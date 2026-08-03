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
    const stageRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const frameRect = useVideoFrameRect(stageRef);
    const [hasOpened, setHasOpened] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const passedCues = usePassedVideoCues(videoRef, videoCues, hasOpened);
    const isGreetingVisible =
        passedCues.greetingAppears && !passedCues.greetingFades;

    /** The tap that lets the browser play the video with its sound on. */
    const openInvitation = async () => {
        const video = videoRef.current;
        if (!video) return;

        setHasOpened(true);
        video.muted = false;
        setIsMuted(false);

        try {
            await video.play();
        } catch {
            // Some phones (low power mode) refuse sound - fall back to a silent play.
            video.muted = true;
            setIsMuted(true);
            await video.play().catch(() => undefined);
        }
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
        <main
            ref={stageRef}
            className="relative h-[100dvh] w-full overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#2c4a3a,#0b1f16)]"
        >
            <video
                ref={videoRef}
                src={invitationVideo.src}
                poster={invitationVideo.poster}
                playsInline
                preload="auto"
                disablePictureInPicture
                onCanPlayThrough={() => setIsVideoReady(true)}
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

            {hasOpened && (
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

            {!hasOpened && (
                <TapToOpenScreen
                    studentName={studentName}
                    isVideoReady={isVideoReady}
                    onOpen={openInvitation}
                />
            )}
        </main>
    );
}