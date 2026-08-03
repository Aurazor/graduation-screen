"use client";

import { useEffect, useState, type RefObject } from "react";
import {
    invitationVideo,
    minVisibleVideoHeight,
    minVisibleVideoWidth,
} from "@/lib/invitation-details";

export type FrameRect = {
    left: number;
    top: number;
    width: number;
    height: number;
};

/**
 * Works out the exact box the video should occupy inside the stage.
 *
 * It fills the screen like `object-fit: cover`, but stops zooming in once the
 * sides of the letter would be cropped away. The video element and the text
 * overlay are both given this box, so a percentage inside the overlay always
 * points at the same spot in the video - on any phone size.
 */
export function useVideoFrameRect(
    stageRef: RefObject<HTMLElement | null>,
): FrameRect | null {
    const [frameRect, setFrameRect] = useState<FrameRect | null>(null);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;

        const measureFrame = () => {
            const { width: stageWidth, height: stageHeight } =
                stage.getBoundingClientRect();
            if (!stageWidth || !stageHeight) return;

            const coverScale = Math.max(
                stageWidth / invitationVideo.width,
                stageHeight / invitationVideo.height,
            );
            const maxScaleKeepingLetterVisible = Math.min(
                stageWidth / (invitationVideo.width * minVisibleVideoWidth),
                stageHeight / (invitationVideo.height * minVisibleVideoHeight),
            );
            const scale = Math.min(coverScale, maxScaleKeepingLetterVisible);

            const width = invitationVideo.width * scale;
            const height = invitationVideo.height * scale;

            setFrameRect({
                left: (stageWidth - width) / 2,
                top: (stageHeight - height) / 2,
                width,
                height,
            });
        };

        measureFrame();
        const observer = new ResizeObserver(measureFrame);
        observer.observe(stage);
        // Covers iOS toolbar show/hide, which does not always fire a resize on the element.
        window.addEventListener("orientationchange", measureFrame);

        return () => {
            observer.disconnect();
            window.removeEventListener("orientationchange", measureFrame);
        };
    }, [stageRef]);

    return frameRect;
}