import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { sessionId, format = 'json' } = body
  
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }
  
  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: {
      events: { orderBy: { order: 'asc' } },
      toolCalls: { orderBy: { createdAt: 'asc' } },
      memories: true,
      costs: { orderBy: { createdAt: 'desc' } },
      errors: true,
    },
  })
  
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }
  
  let content = ''
  let filename = `session-${sessionId}`
  let mimeType = 'application/json'
  
  switch (format) {
    case 'json':
      content = JSON.stringify(session, null, 2)
      filename += '.json'
      break
      
    case 'markdown':
      content = generateMarkdown(session)
      filename += '.md'
      mimeType = 'text/markdown'
      break
      
    case 'csv':
      content = generateCSV(session)
      filename += '.csv'
      mimeType = 'text/csv'
      break
      
    case 'html':
      content = generateHTML(session)
      filename += '.html'
      mimeType = 'text/html'
      break
      
    default:
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
  }
  
  return new NextResponse(content, {
    headers: {
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

function generateMarkdown(session: any): string {
  let md = `# ${session.name || 'Session'}\n\n`
  md += `**Created:** ${new Date(session.createdAt).toLocaleString()}\n`
  md += `**Status:** ${session.status}\n\n`
  
  md += `## Summary\n\n`
  md += `- Events: ${session.events.length}\n`
  md += `- Tool Calls: ${session.toolCalls.length}\n`
  md += `- Total Cost: $${(session.costs.reduce((s: number, c: any) => s + c.cost, 0)).toFixed(4)}\n\n`
  
  md += `## Events\n\n`
  session.events.forEach((e: any, i: number) => {
    md += `### ${i + 1}. ${e.type}\n\n`
    md += `\`\`\`json\n${e.content}\n\`\`\`\n\n`
  })
  
  if (session.toolCalls.length > 0) {
    md += `## Tool Calls\n\n`
    session.toolCalls.forEach((t: any) => {
      md += `### ${t.name}\n\n`
      md += `**Status:** ${t.status}\n\n`
      md += `**Input:**\n\`\`\`json\n${t.input}\n\`\`\`\n\n`
      if (t.output) {
        md += `**Output:**\n\`\`\`json\n${t.output}\n\`\`\`\n\n`
      }
    })
  }
  
  return md
}

function generateCSV(session: any): string {
  let csv = 'type,content,timestamp,duration\n'
  session.events.forEach((e: any) => {
    const content = typeof e.content === 'string' 
      ? e.content.replace(/"/g, '""')
      : JSON.stringify(e.content).replace(/"/g, '""')
    csv += `"${e.type}","${content}","${e.timestamp}",${e.duration}\n`
  })
  return csv
}

function generateHTML(session: any): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${session.name || 'Session'} - VoiceDev Pro</title>
  <style>
    body { font-family: system-ui; background: #09090b; color: #fafafa; padding: 2rem; }
    .card { background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
    .event { border-left: 3px solid #8b5cf6; padding-left: 1rem; }
    pre { background: #09090b; padding: 1rem; border-radius: 4px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>${session.name || 'Session'}</h1>
  <p>Created: ${new Date(session.createdAt).toLocaleString()}</p>
  ${session.events.map((e: any) => `
    <div class="card event">
      <h3>${e.type}</h3>
          <pre>${typeof e.content === 'string' ? e.content : JSON.stringify(e.content, null, 2)}</pre>
        </div>
      `).join('')}
</body>
</html>`
}
