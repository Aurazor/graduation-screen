"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { invitation, letterWritingArea } from "@/lib/invitation-details";

type InvitationLetterProps = {
    isVisible: boolean;
};

/**
 * Sits exactly on the blank part of the letter in the video's final frame.
 *
 * The wrapper is placed with percentages of the video frame (see
 * `letterWritingArea`) and declares a CSS container, so every font size below is
 * a share of the letter's own width. That is what keeps the whole
 * "Class of 2026" block inside the paper on every phone size.
 */
export default function InvitationLetter({ isVisible }: InvitationLetterProps) {
    const letterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isVisible) return;
        const letter = letterRef.current;
        if (!letter) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        const animation = gsap.context(() => {
            gsap.fromTo(
                ".letter-line",
                { opacity: 0, y: prefersReducedMotion ? 0 : 12, filter: "blur(6px)" },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: prefersReducedMotion ? 0.3 : 0.85,
                    stagger: prefersReducedMotion ? 0 : 0.18,
                    ease: "power2.out",
                },
            );
        }, letter);

        return () => animation.revert();
    }, [isVisible]);

    return (
        <div
            ref={letterRef}
            className={`letter-container absolute flex flex-col items-center justify-center text-center transition-opacity duration-500 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{
                left: `${letterWritingArea.left * 100}%`,
                top: `${letterWritingArea.top * 100}%`,
                width: `${letterWritingArea.width * 100}%`,
                height: `${letterWritingArea.height * 100}%`,
            }}
            aria-hidden={!isVisible}
        >
            <p className="letter-line letter-eyebrow font-serif-display font-semibold uppercase text-[var(--school-green)]">
                {invitation.classOf}
            </p>

            <span className="letter-line letter-rule" />

            <p className="letter-line letter-lead font-serif-display text-[var(--ink)]">
                {invitation.leadIn}
            </p>

            <h2 className="letter-line letter-title font-serif-display font-bold leading-[1.05] text-[var(--school-green)]">
                {invitation.eventName}
            </h2>

            <p className="letter-line letter-host font-serif-display text-[var(--ink)]">
                {invitation.hostLine}
            </p>

            <span className="letter-line letter-rule" />

            <dl className="letter-facts font-serif-display text-[var(--ink)]">
                {invitation.facts.map((fact) => (
                    <div key={fact.label} className="letter-line letter-fact">
                        <dt className="inline">{fact.label}</dt>
                        <span aria-hidden> · </span>
                        <dd className="inline">{fact.value}</dd>
                        {fact.note && <span className="letter-note block">{fact.note}</span>}
                    </div>
                ))}
            </dl>
        </div>
    );
}