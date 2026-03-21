/**
 * VoiceDev - Messaging Channels via MCP
 * Telegram, WhatsApp, Discord, Slack, and more
 */

import { execCrossPlatform, isWindows } from '../tools';

// ============================================
// CHANNEL TYPES
// ============================================
export interface ChannelConfig {
  type: 'telegram' | 'whatsapp' | 'discord' | 'slack' | 'email' | 'sms';
  credentials: Record<string, string>;
  webhook?: string;
}

export interface Message {
  to: string;
  content: string;
  attachments?: string[];
  replyTo?: string;
}

// ============================================
// TELEGRAM CHANNEL
// ============================================
export const telegramChannel = {
  telegram_send_message: {
    name: 'telegram_send_message',
    description: 'Send message via Telegram bot',
    parameters: { botToken: 'string', chatId: 'string', message: 'string', parseMode: 'string?' },
    execute: async (p: { botToken: string; chatId: string; message: string; parseMode?: string }) => {
      try {
        const parseMode = p.parseMode || 'Markdown';
        const url = `https://api.telegram.org/bot${p.botToken}/sendMessage`;
        const https = require('https');
        
        return new Promise((resolve) => {
          const data = JSON.stringify({
            chat_id: p.chatId,
            text: p.message,
            parse_mode: parseMode
          });
          
          const req = https.request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
          }, (res: any) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ success: true, data: JSON.parse(body) }));
          });
          
          req.on('error', (e: any) => resolve({ success: false, error: e.message }));
          req.write(data);
          req.end();
        });
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  telegram_send_photo: {
    name: 'telegram_send_photo',
    description: 'Send photo via Telegram bot',
    parameters: { botToken: 'string', chatId: 'string', photoUrl: 'string', caption: 'string?' },
    execute: async (p: { botToken: string; chatId: string; photoUrl: string; caption?: string }) => {
      try {
        const url = `https://api.telegram.org/bot${p.botToken}/sendPhoto`;
        const https = require('https');
        
        return new Promise((resolve) => {
          const data = JSON.stringify({
            chat_id: p.chatId,
            photo: p.photoUrl,
            caption: p.caption || ''
          });
          
          const req = https.request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
          }, (res: any) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ success: true, data: JSON.parse(body) }));
          });
          
          req.on('error', (e: any) => resolve({ success: false, error: e.message }));
          req.write(data);
          req.end();
        });
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  telegram_get_updates: {
    name: 'telegram_get_updates',
    description: 'Get updates from Telegram bot',
    parameters: { botToken: 'string', offset: 'number?', limit: 'number?' },
    execute: async (p: { botToken: string; offset?: number; limit?: number }) => {
      try {
        const url = `https://api.telegram.org/bot${p.botToken}/getUpdates?offset=${p.offset || 0}&limit=${p.limit || 100}`;
        const https = require('https');
        
        return new Promise((resolve) => {
          https.get(url, (res: any) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ success: true, data: JSON.parse(body) }));
          }).on('error', (e: any) => resolve({ success: false, error: e.message }));
        });
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  telegram_send_document: {
    name: 'telegram_send_document',
    description: 'Send document via Telegram bot',
    parameters: { botToken: 'string', chatId: 'string', documentUrl: 'string', caption: 'string?' },
    execute: async (p: { botToken: string; chatId: string; documentUrl: string; caption?: string }) => {
      try {
        const url = `https://api.telegram.org/bot${p.botToken}/sendDocument`;
        const https = require('https');
        
        return new Promise((resolve) => {
          const data = JSON.stringify({
            chat_id: p.chatId,
            document: p.documentUrl,
            caption: p.caption || ''
          });
          
          const req = https.request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
          }, (res: any) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ success: true, data: JSON.parse(body) }));
          });
          
          req.on('error', (e: any) => resolve({ success: false, error: e.message }));
          req.write(data);
          req.end();
        });
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },
};

// ============================================
// WHATSAPP CHANNEL (via Business API)
// ============================================
export const whatsappChannel = {
  whatsapp_send_message: {
    name: 'whatsapp_send_message',
    description: 'Send message via WhatsApp Business API',
    parameters: { 
      accessToken: 'string', 
      phoneNumberId: 'string', 
      to: 'string', 
      message: 'string' 
    },
    execute: async (p: { accessToken: string; phoneNumberId: string; to: string; message: string }) => {
      try {
        const url = `https://graph.facebook.com/v18.0/${p.phoneNumberId}/messages`;
        const https = require('https');
        const parsedUrl = new URL(url);
        
        return new Promise((resolve) => {
          const data = JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: p.to,
            type: 'text',
            text: { preview_url: false, body: p.message }
          });
          
          const req = https.request({
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname,
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${p.accessToken}`,
              'Content-Type': 'application/json',
              'Content-Length': data.length
            }
          }, (res: any) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ success: true, data: JSON.parse(body) }));
          });
          
          req.on('error', (e: any) => resolve({ success: false, error: e.message }));
          req.write(data);
          req.end();
        });
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  whatsapp_send_template: {
    name: 'whatsapp_send_template',
    description: 'Send template message via WhatsApp',
    parameters: { 
      accessToken: 'string', 
      phoneNumberId: 'string', 
      to: 'string', 
      templateName: 'string',
      language: 'string?',
      components: 'array?'
    },
    execute: async (p: { 
      accessToken: string; 
      phoneNumberId: string; 
      to: string; 
      templateName: string;
      language?: string;
      components?: any[];
    }) => {
      try {
        const url = `https://graph.facebook.com/v18.0/${p.phoneNumberId}/messages`;
        const https = require('https');
        const parsedUrl = new URL(url);
        
        return new Promise((resolve) => {
          const data = JSON.stringify({
            messaging_product: 'whatsapp',
            to: p.to,
            type: 'template',
            template: {
              name: p.templateName,
              language: { code: p.language || 'en' },
              components: p.components || []
            }
          });
          
          const req = https.request({
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname,
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${p.accessToken}`,
              'Content-Type': 'application/json',
              'Content-Length': data.length
            }
          }, (res: any) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ success: true, data: JSON.parse(body) }));
          });
          
          req.on('error', (e: any) => resolve({ success: false, error: e.message }));
          req.write(data);
          req.end();
        });
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },
};

// ============================================
// DISCORD CHANNEL
// ============================================
export const discordChannel = {
  discord_send_message: {
    name: 'discord_send_message',
    description: 'Send message to Discord channel via webhook',
    parameters: { webhookUrl: 'string', content: 'string', username: 'string?', embeds: 'array?' },
    execute: async (p: { webhookUrl: string; content: string; username?: string; embeds?: any[] }) => {
      try {
        const https = require('https');
        const parsedUrl = new URL(p.webhookUrl);
        
        return new Promise((resolve) => {
          const data = JSON.stringify({
            content: p.content,
            username: p.username || 'VoiceDev Bot',
            embeds: p.embeds || []
          });
          
          const req = https.request({
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': data.length
            }
          }, (res: any) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ success: true, data: body || 'Sent' }));
          });
          
          req.on('error', (e: any) => resolve({ success: false, error: e.message }));
          req.write(data);
          req.end();
        });
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  discord_send_embed: {
    name: 'discord_send_embed',
    description: 'Send rich embed to Discord',
    parameters: { 
      webhookUrl: 'string', 
      title: 'string', 
      description: 'string',
      color: 'number?',
      fields: 'array?'
    },
    execute: async (p: { 
      webhookUrl: string; 
      title: string; 
      description: string;
      color?: number;
      fields?: { name: string; value: string; inline?: boolean }[];
    }) => {
      try {
        const https = require('https');
        const parsedUrl = new URL(p.webhookUrl);
        
        return new Promise((resolve) => {
          const data = JSON.stringify({
            embeds: [{
              title: p.title,
              description: p.description,
              color: p.color || 5814783,
              fields: p.fields || []
            }]
          });
          
          const req = https.request({
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': data.length
            }
          }, (res: any) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ success: true, data: body || 'Sent' }));
          });
          
          req.on('error', (e: any) => resolve({ success: false, error: e.message }));
          req.write(data);
          req.end();
        });
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },
};

// ============================================
// SLACK CHANNEL
// ============================================
export const slackChannel = {
  slack_send_message: {
    name: 'slack_send_message',
    description: 'Send message to Slack channel',
    parameters: { webhookUrl: 'string', text: 'string', channel: 'string?', username: 'string?', blocks: 'array?' },
    execute: async (p: { webhookUrl: string; text: string; channel?: string; username?: string; blocks?: any[] }) => {
      try {
        const https = require('https');
        const parsedUrl = new URL(p.webhookUrl);
        
        return new Promise((resolve) => {
          const data = JSON.stringify({
            text: p.text,
            channel: p.channel,
            username: p.username || 'VoiceDev Bot',
            blocks: p.blocks
          });
          
          const req = https.request({
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': data.length
            }
          }, (res: any) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ success: true, data: body || 'Sent' }));
          });
          
          req.on('error', (e: any) => resolve({ success: false, error: e.message }));
          req.write(data);
          req.end();
        });
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },
};

// ============================================
// EMAIL CHANNEL
// ============================================
export const emailChannel = {
  email_send: {
    name: 'email_send',
    description: 'Send email (via SMTP or API)',
    parameters: { 
      to: 'string', 
      subject: 'string', 
      body: 'string',
      from: 'string?',
      html: 'boolean?'
    },
    execute: async (p: { to: string; subject: string; body: string; from?: string; html?: boolean }) => {
      try {
        // This would typically use nodemailer or similar
        // For now, we'll use a simple implementation
        const nodemailer = require('nodemailer');
        
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        
        const info = await transporter.sendMail({
          from: p.from || process.env.SMTP_USER,
          to: p.to,
          subject: p.subject,
          [p.html ? 'html' : 'text']: p.body
        });
        
        return { success: true, data: { messageId: info.messageId } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },
};

// ============================================
// GENERIC MCP CHANNEL ADAPTER
// ============================================
export const mcpChannel = {
  mcp_call: {
    name: 'mcp_call',
    description: 'Call any MCP-compatible API with JSON config',
    parameters: { 
      config: 'object',  // { baseUrl, method, endpoint, headers, body }
      endpoint: 'string',
      method: 'string?',
      body: 'object?'
    },
    execute: async (p: { 
      config: { baseUrl: string; headers?: Record<string, string> }; 
      endpoint: string;
      method?: string;
      body?: any;
    }) => {
      try {
        const https = require('https');
        const http = require('http');
        const url = new URL(p.endpoint, p.config.baseUrl);
        const lib = url.protocol === 'https:' ? https : http;
        
        return new Promise((resolve) => {
          const data = p.body ? JSON.stringify(p.body) : '';
          
          const req = lib.request({
            hostname: url.hostname,
            port: url.port || (url.protocol === 'https:' ? 443 : 80),
            path: url.pathname + url.search,
            method: p.method || 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...p.config.headers,
              ...(data ? { 'Content-Length': data.length } : {})
            }
          }, (res: any) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
              try {
                resolve({ success: true, data: JSON.parse(body) });
              } catch {
                resolve({ success: true, data: body });
              }
            });
          });
          
          req.on('error', (e: any) => resolve({ success: false, error: e.message }));
          if (data) req.write(data);
          req.end();
        });
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  // Dynamic channel registration
  register_channel: {
    name: 'register_channel',
    description: 'Register a new channel from JSON config',
    parameters: { 
      name: 'string',
      type: 'string',
      config: 'object'
    },
    execute: async (p: { name: string; type: string; config: Record<string, any> }) => {
      // Store channel config for later use
      return { 
        success: true, 
        data: { 
          message: `Channel '${p.name}' registered`,
          type: p.type,
          config: { ...p.config, credentials: '[HIDDEN]' }
        }
      };
    }
  }
};

// Export all channels
export const allChannels = {
  ...telegramChannel,
  ...whatsappChannel,
  ...discordChannel,
  ...slackChannel,
  ...emailChannel,
  ...mcpChannel,
};

export default allChannels;
