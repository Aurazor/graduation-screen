"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Reports how many seconds into the voiceover the narrator currently is.
 *
 * Polled once per animation frame, because the native `timeupdate` event only
 * fires a few times a second - too coarse to write a line onto the paper on the
 * exact word. Returns 0 while the narration has not started.
 */
export function useSpokenSeconds(
    audioRef: RefObject<HTMLAudioElement | null>,
    isSpeaking: boolean,
): number {
    const [spokenSeconds, setSpokenSeconds] = useState(0);

    useEffect(() => {
        if (!isSpeaking) return;
        const audio = audioRef.current;
        if (!audio) return;

        let frameId = 0;

        const readCurrentTime = () => {
            setSpokenSeconds(audio.currentTime);
            frameId = requestAnimationFrame(readCurrentTime);
        };

        frameId = requestAnimationFrame(readCurrentTime);
        return () => cancelAnimationFrame(frameId);
    }, [audioRef, isSpeaking]);

    return isSpeaking ? spokenSeconds : 0;
}