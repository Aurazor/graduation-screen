"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Tells you which cue times the video has already played past.
 *
 * Checked once per animation frame (the native `timeupdate` event only fires a
 * few times a second, which is too coarse for cueing text). Rewinding the video
 * flips the cues back to false, so replaying just works.
 */
export function usePassedVideoCues<Cues extends Record<string, number>>(
    videoRef: RefObject<HTMLVideoElement | null>,
    cues: Cues,
    isWatching: boolean,
): Record<keyof Cues, boolean> {
    const [passedCues, setPassedCues] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!isWatching) return;
        const video = videoRef.current;
        if (!video) return;

        let frameId = 0;

        const checkCues = () => {
            setPassedCues((previous) => {
                const next = { ...previous };
                let hasChanged = false;

                for (const [cueName, cueTime] of Object.entries(cues)) {
                    const isPassed = video.currentTime >= cueTime;
                    if (isPassed !== Boolean(previous[cueName])) {
                        next[cueName] = isPassed;
                        hasChanged = true;
                    }
                }

                return hasChanged ? next : previous;
            });

            frameId = requestAnimationFrame(checkCues);
        };

        frameId = requestAnimationFrame(checkCues);
        return () => cancelAnimationFrame(frameId);
    }, [videoRef, cues, isWatching]);

    return passedCues as Record<keyof Cues, boolean>;
}