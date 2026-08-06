import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Mic,
  Sliders,
  Clock,
  Radio,
  FileText,
  Zap,
  Check,
  AlertCircle,
  Loader2,
  Video,
  Volume2,
} from 'lucide-react';
import {
  GenerationOptions,
  PodcastEpisode,
  PodcastFormat,
  PodcastLength,
  PodcastTone,
  SourceDocument,
  VoiceName,
} from '../types';

interface GeneratorTabProps {
  sources: SourceDocument[];
  onEpisodeGenerated: (episode: PodcastEpisode) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
}

export const GeneratorTab: React.FC<GeneratorTabProps> = ({
  sources,
  onEpisodeGenerated,
  isGenerating,
  setIsGenerating,
}) => {
  const selectedSources = sources.filter((s) => s.selected);

  const [options, setOptions] = useState<GenerationOptions>({
    format: 'deep_dive',
    tone: 'engaging',
    length: 'short',
    hostAName: 'Alex',
    hostBName: 'Sarah',
    hostAVoice: 'Kore',
    hostBVoice: 'Puck',
    customPrompt: '',
    focusTopic: '',
  });

  const [generationStep, setGenerationStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setGenerationStep('Analyzing Notebook Grounded Context...');

    try {
      await new Promise((r) => setTimeout(r, 600));
      setGenerationStep('Synthesizing Dual-Host Conversational Dialogue...');

      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sources: selectedSources,
          ...options,
        }),
      });

      setGenerationStep('Generating Video Storyboard & Presentation Slides...');
      await new Promise((r) => setTimeout(r, 600));

      const data = await response.json();

      if (!data.success || !data.episode) {
        throw new Error(data.error || 'Failed to generate episode script');
      }

      setGenerationStep('Formatting Show Notes & Chapter Markers...');
      await new Promise((r) => setTimeout(r, 400));

      onEpisodeGenerated(data.episode);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setErrorMsg(err.message || 'An error occurred while generating the podcast episode.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const formats: { id: PodcastFormat; title: string; desc: string; icon: string }[] = [
    {
      id: 'deep_dive',
      title: 'Deep Dive Dialogue',
      desc: '2 Hosts bantering, explaining, and demystifying complex topics (NotebookLM style)',
      icon: '🎙️',
    },
    {
      id: 'solo_talk',
      title: 'Solo Monologue',
      desc: '1 Expert Host presenting a structured breakdown',
      icon: '👤',
    },
    {
      id: 'debate',
      title: 'Debate & Perspectives',
      desc: '2 Hosts exploring opposing viewpoints & constructive counter-arguments',
      icon: '⚔️',
    },
    {
      id: 'quick_explainer',
      title: 'Quick Explainer',
      desc: '3-minute rapid summary focusing purely on key takeaways',
      icon: '⚡',
    },
  ];

  const tones: { id: PodcastTone; label: string }[] = [
    { id: 'engaging', label: 'Engaging & Casual' },
    { id: 'academic', label: 'Academic & Technical' },
    { id: 'humorous', label: 'Witty & Punchy' },
    { id: 'investigative', label: 'Investigative Journalism' },
    { id: 'storytelling', label: 'Cinematic Narrative' },
    { id: 'executive', label: 'Executive Briefing' },
  ];

  const lengths: { id: PodcastLength; label: string; time: string }[] = [
    { id: 'short', label: 'Short (~2.5 mins)', time: '12-16 turns' },
    { id: 'medium', label: 'Medium (~5 mins)', time: '20-28 turns' },
    { id: 'long', label: 'In-Depth (~10 mins)', time: '32+ turns' },
  ];

  const voices: VoiceName[] = ['Kore', 'Puck', 'Zephyr', 'Charon', 'Fenrir'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-2 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            AI Studio Showrunner
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Configure Your AI Podcast & Video Studio Episode
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Select your podcast format, voice profiles, tone, and focus area. The Gemini AI engine will read your selected notebook sources and build a complete audio-visual production.
        </p>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Configuration Controls */}
        <div className="lg:col-span-2 space-y-8">
          {/* Format Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Radio className="w-4 h-4 text-indigo-400" />
              <span>1. Choose Episode Format</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formats.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setOptions({ ...options, format: f.id })}
                  className={`p-4 rounded-xl border text-left transition duration-150 flex flex-col justify-between space-y-2 ${
                    options.format === f.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{f.icon}</span>
                    {options.format === f.id && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{f.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">{f.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Host & Voice Synthesis Configuration */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>2. AI Host Persona & Voice Synthesis</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Host A */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Host A (Lead Host)</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Host Name</label>
                  <input
                    type="text"
                    value={options.hostAName}
                    onChange={(e) => setOptions({ ...options, hostAName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Gemini AI Voice Model</label>
                  <select
                    value={options.hostAVoice}
                    onChange={(e) => setOptions({ ...options, hostAVoice: e.target.value as VoiceName })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {voices.map((v) => (
                      <option key={v} value={v}>
                        {v} Voice (Gemini TTS)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Host B */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Host B (Co-Host / Guest)</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Host Name</label>
                  <input
                    type="text"
                    value={options.hostBName}
                    onChange={(e) => setOptions({ ...options, hostBName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Gemini AI Voice Model</label>
                  <select
                    value={options.hostBVoice}
                    onChange={(e) => setOptions({ ...options, hostBVoice: e.target.value as VoiceName })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {voices.map((v) => (
                      <option key={v} value={v}>
                        {v} Voice (Gemini TTS)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tone & Duration Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>3. Tone & Episode Length</span>
            </h2>

            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-300">Tone & Presentation Style</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setOptions({ ...options, tone: t.id })}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition text-center ${
                      options.tone === t.id
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-medium text-slate-300">Target Duration</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {lengths.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setOptions({ ...options, length: l.id })}
                    className={`p-3 rounded-xl border text-left transition ${
                      options.length === l.id
                        ? 'bg-indigo-950/80 border-indigo-500 text-white ring-1 ring-indigo-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-1 text-xs font-bold text-white">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{l.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">{l.time}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Focus Prompt */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>4. Specific Angle or Custom Prompt (Optional)</span>
            </h2>
            <textarea
              value={options.customPrompt}
              onChange={(e) => setOptions({ ...options, customPrompt: e.target.value })}
              placeholder="e.g. Focus on how this impacts non-technical readers. Ask the hosts to include a metaphor about space travel."
              rows={3}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* Right Column: Sources Summary & Generate Trigger */}
        <div className="space-y-6">
          {/* Selected Sources Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Grounded Notebook Sources</span>
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                {selectedSources.length} Active
              </span>
            </div>

            {selectedSources.length === 0 ? (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-center space-y-2">
                <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
                <p className="text-xs text-slate-400">
                  No sources currently checked! The AI will generate a general topic episode. Check sources in the Notebook tab for grounded analysis.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {selectedSources.map((s) => (
                  <div key={s.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 truncate flex items-center justify-between">
                    <span className="truncate">{s.title}</span>
                    <span className="text-[10px] text-slate-500 ml-2">{s.wordCount}w</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Studio Features Highlight */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-sm text-indigo-300 flex items-center space-x-2">
              <Video className="w-4 h-4 text-indigo-400" />
              <span>Includes NotebookLM Video Studio</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every episode generates:
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Timed multi-speaker audio dialogue</li>
              <li>Animated video storyboard slides</li>
              <li>Waveform audio spectrum visualizer</li>
              <li>1-Click WebM/MP4 Video Recording Export</li>
              <li>Show notes & chapter timestamps</li>
            </ul>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs space-y-1">
              <div className="flex items-center space-x-2 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Generation Error</span>
              </div>
              <p>{errorMsg}</p>
            </div>
          )}

          {/* Action Trigger Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base shadow-2xl flex items-center justify-center space-x-3 transition duration-200 ${
              isGenerating
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-600/30 active:scale-95'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                <span className="text-sm">{generationStep || 'Generating Studio Episode...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Synthesize Studio Episode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
