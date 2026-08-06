import { ScriptLine, SpeakerProfile, VoiceName } from '../types';

export class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPlaying: boolean = false;
  private activeLineIndex: number = -1;
  private speechVoices: SpeechSynthesisVoice[] = [];

  // Callbacks
  private onTimeUpdateCallback: ((currentTime: number, currentLineIndex: number) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private onSpeakerVolumeCallback: ((speakerName: string, volume: number) => void) | null = null;

  private lines: ScriptLine[] = [];
  private speakers: SpeakerProfile[] = [];
  private currentTime: number = 0;
  private timerInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadSpeechVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadSpeechVoices();
      };
    }
  }

  private loadSpeechVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechVoices = window.speechSynthesis.getVoices();
    }
  }

  public initAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setEpisodeData(lines: ScriptLine[], speakers: SpeakerProfile[]) {
    this.lines = lines;
    this.speakers = speakers;
    this.currentTime = 0;
    this.activeLineIndex = 0;
  }

  public setCallbacks(
    onTimeUpdate: (currentTime: number, currentLineIndex: number) => void,
    onEnd: () => void,
    onSpeakerVolume?: (speakerName: string, volume: number) => void
  ) {
    this.onTimeUpdateCallback = onTimeUpdate;
    this.onEndCallback = onEnd;
    this.onSpeakerVolumeCallback = onSpeakerVolume;
  }

  public play(fromTime?: number) {
    this.initAudioContext();
    if (this.lines.length === 0) return;

    if (fromTime !== undefined) {
      this.currentTime = Math.max(0, fromTime);
    }

    this.isPlaying = true;
    this.stopSpeech();

    // Find current line based on currentTime
    let lineIdx = this.lines.findIndex(
      (l) => this.currentTime >= l.timestamp && this.currentTime < l.timestamp + l.duration
    );
    if (lineIdx === -1) {
      lineIdx = this.currentTime >= (this.lines[this.lines.length - 1]?.timestamp || 0) ? this.lines.length - 1 : 0;
    }

    this.activeLineIndex = lineIdx;
    this.speakCurrentLine();

    // Start timer interval for playback updates
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.isPlaying) return;

      this.currentTime += 0.25;

      // Check if we advanced to next line
      const currentLine = this.lines[this.activeLineIndex];
      if (currentLine && this.currentTime >= currentLine.timestamp + currentLine.duration) {
        if (this.activeLineIndex < this.lines.length - 1) {
          this.activeLineIndex++;
          this.speakCurrentLine();
        } else {
          // Reached the end
          this.pause();
          if (this.onEndCallback) this.onEndCallback();
          return;
        }
      }

      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.currentTime, this.activeLineIndex);
      }
    }, 250);
  }

  public pause() {
    this.isPlaying = false;
    this.stopSpeech();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  public seek(timeSeconds: number) {
    this.currentTime = Math.max(0, timeSeconds);
    let lineIdx = this.lines.findIndex(
      (l) => this.currentTime >= l.timestamp && this.currentTime < l.timestamp + l.duration
    );
    if (lineIdx === -1) lineIdx = 0;

    this.activeLineIndex = lineIdx;

    if (this.isPlaying) {
      this.play(this.currentTime);
    } else if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentTime, this.activeLineIndex);
    }
  }

  private speakCurrentLine() {
    this.stopSpeech();
    if (!this.lines[this.activeLineIndex]) return;

    const line = this.lines[this.activeLineIndex];
    const speaker = this.speakers.find((s) => s.id === line.speakerId || s.name === line.speakerName);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(line.text);

      // Select voice based on speaker role / gender / index
      const available = this.speechVoices.length > 0 ? this.speechVoices : window.speechSynthesis.getVoices();
      let selectedVoice: SpeechSynthesisVoice | null = null;

      if (speaker?.gender === 'female') {
        selectedVoice = available.find((v) => v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Karen') || v.lang.startsWith('en')) || available[0];
      } else {
        selectedVoice = available.find((v) => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Daniel') || v.name.includes('Alex') || v.lang.startsWith('en')) || available[0];
      }

      if (selectedVoice) {
        utter.voice = selectedVoice;
      }

      // Slightly adjust pitch/rate based on speaker to give distinct voice personalities!
      if (speaker?.role === 'Host A') {
        utter.pitch = 1.05;
        utter.rate = 1.0;
      } else {
        utter.pitch = 0.92;
        utter.rate = 0.98;
      }

      utter.onboundary = (e) => {
        // Trigger pulse volume callback for speaker
        if (this.onSpeakerVolumeCallback) {
          const vol = 0.4 + Math.random() * 0.6;
          this.onSpeakerVolumeCallback(line.speakerName, vol);
        }
      };

      utter.onend = () => {
        if (this.onSpeakerVolumeCallback) {
          this.onSpeakerVolumeCallback(line.speakerName, 0);
        }
      };

      this.currentUtterance = utter;
      window.speechSynthesis.speak(utter);
    }
  }

  private stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public destroy() {
    this.pause();
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}

export const globalAudioEngine = new AudioEngine();
