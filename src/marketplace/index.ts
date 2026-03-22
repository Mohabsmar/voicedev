/**
 * VoiceDev - Marketplace Module
 * Unified marketplace combining Smithery (MCP Tools) + ClawHub (Skills)
 */

// Export unified marketplace
export {
  UnifiedMarketplace,
  SmitheryMarketplace,
  ClawHubMarketplace,
  VetScanner,
  type MarketplaceItem,
  type VetResult,
  type InstallResult
} from './unified-marketplace';

// Re-export marketplace class for backwards compatibility
import { SkillMarketplace } from './skill-marketplace';
export { SkillMarketplace };
export const marketplace = new SkillMarketplace();

// Helper functions
export function searchMarketplace(query: string, filters?: any) {
  return marketplace.search(query, filters);
}

export function installItem(itemId: string, userId?: string) {
  return marketplace.install(itemId, userId);
}

export function getMarketplaceStats() {
  return marketplace.getStats();
}

export default marketplace;
