"use client";

import { useRef, useState, useEffect } from "react";

interface Props {
    name: string;
}

export default function CongratsPage({ name }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.play().catch(() => setShowText(true));
    }, []);

    return (
        <div style={{ width: "100vw", height: "100vh", background: "black", position: "relative" }}>

            {/* VIDEO */}
            <video
                ref={videoRef}
                onEnded={() => setShowText(true)}
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
            >
                <source src="/greeting.mp4" type="video/mp4" />
            </video>

            {/* SKIP */}
            {!showText && (
                <button
                    onClick={() => setShowText(true)}
                    style={{
                        position: "absolute",
                        bottom: "32px",
                        right: "32px",
                        background: "rgba(255,255,255,0.15)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.4)",
                        padding: "8px 20px",
                        borderRadius: "999px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontFamily: "Cinzel, serif",
                    }}
                >
                    Skip
                </button>
            )}

            {/* OVERLAY */}
            {showText && (
                <div style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "fadeIn 1.2s ease forwards",
                }}>
                    <div style={{
                        position: "relative",
                        textAlign: "center",
                        color: "#2c1a08",
                        padding: "40px 36px",
                        paddingTop: "180px",
                        maxWidth: "480px",
                        width: "88%",
                        // background: "rgba(255, 240, 210, 0.15)",
                        // border: "1px solid rgba(138, 92, 16, 0.3)",
                        borderRadius: "4px",
                        animation: "fadeUp 1.2s ease forwards",
                    }}>

                        {/* Corner ornaments */}
                        {/*<span style={{ position: "absolute", top: "10px",  left:  "14px", color: "#8a5c10", fontSize: "14px" }}>✦</span>*/}
                        {/*<span style={{ position: "absolute", top: "10px",  right: "14px", color: "#8a5c10", fontSize: "14px" }}>✦</span>*/}
                        {/*<span style={{ position: "absolute", bottom: "10px", left:  "14px", color: "#8a5c10", fontSize: "14px" }}>✦</span>*/}
                        {/*<span style={{ position: "absolute", bottom: "10px", right: "14px", color: "#8a5c10", fontSize: "14px" }}>✦</span>*/}

                        {/* School name */}
                        <div style={{
                            fontFamily: "Cinzel, serif",
                            fontSize: "10px",
                            letterSpacing: "4px",
                            color: "#5a3e1b",
                            // marginBottom: "4px",
                            textTransform: "uppercase",
                        }}>
                            William Pescod High School
                        </div>

                        {/* Top divider */}
                        <div style={{
                            margin: "5px auto 5px",
                            height: "1px",
                            width: "70%",
                            background: "linear-gradient(to right, transparent, #8a5c10, transparent)",
                        }} />

                        {/* Class of */}
                        <p style={{
                            fontFamily: "Cinzel, serif",
                            fontSize: "11px",
                            letterSpacing: "5px",
                            color: "#7a5520",
                            marginBottom: "14px",
                            textTransform: "uppercase",
                        }}>
                            Class of 2026
                        </p>

                        {/* Main heading */}
                        <h1 style={{
                            fontFamily: "Cinzel, serif",
                            fontSize: "17px",
                            fontWeight: "700",
                            color: "#2c1a08",
                            lineHeight: 1.6,
                            marginBottom: "18px",
                            letterSpacing: "0.5px",
                        }}>
                            You are hereby invited to the<br />
                            <span style={{ color: "#8a5c10" }}>Matric Farewell</span>
                        </h1>

                        {/* Middle ornament */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "18px" }}>
                            <div style={{ height: "1px", width: "48px", background: "linear-gradient(to right, transparent, #8a5c10)" }} />
                            <span style={{ color: "#8a5c10", fontSize: "13px" }}>⚜</span>
                            <div style={{ height: "1px", width: "48px", background: "linear-gradient(to left, transparent, #8a5c10)" }} />
                        </div>

                        {/* Details */}
                        <div style={{
                            fontFamily: "IM Fell English, serif",
                            fontSize: "14px",
                            lineHeight: "2.0",
                            color: "#3a2510",
                            marginBottom: "18px",
                        }}>
                            <div><span style={{ color: "#8a5c10", fontStyle: "italic" }}>Date</span>{"  ·  "}23 September 2026</div>
                            <div><span style={{ color: "#8a5c10", fontStyle: "italic" }}>Time</span>{"  ·  "}18h00</div>
                            <div><span style={{ color: "#8a5c10", fontStyle: "italic" }}>Theme</span>{"  ·  "}Bridgerton</div>
                            <div><span style={{ color: "#8a5c10", fontStyle: "italic" }}>Venue</span>{"  ·  "}The Light House</div>
                            <div style={{ fontSize: "11px", color: "#5a3e1b", marginTop: "2px" }}>(Old CRC Church)</div>
                        </div>

                        {/* Bottom divider */}
                        <div style={{
                            margin: "0 auto 14px",
                            height: "1px",
                            width: "70%",
                            background: "linear-gradient(to right, transparent, #8a5c10, transparent)",
                        }} />

                        {/* Footer */}
                        <p style={{
                            fontFamily: "IM Fell English, serif",
                            fontStyle: "italic",
                            fontSize: "12px",
                            color: "#7a5520",
                            letterSpacing: "0.5px",
                        }}>
                            Dress to impress · An evening to remember
                        </p>

                    </div>
                </div>
            )}

            <style>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(30px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
        </div>
    );
}