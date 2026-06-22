"use client";

import { useRef, useState, useEffect } from "react";

interface Props {
    name: string;
}

const VIDEO_WIDTH = 720;
const VIDEO_HEIGHT = 1280;


export default function CongratsPage({ name }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showText, setShowText] = useState(false);
    const [muted, setMuted] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.play().catch(() => setShowText(true));
    }, []);

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setMuted(video.muted);
    };

    return (
        <div className="page-wrapper" style={{
            width: "100vw",
            height: "100vh",
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>

            <div className="video-container" style={{
                position: "relative",
                width: "min(720px, 100vw)",
                height: "min(1280px, 100vh)",
                aspectRatio: "9 / 16",
                overflow: "hidden",
                flexShrink: 0,
            }}>

                <video
                    className="main-video"
                    ref={videoRef}
                    onEnded={() => setShowText(true)}
                    muted
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                >
                    <source src="/greeting.mp4" type="video/mp4" />
                </video>

                {/* MUTE / UNMUTE BUTTON */}
                <button
                    className="music-button"
                    onClick={toggleMute}
                    title={muted ? "Unmute music" : "Mute music"}
                    style={{
                        position: "absolute",
                        bottom: "32px",
                        right: "32px",
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.4)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "white",
                        fontSize: "18px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(6px)",
                    }}
                >
                    {muted ? "🔇" : "🔊"}
                </button>

                {showText && (
                    <div className="invitation-card" style={{
                        position: "absolute",
                        top: "33.6%",     // right below the crest
                        left: "13.2%",    // paper's left edge
                        right: "14.6%",   // paper's right edge (100 - 85.4)
                        bottom: "20.3%",  // paper's bottom edge (100 - 79.7)
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        textAlign: "center",
                        padding: "4% 6%",
                        overflow: "hidden",     // prevents overflow outside the paper
                        animation: "fadeIn 1.2s ease forwards",
                    }}>
                        <div className="invitation-card" style={{
                            textAlign: "center",
                            padding: "32px 28px",
                            width: "88%",
                            // marginTop: "180px",
                        }}>

                            {/* Class of */}
                            <p className="class-of" style={{
                                fontFamily: "Cinzel, serif",
                                fontSize: "11px",
                                letterSpacing: "5px",
                                color: "#7a5520",
                                marginBottom: name && name !== "Graduate" ? "8px" : "16px",
                                textTransform: "uppercase",
                            }}>
                                Class of 2026
                            </p>

                            {/* Student name */}
                            {name && name !== "Graduate" && (
                                <p className="student-name" style={{
                                    fontFamily: "Cinzel, serif",
                                    fontSize: "20px",
                                    fontWeight: "900",
                                    color: "#2c1a08",
                                    marginBottom: "16px",
                                    letterSpacing: "1px",
                                }}>
                                    {name}
                                </p>
                            )}

                            {/* Divider */}
                            <div className="divider-top" style={{
                                margin: "0 auto 16px",
                                height: "1px",
                                width: "60%",
                                background: "linear-gradient(to right, transparent, #8a5c10, transparent)",
                            }} />

                            {/* Main invite line */}
                            <p className="invite-text" style={{
                                fontFamily: "Cinzel, serif",
                                fontSize: "13px",
                                fontWeight: "700",
                                color: "#2c1a08",
                                lineHeight: 1.8,
                                marginBottom: "20px",
                                letterSpacing: "0.3px",
                            }}>
                                You are hereby invited to the<br />
                                <span className="invite-highlight" style={{ color: "#8a5c10" }}>
                  Matric Farewell
                </span><br />
                                <span className="invite-school" style={{ fontSize: "11px", fontWeight: "400", color: "#5a3e1b", letterSpacing: "2px" }}>
                  of William Pescod High School
                </span>
                            </p>

                            {/* Divider */}
                            <div className="divider-mid" style={{
                                margin: "0 auto 20px",
                                height: "1px",
                                width: "60%",
                                background: "linear-gradient(to right, transparent, #8a5c10, transparent)",
                            }} />

                            {/* Details */}
                            <div className="details-block" style={{
                                fontFamily: "IM Fell English, serif",
                                fontSize: "15px",
                                lineHeight: "2.1",
                                color: "#3a2510",
                            }}>
                                <div className="detail-date">
                                    <span className="detail-label" style={{ color: "#8a5c10", fontStyle: "italic" }}>Date</span>
                                    {" · "}23 September 2026
                                </div>
                                <div className="detail-time">
                                    <span className="detail-label" style={{ color: "#8a5c10", fontStyle: "italic" }}>Time</span>
                                    {" · "}18h00
                                </div>
                                <div className="detail-theme">
                                    <span className="detail-label" style={{ color: "#8a5c10", fontStyle: "italic" }}>Theme</span>
                                    {" · "}Bridgerton
                                </div>
                                <div className="detail-venue">
                                    <span className="detail-label" style={{ color: "#8a5c10", fontStyle: "italic" }}>Venue</span>
                                    {" · "}The Light House
                                    <span className="detail-venue-sub" style={{ fontSize: "12px", color: "#5a3e1b" }}> (Old CRC Church)</span>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        `}</style>

            </div>
        </div>
    );
}