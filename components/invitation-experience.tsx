"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import GreetingOverlay from "@/components/greeting-overlay";
import InvitationLetter from "@/components/invitation-letter";
import TapToOpenScreen from "@/components/tap-to-open-screen";
import { useInvitationAudio } from "@/hooks/use-invitation-audio";
import { usePassedVideoCues } from "@/hooks/use-passed-video-cues";
import { useSpokenSeconds } from "@/hooks/use-spoken-seconds";
import { useVideoFrameRect } from "@/hooks/use-video-frame-rect";
import {
    invitationAudio,
    invitationVideo,
    videoCues,
} from "@/lib/invitation-details";

type InvitationExperienceProps = {
    studentName: string;
};

export default function InvitationExperience({
                                                 studentName,
                                             }: InvitationExperienceProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const frameRect = useVideoFrameRect();
    const {
        musicRef,
        voiceoverRef,
        unlockOnTap,
        startVoiceover,
        finishAfterVoiceover,
        setMuted,
        rewind,
    } = useInvitationAudio();

    const [hasTapped, setHasTapped] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const passedCues = usePassedVideoCues(videoRef, videoCues, hasTapped);
    const spokenSeconds = useSpokenSeconds(voiceoverRef, isSpeaking);
    const isGreetingVisible =
        passedCues.greetingAppears && !passedCues.greetingFades;

    /**
     * The video is silent - the music carries the opening - so the narrator is
     * cued off the video's own clock as the letter finishes settling.
     */
    useEffect(() => {
        if (!hasTapped || isSpeaking) return;
        const video = videoRef.current;
        if (!video) return;

        let frameId = 0;
        const waitForCue = () => {
            if (video.currentTime >= invitationAudio.voiceoverStartsAt) {
                setIsSpeaking(true);
                startVoiceover();
                return;
            }
            frameId = requestAnimationFrame(waitForCue);
        };

        frameId = requestAnimationFrame(waitForCue);
        return () => cancelAnimationFrame(frameId);
    }, [hasTapped, isSpeaking, startVoiceover]);

    /**
     * The tap that lets the browser play audio at all. Everything here runs
     * synchronously, while the tap still counts as a user gesture - iOS will not
     * buffer media before this happens, which is why nothing waits for readiness.
     */
    const openInvitation = () => {
        const video = videoRef.current;
        if (!video) return;

        setHasTapped(true);
        unlockOnTap();
        video.play().catch(() => setHasTapped(false));
    };

    const toggleSound = () => {
        const nextMuted = !isMuted;
        setIsMuted(nextMuted);
        setMuted(nextMuted);
    };

    const replayInvitation = () => {
        const video = videoRef.current;
        if (!video) return;

        setHasFinished(false);
        setIsSpeaking(false);
        rewind();
        video.currentTime = 0;
        void video.play();
    };

    /** The exact box the video and the text overlay both occupy. Sharing one
     *  object guarantees they can never drift apart.
     *
     *  `maxWidth: "none"` is inline on purpose: Tailwind's preflight sets
     *  `max-width: 100%` on media, which would otherwise squash the video back to
     *  the screen width while the overlay kept its full frame width. An inline
     *  style always beats a stylesheet rule, so this holds however the CSS is
     *  bundled. */
    const frameStyle: CSSProperties = frameRect
        ? {
            left: frameRect.left,
            top: frameRect.top,
            width: frameRect.width,
            height: frameRect.height,
        }
        : { left: 0, top: 0, width: "100%", height: "100%" };

    return (
        <main className="fixed inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#2c4a3a,#0b1f16)]">
            <video
                ref={videoRef}
                src={invitationVideo.src}
                poster={invitationVideo.poster}
                playsInline
                muted
                preload="auto"
                disablePictureInPicture
                onPlaying={() => setIsPlaying(true)}
                className={`invitation-video absolute transition-opacity duration-300 ${
                    frameRect ? "opacity-100" : "opacity-0"
                }`}
                style={{ ...frameStyle, maxWidth: "none", objectFit: "cover" }}
            />

            <audio ref={musicRef} src={invitationAudio.musicSrc} preload="auto" loop />
            <audio
                ref={voiceoverRef}
                src={invitationAudio.voiceoverSrc}
                preload="auto"
                onEnded={() => {
                    setHasFinished(true);
                    finishAfterVoiceover();
                }}
            />

            {/* Shares the video's exact box, so percentages inside land on the letter. */}
            {frameRect && (
                <div
                    className="video-frame pointer-events-none absolute"
                    style={frameStyle}
                >
                    <GreetingOverlay
                        studentName={studentName}
                        isVisible={Boolean(isGreetingVisible)}
                    />
                    <InvitationLetter
                        spokenSeconds={spokenSeconds}
                        isVisible={Boolean(passedCues.letterAppears)}
                    />
                </div>
            )}

            {isPlaying && (
                <div className="absolute bottom-6 right-5 z-20 flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={toggleSound}
                        aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
                        className="control-button"
                    >
                        {isMuted ? "🔇" : "🔊"}
                    </button>
                    {hasFinished && (
                        <button
                            type="button"
                            onClick={replayInvitation}
                            aria-label="Play again"
                            className="control-button"
                        >
                            ↻
                        </button>
                    )}
                </div>
            )}

            {/* Stays up until the video really starts, so a slow connection never
          leaves a blank screen. */}
            <TapToOpenScreen
                studentName={studentName}
                isOpening={hasTapped}
                isHidden={isPlaying}
                onOpen={openInvitation}
            />
        </main>
    );
}