import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Helper to initialize GenAI client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// API 1: Health Check
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ----------------------------------------------------
// API 2: Generate Podcast Script & Storyboard (NotebookLM Style)
// ----------------------------------------------------
app.post('/api/generate-script', async (req, res) => {
  try {
    const {
      sources = [],
      format = 'deep_dive',
      tone = 'engaging',
      length = 'short',
      hostAName = 'Alex',
      hostBName = 'Sarah',
      hostAVoice = 'Kore',
      hostBVoice = 'Puck',
      customPrompt = '',
      focusTopic = '',
    } = req.body;

    const ai = getGenAI();

    const sourceTexts = sources.map((s: any, idx: number) => `--- SOURCE ${idx + 1}: ${s.title || 'Document'} ---\n${s.content}`).join('\n\n');

    const systemInstruction = `You are a world-class AI Podcast Showrunner and Video Director producing a NotebookLM-style "Audio & Video Overview" episode.
Your task is to transform the provided source documents into a highly engaging, natural, multi-speaker conversational podcast script with synchronized video slides, show notes, and chapters.

Rules for Dialogue:
- The hosts are ${hostAName} (Host A) and ${hostBName} (Host B).
- Format: ${format} (e.g. deep_dive with 2 hosts bantering back and forth, demystifying complex concepts with analogies, enthusiasm, and lighthearted commentary).
- Tone: ${tone}.
- Target length: ${length} (short: 12-16 lines, medium: 20-28 lines, long: 32+ lines).
- Make dialogue sound completely human! Use conversational phrasing like "Wait, really?", "Hold on, let me get this straight...", "Exactly!", "What's super interesting here is...", "If you look at the slide...".
- Each line MUST specify which slideIndex it belongs to (0-indexed referring to the video slides array).
- Include appropriate emotions ('excited', 'thoughtful', 'curious', 'surprised', 'serious', 'amused') and subtle sound effects ('chuckle', 'paper shuffle', 'intro chime', 'outro music').

Rules for Storyboard Slides (Video Overview):
- Create 3-5 visual storyboard slides that transition as the hosts speak.
- Each slide has a clear title, subtitle, 3 crisp bullet points, a key quote, and chartType ('comparison', 'bar', 'pie', 'timeline', or 'none').

Rules for Show Notes:
- Concise summary, 3 bulleted key takeaways, 2 discussion questions, and references.`;

    const userPrompt = `SOURCE DOCUMENTS:
${sourceTexts || 'No documents provided. Create a podcast episode on: ' + (focusTopic || 'The Future of AI Technology')}

${focusTopic ? `SPECIAL FOCUS TOPIC: ${focusTopic}` : ''}
${customPrompt ? `ADDITIONAL INSTRUCTIONS: ${customPrompt}` : ''}

Generate a complete, fully detailed podcast episode JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Catchy episode title' },
            tagline: { type: Type.STRING, description: 'One line tagline summarizing the episode' },
            topicSummary: { type: Type.STRING, description: 'Brief paragraph overview' },
            showNotes: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
                discussionQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                references: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['summary', 'keyTakeaways', 'discussionQuestions', 'references'],
            },
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.NUMBER, description: 'Timestamp in seconds' },
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                },
                required: ['timestamp', 'title', 'summary'],
              },
            },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  index: { type: Type.NUMBER },
                  timestamp: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                  keyQuote: { type: Type.STRING },
                  chartType: { type: Type.STRING },
                },
                required: ['index', 'timestamp', 'title', 'bullets'],
              },
            },
            lines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  speakerName: { type: Type.STRING, description: `${hostAName} or ${hostBName}` },
                  text: { type: Type.STRING },
                  timestamp: { type: Type.NUMBER },
                  duration: { type: Type.NUMBER, description: 'Duration in seconds for speaking this line' },
                  emotion: { type: Type.STRING },
                  soundEffect: { type: Type.STRING },
                  slideIndex: { type: Type.NUMBER },
                },
                required: ['speakerName', 'text', 'timestamp', 'duration', 'slideIndex'],
              },
            },
          },
          required: ['title', 'tagline', 'topicSummary', 'showNotes', 'chapters', 'slides', 'lines'],
        },
      },
    });

    const jsonText = response.text || '{}';
    const episodeData = JSON.parse(jsonText);

    // Attach speaker profiles and IDs
    const speaker1Profile = {
      id: 'spk-1',
      name: hostAName,
      role: 'Host A' as const,
      voiceName: hostAVoice,
      gender: 'female' as const,
      color: '#3b82f6',
    };
    const speaker2Profile = {
      id: 'spk-2',
      name: hostBName,
      role: 'Host B' as const,
      voiceName: hostBVoice,
      gender: 'male' as const,
      color: '#10b981',
    };

    const speakers = [speaker1Profile, speaker2Profile];

    let currentTimestamp = 0;
    const linesWithMeta = episodeData.lines.map((line: any, idx: number) => {
      const isHostA = line.speakerName.toLowerCase().trim() === hostAName.toLowerCase().trim();
      const speakerObj = isHostA ? speaker1Profile : speaker2Profile;
      const estimatedDuration = Math.max(3, Math.ceil(line.text.split(' ').length / 2.8));

      const lineMeta = {
        id: `line-${idx + 1}`,
        speakerId: speakerObj.id,
        speakerName: speakerObj.name,
        text: line.text,
        timestamp: currentTimestamp,
        duration: estimatedDuration,
        emotion: line.emotion || 'neutral',
        soundEffect: line.soundEffect || undefined,
        slideIndex: typeof line.slideIndex === 'number' ? line.slideIndex : 0,
      };

      currentTimestamp += estimatedDuration;
      return lineMeta;
    });

    const totalDuration = currentTimestamp;

    const fullEpisode = {
      id: `ep-${Date.now()}`,
      title: episodeData.title,
      tagline: episodeData.tagline,
      topicSummary: episodeData.topicSummary,
      format,
      tone,
      length,
      coverImage: '/src/assets/images/quantum_breakthrough_cover_1786044820425.jpg',
      createdAt: new Date().toISOString().split('T')[0],
      durationSeconds: totalDuration,
      sourcesUsed: sources.map((s: any) => s.id || s.title),
      speakers,
      lines: linesWithMeta,
      slides: (episodeData.slides || []).map((sl: any, idx: number) => ({
        ...sl,
        id: `slide-${idx + 1}`,
        index: idx,
      })),
      chapters: episodeData.chapters || [],
      showNotes: episodeData.showNotes,
      audioSynthesized: false,
    };

    res.json({ success: true, episode: fullEpisode });
  } catch (error: any) {
    console.error('Error generating script:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate script' });
  }
});

// ----------------------------------------------------
// API 3: Voice Synthesis (Gemini TTS API)
// ----------------------------------------------------
app.post('/api/synthesize-voice', async (req, res) => {
  try {
    const { text, voiceName = 'Kore', prompt } = req.body;
    const ai = getGenAI();

    const textToSynthesize = prompt || text || 'Welcome to NotebookCast Studio!';

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: textToSynthesize }] }],
      config: {
        responseModalities: ['AUDIO' as any],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(400).json({ success: false, error: 'No audio data returned from TTS' });
    }

    res.json({
      success: true,
      audioBase64: base64Audio,
      sampleRate: 24000,
      mimeType: 'audio/pcm',
    });
  } catch (error: any) {
    console.error('TTS Synthesis error:', error);
    res.status(500).json({ success: false, error: error.message || 'Voice synthesis failed' });
  }
});

// ----------------------------------------------------
// API 4: Generate Episode Cover Art
// ----------------------------------------------------
app.post('/api/generate-cover', async (req, res) => {
  try {
    const { prompt } = req.body;
    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            text: `High quality podcast album cover art for episode: ${prompt}. Minimalist digital artwork, sleek 3D graphic aesthetic, vibrant gradient studio lighting.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: '1:1',
        },
      },
    });

    let imageUrl = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      imageUrl = 'https://picsum.photos/seed/' + encodeURIComponent(prompt) + '/800/800';
    }

    res.json({ success: true, imageUrl });
  } catch (error: any) {
    console.error('Cover image generation error:', error);
    res.json({
      success: false,
      imageUrl: 'https://picsum.photos/seed/podcast-cover/800/800',
    });
  }
});

// ----------------------------------------------------
// Serve Vite in dev / Static files in production
// ----------------------------------------------------
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NotebookCast Studio running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
