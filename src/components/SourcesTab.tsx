import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  Link as LinkIcon,
  Upload,
  Globe,
  Sparkles,
  BookOpen,
  CheckSquare,
  Square,
  Search,
} from 'lucide-react';
import { SourceDocument, SourceType } from '../types';

interface SourcesTabProps {
  sources: SourceDocument[];
  onAddSource: (source: SourceDocument) => void;
  onDeleteSource: (id: string) => void;
  onToggleSelectSource: (id: string) => void;
  onGenerateWithSelected: () => void;
}

export const SourcesTab: React.FC<SourcesTabProps> = ({
  sources,
  onAddSource,
  onDeleteSource,
  onToggleSelectSource,
  onGenerateWithSelected,
}) => {
  const [activeInputType, setActiveInputType] = useState<SourceType>('notes');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedCount = sources.filter((s) => s.selected).length;

  const handleCreateSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !url.trim()) return;

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 50;

    const newSource: SourceDocument = {
      id: `src-${Date.now()}`,
      title: title.trim() || (url ? `Web Source: ${new URL(url).hostname}` : 'Untitled Source Notes'),
      type: activeInputType,
      content: content.trim() || `Imported content from ${url}`,
      wordCount,
      addedAt: new Date().toISOString().split('T')[0],
      url: url.trim() || undefined,
      tags: tags
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : ['Notebook'],
      selected: true,
    };

    onAddSource(newSource);
    setTitle('');
    setContent('');
    setUrl('');
    setTags('');
    setIsModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const wordCount = text.trim().split(/\s+/).length;
        const newSource: SourceDocument = {
          id: `src-${Date.now()}`,
          title: file.name,
          type: 'file',
          content: text,
          wordCount,
          addedAt: new Date().toISOString().split('T')[0],
          tags: ['Uploaded Document'],
          selected: true,
        };
        onAddSource(newSource);
      }
    };
    reader.readAsText(file);
  };

  const filteredSources = sources.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / NotebookLM Overview */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                NotebookLM Grounded Context
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Source Material Notebook
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Upload documents, paste research notes, or add article links. The AI will synthesize your sources into a conversational multi-host podcast episode complete with storyboard video slides.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition duration-150"
            >
              <Plus className="w-4 h-4" />
              <span>Add Source Notes</span>
            </button>

            <button
              onClick={onGenerateWithSelected}
              disabled={selectedCount === 0}
              className={`flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl transition duration-150 ${
                selectedCount > 0
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize ({selectedCount}) Sources</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Sources List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Notebook Sources ({sources.length})
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium">
                {selectedCount} Selected
              </span>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sources..."
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {filteredSources.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-300">No sources found</h3>
                <p className="text-xs text-slate-500">Add research notes or upload text documents to start.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Source</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSources.map((source) => (
                <div
                  key={source.id}
                  className={`group relative rounded-2xl border p-5 transition-all duration-200 ${
                    source.selected
                      ? 'bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/5'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3.5">
                      <button
                        onClick={() => onToggleSelectSource(source.id)}
                        className="mt-0.5 text-slate-400 hover:text-indigo-400 transition"
                      >
                        {source.selected ? (
                          <CheckSquare className="w-5 h-5 text-indigo-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-600" />
                        )}
                      </button>

                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition">
                            {source.title}
                          </h3>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {source.type}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                          {source.content}
                        </p>

                        <div className="flex items-center space-x-4 text-[11px] text-slate-500 pt-1">
                          <span>{source.wordCount} words</span>
                          <span>•</span>
                          <span>Added {source.addedAt}</span>
                          {source.tags && source.tags.length > 0 && (
                            <>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                {source.tags.map((tag, i) => (
                                  <span
                                    key={i}
                                    className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 text-[10px]"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteSource(source.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-400 transition hover:bg-slate-800 rounded-lg"
                      title="Delete source"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Quick Add & Tips */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>Quick Upload File</span>
            </h3>
            <p className="text-xs text-slate-400">
              Upload plain text (.txt, .md, .csv) or notes to incorporate into your podcast episode.
            </p>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 cursor-pointer bg-slate-950/50 transition">
              <Upload className="w-8 h-8 text-slate-500 mb-2" />
              <span className="text-xs font-semibold text-slate-300">Click to upload document</span>
              <span className="text-[10px] text-slate-500 mt-1">.txt, .md, .pdf text supported</span>
              <input type="file" accept=".txt,.md,.json,.csv,.pdf" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-sm text-indigo-300 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>How NotebookLM Grounding Works</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>The AI analyzes every checked source document above.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>It extracts technical terms, quotes, statistics, and narrative themes.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>It scripts a back-and-forth dialogue between two hosts and aligns visual video slides for each segment.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Source Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>Add Notebook Source Document</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSource} className="space-y-4">
              {/* Type Switcher */}
              <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveInputType('notes')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    activeInputType === 'notes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Text Notes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInputType('url')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    activeInputType === 'url' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Web Link
                </button>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Source Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quantum Computing Report 2026"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              {activeInputType === 'url' && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Website URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              )}

              {/* Content */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Source Text / Research Notes</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste research, raw text, article contents, or key takeaways here..."
                  rows={6}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono"
                  required
                />
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="AI, Physics, Research"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                >
                  Save to Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
