"use client";

import type { ReactNode } from "react";
import { invitation, letterWritingArea } from "@/lib/invitation-details";

type InvitationLetterProps = {
    /** How far into the voiceover the narrator is, in seconds. */
    spokenSeconds: number;
    isVisible: boolean;
};

type SpokenLineProps = {
    spokenAt: number;
    spokenSeconds: number;
    className?: string;
    children: ReactNode;
};

/** One line of the invitation, written onto the paper as it is spoken. */
function SpokenLine({
                        spokenAt,
                        spokenSeconds,
                        className = "",
                        children,
                    }: SpokenLineProps) {
    const hasBeenSpoken = spokenSeconds >= spokenAt;

    return (
        <p
            className={`letter-line ${className} ${
                hasBeenSpoken ? "letter-line-written" : ""
            }`}
        >
            {children}
        </p>
    );
}

/**
 * Sits exactly on the blank part of the letter in the video's final frame.
 *
 * The wrapper is placed with percentages of the video frame (see
 * `letterWritingArea`) and declares a CSS container, so every font size below is
 * a share of the letter's own width. That is what keeps the whole
 * "Class of 2026" block inside the paper on every phone size.
 */
export default function InvitationLetter({
                                             spokenSeconds,
                                             isVisible,
                                         }: InvitationLetterProps) {
    const lastFact = invitation.facts[invitation.facts.length - 1];

    return (
        <div
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
            <SpokenLine
                spokenAt={invitation.classOf.spokenAt}
                spokenSeconds={spokenSeconds}
                className="letter-eyebrow font-serif-display font-semibold uppercase text-[var(--school-green)]"
            >
                {invitation.classOf.text}
            </SpokenLine>

            <span
                className={`letter-rule ${
                    spokenSeconds >= invitation.classOf.spokenAt
                        ? "letter-line-written"
                        : "letter-line"
                }`}
            />

            <SpokenLine
                spokenAt={invitation.leadIn.spokenAt}
                spokenSeconds={spokenSeconds}
                className="letter-lead font-serif-display text-[var(--ink)]"
            >
                {invitation.leadIn.text}
            </SpokenLine>

            <SpokenLine
                spokenAt={invitation.eventName.spokenAt}
                spokenSeconds={spokenSeconds}
                className="letter-title font-serif-display font-bold text-[var(--school-green)]"
            >
                {invitation.eventName.text}
            </SpokenLine>

            <SpokenLine
                spokenAt={invitation.hostLine.spokenAt}
                spokenSeconds={spokenSeconds}
                className="letter-host font-serif-display text-[var(--ink)]"
            >
                {invitation.hostLine.text}
            </SpokenLine>

            <span
                className={`letter-rule ${
                    spokenSeconds >= invitation.hostLine.spokenAt
                        ? "letter-line-written"
                        : "letter-line"
                }`}
            />

            <dl className="letter-facts font-serif-display text-[var(--ink)]">
                {invitation.facts.map((fact) => (
                    <SpokenLine
                        key={fact.label}
                        spokenAt={fact.spokenAt}
                        spokenSeconds={spokenSeconds}
                        className="letter-fact"
                    >
                        <span className="letter-fact-label">{fact.label}</span>
                        <span aria-hidden> · </span>
                        <span>{fact.value}</span>
                        {fact.note && <span className="letter-note block">{fact.note}</span>}
                    </SpokenLine>
                ))}
            </dl>

            {/* Screen readers get the whole invitation at once, not word by word. */}
            <p className="sr-only">
                {invitation.classOf.text}. {invitation.leadIn.text}{" "}
                {invitation.eventName.text} {invitation.hostLine.text}.{" "}
                {invitation.facts
                    .map((fact) => `${fact.label}: ${fact.value}`)
                    .join(". ")}
                {lastFact?.note ? ` ${lastFact.note}` : ""}
            </p>
        </div>
    );
}