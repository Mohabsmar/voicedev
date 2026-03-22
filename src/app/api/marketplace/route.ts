/**
 * VoiceDev - Marketplace API
 * Unified API for Smithery (MCP) + ClawHub (Skills)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  UnifiedMarketplace,
  SmitheryMarketplace,
  ClawHubMarketplace,
  VetScanner
} from '@/marketplace/unified-marketplace';
import { EXTREME_CORE_20, CoreToolsExecutor } from '@/tools/extreme-core';
import { LOCAL_TOOLBOXES, LocalToolboxExecutor } from '@/tools/local-toolboxes';

// ============================================
// GET - List/Search operations
// ============================================
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'status';
  const source = searchParams.get('source') as 'smithery' | 'clawhub' | 'all' || 'all';
  const query = searchParams.get('query') || '';
  const type = searchParams.get('type') as 'mcp-server' | 'tool' | 'skill' | 'all' || 'all';

  try {
    switch (action) {
      case 'search':
        const searchResults = await UnifiedMarketplace.search(query, { source, type });
        return NextResponse.json({
          success: true,
          action: 'search',
          query,
          source,
          results: searchResults,
          count: searchResults.length
        });

      case 'list':
        const installedItems = await UnifiedMarketplace.listInstalled();
        return NextResponse.json({
          success: true,
          action: 'list',
          items: installedItems,
          count: installedItems.length
        });

      case 'list-smithery':
        const smitheryItems = await SmitheryMarketplace.list();
        return NextResponse.json({
          success: true,
          action: 'list-smithery',
          items: smitheryItems,
          count: smitheryItems.length
        });

      case 'list-clawhub':
        const clawhubItems = await ClawHubMarketplace.list();
        return NextResponse.json({
          success: true,
          action: 'list-clawhub',
          items: clawhubItems,
          count: clawhubItems.length
        });

      case 'explore':
        const featured = await UnifiedMarketplace.getFeatured();
        return NextResponse.json({
          success: true,
          action: 'explore',
          smithery: featured.smithery,
          clawhub: featured.clawhub
        });

      case 'core-tools':
        return NextResponse.json({
          success: true,
          action: 'core-tools',
          tools: EXTREME_CORE_20,
          count: EXTREME_CORE_20.length,
          categories: CoreToolsExecutor.toOpenAIFunctions()
        });

      case 'local-toolboxes':
        return NextResponse.json({
          success: true,
          action: 'local-toolboxes',
          toolboxes: LOCAL_TOOLBOXES,
          count: LOCAL_TOOLBOXES.length
        });

      case 'vet':
        const itemId = searchParams.get('itemId');
        const itemSource = searchParams.get('itemSource') as 'smithery' | 'clawhub';

        if (!itemId || !itemSource) {
          return NextResponse.json({
            success: false,
            error: 'itemId and itemSource are required for vet action'
          }, { status: 400 });
        }

        const vetResult = await VetScanner.scan(itemId, itemSource);
        return NextResponse.json({
          success: true,
          action: 'vet',
          result: vetResult
        });

      case 'status':
      default:
        return NextResponse.json({
          success: true,
          action: 'status',
          marketplaces: {
            smithery: {
              name: 'Smithery',
              description: 'MCP Tools Marketplace',
              url: 'https://smithery.ai',
              cli: '@smithery/cli'
            },
            clawhub: {
              name: 'ClawHub',
              description: 'Agent Skills Marketplace',
              url: 'https://clawhub.dev',
              cli: 'clawhub'
            }
          },
          coreTools: {
            count: EXTREME_CORE_20.length,
            categories: [...new Set(EXTREME_CORE_20.map(t => t.category))]
          },
          localToolboxes: {
            count: LOCAL_TOOLBOXES.length,
            totalTools: LOCAL_TOOLBOXES.reduce((sum, t) => sum + t.tools.length, 0)
          },
          actions: ['search', 'list', 'list-smithery', 'list-clawhub', 'explore', 'core-tools', 'local-toolboxes', 'vet', 'install', 'status']
        });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ============================================
// POST - Install/Execute operations
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, itemId, source, targetDir, toolId, params } = body;

    switch (action) {
      case 'install':
        if (!itemId || !source) {
          return NextResponse.json({
            success: false,
            error: 'itemId and source are required for install action'
          }, { status: 400 });
        }

        const installResult = await UnifiedMarketplace.install(itemId, source, { targetDir });
        return NextResponse.json({
          success: installResult.success,
          action: 'install',
          message: installResult.message,
          item: installResult.item
        });

      case 'uninstall':
        if (!itemId || !source) {
          return NextResponse.json({
            success: false,
            error: 'itemId and source are required for uninstall action'
          }, { status: 400 });
        }

        if (source === 'smithery') {
          const removed = await SmitheryMarketplace.remove(itemId);
          return NextResponse.json({ success: removed, action: 'uninstall', itemId });
        } else {
          const removed = await ClawHubMarketplace.uninstall(itemId);
          return NextResponse.json({ success: removed, action: 'uninstall', itemId });
        }

      case 'execute-tool':
        if (!toolId) {
          return NextResponse.json({
            success: false,
            error: 'toolId is required for execute-tool action'
          }, { status: 400 });
        }

        const result = await LocalToolboxExecutor.execute(toolId, params || {});
        return NextResponse.json({
          success: result.success,
          action: 'execute-tool',
          toolId,
          result
        });

      case 'call-smithery-tool':
        const { connectionId, toolName, args } = body;
        if (!connectionId || !toolName) {
          return NextResponse.json({
            success: false,
            error: 'connectionId and toolName are required'
          }, { status: 400 });
        }

        const toolResult = await SmitheryMarketplace.callTool(connectionId, toolName, args || {});
        return NextResponse.json({
          success: true,
          action: 'call-smithery-tool',
          result: toolResult
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
