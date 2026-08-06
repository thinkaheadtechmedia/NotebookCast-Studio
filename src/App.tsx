import React, { useState } from 'react';
import { ActiveTab, PodcastEpisode, SourceDocument } from './types';
import { INITIAL_SOURCES, SAMPLE_EPISODES } from './data/sampleEpisodes';
import { Navbar } from './components/Navbar';
import { SourcesTab } from './components/SourcesTab';
import { GeneratorTab } from './components/GeneratorTab';
import { VideoStudioCanvas } from './components/VideoStudioCanvas';
import { AudioPlayerTab } from './components/AudioPlayerTab';
import { ShowNotesTab } from './components/ShowNotesTab';
import { LibraryTab } from './components/LibraryTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('video_studio');
  const [sources, setSources] = useState<SourceDocument[]>(INITIAL_SOURCES);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(SAMPLE_EPISODES);
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode>(SAMPLE_EPISODES[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddSource = (newSource: SourceDocument) => {
    setSources((prev) => [newSource, ...prev]);
  };

  const handleDeleteSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleSelectSource = (id: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  const handleEpisodeGenerated = (newEpisode: PodcastEpisode) => {
    setEpisodes((prev) => [newEpisode, ...prev]);
    setCurrentEpisode(newEpisode);
    setActiveTab('video_studio');
  };

  const handleSelectEpisode = (episode: PodcastEpisode, targetTab?: ActiveTab) => {
    setCurrentEpisode(episode);
    if (targetTab) {
      setActiveTab(targetTab);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sourcesCount={sources.length}
        currentEpisodeTitle={currentEpisode?.title}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {activeTab === 'sources' && (
          <SourcesTab
            sources={sources}
            onAddSource={handleAddSource}
            onDeleteSource={handleDeleteSource}
            onToggleSelectSource={handleToggleSelectSource}
            onGenerateWithSelected={() => setActiveTab('generator')}
          />
        )}

        {activeTab === 'generator' && (
          <GeneratorTab
            sources={sources}
            onEpisodeGenerated={handleEpisodeGenerated}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        )}

        {activeTab === 'video_studio' && (
          <VideoStudioCanvas episode={currentEpisode} />
        )}

        {activeTab === 'audio_player' && (
          <AudioPlayerTab episode={currentEpisode} />
        )}

        {activeTab === 'show_notes' && (
          <ShowNotesTab episode={currentEpisode} />
        )}

        {activeTab === 'library' && (
          <LibraryTab
            episodes={episodes}
            activeEpisodeId={currentEpisode?.id}
            onSelectEpisode={handleSelectEpisode}
            onNavigateToGenerator={() => setActiveTab('generator')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
        <p>NotebookCast Studio • AI Audio Overview & Video Production Engine</p>
      </footer>
    </div>
  );
}
