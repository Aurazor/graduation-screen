import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes } from "next/font/google";
import { invitation, invitationVideo } from "@/lib/invitation-details";
import "./globals.css";

const displaySerif = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-display-serif",
});

const scriptFont = Great_Vibes({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-script",
});

export const metadata: Metadata = {
    title: `${invitation.eventName} 2026 · ${invitation.schoolName}`,
    description: `${invitation.classOf} — you are invited to the ${invitation.eventName}.`,
    openGraph: {
        title: `${invitation.eventName} 2026`,
        description: `${invitation.classOf} — an invitation from ${invitation.schoolName}.`,
        images: [invitationVideo.poster],
    },
};

export const viewport: Viewport = {
    themeColor: "#0b1f16",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body className={`${displaySerif.variable} ${scriptFont.variable}`}>
        {children}
        </body>
        </html>
    );
}