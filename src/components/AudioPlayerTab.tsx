import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Headphones,
  List,
  Download,
  Clock,
  Sparkles,
  BookOpen,
  MessageSquare,
  FileText,
  Check,
} from 'lucide-react';
import { PodcastEpisode } from '../types';
import { globalAudioEngine } from '../lib/audioEngine';

interface AudioPlayerTabProps {
  episode: PodcastEpisode;
}

export const AudioPlayerTab: React.FC<AudioPlayerTabProps> = ({ episode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'transcript' | 'chapters'>('transcript');

  const togglePlay = () => {
    if (isPlaying) {
      globalAudioEngine.pause();
      setIsPlaying(false);
    } else {
      globalAudioEngine.play(currentTime);
      setIsPlaying(true);
    }
  };

  const jumpToTime = (timeSeconds: number) => {
    setCurrentTime(timeSeconds);
    globalAudioEngine.seek(timeSeconds);
  };

  const handleDownloadMarkdown = () => {
    let md = `# ${episode.title}\n*${episode.tagline}*\n\n`;
    md += `**Format:** ${episode.format} | **Tone:** ${episode.tone}\n\n`;
    md += `## Show Notes\n${episode.showNotes.summary}\n\n### Key Takeaways\n`;
    episode.showNotes.keyTakeaways.forEach((k) => (md += `- ${k}\n`));
    md += `\n## Full Transcript\n\n`;
    episode.lines.forEach((line) => {
      md += `**${line.speakerName}** (${Math.floor(line.timestamp / 60)}:${Math.floor(
        line.timestamp % 60
      )
        .toString()
        .padStart(2, '0')}): ${line.text}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${episode.title.replace(/\s+/g, '_')}_Transcript.md`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Episode Header & Player Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <img
              src={episode.coverImage}
              alt={episode.title}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-lg border border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1.5">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {episode.format.replace('_', ' ').toUpperCase()} • {episode.tone}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold">{episode.title}</h1>
              <p className="text-xs text-slate-400 max-w-xl line-clamp-2">{episode.tagline}</p>
              <div className="flex items-center space-x-3 text-xs text-slate-500 pt-1">
                <span>{episode.lines.length} Dialogue Turns</span>
                <span>•</span>
                <span>
                  ~{Math.floor(episode.durationSeconds / 60)}m {episode.durationSeconds % 60}s
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Download Script (.md)</span>
            </button>
          </div>
        </div>

        {/* Player Bar */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <div className="flex-1 space-y-1">
              <input
                type="range"
                min={0}
                max={episode.durationSeconds || 120}
                value={currentTime}
                onChange={(e) => jumpToTime(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>
                  {Math.floor(currentTime / 60)}:
                  {Math.floor(currentTime % 60)
                    .toString()
                    .padStart(2, '0')}
                </span>
                <span>
                  {Math.floor(episode.durationSeconds / 60)}:
                  {Math.floor(episode.durationSeconds % 60)
                    .toString()
                    .padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio View: Transcript Timeline vs Chapter Markers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Interactive Timed Transcript */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Interactive Timed Transcript</h2>
            </div>
            <span className="text-xs text-slate-400">Click any line to jump audio</span>
          </div>

          <div className="space-y-3">
            {episode.lines.map((line, idx) => {
              const isCurrent = activeLineIndex === idx;
              const speaker = episode.speakers.find((s) => s.id === line.speakerId || s.name === line.speakerName);

              return (
                <div
                  key={line.id}
                  onClick={() => {
                    setActiveLineIndex(idx);
                    jumpToTime(line.timestamp);
                  }}
                  className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 border-indigo-500/80 shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/40'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: speaker?.color || '#3b82f6' }}
                      />
                      <span className="font-bold text-xs text-white">{line.speakerName}</span>
                      <span className="text-[10px] text-slate-500">({speaker?.role || 'Host'})</span>
                    </div>

                    <div className="flex items-center space-x-2 text-[10px]">
                      {line.emotion && (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 capitalize">
                          {line.emotion}
                        </span>
                      )}
                      <span className="font-mono text-slate-500">
                        {Math.floor(line.timestamp / 60)}:
                        {Math.floor(line.timestamp % 60)
                          .toString()
                          .padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  <p className={`text-sm leading-relaxed ${isCurrent ? 'text-white font-medium' : 'text-slate-300'}`}>
                    {line.text}
                  </p>

                  {line.soundEffect && (
                    <span className="mt-2 inline-block text-[10px] font-mono italic text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                      ♫ [{line.soundEffect}]
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chapters & Speaker Voices */}
        <div className="space-y-6">
          {/* Chapters Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Chapter Breakdown</span>
            </h3>

            <div className="space-y-2">
              {episode.chapters.map((ch, i) => (
                <button
                  key={i}
                  onClick={() => jumpToTime(ch.timestamp)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 text-left transition space-y-1 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 group-hover:text-indigo-400 transition">
                      {ch.title}
                    </span>
                    <span className="font-mono text-[10px] text-indigo-400 font-semibold">
                      {Math.floor(ch.timestamp / 60)}:
                      {Math.floor(ch.timestamp % 60)
                        .toString()
                        .padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{ch.summary}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Speaker Profiles Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <Headphones className="w-4 h-4 text-indigo-400" />
              <span>Voice Performers</span>
            </h3>

            <div className="space-y-3">
              {episode.speakers.map((spk) => (
                <div key={spk.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                      style={{ backgroundColor: spk.color }}
                    >
                      {spk.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{spk.name}</h4>
                      <p className="text-[10px] text-slate-400">{spk.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                    {spk.voiceName} Voice
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
