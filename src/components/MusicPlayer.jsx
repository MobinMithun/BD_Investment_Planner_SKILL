import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

export default function MusicPlayer() {
  const [micEnabled, setMicEnabled] = useState(false);

  const toggleMicSync = async () => {
    if (micEnabled) {
      document.documentElement.style.setProperty('--beat-level', 0);
      setMicEnabled(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      
      analyser.fftSize = 256;
      source.connect(analyser);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateBeat = () => {
        if (!document.getElementById('mic-sync-container') && !micEnabled) {
           // Component unmounted
           return;
        }
        
        analyser.getByteFrequencyData(dataArray);
        
        // Extremely simple, instant average volume tracking across all frequencies
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const averageLoudness = sum / bufferLength;
        const normalized = averageLoudness / 255;
        
        // Instantly maps any sound to a strong visual output 
        // Multiplying by 3.5 makes it VERY sensitive to even quiet mic sounds
        const beatVal = normalized * 3.5; 
        
        document.documentElement.style.setProperty('--beat-level', Math.min(beatVal, 1.5).toFixed(3));
        
        requestAnimationFrame(updateBeat);
      };
      
      updateBeat();
      setMicEnabled(true);
    } catch (err) {
      console.error('Mic access denied:', err);
      alert('Please allow microphone access to sync the background with the music!');
    }
  };

  return (
    <div id="mic-sync-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <button
        onClick={toggleMicSync}
        className="btn"
        style={{
          background: micEnabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${micEnabled ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.1)'}`,
          color: micEnabled ? 'var(--primary-light)' : 'var(--text-tertiary)',
          gap: '0.5rem',
          height: '42px',
          padding: '0 1rem'
        }}
        aria-label={micEnabled ? 'Disable Mic Sync' : 'Enable Mic Sync for Beats'}
      >
        {micEnabled ? <Mic size={16} /> : <MicOff size={16} />}
        {micEnabled ? 'Syncing Beats...' : 'Mic Beat Sync'}
      </button>
    </div>
  );
}
