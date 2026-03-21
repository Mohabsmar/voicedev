/**
 * VoiceDev - Remote Computer Control Tools
 * RDP, VNC, SSH, SFTP, Remote Desktop
 */

import { execCrossPlatform, isWindows } from '../tools';

// ============================================
// SSH TOOLS
// ============================================
export const sshTools = {
  ssh_connect: {
    name: 'ssh_connect',
    description: 'Connect to remote server via SSH',
    parameters: { host: 'string', user: 'string', port: 'number?', keyPath: 'string?', password: 'string?' },
    execute: async (p: { host: string; user: string; port?: number; keyPath?: string; password?: string }) => {
      try {
        const port = p.port || 22;
        const keyFlag = p.keyPath ? `-i "${p.keyPath}"` : '';
        const cmd = `ssh ${keyFlag} -p ${port} ${p.user}@${p.host} "echo 'Connected successfully'"`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: { host: p.host, user: p.user, port } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  ssh_exec: {
    name: 'ssh_exec',
    description: 'Execute command on remote server via SSH',
    parameters: { host: 'string', user: 'string', command: 'string', port: 'number?', keyPath: 'string?' },
    execute: async (p: { host: string; user: string; command: string; port?: number; keyPath?: string }) => {
      try {
        const port = p.port || 22;
        const keyFlag = p.keyPath ? `-i "${p.keyPath}"` : '';
        const cmd = `ssh ${keyFlag} -p ${port} ${p.user}@${p.host} "${p.command.replace(/"/g, '\\"')}"`;
        const { stdout, stderr } = await execCrossPlatform(cmd);
        return { success: true, data: { stdout, stderr } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  ssh_copy_file: {
    name: 'ssh_copy_file',
    description: 'Copy file to remote server via SCP',
    parameters: { source: 'string', destination: 'string', host: 'string', user: 'string', port: 'number?' },
    execute: async (p: { source: string; destination: string; host: string; user: string; port?: number }) => {
      try {
        const port = p.port || 22;
        const cmd = `scp -P ${port} "${p.source}" ${p.user}@${p.host}:"${p.destination}"`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: { source: p.source, destination: p.destination } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  ssh_tunnel: {
    name: 'ssh_tunnel',
    description: 'Create SSH tunnel for port forwarding',
    parameters: { host: 'string', user: 'string', localPort: 'number', remotePort: 'number', port: 'number?' },
    execute: async (p: { host: string; user: string; localPort: number; remotePort: number; port?: number }) => {
      try {
        const port = p.port || 22;
        const cmd = `ssh -f -N -L ${p.localPort}:localhost:${p.remotePort} -p ${port} ${p.user}@${p.host}`;
        await execCrossPlatform(cmd);
        return { success: true, data: { localPort: p.localPort, remotePort: p.remotePort } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },
};

// ============================================
// RDP TOOLS (Windows Remote Desktop)
// ============================================
export const rdpTools = {
  rdp_connect: {
    name: 'rdp_connect',
    description: 'Connect to Windows Remote Desktop',
    parameters: { host: 'string', user: 'string', password: 'string?', port: 'number?' },
    execute: async (p: { host: string; user: string; password?: string; port?: number }) => {
      try {
        const port = p.port || 3389;
        if (isWindows) {
          const cmd = `mstsc /v:${p.host}:${port}`;
          await execCrossPlatform(cmd);
          return { success: true, data: { host: p.host, port } };
        } else {
          // Use xfreerdp on Linux
          const passFlag = p.password ? `/p:"${p.password}"` : '';
          const cmd = `xfreerdp /v:${p.host}:${port} /u:${p.user} ${passFlag}`;
          await execCrossPlatform(cmd);
          return { success: true, data: { host: p.host, port } };
        }
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  rdp_session_list: {
    name: 'rdp_session_list',
    description: 'List RDP sessions on Windows',
    parameters: { server: 'string?' },
    execute: async (p: { server?: string }) => {
      try {
        if (!isWindows) {
          return { success: false, error: 'RDP sessions only available on Windows' };
        }
        const cmd = p.server ? `query session /server:${p.server}` : 'query session';
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: stdout };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },
};

// ============================================
// VNC TOOLS
// ============================================
export const vncTools = {
  vnc_connect: {
    name: 'vnc_connect',
    description: 'Connect to VNC server',
    parameters: { host: 'string', port: 'number?', password: 'string?' },
    execute: async (p: { host: string; port?: number; password?: string }) => {
      try {
        const port = p.port || 5900;
        const cmd = isWindows 
          ? `vncviewer ${p.host}:${port}` 
          : `vncviewer ${p.host}:${port}`;
        await execCrossPlatform(cmd);
        return { success: true, data: { host: p.host, port } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  vnc_server_start: {
    name: 'vnc_server_start',
    description: 'Start VNC server',
    parameters: { display: 'number?', geometry: 'string?' },
    execute: async (p: { display?: number; geometry?: string }) => {
      try {
        const display = p.display || 1;
        const geometry = p.geometry || '1920x1080';
        if (isWindows) {
          return { success: false, error: 'VNC server typically not run on Windows' };
        }
        const cmd = `vncserver :${display} -geometry ${geometry}`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: { display, geometry, output: stdout } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },
};

// ============================================
// REMOTE MONITORING TOOLS
// ============================================
export const remoteMonitorTools = {
  ping: {
    name: 'ping',
    description: 'Ping remote host',
    parameters: { host: 'string', count: 'number?' },
    execute: async (p: { host: string; count?: number }) => {
      try {
        const count = p.count || 4;
        const cmd = isWindows ? `ping -n ${count} ${p.host}` : `ping -c ${count} ${p.host}`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: stdout };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  traceroute: {
    name: 'traceroute',
    description: 'Trace route to remote host',
    parameters: { host: 'string', maxHops: 'number?' },
    execute: async (p: { host: string; maxHops?: number }) => {
      try {
        const maxHops = p.maxHops || 30;
        const cmd = isWindows ? `tracert -h ${maxHops} ${p.host}` : `traceroute -m ${maxHops} ${p.host}`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: stdout };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  netstat: {
    name: 'netstat',
    description: 'Show network connections',
    parameters: { filter: 'string?' },
    execute: async (p: { filter?: string }) => {
      try {
        const cmd = isWindows ? 'netstat -ano' : 'netstat -tuln';
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: stdout };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  port_scan: {
    name: 'port_scan',
    description: 'Scan ports on remote host (quick scan)',
    parameters: { host: 'string', ports: 'string?' },
    execute: async (p: { host: string; ports?: string }) => {
      try {
        const ports = p.ports || '22,80,443,3389,5900';
        // Using PowerShell on Windows, nc on Linux
        const results: string[] = [];
        for (const port of ports.split(',')) {
          const cmd = isWindows
            ? `Test-NetConnection -ComputerName ${p.host} -Port ${port.trim()} | Select-Object TcpTestSucceeded`
            : `nc -zv ${p.host} ${port.trim()} 2>&1`;
          try {
            const { stdout } = await execCrossPlatform(cmd);
            if (stdout.includes('True') || stdout.includes('succeeded') || stdout.includes('open')) {
              results.push(`Port ${port}: OPEN`);
            }
          } catch {
            results.push(`Port ${port}: CLOSED`);
          }
        }
        return { success: true, data: results };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  remote_command: {
    name: 'remote_command',
    description: 'Execute command on remote machine (requires setup)',
    parameters: { host: 'string', command: 'string', method: 'string?' },
    execute: async (p: { host: string; command: string; method?: string }) => {
      // This would use SSH, WinRM, or other protocols
      try {
        const method = p.method || 'ssh';
        if (method === 'ssh') {
          // SSH execution
          const cmd = `ssh ${p.host} "${p.command}"`;
          const { stdout } = await execCrossPlatform(cmd);
          return { success: true, data: stdout };
        } else if (method === 'winrm' && isWindows) {
          // WinRM for Windows
          const cmd = `Invoke-Command -ComputerName ${p.host} -ScriptBlock { ${p.command} }`;
          const { stdout } = await execCrossPlatform(cmd);
          return { success: true, data: stdout };
        }
        return { success: false, error: 'Unsupported method' };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  wake_on_lan: {
    name: 'wake_on_lan',
    description: 'Wake remote computer via Wake-on-LAN',
    parameters: { mac: 'string', broadcastIp: 'string?' },
    execute: async (p: { mac: string; broadcastIp?: string }) => {
      try {
        const broadcast = p.broadcastIp || '255.255.255.255';
        const mac = p.mac.replace(/[:-]/g, '');
        // This is a simplified version - real WoL needs raw sockets
        const cmd = isWindows
          ? `powershell -Command "Send-WOL -Mac '${p.mac}' -Broadcast '${broadcast}'"`
          : `wakeonlan -i ${broadcast} ${p.mac}`;
        await execCrossPlatform(cmd);
        return { success: true, data: { mac: p.mac, broadcast } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },
};

// Export all remote tools
export const allRemoteTools = {
  ...sshTools,
  ...rdpTools,
  ...vncTools,
  ...remoteMonitorTools,
};

export default allRemoteTools;
