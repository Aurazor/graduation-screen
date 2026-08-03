"use client";

import { useRef, useState } from "react";
import GreetingOverlay from "@/components/greeting-overlay";
import InvitationLetter from "@/components/invitation-letter";
import TapToOpenScreen from "@/components/tap-to-open-screen";
import { usePassedVideoCues } from "@/hooks/use-passed-video-cues";
import { useVideoFrameRect } from "@/hooks/use-video-frame-rect";
import { invitationVideo, videoCues } from "@/lib/invitation-details";

type InvitationExperienceProps = {
    studentName: string;
};

export default function InvitationExperience({
                                                 studentName,
                                             }: InvitationExperienceProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const frameRect = useVideoFrameRect();

    const [hasTapped, setHasTapped] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const passedCues = usePassedVideoCues(videoRef, videoCues, hasTapped);
    const isGreetingVisible =
        passedCues.greetingAppears && !passedCues.greetingFades;

    /**
     * The tap that lets the browser play the video with its sound on.
     * `play()` is called straight away, while the tap still counts as a user
     * gesture - iOS will not buffer the video before this happens, which is why
     * nothing here waits for the video to be ready first.
     */
    const openInvitation = () => {
        const video = videoRef.current;
        if (!video) return;

        setHasTapped(true);
        video.muted = false;
        setIsMuted(false);

        video.play().catch(() => {
            // Some phones (iOS Low Power Mode) refuse sound - fall back to silent play.
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => setHasTapped(false));
        });
    };

    const toggleSound = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const replayInvitation = () => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = 0;
        setHasFinished(false);
        void video.play();
    };

    return (
        <main className="fixed inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#2c4a3a,#0b1f16)]">
            <video
                ref={videoRef}
                src={invitationVideo.src}
                poster={invitationVideo.poster}
                playsInline
                preload="auto"
                disablePictureInPicture
                onPlaying={() => setIsPlaying(true)}
                onEnded={() => setHasFinished(true)}
                className={`absolute transition-opacity duration-300 ${
                    frameRect ? "opacity-100" : "opacity-0"
                }`}
                style={
                    frameRect
                        ? {
                            left: frameRect.left,
                            top: frameRect.top,
                            width: frameRect.width,
                            height: frameRect.height,
                        }
                        : { left: 0, top: 0, width: "100%", height: "100%" }
                }
            />

            {/* Shares the video's exact box, so percentages inside land on the letter. */}
            {frameRect && (
                <div
                    className="video-frame pointer-events-none absolute"
                    style={{
                        left: frameRect.left,
                        top: frameRect.top,
                        width: frameRect.width,
                        height: frameRect.height,
                    }}
                >
                    <GreetingOverlay
                        studentName={studentName}
                        isVisible={Boolean(isGreetingVisible)}
                    />
                    <InvitationLetter isVisible={Boolean(passedCues.letterAppears)} />
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