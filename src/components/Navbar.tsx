import React from 'react';
import {
  FileText,
  Sparkles,
  Video,
  Headphones,
  BookOpen,
  Library,
  Radio,
  Zap,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  sourcesCount: number;
  currentEpisodeTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  sourcesCount,
  currentEpisodeTitle,
}) => {
  const tabs = [
    {
      id: 'sources' as ActiveTab,
      label: 'Notebook Sources',
      icon: FileText,
      badge: sourcesCount > 0 ? sourcesCount : undefined,
    },
    {
      id: 'generator' as ActiveTab,
      label: 'AI Studio Generator',
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'video_studio' as ActiveTab,
      label: 'Video Overview Studio',
      icon: Video,
    },
    {
      id: 'audio_player' as ActiveTab,
      label: 'Audio Player & Script',
      icon: Headphones,
    },
    {
      id: 'show_notes' as ActiveTab,
      label: 'Show Notes & Clips',
      icon: BookOpen,
    },
    {
      id: 'library' as ActiveTab,
      label: 'Episode Library',
      icon: Library,
    },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('library')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  NotebookCast
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Studio v2.5
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                AI Audio Overview & Video Production Engine
              </p>
            </div>
          </div>

          {/* Current Active Episode Quick Indicator */}
          {currentEpisodeTitle && (
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 max-w-xs text-xs truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-400 font-medium">Now Loaded:</span>
              <span className="text-slate-200 font-semibold truncate">{currentEpisodeTitle}</span>
            </div>
          )}

          {/* Actions / AI Status */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('generator')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition duration-150 active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Create Episode</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-800 text-indigo-400 border border-slate-700/80 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
