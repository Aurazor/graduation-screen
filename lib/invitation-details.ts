/**
 * Everything about the video and the invitation lives here,
 * so wording or timing can be changed without touching components.
 */

export const invitationVideo = {
    src: "/video/greeting.mp4",
    poster: "/video/greeting-poster.jpg",
    /** Real pixel size of greeting.mp4 - used to line the text up with the video. */
    width: 720,
    height: 1280,
    durationSeconds: 10,
} as const;

/** Moments in the video (seconds) where something should appear or disappear. */
export const videoCues = {
    /** Doors are swinging open - good moment to greet the student. */
    greetingAppears: 0.6,
    greetingFades: 3.6,
    /** The letter has unfolded and settled - write on it now. */
    letterAppears: 9.1,
} as const;

/**
 * The blank writing area of the letter in the video's final frame,
 * measured from the video itself and expressed as a fraction of the frame.
 * The overlay uses the same coordinates, so the text always sits on the paper.
 */
export const letterWritingArea = {
    left: 0.2,
    top: 0.345,
    width: 0.6,
    height: 0.43,
} as const;

/**
 * The video fills the screen like `object-fit: cover`, but we never zoom in so
 * far that less than this share of the video is still on screen. The width rule
 * keeps the letter whole on very tall phones (0.76 is the paper's own width plus
 * a hair, so tall 20:9 and 21:9 phones still get an edge-to-edge video); the
 * height rule does the same on wide screens, where the sides are filled with the
 * page background.
 */
export const minVisibleVideoWidth = 0.76;
export const minVisibleVideoHeight = 0.66;

export type InvitationFact = {
    label: string;
    value: string;
    /** Optional second line, e.g. the venue's former name. */
    note?: string;
    /** Seconds into the voiceover where this line is written onto the paper. */
    revealAt: number;
};

/** The third block: every practical detail lands together, at 9.0s. */
const invitationFacts: InvitationFact[] = [
    { label: "Date", value: "23 September 2026", revealAt: 9.0 },
    { label: "Time", value: "18h00", revealAt: 9.2 },
    { label: "Theme", value: "Bridgerton", revealAt: 9.4 },
    {
        label: "Venue",
        value: "The Light House",
        note: "(Old CRC Church)",
        revealAt: 9.6,
    },
];

/**
 * The invitation text. Each `revealAt` is a moment in invitation-voiceover.mp3.
 *
 * The narration is a Whistledown-style address - a herald announcing the event,
 * not someone reading the letter aloud. She never states the date, time or
 * venue, so there is nothing for a line-by-line reveal to sync to. Instead the
 * letter writes itself in three quick blocks over the first ten seconds and
 * then holds, complete, for the rest of her speech:
 *
 *   0.0s  the salutation, on "graduating class of 2026"
 *   5.2s  the title block, as she begins "It is with the greatest pleasure"
 *   9.0s  every practical detail, lightly staggered
 *
 * Keeping it fast matters because students screenshot this - the invitation has
 * to be complete and readable long before the narration ends.
 */
export const invitation = {
    schoolName: "William Pescod High School",
    classOf: { text: "Class of 2026", revealAt: 0 },
    leadIn: { text: "You are hereby invited to the", revealAt: 5.2 },
    eventName: { text: "Matric Farewell", revealAt: 5.6 },
    hostLine: { text: "of William Pescod High School", revealAt: 6.0 },
    facts: invitationFacts,
};

export const invitationAudio = {
    musicSrc: "/audio/background-music.mp3",
    voiceoverSrc: "/audio/invitation-voiceover.mp3",
    /** Real length of the voiceover, used to fade the music back up at the end. */
    voiceoverDurationSeconds: 63.4,
    /** Video time at which the narrator starts - just after the letter settles. */
    voiceoverStartsAt: 9.1,
    /** Music level on its own, and the lower level it drops to under the speech. */
    musicLevel: 0.5,
    musicLevelUnderVoiceover: 0.14,
    /** How long the music takes to duck, lift and fade out. */
    fadeSeconds: 1.2,
    /** Quiet tail after the last word before the music fades away. */
    outroSeconds: 3,
};