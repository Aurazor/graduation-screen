"use client";

import { useCallback, useRef } from "react";
import { invitationAudio } from "@/lib/invitation-details";

/**
 * Smoothly ramps an audio element to a target volume.
 * Used to duck the music under the narrator and to fade it out at the end.
 */
function fadeVolumeTo(
  audio: HTMLAudioElement,
  targetVolume: number,
  seconds: number,
  fadeRef: { current: number },
) {
  cancelAnimationFrame(fadeRef.current);

  const startVolume = audio.volume;
  const startedAt = performance.now();
  const durationMs = Math.max(seconds, 0.01) * 1000;

  const step = () => {
    const progress = Math.min((performance.now() - startedAt) / durationMs, 1);
    audio.volume = startVolume + (targetVolume - startVolume) * progress;
    if (progress < 1) {
      fadeRef.current = requestAnimationFrame(step);
    }
  };

  fadeRef.current = requestAnimationFrame(step);
}

/**
 * Owns the two audio tracks: looping background music and the narrator.
 *
 * Phones will only play audio that was started inside a real tap, and each
 * element has to be unlocked individually - so `unlockOnTap` starts both during
 * the tap, then immediately pauses the voiceover to be resumed on cue later.
 */
export function useInvitationAudio() {
  const musicRef = useRef<HTMLAudioElement>(null);
  const voiceoverRef = useRef<HTMLAudioElement>(null);
  const musicFadeRef = useRef(0);

  /** Called synchronously inside the tap handler, before any `await`. */
  const unlockOnTap = useCallback(() => {
    const music = musicRef.current;
    const voiceover = voiceoverRef.current;

    if (music) {
      music.volume = invitationAudio.musicLevel;
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
  }, []);

  const startVoiceover = useCallback(() => {
    const music = musicRef.current;
    const voiceover = voiceoverRef.current;
    if (!voiceover) return;

    voiceover.currentTime = 0;
    void voiceover.play().catch(() => undefined);

    if (music) {
      fadeVolumeTo(
        music,
        invitationAudio.musicLevelUnderVoiceover,
        invitationAudio.fadeSeconds,
        musicFadeRef,
      );
    }
  }, []);

  /** After the last word: let the music swell again, then fade it away. */
  const finishAfterVoiceover = useCallback(() => {
    const music = musicRef.current;
    if (!music) return;

    fadeVolumeTo(
      music,
      invitationAudio.musicLevel,
      invitationAudio.fadeSeconds,
      musicFadeRef,
    );

    window.setTimeout(() => {
      fadeVolumeTo(music, 0, invitationAudio.fadeSeconds * 2, musicFadeRef);
    }, invitationAudio.outroSeconds * 1000);
  }, []);

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
      music.volume = invitationAudio.musicLevel;
      void music.play().catch(() => undefined);
    }
  }, []);

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