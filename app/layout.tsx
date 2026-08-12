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
    /**
     * Set NEXT_PUBLIC_SITE_URL to your real domain so the preview image resolves
     * when the link is shared on WhatsApp or Instagram.
     */
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
    title: `${invitation.eventName.text} 2026 · ${invitation.schoolName}`,
    description: `${invitation.classOf.text} — you are invited to the ${invitation.eventName.text}.`,
    openGraph: {
        title: `${invitation.eventName.text} 2026`,
        description: `${invitation.classOf.text} — an invitation from ${invitation.schoolName}.`,
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