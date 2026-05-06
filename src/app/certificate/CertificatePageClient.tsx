"use client";

import { useEffect, useRef } from "react";
import { EligibilityStatus } from "@/app/lib/certificate/eligibility";
import Link from "next/link";
import QRCode from "qrcode";


function CheckCircleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
    );
}

function LockClosedIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
        </svg>
    );
}

export default function CertificatePageClient({ status }: { status: EligibilityStatus }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (status.eligible && canvasRef.current) {
            renderCertificate();
        }
    }, [status.eligible]);

    const renderCertificate = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Scale for high DPI (Print quality)
        const scale = 3;
        canvas.width = 1000 * scale;
        canvas.height = 700 * scale;
        ctx.scale(scale, scale);

        // Background (Clean white)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 1000, 700);

        // Outer Border (Rich Indigo)
        ctx.strokeStyle = "#1e1b4b"; // Dark Indigo
        ctx.lineWidth = 12;
        ctx.strokeRect(30, 30, 940, 640);

        // Inner Border (Gold Accent)
        ctx.strokeStyle = "#d4af37"; // Metallic Gold
        ctx.lineWidth = 2;
        ctx.strokeRect(45, 45, 910, 610);

        // Corner Decorations (Simple circles for a premium feel)
        ctx.fillStyle = "#d4af37";
        [
            [30, 30], [970, 30], [30, 670], [970, 670]
        ].forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fill();
        });

        // Header - Institute Name
        ctx.textAlign = "center";
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 28px 'serif'";
        ctx.fillText("Computer Communications Development Institute Sorsogon", 500, 100);

        ctx.font = "16px 'sans-serif'";
        ctx.fillStyle = "#64748b";
        ctx.fillText("COLLEGE OF COMPUTER STUDIES", 500, 125);

        // VisualDS Logo/Sub-brand
        ctx.font = "italic 24px 'serif'";
        ctx.fillStyle = "#4f46e5";
        ctx.fillText("VisualDS Learning Platform", 500, 160);

        // Main Title
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 42px 'sans-serif'";
        ctx.fillText("CERTIFICATE OF COMPLETION", 500, 230);

        // body text
        ctx.fillStyle = "#334155";
        ctx.font = "20px 'serif'";
        ctx.fillText("This official certificate is proudly presented to", 500, 290);

        // User Name (The highlight)
        ctx.fillStyle = "#1e1b4b";
        ctx.font = "bold 64px 'serif'";
        ctx.fillText(status.userName || "Valued Learner", 500, 380);

        // Description
        ctx.fillStyle = "#334155";
        ctx.font = "20px 'serif'";
        ctx.fillText("for successfully completing all advanced modules and challenges in", 500, 450);

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 28px 'sans-serif'";
        ctx.fillText("Data Structures & Algorithms Mastery", 500, 495);

        // Footer Divider
        ctx.beginPath();
        ctx.moveTo(250, 530);
        ctx.lineTo(750, 530);
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Issued Date
        const date = new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        ctx.fillStyle = "#64748b";
        ctx.font = "16px 'sans-serif'";
        ctx.fillText(`Issued on this day, ${date}`, 500, 560);

        // QR Code Generation
        try {
            const verifyUrl = `${window.location.origin}/verify/${status.userId}`;
            const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
                margin: 1,
                width: 150, // Larger QR
                color: {
                    dark: "#1e1b4b",
                    light: "#ffffff"
                }
            });

            const qrImg = new Image();
            qrImg.src = qrDataUrl;
            await new Promise((resolve) => {
                qrImg.onload = resolve;
            });

            // Draw QR Code on the bottom right side
            const qrSize = 100;
            const rightPadding = 60;
            const bottomPadding = 60;
            const qrX = 1000 - qrSize - rightPadding;
            const qrY = 700 - qrSize - bottomPadding;

            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
            
            ctx.textAlign = "center";
            ctx.font = "bold 10px monospace";
            ctx.fillStyle = "#94a3b8";
            ctx.fillText("SCAN TO VERIFY", qrX + (qrSize / 2), qrY + qrSize + 15);
        } catch (err) {
            console.error("QR Code Error:", err);
        }


    };

    const downloadCertificate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = `CCDI_VisualDS_Certificate_${status.userName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
    };


    if (!status.eligible) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <LockClosedIcon className="w-64 h-64 text-slate-900" />
                    </div>
                    
                    <header className="mb-10 relative z-10">
                        <h1 className="text-4xl font-black text-slate-900 mb-2">Certification Roadmap</h1>
                        <p className="text-slate-500 font-medium text-lg">Complete all modules to unlock your official VisualDS certificate.</p>
                    </header>

                    <div className="grid gap-6 relative z-10">
                        <StatusCard 
                            title="Lessons" 
                            description="Finish all lecture modules and self-checks."
                            completed={status.lessons.completed}
                            total={status.lessons.total}
                            href="/lesson"
                        />
                        <StatusCard 
                            title="Simulators" 
                            description="Successfully solve every interactive challenge."
                            completed={status.simulators.completed}
                            total={status.simulators.total}
                            href="/simulator"
                        />
                        <StatusCard 
                            title="Assessments" 
                            description="Achieve a passing score (75%+) on all tests."
                            completed={status.assessments.passing}
                            total={status.assessments.total}
                            href="/assessment"
                        />
                    </div>

                    <footer className="mt-12 pt-10 border-t border-slate-100 flex flex-col items-center text-center">
                        <div className="bg-slate-50 rounded-2xl p-6 max-w-lg">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Once all items are marked as complete, you'll be able to generate and download a high-resolution certificate verifying your expertise in Data Structures and Algorithms.
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-6 flex flex-col items-center">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-black text-slate-900 mb-2">Congratulations!</h1>
                <p className="text-slate-500 font-medium">You've mastered the foundations of computer science. Here is your certificate.</p>
            </header>

            <div className="w-full bg-slate-900 p-8 rounded-[40px] shadow-2xl mb-10">
                <canvas 
                    ref={canvasRef} 
                    className="w-full h-auto rounded-lg shadow-lg bg-white"
                    style={{ aspectRatio: '1000 / 700' }}
                />
            </div>

            <button 
                onClick={downloadCertificate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
                Download Certificate (.png)
            </button>
        </div>
    );
}

function StatusCard({ title, description, completed, total, href }: { title: string, description: string, completed: number, total: number, href: string }) {
    const isDone = total > 0 && completed >= total;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <Link href={href} className="group block">
            <div className={`p-6 rounded-2xl border transition-all ${isDone ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {isDone ? <CheckCircleIcon className="w-6 h-6" /> : <div className="text-xs font-bold">{progress}%</div>}
                        </div>
                        <div>
                            <h3 className={`font-bold ${isDone ? 'text-emerald-900' : 'text-slate-800'}`}>{title}</h3>
                            <p className="text-xs text-slate-500 font-medium">{description}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-sm font-black ${isDone ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {completed} <span className="text-slate-300">/</span> {total}
                        </div>
                    </div>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ${isDone ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                        style={{ width: `${progress}%` }} 
                    />
                </div>
            </div>
        </Link>
    );
}
