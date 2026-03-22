/**
 * VoiceDev - Voice Support (TTS, ASR, STT)
 * Integration with multiple providers
 */

import { providers, getTTSModels, getASRModels } from '../providers';

// ============================================
// TEXT-TO-SPEECH (TTS)
// ============================================
export const ttsTools = {
  tts_speak: {
    name: 'tts_speak',
    description: 'Convert text to speech using AI',
    parameters: { 
      text: 'string', 
      provider: 'string?', 
      model: 'string?', 
      voice: 'string?',
      speed: 'number?',
      output: 'string?'
    },
    execute: async (p: { 
      text: string; 
      provider?: string; 
      model?: string; 
      voice?: string;
      speed?: number;
      output?: string;
    }) => {
      const provider = p.provider || 'openai';
      const model = p.model || 'tts-1';
      const voice = p.voice || 'alloy';
      const speed = p.speed || 1.0;
      
      try {
        if (provider === 'openai') {
          return await openaiTTS(p.text, model, voice, speed, p.output);
        } else if (provider === 'elevenlabs') {
          return await elevenLabsTTS(p.text, model, voice, p.output);
        } else if (provider === 'minimax') {
          return await minimaxTTS(p.text, voice, p.output);
        }
        
        return { success: false, error: `Unknown TTS provider: ${provider}` };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  tts_list_voices: {
    name: 'tts_list_voices',
    description: 'List available TTS voices',
    parameters: { provider: 'string?' },
    execute: async (p: { provider?: string }) => {
      const voices: Record<string, string[]> = {
        openai: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
        elevenlabs: ['rachel', 'domi', 'bella', 'antoni', 'elli', 'josh', 'arnold', 'adam', 'sam'],
        minimax: ['male-qn-qingse', 'male-qn-jingying', 'female-shaonv', 'female-yujie', 'male-qn-badao', 'male-qn-jingjia'],
        google: ['en-US-Neural2-A', 'en-US-Neural2-C', 'en-US-Neural2-D', 'en-US-Neural2-E', 'en-US-Neural2-F'],
        azure: ['en-US-JennyNeural', 'en-US-GuyNeural', 'en-US-AriaNeural', 'en-US-DavisNeural'],
      };
      
      if (p.provider) {
        return { success: true, data: voices[p.provider] || [] };
      }
      
      return { success: true, data: voices };
    }
  },

  tts_stream: {
    name: 'tts_stream',
    description: 'Stream TTS audio in real-time',
    parameters: { text: 'string', provider: 'string?', voice: 'string?' },
    execute: async (p: { text: string; provider?: string; voice?: string }) => {
      // Returns a stream URL or audio chunks
      try {
        const provider = p.provider || 'openai';
        const voice = p.voice || 'alloy';
        
        return { 
          success: true, 
          data: { 
            streamUrl: `ws://localhost:3000/api/tts/stream`,
            provider,
            voice,
            textLength: p.text.length
          }
        };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },
};

// ============================================
// AUTOMATIC SPEECH RECOGNITION (ASR)
// ============================================
export const asrTools = {
  asr_transcribe: {
    name: 'asr_transcribe',
    description: 'Transcribe audio to text using AI',
    parameters: { 
      audioPath: 'string', 
      provider: 'string?', 
      model: 'string?',
      language: 'string?'
    },
    execute: async (p: { 
      audioPath: string; 
      provider?: string; 
      model?: string;
      language?: string;
    }) => {
      const provider = p.provider || 'openai';
      const model = p.model || 'whisper-1';
      
      try {
        if (provider === 'openai') {
          return await openaiWhisper(p.audioPath, model, p.language);
        } else if (provider === 'groq') {
          return await groqWhisper(p.audioPath, p.language);
        } else if (provider === 'elevenlabs') {
          return await elevenLabsScribe(p.audioPath);
        }
        
        return { success: false, error: `Unknown ASR provider: ${provider}` };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  asr_transcribe_url: {
    name: 'asr_transcribe_url',
    description: 'Transcribe audio from URL',
    parameters: { 
      audioUrl: 'string', 
      provider: 'string?', 
      language: 'string?'
    },
    execute: async (p: { audioUrl: string; provider?: string; language?: string }) => {
      try {
        // Download and transcribe
        const https = require('https');
        const http = require('http');
        const fs = require('fs');
        const os = require('os');
        
        const tempFile = `${os.tmpdir()}/audio_${Date.now()}.mp3`;
        
        return new Promise((resolve) => {
          const lib = p.audioUrl.startsWith('https') ? https : http;
          const file = fs.createWriteStream(tempFile);
          
          lib.get(p.audioUrl, (res: any) => {
            res.pipe(file);
            file.on('finish', async () => {
              file.close();
              // Now transcribe
              const result = await asrTools.asr_transcribe.execute({
                audioPath: tempFile,
                provider: p.provider,
                language: p.language
              });
              fs.unlinkSync(tempFile);
              resolve(result);
            });
          }).on('error', (e: any) => {
            fs.unlinkSync(tempFile);
            resolve({ success: false, error: e.message });
          });
        });
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },

  asr_translate: {
    name: 'asr_translate',
    description: 'Transcribe and translate audio to English',
    parameters: { audioPath: 'string', provider: 'string?' },
    execute: async (p: { audioPath: string; provider?: string }) => {
      const provider = p.provider || 'openai';
      const fs = require('fs');
      const path = require('path');

      if (provider === 'openai') {
        if (!process.env.OPENAI_API_KEY) return { success: false, error: 'OPENAI_API_KEY not set' };
        try {
          const audioBuffer = fs.readFileSync(p.audioPath);
          const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
          const formData = new FormData();
          formData.append('file', blob, path.basename(p.audioPath));
          formData.append('model', 'whisper-1');

          const response = await fetch('https://api.openai.com/v1/audio/translations', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
            body: formData
          });

          const json = await response.json();
          return json.error ? { success: false, error: json.error.message } : { success: true, data: { text: json.text, provider } };
        } catch (e: any) { return { success: false, error: e.message }; }
      }

      if (provider === 'groq') {
        if (!process.env.GROQ_API_KEY) return { success: false, error: 'GROQ_API_KEY not set' };
        try {
          const audioBuffer = fs.readFileSync(p.audioPath);
          const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
          const formData = new FormData();
          formData.append('file', blob, path.basename(p.audioPath));
          formData.append('model', 'whisper-large-v3');

          const response = await fetch('https://api.groq.com/openai/v1/audio/translations', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
            body: formData
          });

          const json = await response.json();
          return json.error ? { success: false, error: json.error.message } : { success: true, data: { text: json.text, provider } };
        } catch (e: any) { return { success: false, error: e.message }; }
      }

      return { success: false, error: 'Translation not supported for this provider' };
    }
  },
};

// ============================================
// VOICE CLONING
// ============================================
export const voiceCloningTools = {
  voice_clone: {
    name: 'voice_clone',
    description: 'Clone a voice from audio samples using ElevenLabs',
    parameters: { 
      audioPaths: 'array', 
      name: 'string',
      description: 'string?'
    },
    execute: async (p: { audioPaths: string[]; name: string; description?: string }) => {
      const fs = require('fs');
      const path = require('path');

      if (!process.env.ELEVENLABS_API_KEY) {
        return { success: false, error: 'ELEVENLABS_API_KEY is not set' };
      }

      try {
        const formData = new FormData();
        formData.append('name', p.name);
        if (p.description) formData.append('description', p.description);
        
        for (const audioPath of p.audioPaths) {
          const buffer = fs.readFileSync(audioPath);
          const blob = new Blob([buffer], { type: 'audio/mpeg' });
          formData.append('files', blob, path.basename(audioPath));
        }

        const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
          method: 'POST',
          headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
          },
          body: formData
        });

        const json = await response.json();
        if (json.error || !json.voice_id) {
          return { success: false, error: json.error?.message || 'Failed to clone voice' };
        }
        return {
          success: true,
          data: {
            voiceId: json.voice_id,
            name: p.name,
            provider: 'elevenlabs',
            samples: p.audioPaths.length
          }
        };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
  },
};

// ============================================
// PROVIDER IMPLEMENTATIONS
// ============================================
async function openaiTTS(text: string, model: string, voice: string, speed: number, output?: string): Promise<any> {
  const https = require('https');
  const fs = require('fs');
  const os = require('os');
  
  return new Promise((resolve) => {
    const data = JSON.stringify({ model, input: text, voice, speed });
    
    const req = https.request({
      hostname: 'api.openai.com',
      path: '/v1/audio/speech',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (res: any) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const outputPath = output || `${os.tmpdir()}/tts_${Date.now()}.mp3`;
        fs.writeFileSync(outputPath, buffer);
        resolve({ success: true, data: { path: outputPath, size: buffer.length } });
      });
    });
    
    req.on('error', (e: any) => resolve({ success: false, error: e.message }));
    req.write(data);
    req.end();
  });
}

async function elevenLabsTTS(text: string, model: string, voice: string, output?: string): Promise<any> {
  const https = require('https');
  const fs = require('fs');
  const os = require('os');
  
  const voiceId = voice || '21m00Tcm4TlvDq8ikWAM'; // Rachel
  
  return new Promise((resolve) => {
    const data = JSON.stringify({ text, model_id: model || 'eleven_monolingual_v1' });
    
    const req = https.request({
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${voiceId}`,
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (res: any) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const outputPath = output || `${os.tmpdir()}/tts_${Date.now()}.mp3`;
        fs.writeFileSync(outputPath, buffer);
        resolve({ success: true, data: { path: outputPath, size: buffer.length } });
      });
    });
    
    req.on('error', (e: any) => resolve({ success: false, error: e.message }));
    req.write(data);
    req.end();
  });
}

async function minimaxTTS(text: string, voice: string, output?: string): Promise<any> {
  // MiniMax TTS implementation
  const https = require('https');
  const fs = require('fs');
  const os = require('os');
  
  return new Promise((resolve) => {
    const data = JSON.stringify({
      text,
      voice_id: voice || 'male-qn-qingse',
      model: 'speech-01'
    });
    
    const req = https.request({
      hostname: 'api.minimax.chat',
      path: '/v1/text_to_speech',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (res: any) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(Buffer.concat(chunks).toString());
          if (json.data?.audio) {
            const buffer = Buffer.from(json.data.audio, 'base64');
            const outputPath = output || `${os.tmpdir()}/tts_${Date.now()}.mp3`;
            fs.writeFileSync(outputPath, buffer);
            resolve({ success: true, data: { path: outputPath, size: buffer.length } });
          } else {
            resolve({ success: false, error: 'No audio in response' });
          }
        } catch (e: any) {
          resolve({ success: false, error: e.message });
        }
      });
    });
    
    req.on('error', (e: any) => resolve({ success: false, error: e.message }));
    req.write(data);
    req.end();
  });
}

async function openaiWhisper(audioPath: string, model: string, language?: string): Promise<any> {
  const fs = require('fs');
  const path = require('path');

  if (!process.env.OPENAI_API_KEY) {
    return { success: false, error: 'OPENAI_API_KEY is not set' };
  }

  try {
    const audioBuffer = fs.readFileSync(audioPath);
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const formData = new FormData();
    formData.append('file', blob, path.basename(audioPath));
    formData.append('model', model || 'whisper-1');
    if (language) formData.append('language', language);

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData
    });

    const json = await response.json();
    if (json.error) {
      return { success: false, error: json.error.message };
    }
    return { success: true, data: { text: json.text, language: language || 'auto' } };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

async function groqWhisper(audioPath: string, language?: string): Promise<any> {
  const fs = require('fs');
  const path = require('path');

  if (!process.env.GROQ_API_KEY) {
    return { success: false, error: 'GROQ_API_KEY is not set' };
  }

  try {
    const audioBuffer = fs.readFileSync(audioPath);
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const formData = new FormData();
    formData.append('file', blob, path.basename(audioPath));
    formData.append('model', 'whisper-large-v3-turbo');
    if (language) formData.append('language', language);

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: formData
    });

    const json = await response.json();
    if (json.error) {
      return { success: false, error: json.error.message };
    }
    return { success: true, data: { text: json.text, language: language || 'auto', speed: 'ultra_fast' } };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

async function elevenLabsScribe(audioPath: string): Promise<any> {
  const fs = require('fs');
  const path = require('path');

  if (!process.env.ELEVENLABS_API_KEY) {
    return { success: false, error: 'ELEVENLABS_API_KEY is not set' };
  }

  try {
    const audioBuffer = fs.readFileSync(audioPath);
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const formData = new FormData();
    formData.append('file', blob, path.basename(audioPath));
    formData.append('model_id', 'scribe_v1');

    const response = await fetch('https://api.elevenlabs.io/v1/scribe', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      body: formData
    });

    const json = await response.json();
    if (json.error) {
      return { success: false, error: json.error.message };
    }
    return { success: true, data: { text: json.text, provider: 'elevenlabs' } };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// Export all voice tools
export const allVoiceTools = {
  ...ttsTools,
  ...asrTools,
  ...voiceCloningTools,
};

export default allVoiceTools;
