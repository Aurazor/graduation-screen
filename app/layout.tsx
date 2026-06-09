import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Matric Farewell 2026",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" style={{ height: "100%" }}>
        <head>
            <link
                href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=IM+Fell+English:ital@0;1&display=swap"
                rel="stylesheet"
            />
        </head>
        <body style={{ height: "100%" }}>
        {children}
        </body>
        </html>
    );
}