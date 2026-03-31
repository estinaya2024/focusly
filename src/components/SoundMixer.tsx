import React, { useState, useEffect, useRef } from 'react';
import { CloudRain, Volume2, Pause, Loader2, Waves, Wind, Trees, Zap, RefreshCw } from 'lucide-react';

interface SoundTrack {
  id: string;
  label: string;
  icon: React.ReactNode;
  videoId: string;
  color: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const TRACKS: SoundTrack[] = [
  { id: 'rain', label: 'Rain', icon: <CloudRain size={14} />, videoId: 'mPZkdNFkNps', color: 'text-blue-400' },
  { id: 'white-noise', label: 'White Noise', icon: <Waves size={14} />, videoId: 'yLOM8R6lbzg', color: 'text-cyan-400' },
  { id: 'waves', label: 'Beach Waves', icon: <Waves size={14} />, videoId: 'bn9F19Hi1Lk', color: 'text-teal-400' },
  { id: 'snow', label: 'Winter Storm', icon: <Wind size={14} />, videoId: 'sGkh1W5cbH4', color: 'text-indigo-200' },
  { id: 'forest', label: 'Forest', icon: <Trees size={14} />, videoId: 'xNN7iTA57jM', color: 'text-green-400' },
  { id: 'brown-noise', label: 'Brown Noise', icon: <Volume2 size={14} />, videoId: '0GDfOAuUvQ0', color: 'text-amber-800' },
  { id: 'binaural', label: '40Hz Beats', icon: <Zap size={14} />, videoId: '1_G60OdEzXs', color: 'text-purple-400' },
];

const SoundMixer: React.FC<{ masterVolume: number }> = ({ masterVolume }) => {
  const [volumes, setVolumes] = useState<Record<string, number>>(
    TRACKS.reduce((acc, track) => ({ ...acc, [track.id]: 0 }), {})
  );
  const [readyPlayers, setReadyPlayers] = useState<Set<string>>(new Set());
  const players = useRef<Record<string, any>>({});

  const initPlayers = () => {
    TRACKS.forEach((track) => {
      if (players.current[track.id]) {
        try { players.current[track.id].destroy(); } catch (e) { }
      }

      players.current[track.id] = new window.YT.Player(`yt-player-${track.id}`, {
        height: '0',
        width: '0',
        videoId: track.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          enablejsapi: 1,
          loop: 1
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(0);
            setReadyPlayers(prev => new Set(prev).add(track.id));
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    });
  };

  useEffect(() => {
    const loadTimeout = setTimeout(() => {
      if (window.YT && window.YT.Player) {
        initPlayers();
      } else {
        (window as any).onYouTubeIframeAPIReady = () => initPlayers();
      }
    }, 100);
    return () => clearTimeout(loadTimeout);
  }, []);

  useEffect(() => {
    TRACKS.forEach(track => {
      const player = players.current[track.id];
      if (player && player.setVolume && readyPlayers.has(track.id)) {
        const scaledVolume = (volumes[track.id] * masterVolume) / 100;
        player.setVolume(scaledVolume);
        if (scaledVolume > 0) player.playVideo();
        else player.pauseVideo();
      }
    });
  }, [masterVolume, volumes, readyPlayers]);

  const handleVolumeChange = (id: string, volume: number) => {
    setVolumes(prev => ({ ...prev, [id]: volume }));
  };

  const isStudioConnected = readyPlayers.size === TRACKS.length;

  return (
    <div className="hud-panel p-6 flex flex-col gap-6 h-full border-white/10">
      <div className="absolute opacity-0 pointer-events-none">
        {TRACKS.map(track => (
          <div key={track.id} id={`yt-player-${track.id}`}></div>
        ))}
      </div>

      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white text-black rounded-xl shadow-lg">
            {isStudioConnected ? <Volume2 size={16} strokeWidth={3} /> : <Loader2 size={16} className="animate-spin" />}
          </div>
          <div>
            <h3 className="hud-mono !text-[9px] !text-black tracking-widest">Ambiance</h3>
            <p className="hud-mono !text-[7px]">
              {isStudioConnected ? 'Sanctuary Online' : `Syncing ${readyPlayers.size}/${TRACKS.length}`}
            </p>
          </div>
        </div>

        {!isStudioConnected && (
          <button onClick={initPlayers} className="p-1.5 text-hud-muted hover:text-white transition-colors">
            <RefreshCw size={12} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-1">
        {TRACKS.map((track) => (
          <div
            key={track.id}
            className={`flex flex-col gap-2 p-4 rounded-2xl transition-all duration-500 ${volumes[track.id] > 0 ? 'bg-white/[0.05] border border-white/10' : 'opacity-40 hover:opacity-100'}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-black/20 ${track.color}`}>
                  {!readyPlayers.has(track.id) ? (
                    <Loader2 size={12} className="animate-spin opacity-20" />
                  ) : volumes[track.id] > 0 ? (
                    <Pause size={12} fill="currentColor" />
                  ) : (
                    track.icon
                  )}
                </div>
                <span className="hud-mono !text-[8.5px] !text-black tracking-widest">{track.label}</span>
              </div>
              <span className="hud-mono !text-[8px] tabular-nums">
                {readyPlayers.has(track.id) ? (volumes[track.id] > 0 ? `${volumes[track.id]}%` : 'OFF') : '...'}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={volumes[track.id]}
              disabled={!readyPlayers.has(track.id)}
              onChange={(e) => handleVolumeChange(track.id, parseInt(e.target.value))}
              className="hud-slider w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoundMixer;
