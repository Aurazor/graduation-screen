"use client";

import { invitation, invitationVideo } from "@/lib/invitation-details";

type TapToOpenScreenProps = {
    studentName: string;
    /** True once the seal has been tapped and the video is starting. */
    isOpening: boolean;
    /** True once the video is really playing - the screen fades away. */
    isHidden: boolean;
    onOpen: () => void;
};

/**
 * Phones only allow sound after a real tap, so the experience always starts here.
 * The button is never disabled: iOS will not pre-buffer a video, so waiting for
 * it to report "ready" would leave the seal stuck on a loading state forever.
 */
export default function TapToOpenScreen({
                                            studentName,
                                            isOpening,
                                            isHidden,
                                            onOpen,
                                        }: TapToOpenScreenProps) {
    return (
        <div
            className={`absolute inset-0 z-30 flex flex-col items-center justify-center px-8 text-center transition-opacity duration-500 ${
                isHidden ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            aria-hidden={isHidden}
        >
            <div
                className="absolute inset-0 scale-110 bg-cover bg-center blur-md"
                style={{ backgroundImage: `url(${invitationVideo.poster})` }}
                aria-hidden
            />
            <div className="absolute inset-0 bg-[#0b1f16]/75" aria-hidden />

            <div className="relative flex flex-col items-center gap-6">
                <p className="font-serif-display text-[0.72rem] uppercase tracking-[0.42em] text-[#e7d8b5]">
                    {invitation.schoolName}
                </p>

                <h1 className="font-script text-5xl leading-tight text-[#f6ecd8] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                    {studentName ? studentName : "An invitation awaits"}
                </h1>

                <p className="font-serif-display max-w-xs text-base leading-relaxed text-[#e7d8b5]/90">
                    A sealed letter has arrived for you.
                </p>

                <button
                    type="button"
                    onClick={onOpen}
                    className="wax-seal-button font-serif-display mt-2 flex h-32 w-32 items-center justify-center rounded-full text-sm uppercase tracking-[0.2em] text-[#f6ecd8] transition"
                >
                    {isOpening ? <span className="seal-spinner" /> : "Open"}
                </button>

                <p className="font-serif-display text-xs tracking-[0.18em] text-[#e7d8b5]/70">
                    {isOpening ? "Unsealing…" : "Best with your sound on"}
                </p>
            </div>
        </div>
    );
}