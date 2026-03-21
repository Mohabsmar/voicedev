/**
 * VoiceDev - Remote Computer Control Tools
 * SSH, RDP, VNC, WinRM, Remote Desktop, Screen Sharing, File Transfer
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
        const cmd = `ssh ${keyFlag} -p ${port} -o StrictHostKeyChecking=no ${p.user}@${p.host} "echo 'Connected successfully'"`;
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
        const cmd = `ssh ${keyFlag} -p ${port} -o StrictHostKeyChecking=no ${p.user}@${p.host} "${p.command.replace(/"/g, '\\"')}"`;
        const { stdout, stderr } = await execCrossPlatform(cmd);
        return { success: true, data: { stdout, stderr } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  ssh_copy_file: {
    name: 'ssh_copy_file',
    description: 'Copy file to/from remote server via SCP',
    parameters: { source: 'string', destination: 'string', direction: 'string?', port: 'number?' },
    execute: async (p: { source: string; destination: string; direction?: 'upload' | 'download'; port?: number }) => {
      try {
        const port = p.port || 22;
        const direction = p.direction || 'upload';
        const cmd = `scp -P ${port} -o StrictHostKeyChecking=no "${p.source}" "${p.destination}"`;
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
        const cmd = `ssh -f -N -L ${p.localPort}:localhost:${p.remotePort} -p ${port} -o StrictHostKeyChecking=no ${p.user}@${p.host}`;
        await execCrossPlatform(cmd);
        return { success: true, data: { localPort: p.localPort, remotePort: p.remotePort } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  ssh_tunnel_reverse: {
    name: 'ssh_tunnel_reverse',
    description: 'Create reverse SSH tunnel',
    parameters: { host: 'string', user: 'string', remotePort: 'number', localPort: 'number', port: 'number?' },
    execute: async (p: { host: string; user: string; remotePort: number; localPort: number; port?: number }) => {
      try {
        const port = p.port || 22;
        const cmd = `ssh -f -N -R ${p.remotePort}:localhost:${p.localPort} -p ${port} ${p.user}@${p.host}`;
        await execCrossPlatform(cmd);
        return { success: true, data: { remotePort: p.remotePort, localPort: p.localPort } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  ssh_sftp: {
    name: 'ssh_sftp',
    description: 'Transfer files using SFTP',
    parameters: { host: 'string', user: 'string', operation: 'string', localPath: 'string', remotePath: 'string' },
    execute: async (p: { host: string; user: string; operation: 'put' | 'get' | 'ls' | 'rm' | 'mkdir'; localPath?: string; remotePath?: string }) => {
      try {
        let cmd: string;
        if (p.operation === 'ls') {
          cmd = `sftp ${p.user}@${p.host} -c "ls ${p.remotePath || '.'}"`;
        } else if (p.operation === 'put' && p.localPath && p.remotePath) {
          cmd = `sftp ${p.user}@${p.host} -c "put ${p.localPath} ${p.remotePath}"`;
        } else if (p.operation === 'get' && p.localPath && p.remotePath) {
          cmd = `sftp ${p.user}@${p.host} -c "get ${p.remotePath} ${p.localPath}"`;
        } else {
          return { success: false, error: 'Invalid operation or missing paths' };
        }
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: stdout };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  ssh_keygen: {
    name: 'ssh_keygen',
    description: 'Generate SSH key pair',
    parameters: { path: 'string?', type: 'string?', bits: 'number?' },
    execute: async (p: { path?: string; type?: 'rsa' | 'ed25519' | 'ecdsa'; bits?: number }) => {
      try {
        const path = p.path || `${process.env.HOME || process.env.USERPROFILE}/.ssh/id_${p.type || 'rsa'}`;
        const type = p.type || 'rsa';
        const bits = p.bits || 4096;
        const cmd = `ssh-keygen -t ${type} -b ${bits} -f "${path}" -N ""`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: { path, publicKey: `${path}.pub` } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  ssh_copy_id: {
    name: 'ssh_copy_id',
    description: 'Copy SSH public key to remote server',
    parameters: { host: 'string', user: 'string', keyPath: 'string?', port: 'number?' },
    execute: async (p: { host: string; user: string; keyPath?: string; port?: number }) => {
      try {
        const keyPath = p.keyPath || `${process.env.HOME || process.env.USERPROFILE}/.ssh/id_rsa.pub`;
        const port = p.port || 22;
        const cmd = isWindows
          ? `type ${keyPath} | ssh ${p.user}@${p.host} -p ${port} "cat >> .ssh/authorized_keys"`
          : `ssh-copy-id -i ${keyPath} -p ${port} ${p.user}@${p.host}`;
        await execCrossPlatform(cmd);
        return { success: true, data: { host: p.host, user: p.user } };
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

  rdp_session_disconnect: {
    name: 'rdp_session_disconnect',
    description: 'Disconnect an RDP session',
    parameters: { sessionId: 'string', server: 'string?' },
    execute: async (p: { sessionId: string; server?: string }) => {
      try {
        if (!isWindows) {
          return { success: false, error: 'RDP session management only available on Windows' };
        }
        const cmd = p.server 
          ? `rwinsta ${p.sessionId} /server:${p.server}`
          : `rwinsta ${p.sessionId}`;
        await execCrossPlatform(cmd);
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  rdp_enable: {
    name: 'rdp_enable',
    description: 'Enable Remote Desktop on Windows',
    parameters: {},
    execute: async () => {
      try {
        if (!isWindows) {
          return { success: false, error: 'RDP enable only available on Windows' };
        }
        const cmd = `reg add "HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f`;
        await execCrossPlatform(cmd);
        return { success: true, data: { message: 'RDP enabled. Ensure firewall allows port 3389.' } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  rdp_disable: {
    name: 'rdp_disable',
    description: 'Disable Remote Desktop on Windows',
    parameters: {},
    execute: async () => {
      try {
        if (!isWindows) {
          return { success: false, error: 'RDP disable only available on Windows' };
        }
        const cmd = `reg add "HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 1 /f`;
        await execCrossPlatform(cmd);
        return { success: true };
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
    description: 'Start VNC server on Linux',
    parameters: { display: 'number?', geometry: 'string?', depth: 'number?' },
    execute: async (p: { display?: number; geometry?: string; depth?: number }) => {
      try {
        const display = p.display || 1;
        const geometry = p.geometry || '1920x1080';
        const depth = p.depth || 24;
        if (isWindows) {
          return { success: false, error: 'VNC server typically not run on Windows. Use RDP instead.' };
        }
        const cmd = `vncserver :${display} -geometry ${geometry} -depth ${depth}`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: { display, geometry, depth, output: stdout } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  vnc_server_stop: {
    name: 'vnc_server_stop',
    description: 'Stop VNC server',
    parameters: { display: 'number?' },
    execute: async (p: { display?: number }) => {
      try {
        const display = p.display || 1;
        if (isWindows) {
          return { success: false, error: 'Not applicable on Windows' };
        }
        const cmd = `vncserver -kill :${display}`;
        await execCrossPlatform(cmd);
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  vnc_server_list: {
    name: 'vnc_server_list',
    description: 'List running VNC servers',
    parameters: {},
    execute: async () => {
      try {
        if (isWindows) {
          return { success: false, error: 'Not applicable on Windows' };
        }
        const cmd = `vncserver -list`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: stdout };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },
};

// ============================================
// WINRM TOOLS (Windows Remote Management)
// ============================================
export const winrmTools = {
  winrm_exec: {
    name: 'winrm_exec',
    description: 'Execute command via WinRM on Windows',
    parameters: { host: 'string', user: 'string', password: 'string', command: 'string' },
    execute: async (p: { host: string; user: string; password: string; command: string }) => {
      try {
        if (!isWindows) {
          // Use PowerShell Core on non-Windows
          const cmd = `pwsh -Command "Invoke-Command -ComputerName ${p.host} -Credential (New-Object System.Management.Automation.PSCredential('${p.user}', (ConvertTo-SecureString '${p.password}' -AsPlainText -Force))) -ScriptBlock { ${p.command} }"`;
          const { stdout } = await execCrossPlatform(cmd);
          return { success: true, data: stdout };
        }
        const cmd = `Invoke-Command -ComputerName ${p.host} -Credential (New-Object System.Management.Automation.PSCredential('${p.user}', (ConvertTo-SecureString '${p.password}' -AsPlainText -Force))) -ScriptBlock { ${p.command} }`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: stdout };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  winrm_enable: {
    name: 'winrm_enable',
    description: 'Enable WinRM on Windows',
    parameters: {},
    execute: async () => {
      try {
        if (!isWindows) {
          return { success: false, error: 'WinRM only available on Windows' };
        }
        const cmd = `winrm quickconfig -q`;
        await execCrossPlatform(cmd);
        return { success: true, data: { message: 'WinRM enabled' } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  winrm_test: {
    name: 'winrm_test',
    description: 'Test WinRM connection',
    parameters: { host: 'string' },
    execute: async (p: { host: string }) => {
      try {
        if (!isWindows) {
          return { success: false, error: 'WinRM only available on Windows' };
        }
        const cmd = `Test-WSMan ${p.host}`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: stdout };
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
    description: 'Scan common ports on remote host',
    parameters: { host: 'string', ports: 'string?' },
    execute: async (p: { host: string; ports?: string }) => {
      try {
        const ports = p.ports || '22,23,80,443,3389,5900,5901,8080';
        const results: string[] = [];
        for (const port of ports.split(',')) {
          const cmd = isWindows
            ? `powershell -Command "(Test-NetConnection -ComputerName ${p.host} -Port ${port.trim()}).TcpTestSucceeded"`
            : `nc -zv ${p.host} ${port.trim()} 2>&1 || echo "closed"`;
          try {
            const { stdout } = await execCrossPlatform(cmd);
            if (stdout.includes('True') || stdout.includes('succeeded') || stdout.includes('open')) {
              results.push(`Port ${port}: OPEN`);
            } else {
              results.push(`Port ${port}: CLOSED`);
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

  dns_lookup: {
    name: 'dns_lookup',
    description: 'DNS lookup for hostname',
    parameters: { host: 'string', type: 'string?' },
    execute: async (p: { host: string; type?: 'A' | 'AAAA' | 'MX' | 'NS' | 'TXT' }) => {
      try {
        const type = p.type || 'A';
        const cmd = isWindows 
          ? `nslookup -type=${type} ${p.host}`
          : `dig ${p.host} ${type} +short`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: stdout };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  whois: {
    name: 'whois',
    description: 'WHOIS lookup for domain',
    parameters: { domain: 'string' },
    execute: async (p: { domain: string }) => {
      try {
        const cmd = `whois ${p.domain}`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: stdout };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  http_check: {
    name: 'http_check',
    description: 'Check HTTP/HTTPS endpoint',
    parameters: { url: 'string', timeout: 'number?' },
    execute: async (p: { url: string; timeout?: number }) => {
      try {
        const timeout = p.timeout || 10;
        const cmd = isWindows
          ? `powershell -Command "try { $r = Invoke-WebRequest -Uri '${p.url}' -TimeoutSeconds ${timeout} -UseBasicParsing; Write-Output \"Status: $($r.StatusCode)\" } catch { Write-Output \"Error: $_\" }"`
          : `curl -s -o /dev/null -w "%{http_code}" --max-time ${timeout} ${p.url}`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: { url: p.url, status: stdout.trim() } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  remote_command: {
    name: 'remote_command',
    description: 'Execute command on remote machine via SSH or WinRM',
    parameters: { host: 'string', command: 'string', method: 'string?', user: 'string?', keyPath: 'string?' },
    execute: async (p: { host: string; command: string; method?: 'ssh' | 'winrm'; user?: string; keyPath?: string }) => {
      try {
        const method = p.method || 'ssh';
        if (method === 'ssh') {
          const user = p.user || 'root';
          const keyFlag = p.keyPath ? `-i "${p.keyPath}"` : '';
          const cmd = `ssh ${keyFlag} -o StrictHostKeyChecking=no ${user}@${p.host} "${p.command.replace(/"/g, '\\"')}"`;
          const { stdout } = await execCrossPlatform(cmd);
          return { success: true, data: stdout };
        } else if (method === 'winrm' && isWindows) {
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

  remote_shutdown: {
    name: 'remote_shutdown',
    description: 'Shutdown or restart remote computer',
    parameters: { host: 'string', action: 'string', message: 'string?', timeout: 'number?' },
    execute: async (p: { host: string; action: 'shutdown' | 'restart' | 'abort'; message?: string; timeout?: number }) => {
      try {
        const timeout = p.timeout || 30;
        const message = p.message || 'System shutdown initiated';
        
        if (isWindows) {
          const actionFlag = p.action === 'restart' ? '/r' : p.action === 'abort' ? '/a' : '/s';
          const cmd = p.action === 'abort'
            ? `shutdown ${actionFlag} /m \\\\${p.host}`
            : `shutdown ${actionFlag} /t ${timeout} /c "${message}" /m \\\\${p.host}`;
          await execCrossPlatform(cmd);
        } else {
          const cmd = p.action === 'shutdown'
            ? `ssh ${p.host} "shutdown -h +${Math.ceil(timeout/60)} '${message}'"`
            : p.action === 'restart'
              ? `ssh ${p.host} "shutdown -r +${Math.ceil(timeout/60)} '${message}'"`
              : `ssh ${p.host} "shutdown -c"`;
          await execCrossPlatform(cmd);
        }
        return { success: true, data: { host: p.host, action: p.action } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  remote_process_list: {
    name: 'remote_process_list',
    description: 'List processes on remote computer',
    parameters: { host: 'string', user: 'string?', filter: 'string?' },
    execute: async (p: { host: string; user?: string; filter?: string }) => {
      try {
        const user = p.user || 'root';
        const filter = p.filter || '';
        
        if (isWindows) {
          const cmd = `tasklist /s ${p.host} ${filter ? `/fi "${filter}"` : ''}`;
          const { stdout } = await execCrossPlatform(cmd);
          return { success: true, data: stdout };
        } else {
          const cmd = `ssh ${user}@${p.host} "ps aux ${filter ? `| grep ${filter}` : ''}"`;
          const { stdout } = await execCrossPlatform(cmd);
          return { success: true, data: stdout };
        }
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  remote_service_list: {
    name: 'remote_service_list',
    description: 'List services on remote computer',
    parameters: { host: 'string', user: 'string?' },
    execute: async (p: { host: string; user?: string }) => {
      try {
        const user = p.user || 'root';
        
        if (isWindows) {
          const cmd = `sc \\\\${p.host} query type= service state= all`;
          const { stdout } = await execCrossPlatform(cmd);
          return { success: true, data: stdout };
        } else {
          const cmd = `ssh ${user}@${p.host} "systemctl list-units --type=service"`;
          const { stdout } = await execCrossPlatform(cmd);
          return { success: true, data: stdout };
        }
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  remote_disk_usage: {
    name: 'remote_disk_usage',
    description: 'Get disk usage on remote computer',
    parameters: { host: 'string', user: 'string?' },
    execute: async (p: { host: string; user?: string }) => {
      try {
        const user = p.user || 'root';
        
        if (isWindows) {
          const cmd = `wmic /node:${p.host} logicaldisk get size,freespace,caption`;
          const { stdout } = await execCrossPlatform(cmd);
          return { success: true, data: stdout };
        } else {
          const cmd = `ssh ${user}@${p.host} "df -h"`;
          const { stdout } = await execCrossPlatform(cmd);
          return { success: true, data: stdout };
        }
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  remote_system_info: {
    name: 'remote_system_info',
    description: 'Get system info from remote computer',
    parameters: { host: 'string', user: 'string?' },
    execute: async (p: { host: string; user?: string }) => {
      try {
        const user = p.user || 'root';
        
        if (isWindows) {
          const cmd = `systeminfo /s ${p.host}`;
          const { stdout } = await execCrossPlatform(cmd);
          return { success: true, data: stdout };
        } else {
          const cmd = `ssh ${user}@${p.host} "uname -a && cat /etc/os-release && free -h && lscpu | head -10"`;
          const { stdout } = await execCrossPlatform(cmd);
          return { success: true, data: stdout };
        }
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
  ...winrmTools,
  ...remoteMonitorTools,
};

export default allRemoteTools;
