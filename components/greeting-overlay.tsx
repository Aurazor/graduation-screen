"use client";

type GreetingOverlayProps = {
    studentName: string;
    isVisible: boolean;
};

/**
 * "Hello, {studentName}" while the garden doors open.
 * Sizes are in `cqw`, so they scale with the video frame rather than the screen.
 */
export default function GreetingOverlay({
                                            studentName,
                                            isVisible,
                                        }: GreetingOverlayProps) {
    return (
        <div
            className={`absolute inset-x-[8%] top-[26%] flex flex-col items-center text-center transition-all duration-700 ${
                isVisible
                    ? "translate-y-0 opacity-100 blur-0"
                    : "translate-y-2 opacity-0 blur-sm"
            }`}
            aria-live="polite"
        >
            <p className="greeting-hello font-serif-display uppercase tracking-[0.3em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
                Hello
            </p>
            {studentName && (
                <p className="greeting-name font-script leading-[1.15] text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.7)]">
                    {studentName}
                </p>
            )}
        </div>
    );
}