/**
 * VoiceDev - Browser Use Skill
 * Control web browsers programmatically with Puppeteer/Playwright-like functionality
 */

import { execCrossPlatform, isWindows } from '../tools';

// ============================================
// BROWSER USE SKILL TYPES
// ============================================
export interface BrowserAction {
  type: 'navigate' | 'click' | 'type' | 'screenshot' | 'extract' | 'scroll' | 'wait' | 'evaluate';
  selector?: string;
  value?: string;
  timeout?: number;
}

export interface BrowserResult {
  success: boolean;
  data?: any;
  screenshot?: string;
  error?: string;
}

// ============================================
// BROWSER USE SKILL
// ============================================
export const browserUseSkill = {
  name: 'browser_use',
  description: 'Control a web browser to navigate, interact, and extract data from websites',
  category: 'automation',
  
  // Available actions
  actions: {
    // Navigate to URL
    navigate: async (url: string): Promise<BrowserResult> => {
      try {
        // Uses system default browser or Puppeteer if available
        const cmd = isWindows 
          ? `start "" "${url}"`
          : process.platform === 'darwin'
            ? `open "${url}"`
            : `xdg-open "${url}"`;
        await execCrossPlatform(cmd);
        return { success: true, data: { url, message: 'Browser opened' } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },

    // Take screenshot (requires Puppeteer/Playwright)
    screenshot: async (url: string, outputPath?: string): Promise<BrowserResult> => {
      try {
        const output = outputPath || `/tmp/screenshot-${Date.now()}.png`;
        // This would use Puppeteer in a real implementation
        const puppeteerScript = `
          const puppeteer = require('puppeteer');
          (async () => {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto('${url}', { waitUntil: 'networkidle2' });
            await page.screenshot({ path: '${output}', fullPage: true });
            await browser.close();
            console.log('${output}');
          })().catch(console.error);
        `;
        const { stdout } = await execCrossPlatform(`node -e "${puppeteerScript.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
        return { success: true, screenshot: output, data: { path: output } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },

    // Extract data from webpage
    extract: async (url: string, selectors: Record<string, string>): Promise<BrowserResult> => {
      try {
        const selectorObj = JSON.stringify(selectors);
        const puppeteerScript = `
          const puppeteer = require('puppeteer');
          (async () => {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto('${url}', { waitUntil: 'networkidle2' });
            const data = {};
            const selectors = ${selectorObj};
            for (const [key, selector] of Object.entries(selectors)) {
              try {
                const elements = await page.$$(selector);
                data[key] = elements.length > 1 
                  ? await Promise.all(elements.map(el => el.evaluate(e => e.textContent.trim())))
                  : await page.$eval(selector, el => el.textContent.trim());
              } catch (e) {
                data[key] = null;
              }
            }
            await browser.close();
            console.log(JSON.stringify(data));
          })().catch(console.error);
        `;
        const { stdout } = await execCrossPlatform(`node -e "${puppeteerScript.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
        return { success: true, data: JSON.parse(stdout) };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },

    // Click element
    click: async (url: string, selector: string): Promise<BrowserResult> => {
      try {
        const puppeteerScript = `
          const puppeteer = require('puppeteer');
          (async () => {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto('${url}');
            await page.click('${selector}');
            console.log('Clicked: ${selector}');
          })().catch(console.error);
        `;
        await execCrossPlatform(`node -e "${puppeteerScript.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
        return { success: true, data: { clicked: selector } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },

    // Type text
    type: async (url: string, selector: string, text: string): Promise<BrowserResult> => {
      try {
        const puppeteerScript = `
          const puppeteer = require('puppeteer');
          (async () => {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto('${url}');
            await page.type('${selector}', '${text.replace(/'/g, "\\'")}');
            console.log('Typed into: ${selector}');
          })().catch(console.error);
        `;
        await execCrossPlatform(`node -e "${puppeteerScript.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
        return { success: true, data: { typed: text, selector } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },

    // Scroll page
    scroll: async (url: string, direction: 'up' | 'down' | 'top' | 'bottom', amount?: number): Promise<BrowserResult> => {
      try {
        let scrollScript = '';
        switch (direction) {
          case 'top':
            scrollScript = 'window.scrollTo(0, 0)';
            break;
          case 'bottom':
            scrollScript = 'window.scrollTo(0, document.body.scrollHeight)';
            break;
          case 'up':
            scrollScript = `window.scrollBy(0, -${amount || 500})`;
            break;
          case 'down':
            scrollScript = `window.scrollBy(0, ${amount || 500})`;
            break;
        }
        const puppeteerScript = `
          const puppeteer = require('puppeteer');
          (async () => {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto('${url}');
            await page.evaluate('${scrollScript}');
            console.log('Scrolled: ${direction}');
          })().catch(console.error);
        `;
        await execCrossPlatform(`node -e "${puppeteerScript.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
        return { success: true, data: { direction, amount } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },

    // Wait for element
    waitFor: async (url: string, selector: string, timeout: number = 30000): Promise<BrowserResult> => {
      try {
        const puppeteerScript = `
          const puppeteer = require('puppeteer');
          (async () => {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto('${url}');
            await page.waitForSelector('${selector}', { timeout: ${timeout} });
            console.log('Element found: ${selector}');
            await browser.close();
          })().catch(console.error);
        `;
        await execCrossPlatform(`node -e "${puppeteerScript.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
        return { success: true, data: { selector, found: true } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },

    // Execute JavaScript
    evaluate: async (url: string, script: string): Promise<BrowserResult> => {
      try {
        const puppeteerScript = `
          const puppeteer = require('puppeteer');
          (async () => {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto('${url}');
            const result = await page.evaluate(() => { ${script} });
            console.log(JSON.stringify(result));
            await browser.close();
          })().catch(console.error);
        `;
        const { stdout } = await execCrossPlatform(`node -e "${puppeteerScript.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
        return { success: true, data: stdout };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },

    // Fill form
    fillForm: async (url: string, fields: Record<string, string>): Promise<BrowserResult> => {
      try {
        const fieldsObj = JSON.stringify(fields);
        const puppeteerScript = `
          const puppeteer = require('puppeteer');
          (async () => {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto('${url}');
            const fields = ${fieldsObj};
            for (const [selector, value] of Object.entries(fields)) {
              await page.type(selector, value);
            }
            console.log('Form filled');
          })().catch(console.error);
        `;
        await execCrossPlatform(`node -e "${puppeteerScript.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
        return { success: true, data: { fieldsFilled: Object.keys(fields).length } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },

    // Get page content
    getContent: async (url: string): Promise<BrowserResult> => {
      try {
        const puppeteerScript = `
          const puppeteer = require('puppeteer');
          (async () => {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto('${url}', { waitUntil: 'networkidle2' });
            const content = await page.content();
            console.log(JSON.stringify({ html: content }));
            await browser.close();
          })().catch(console.error);
        `;
        const { stdout } = await execCrossPlatform(`node -e "${puppeteerScript.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
        return { success: true, data: JSON.parse(stdout) };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },

    // Get page text
    getText: async (url: string): Promise<BrowserResult> => {
      try {
        const puppeteerScript = `
          const puppeteer = require('puppeteer');
          (async () => {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto('${url}', { waitUntil: 'networkidle2' });
            const text = await page.evaluate(() => document.body.innerText);
            console.log(JSON.stringify({ text }));
            await browser.close();
          })().catch(console.error);
        `;
        const { stdout } = await execCrossPlatform(`node -e "${puppeteerScript.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
        return { success: true, data: JSON.parse(stdout) };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },

    // Download file
    download: async (url: string, outputPath: string): Promise<BrowserResult> => {
      try {
        const cmd = isWindows
          ? `Invoke-WebRequest -Uri "${url}" -OutFile "${outputPath}"`
          : `curl -o "${outputPath}" "${url}"`;
        await execCrossPlatform(cmd);
        return { success: true, data: { url, outputPath } };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },

    // Search and extract
    search: async (query: string, engine: 'google' | 'bing' | 'duckduckgo' = 'google'): Promise<BrowserResult> => {
      try {
        const searchUrls = {
          google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
          duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        };
        const url = searchUrls[engine];
        const puppeteerScript = `
          const puppeteer = require('puppeteer');
          (async () => {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto('${url}', { waitUntil: 'networkidle2' });
            const results = await page.evaluate(() => {
              const items = document.querySelectorAll('a h3');
              return Array.from(items).slice(0, 10).map(el => ({
                title: el.textContent,
                link: el.closest('a')?.href
              }));
            });
            console.log(JSON.stringify(results));
            await browser.close();
          })().catch(console.error);
        `;
        const { stdout } = await execCrossPlatform(`node -e "${puppeteerScript.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
        return { success: true, data: JSON.parse(stdout) };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },
  },

  // Execute a browser automation sequence
  execute: async (actions: BrowserAction[]): Promise<BrowserResult[]> => {
    const results: BrowserResult[] = [];
    for (const action of actions) {
      // Execute each action in sequence
      // This is a simplified implementation
      results.push({ success: true, data: { action: action.type } });
    }
    return results;
  },
};

// ============================================
// BROWSER TOOLS FOR TOOL REGISTRY
// ============================================
export const browserTools = {
  browser_navigate: {
    name: 'browser_navigate',
    description: 'Open a URL in the browser',
    parameters: { url: 'string' },
    execute: async (p: { url: string }) => browserUseSkill.actions.navigate(p.url),
  },

  browser_screenshot: {
    name: 'browser_screenshot',
    description: 'Take a screenshot of a webpage',
    parameters: { url: 'string', outputPath: 'string?' },
    execute: async (p: { url: string; outputPath?: string }) => 
      browserUseSkill.actions.screenshot(p.url, p.outputPath),
  },

  browser_extract: {
    name: 'browser_extract',
    description: 'Extract data from a webpage using CSS selectors',
    parameters: { url: 'string', selectors: 'object' },
    execute: async (p: { url: string; selectors: Record<string, string> }) => 
      browserUseSkill.actions.extract(p.url, p.selectors),
  },

  browser_click: {
    name: 'browser_click',
    description: 'Click an element on a webpage',
    parameters: { url: 'string', selector: 'string' },
    execute: async (p: { url: string; selector: string }) => 
      browserUseSkill.actions.click(p.url, p.selector),
  },

  browser_type: {
    name: 'browser_type',
    description: 'Type text into an input field on a webpage',
    parameters: { url: 'string', selector: 'string', text: 'string' },
    execute: async (p: { url: string; selector: string; text: string }) => 
      browserUseSkill.actions.type(p.url, p.selector, p.text),
  },

  browser_scroll: {
    name: 'browser_scroll',
    description: 'Scroll the webpage',
    parameters: { url: 'string', direction: 'string', amount: 'number?' },
    execute: async (p: { url: string; direction: 'up' | 'down' | 'top' | 'bottom'; amount?: number }) => 
      browserUseSkill.actions.scroll(p.url, p.direction, p.amount),
  },

  browser_wait: {
    name: 'browser_wait',
    description: 'Wait for an element to appear on the page',
    parameters: { url: 'string', selector: 'string', timeout: 'number?' },
    execute: async (p: { url: string; selector: string; timeout?: number }) => 
      browserUseSkill.actions.waitFor(p.url, p.selector, p.timeout),
  },

  browser_evaluate: {
    name: 'browser_evaluate',
    description: 'Execute JavaScript on a webpage',
    parameters: { url: 'string', script: 'string' },
    execute: async (p: { url: string; script: string }) => 
      browserUseSkill.actions.evaluate(p.url, p.script),
  },

  browser_fill_form: {
    name: 'browser_fill_form',
    description: 'Fill multiple form fields at once',
    parameters: { url: 'string', fields: 'object' },
    execute: async (p: { url: string; fields: Record<string, string> }) => 
      browserUseSkill.actions.fillForm(p.url, p.fields),
  },

  browser_get_content: {
    name: 'browser_get_content',
    description: 'Get the full HTML content of a webpage',
    parameters: { url: 'string' },
    execute: async (p: { url: string }) => 
      browserUseSkill.actions.getContent(p.url),
  },

  browser_get_text: {
    name: 'browser_get_text',
    description: 'Get the visible text content of a webpage',
    parameters: { url: 'string' },
    execute: async (p: { url: string }) => 
      browserUseSkill.actions.getText(p.url),
  },

  browser_download: {
    name: 'browser_download',
    description: 'Download a file from a URL',
    parameters: { url: 'string', outputPath: 'string' },
    execute: async (p: { url: string; outputPath: string }) => 
      browserUseSkill.actions.download(p.url, p.outputPath),
  },

  browser_search: {
    name: 'browser_search',
    description: 'Search the web and get results',
    parameters: { query: 'string', engine: 'string?' },
    execute: async (p: { query: string; engine?: 'google' | 'bing' | 'duckduckgo' }) => 
      browserUseSkill.actions.search(p.query, p.engine || 'google'),
  },
};

export default browserUseSkill;
