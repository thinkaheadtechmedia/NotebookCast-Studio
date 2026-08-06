import React from 'react';
import {
  Library,
  Play,
  Video,
  Headphones,
  BookOpen,
  Sparkles,
  Clock,
  Radio,
  FileText,
} from 'lucide-react';
import { ActiveTab, PodcastEpisode } from '../types';

interface LibraryTabProps {
  episodes: PodcastEpisode[];
  activeEpisodeId?: string;
  onSelectEpisode: (episode: PodcastEpisode, targetTab?: ActiveTab) => void;
  onNavigateToGenerator: () => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({
  episodes,
  activeEpisodeId,
  onSelectEpisode,
  onNavigateToGenerator,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Library className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Studio Library
            </span>
          </div>
          <h1 className="text-2xl font-extrabold">NotebookCast Episode Showcase ({episodes.length})</h1>
          <p className="text-xs text-slate-400">
            Browse pre-loaded AI Audio Overviews or launch custom generated episodes.
          </p>
        </div>

        <button
          onClick={onNavigateToGenerator}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Create New Episode</span>
        </button>
      </div>

      {/* Episode Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {episodes.map((ep) => {
          const isSelected = ep.id === activeEpisodeId;

          return (
            <div
              key={ep.id}
              className={`group relative rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Cover Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={ep.coverImage}
                  alt={ep.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur text-indigo-300 border border-indigo-500/30">
                    {ep.format.replace('_', ' ')}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-slate-950/80 backdrop-blur text-[10px] font-mono text-slate-300">
                  {Math.floor(ep.durationSeconds / 60)}m {ep.durationSeconds % 60}s
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-base text-white group-hover:text-indigo-300 transition line-clamp-1">
                    {ep.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{ep.tagline}</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-4 text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Radio className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{ep.lines.length} Turns</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{ep.slides.length} Video Slides</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onSelectEpisode(ep, 'video_studio')}
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Video Studio</span>
                    </button>

                    <button
                      onClick={() => onSelectEpisode(ep, 'audio_player')}
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
                    >
                      <Headphones className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Audio Player</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
