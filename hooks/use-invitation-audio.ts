"use client";

import { useCallback, useRef } from "react";
import { invitationAudio } from "@/lib/invitation-details";

type WebAudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

/**
 * Owns the two audio tracks: looping background music and the narrator.
 *
 * The music plays through a Web Audio gain node rather than the element's own
 * `volume` property. iOS Safari treats `HTMLMediaElement.volume` as read-only
 * and silently ignores writes to it, so element-based ducking works on desktop
 * and Android but does nothing at all on iPhone - the music would stay at full
 * level under the narrator. A GainNode is honoured on every platform.
 *
 * Phones also only allow audio that was started inside a real tap, and each
 * element must be unlocked separately - so `unlockOnTap` starts both during the
 * tap, then immediately pauses the voiceover to be resumed on cue later.
 */
export function useInvitationAudio() {
  const musicRef = useRef<HTMLAudioElement>(null);
  const voiceoverRef = useRef<HTMLAudioElement>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const fadeFrameRef = useRef(0);

  /**
   * Builds the gain node the first time it is needed. `createMediaElementSource`
   * may only be called once per element, so the result is cached.
   */
  const ensureMusicGain = useCallback((): GainNode | null => {
    if (musicGainRef.current) return musicGainRef.current;

    const music = musicRef.current;
    if (!music) return null;

    const AudioContextClass =
        window.AudioContext ?? (window as WebAudioWindow).webkitAudioContext;
    if (!AudioContextClass) return null;

    try {
      const context = new AudioContextClass();
      const source = context.createMediaElementSource(music);
      const gain = context.createGain();

      gain.gain.value = invitationAudio.musicLevel;
      source.connect(gain);
      gain.connect(context.destination);

      audioContextRef.current = context;
      musicGainRef.current = gain;
      return gain;
    } catch {
      // Web Audio unavailable - fall back to element volume below.
      return null;
    }
  }, []);

  /** Ramps the music, using the gain node when possible. */
  const fadeMusicTo = useCallback(
      (targetLevel: number, seconds: number) => {
        const music = musicRef.current;
        if (!music) return;

        const gain = musicGainRef.current;
        const context = audioContextRef.current;

        if (gain && context) {
          const now = context.currentTime;
          // Pin the curve to the level it is actually at right now, otherwise a
          // fade that interrupts another one jumps.
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.linearRampToValueAtTime(targetLevel, now + seconds);
          return;
        }

        cancelAnimationFrame(fadeFrameRef.current);
        const startLevel = music.volume;
        const startedAt = performance.now();
        const durationMs = Math.max(seconds, 0.01) * 1000;

        const step = () => {
          const progress = Math.min(
              (performance.now() - startedAt) / durationMs,
              1,
          );
          music.volume = startLevel + (targetLevel - startLevel) * progress;
          if (progress < 1) {
            fadeFrameRef.current = requestAnimationFrame(step);
          }
        };

        fadeFrameRef.current = requestAnimationFrame(step);
      },
      [],
  );

  /** Called synchronously inside the tap handler, before any `await`. */
  const unlockOnTap = useCallback(() => {
    const music = musicRef.current;
    const voiceover = voiceoverRef.current;

    ensureMusicGain();
    void audioContextRef.current?.resume().catch(() => undefined);

    if (music) {
      music.volume = 1;
      if (!musicGainRef.current) music.volume = invitationAudio.musicLevel;
      void music.play().catch(() => undefined);
    }

    if (voiceover) {
      // Start then immediately stop: this is what makes the browser treat the
      // later, programmatic play() as allowed.
      void voiceover
          .play()
          .then(() => {
            voiceover.pause();
            voiceover.currentTime = 0;
          })
          .catch(() => undefined);
    }
  }, [ensureMusicGain]);

  const startVoiceover = useCallback(() => {
    const voiceover = voiceoverRef.current;
    if (!voiceover) return;

    voiceover.currentTime = 0;
    void voiceover.play().catch(() => undefined);

    fadeMusicTo(
        invitationAudio.musicLevelUnderVoiceover,
        invitationAudio.fadeSeconds,
    );
  }, [fadeMusicTo]);

  /** After the last word: let the music swell again, then fade it away. */
  const finishAfterVoiceover = useCallback(() => {
    fadeMusicTo(invitationAudio.musicLevel, invitationAudio.fadeSeconds);

    window.setTimeout(() => {
      fadeMusicTo(0, invitationAudio.fadeSeconds * 2);
    }, invitationAudio.outroSeconds * 1000);
  }, [fadeMusicTo]);

  const setMuted = useCallback((isMuted: boolean) => {
    if (musicRef.current) musicRef.current.muted = isMuted;
    if (voiceoverRef.current) voiceoverRef.current.muted = isMuted;
  }, []);

  const rewind = useCallback(() => {
    const music = musicRef.current;
    const voiceover = voiceoverRef.current;

    if (voiceover) {
      voiceover.pause();
      voiceover.currentTime = 0;
    }

    if (music) {
      music.currentTime = 0;
      fadeMusicTo(invitationAudio.musicLevel, 0.2);
      void music.play().catch(() => undefined);
    }
  }, [fadeMusicTo]);

  return {
    musicRef,
    voiceoverRef,
    unlockOnTap,
    startVoiceover,
    finishAfterVoiceover,
    setMuted,
    rewind,
  };
}