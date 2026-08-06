export type SourceType = 'text' | 'url' | 'notes' | 'file';

export interface SourceDocument {
  id: string;
  title: string;
  type: SourceType;
  content: string;
  wordCount: number;
  addedAt: string;
  url?: string;
  tags?: string[];
  selected?: boolean;
}

export type VoiceName = 'Kore' | 'Puck' | 'Zephyr' | 'Charon' | 'Fenrir';

export interface SpeakerProfile {
  id: string;
  name: string;
  role: 'Host A' | 'Host B' | 'Solo Expert' | 'Guest';
  voiceName: VoiceName;
  gender: 'male' | 'female';
  color: string;
  avatarIcon?: string;
}

export interface ScriptLine {
  id: string;
  speakerId: string;
  speakerName: string;
  text: string;
  timestamp: number; // in seconds
  duration: number; // estimated or calculated duration
  emotion?: 'excited' | 'thoughtful' | 'curious' | 'surprised' | 'serious' | 'amused' | 'neutral';
  soundEffect?: string; // e.g. "laughter", "paper shuffle", "chuckle", "gasp", "applause"
  slideIndex?: number;
}

export interface StoryboardSlide {
  id: string;
  index: number;
  timestamp: number; // timestamp in video/audio when slide shows
  title: string;
  subtitle?: string;
  bullets: string[];
  keyQuote?: string;
  visualConcept?: string;
  chartType?: 'none' | 'pie' | 'bar' | 'timeline' | 'comparison';
  imageUrl?: string;
}

export interface Chapter {
  timestamp: number; // seconds
  title: string;
  summary: string;
}

export interface ShowNotes {
  summary: string;
  keyTakeaways: string[];
  discussionQuestions: string[];
  references: string[];
}

export type PodcastFormat = 'deep_dive' | 'solo_talk' | 'debate' | 'quick_explainer' | 'interview';
export type PodcastTone = 'engaging' | 'academic' | 'humorous' | 'investigative' | 'storytelling' | 'executive';
export type PodcastLength = 'short' | 'medium' | 'long';

export interface PodcastEpisode {
  id: string;
  title: string;
  tagline: string;
  topicSummary: string;
  format: PodcastFormat;
  tone: PodcastTone;
  length: PodcastLength;
  coverImage: string;
  createdAt: string;
  durationSeconds: number;
  sourcesUsed: string[]; // document IDs or titles
  speakers: SpeakerProfile[];
  lines: ScriptLine[];
  slides: StoryboardSlide[];
  chapters: Chapter[];
  showNotes: ShowNotes;
  generatedAudioUrl?: string;
  audioSynthesized?: boolean;
}

export interface GenerationOptions {
  format: PodcastFormat;
  tone: PodcastTone;
  length: PodcastLength;
  hostAName: string;
  hostBName: string;
  hostAVoice: VoiceName;
  hostBVoice: VoiceName;
  customPrompt?: string;
  focusTopic?: string;
}

export type ActiveTab = 'sources' | 'generator' | 'video_studio' | 'audio_player' | 'show_notes' | 'library';
