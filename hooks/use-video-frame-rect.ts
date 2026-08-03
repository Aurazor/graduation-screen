"use client";

import { useEffect, useState } from "react";
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
 * Works out the exact box the video should occupy on screen.
 *
 * It measures `window.visualViewport` - the part of the page the person can
 * actually see - instead of relying on `100dvh`, which some Android browsers
 * report differently from the visible area and which left green bands above and
 * below the video. The stage itself is `position: fixed; inset: 0`, so these
 * numbers can be used directly as the video's `left` / `top`.
 *
 * The video fills that visible box like `object-fit: cover`, but stops zooming
 * in once the sides of the letter would be cropped away. The video element and
 * the text overlay are given the same box, so a percentage inside the overlay
 * always points at the same spot in the video - on any phone size.
 */
export function useVideoFrameRect(): FrameRect | null {
    const [frameRect, setFrameRect] = useState<FrameRect | null>(null);

    useEffect(() => {
        const measureFrame = () => {
            const viewport = window.visualViewport;
            const visibleWidth = viewport?.width ?? window.innerWidth;
            const visibleHeight = viewport?.height ?? window.innerHeight;
            const offsetLeft = viewport?.offsetLeft ?? 0;
            const offsetTop = viewport?.offsetTop ?? 0;
            if (!visibleWidth || !visibleHeight) return;

            const coverScale = Math.max(
                visibleWidth / invitationVideo.width,
                visibleHeight / invitationVideo.height,
            );
            const maxScaleKeepingLetterVisible = Math.min(
                visibleWidth / (invitationVideo.width * minVisibleVideoWidth),
                visibleHeight / (invitationVideo.height * minVisibleVideoHeight),
            );
            const scale = Math.min(coverScale, maxScaleKeepingLetterVisible);

            const width = invitationVideo.width * scale;
            const height = invitationVideo.height * scale;

            setFrameRect((previous) => {
                const next = {
                    left: offsetLeft + (visibleWidth - width) / 2,
                    top: offsetTop + (visibleHeight - height) / 2,
                    width,
                    height,
                };
                const isSameBox =
                    previous &&
                    Math.abs(previous.left - next.left) < 0.5 &&
                    Math.abs(previous.top - next.top) < 0.5 &&
                    Math.abs(previous.width - next.width) < 0.5 &&
                    Math.abs(previous.height - next.height) < 0.5;
                return isSameBox ? previous : next;
            });
        };

        measureFrame();
        // Safari settles its viewport a moment after first paint.
        const settleTimer = window.setTimeout(measureFrame, 300);

        const viewport = window.visualViewport;
        viewport?.addEventListener("resize", measureFrame);
        viewport?.addEventListener("scroll", measureFrame);
        window.addEventListener("resize", measureFrame);
        window.addEventListener("orientationchange", measureFrame);

        return () => {
            window.clearTimeout(settleTimer);
            viewport?.removeEventListener("resize", measureFrame);
            viewport?.removeEventListener("scroll", measureFrame);
            window.removeEventListener("resize", measureFrame);
            window.removeEventListener("orientationchange", measureFrame);
        };
    }, []);

    return frameRect;
}