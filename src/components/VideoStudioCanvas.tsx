import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Download,
  Video,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Layers,
  BarChart2,
  Film,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { PodcastEpisode, ScriptLine, StoryboardSlide } from '../types';
import { globalAudioEngine } from '../lib/audioEngine';

interface VideoStudioCanvasProps {
  episode: PodcastEpisode;
}

export const VideoStudioCanvas: React.FC<VideoStudioCanvasProps> = ({ episode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [speakerVolumes, setSpeakerVolumes] = useState<{ [key: string]: number }>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const activeLine: ScriptLine | undefined = episode.lines[activeLineIndex];
  const activeSlideIndex = activeLine?.slideIndex ?? 0;
  const activeSlide: StoryboardSlide | undefined = episode.slides[activeSlideIndex] || episode.slides[0];

  useEffect(() => {
    globalAudioEngine.setEpisodeData(episode.lines, episode.speakers);
    globalAudioEngine.setCallbacks(
      (time, lineIdx) => {
        setCurrentTime(time);
        setActiveLineIndex(lineIdx);
      },
      () => {
        setIsPlaying(false);
      },
      (speakerName, volume) => {
        setSpeakerVolumes((prev) => ({ ...prev, [speakerName]: volume }));
      }
    );
  }, [episode]);

  // Main Canvas Rendering Animation Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particlePhase = 0;

    const renderFrame = () => {
      particlePhase += 0.02;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Background Gradient
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, '#020617'); // slate-950
      bgGradient.addColorStop(0.5, '#0f172a'); // slate-900
      bgGradient.addColorStop(1, '#020617');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Subtle particle grid effect
      ctx.fillStyle = 'rgba(99, 102, 241, 0.08)';
      for (let x = 20; x < width; x += 40) {
        for (let y = 20; y < height; y += 40) {
          const size = 1.5 + Math.sin(particlePhase + (x + y) * 0.01) * 0.8;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Top Header Branding Bar in Canvas
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(20, 20, width - 40, 50);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, width - 40, 50);

      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillStyle = '#818cf8';
      ctx.fillText('NotebookCast Studio', 40, 51);

      ctx.font = '13px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`•  ${episode.title}`, 220, 51);

      // 2. Dual Speaker Avatars (Left & Right)
      const hostA = episode.speakers[0];
      const hostB = episode.speakers[1];

      // Host A Avatar (Left)
      const isHostASpeaking = activeLine?.speakerName === hostA?.name && isPlaying;
      const hostAVol = speakerVolumes[hostA?.name] || (isHostASpeaking ? 0.6 : 0);

      const avatarAY = 160;
      const avatarAX = 90;

      // Pulse Glow Circle for Host A
      if (hostAVol > 0.1) {
        ctx.beginPath();
        ctx.arc(avatarAX, avatarAY, 45 + hostAVol * 20, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(avatarAX, avatarAY, 38, 0, Math.PI * 2);
      ctx.fillStyle = hostA?.color || '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = isHostASpeaking ? '#60a5fa' : '#1e293b';
      ctx.lineWidth = isHostASpeaking ? 4 : 2;
      ctx.stroke();

      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText((hostA?.name || 'A')[0], avatarAX, avatarAY + 6);

      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = isHostASpeaking ? '#60a5fa' : '#cbd5e1';
      ctx.fillText(hostA?.name || 'Host A', avatarAX, avatarAY + 58);

      // Host B Avatar (Right)
      const isHostBSpeaking = activeLine?.speakerName === hostB?.name && isPlaying;
      const hostBVol = speakerVolumes[hostB?.name] || (isHostBSpeaking ? 0.6 : 0);

      const avatarBX = width - 90;
      const avatarBY = 160;

      if (hostBVol > 0.1) {
        ctx.beginPath();
        ctx.arc(avatarBX, avatarBY, 45 + hostBVol * 20, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(avatarBX, avatarBY, 38, 0, Math.PI * 2);
      ctx.fillStyle = hostB?.color || '#10b981';
      ctx.fill();
      ctx.strokeStyle = isHostBSpeaking ? '#34d399' : '#1e293b';
      ctx.lineWidth = isHostBSpeaking ? 4 : 2;
      ctx.stroke();

      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText((hostB?.name || 'B')[0], avatarBX, avatarBY + 6);

      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = isHostBSpeaking ? '#34d399' : '#cbd5e1';
      ctx.fillText(hostB?.name || 'Host B', avatarBX, avatarBY + 58);

      // 3. Center Storyboard Slide Frame (NotebookLM Overview)
      const slideX = 170;
      const slideY = 90;
      const slideW = width - 340;
      const slideH = height - 250;

      // Slide Outer Card Frame
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(slideX, slideY, slideW, slideH);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(slideX, slideY, slideW, slideH);

      // Slide Top Badge
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(slideX + 20, slideY + 20, 140, 24);
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillStyle = '#a5b4fc';
      ctx.textAlign = 'left';
      ctx.fillText(`SLIDE ${activeSlideIndex + 1} OF ${episode.slides.length}`, slideX + 30, slideY + 36);

      // Slide Title
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(activeSlide?.title || episode.title, slideX + 20, slideY + 75);

      if (activeSlide?.subtitle) {
        ctx.font = '13px Inter, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(activeSlide.subtitle, slideX + 20, slideY + 98);
      }

      // Slide Bullet Points
      if (activeSlide?.bullets) {
        ctx.font = '13px Inter, sans-serif';
        ctx.fillStyle = '#e2e8f0';
        activeSlide.bullets.forEach((bullet, idx) => {
          const bulletY = slideY + 130 + idx * 28;
          if (bulletY < slideY + slideH - 60) {
            ctx.fillStyle = '#818cf8';
            ctx.fillText('•', slideX + 20, bulletY);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText(bullet, slideX + 35, bulletY);
          }
        });
      }

      // Slide Key Quote Banner at bottom of slide
      if (activeSlide?.keyQuote) {
        ctx.fillStyle = 'rgba(30, 27, 75, 0.8)';
        ctx.fillRect(slideX + 20, slideY + slideH - 55, slideW - 40, 40);
        ctx.font = 'italic 11px Inter, sans-serif';
        ctx.fillStyle = '#c7d2fe';
        ctx.fillText(activeSlide.keyQuote, slideX + 32, slideY + slideH - 30);
      }

      // 4. Live Audio Waveform Bars (Bottom Center)
      const waveX = slideX;
      const waveY = height - 145;
      const waveW = slideW;
      const barCount = 36;
      const barWidth = 6;
      const gap = (waveW - barCount * barWidth) / barCount;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;
        if (isPlaying) {
          barHeight = 6 + Math.sin(particlePhase * 3 + i * 0.4) * 18 + Math.random() * 8;
        }
        const bx = waveX + i * (barWidth + gap);
        ctx.fillStyle = isPlaying ? '#818cf8' : '#334155';
        ctx.fillRect(bx, waveY - barHeight / 2, barWidth, barHeight);
      }

      // 5. Bottom Live Caption Subtitle Bar
      ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
      ctx.fillRect(20, height - 85, width - 40, 65);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.strokeRect(20, height - 85, width - 40, 65);

      if (activeLine) {
        const speakerColor = activeLine.speakerName === hostA?.name ? '#60a5fa' : '#34d399';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillStyle = speakerColor;
        ctx.textAlign = 'left';
        ctx.fillText(`${activeLine.speakerName}:`, 40, height - 58);

        ctx.font = '14px Inter, sans-serif';
        ctx.fillStyle = '#ffffff';
        // Wrap text
        const text = activeLine.text;
        ctx.fillText(text.length > 95 ? text.substring(0, 95) + '...' : text, 40, height - 34);
      }

      animId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [episode, activeLine, activeSlideIndex, isPlaying, speakerVolumes]);

  const togglePlay = () => {
    if (isPlaying) {
      globalAudioEngine.pause();
      setIsPlaying(false);
    } else {
      globalAudioEngine.play(currentTime);
      setIsPlaying(true);
    }
  };

  const handleExportWebMVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecording(true);
    setRecordingProgress(0);
    recordedChunksRef.current = [];

    try {
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);

        // Auto download
        const a = document.createElement('a');
        a.href = url;
        a.download = `${episode.title.replace(/\s+/g, '_')}_VideoOverview.webm`;
        a.click();

        setIsRecording(false);
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;

      // Play through episode for recording
      globalAudioEngine.play(0);
      setIsPlaying(true);

      // Stop recorder when episode ends or after max duration
      const totalSec = episode.durationSeconds || 120;
      let elapsed = 0;
      const recInterval = setInterval(() => {
        elapsed += 1;
        setRecordingProgress(Math.min(100, Math.round((elapsed / totalSec) * 100)));

        if (elapsed >= totalSec || !isPlaying) {
          clearInterval(recInterval);
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
          globalAudioEngine.pause();
          setIsPlaying(false);
        }
      }, 1000);
    } catch (err) {
      console.error('Video recording failed:', err);
      setIsRecording(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              NotebookLM Video Studio
            </span>
          </div>
          <h1 className="text-2xl font-extrabold">{episode.title}</h1>
          <p className="text-xs text-slate-400">{episode.tagline}</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportWebMVideo}
            disabled={isRecording}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xl transition ${
              isRecording
                ? 'bg-amber-600 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20 active:scale-95'
            }`}
          >
            {isRecording ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Recording Video... ({recordingProgress}%)</span>
              </>
            ) : (
              <>
                <Film className="w-4 h-4" />
                <span>Export Episode Video (.webm)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Renderer */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="w-full h-full object-contain"
          />

          {/* Canvas Play Overlay */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition transform hover:scale-110 active:scale-95"
            >
              <Play className="w-8 h-8 ml-1" />
            </button>
          )}
        </div>

        {/* Video Player Controls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4 text-white">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <div className="text-xs space-y-0.5">
              <div className="font-bold text-slate-200">
                {Math.floor(currentTime / 60)}:
                {Math.floor(currentTime % 60)
                  .toString()
                  .padStart(2, '0')}{' '}
                / {Math.floor(episode.durationSeconds / 60)}:
                {Math.floor(episode.durationSeconds % 60)
                  .toString()
                  .padStart(2, '0')}
              </div>
              <p className="text-[10px] text-slate-400">
                Slide {activeSlideIndex + 1} of {episode.slides.length}
              </p>
            </div>
          </div>

          {/* Time Scrubber */}
          <div className="flex-1 max-w-xl mx-4">
            <input
              type="range"
              min={0}
              max={episode.durationSeconds || 120}
              value={currentTime}
              onChange={(e) => {
                const newTime = parseFloat(e.target.value);
                setCurrentTime(newTime);
                globalAudioEngine.seek(newTime);
              }}
              className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            <span>Voice Synthesis Active</span>
          </div>
        </div>
      </div>

      {/* Storyboard Slide Gallery Below */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Interactive Storyboard Slide Deck</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {episode.slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => {
                globalAudioEngine.seek(slide.timestamp);
                setCurrentTime(slide.timestamp);
              }}
              className={`p-4 rounded-2xl border text-left transition duration-200 ${
                activeSlideIndex === idx
                  ? 'bg-slate-900 border-indigo-500 shadow-xl ring-1 ring-indigo-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-indigo-400 mb-2">
                <span>Slide {idx + 1}</span>
                <span>
                  {Math.floor(slide.timestamp / 60)}:
                  {Math.floor(slide.timestamp % 60)
                    .toString()
                    .padStart(2, '0')}
                </span>
              </div>
              <h4 className="font-bold text-xs text-white line-clamp-1">{slide.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {slide.bullets?.[0] || 'Key visual concept slide'}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
