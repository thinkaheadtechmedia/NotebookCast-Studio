import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  FileText,
  Share2,
  Copy,
  Check,
  Download,
  Film,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';
import { PodcastEpisode } from '../types';

interface ShowNotesTabProps {
  episode: PodcastEpisode;
}

export const ShowNotesTab: React.FC<ShowNotesTabProps> = ({ episode }) => {
  const [copiedText, setCopiedText] = useState(false);
  const [activeClipIndex, setActiveClipIndex] = useState(0);

  const handleCopyShowNotes = () => {
    let text = `${episode.title}\n${episode.tagline}\n\nSUMMARY:\n${episode.showNotes.summary}\n\nKEY TAKEAWAYS:\n`;
    episode.showNotes.keyTakeaways.forEach((k) => (text += `• ${k}\n`));
    text += `\nDISCUSSION QUESTIONS:\n`;
    episode.showNotes.discussionQuestions.forEach((q) => (text += `? ${q}\n`));

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadSRT = () => {
    let srt = '';
    episode.lines.forEach((line, idx) => {
      const startSec = line.timestamp;
      const endSec = line.timestamp + line.duration;

      const formatSRTTime = (sec: number) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = Math.floor(sec % 60);
        const ms = Math.floor((sec % 1) * 1000);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
          .toString()
          .padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
      };

      srt += `${idx + 1}\n`;
      srt += `${formatSRTTime(startSec)} --> ${formatSRTTime(endSec)}\n`;
      srt += `[${line.speakerName}]: ${line.text}\n\n`;
    });

    const blob = new Blob([srt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${episode.title.replace(/\s+/g, '_')}_Captions.srt`;
    a.click();
  };

  // Extract top 3 punchy quote lines for social clips
  const clipLines = episode.lines.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Show Notes & Social Clip Studio
            </span>
          </div>
          <h1 className="text-2xl font-extrabold">{episode.title}</h1>
          <p className="text-xs text-slate-400">{episode.tagline}</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyShowNotes}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
            <span>{copiedText ? 'Copied Notes!' : 'Copy Show Notes'}</span>
          </button>

          <button
            onClick={handleDownloadSRT}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Captions (.srt)</span>
          </button>
        </div>
      </div>

      {/* Grid Layout: Show Notes vs Social Clips Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Structured Show Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 text-white">
            <h2 className="text-base font-bold flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Episode Summary</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              {episode.showNotes.summary}
            </p>
          </div>

          {/* Key Takeaways */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-white">
            <h2 className="text-base font-bold flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Key Takeaways</span>
            </h2>
            <div className="space-y-2">
              {episode.showNotes.keyTakeaways.map((takeaway, i) => (
                <div key={i} className="flex items-start space-x-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{takeaway}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Discussion Questions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-white">
            <h2 className="text-base font-bold flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>Discussion Questions</span>
            </h2>
            <div className="space-y-2">
              {episode.showNotes.discussionQuestions.map((question, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">?</span>
                  <span>{question}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Vertical Social Media Clip Preview (TikTok / Reels / Shorts) */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-white">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm font-bold">Social Clip Generator (9:16 Vertical)</h2>
            </div>
            <p className="text-xs text-slate-400">
              Select a key dialogue highlight below to preview as a viral short-form video clip.
            </p>

            {/* Clip Selector Tabs */}
            <div className="space-y-2">
              {clipLines.map((line, idx) => (
                <button
                  key={line.id}
                  onClick={() => setActiveClipIndex(idx)}
                  className={`w-full p-2.5 rounded-xl border text-left transition text-xs ${
                    activeClipIndex === idx
                      ? 'bg-indigo-950/80 border-indigo-500 text-white font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-indigo-400 block text-[10px]">
                    Clip #{idx + 1} • {line.speakerName}
                  </span>
                  <p className="line-clamp-1 truncate">{line.text}</p>
                </button>
              ))}
            </div>

            {/* Simulated 9:16 Vertical Mobile Video Preview */}
            <div className="relative aspect-[9/16] w-full max-w-[240px] mx-auto rounded-3xl overflow-hidden bg-slate-950 border-4 border-slate-800 shadow-2xl flex flex-col justify-between p-4 text-center">
              <div className="pt-4">
                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-bold tracking-wider uppercase">
                  NotebookCast Short
                </span>
              </div>

              {/* Center Animated Caption */}
              <div className="space-y-3 my-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 mx-auto flex items-center justify-center font-bold text-white text-sm shadow-lg">
                  {clipLines[activeClipIndex]?.speakerName[0] || 'A'}
                </div>
                <div className="bg-slate-900/90 backdrop-blur border border-indigo-500/30 p-3 rounded-2xl">
                  <p className="text-xs font-bold text-white leading-snug">
                    "{clipLines[activeClipIndex]?.text}"
                  </p>
                  <span className="text-[10px] text-indigo-400 font-semibold mt-1 block">
                    — {clipLines[activeClipIndex]?.speakerName}
                  </span>
                </div>
              </div>

              <div className="pb-2 text-[9px] text-slate-500 font-mono">
                NotebookLM Studio Audio Overview
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
