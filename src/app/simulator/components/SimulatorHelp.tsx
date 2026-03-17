'use client';

import { useState } from 'react';
import './SimulatorHelp.css';

export interface HelpSlide {
    title: string;
    description: string;
    items?: { label: string; detail: string; badge?: string }[];
}

interface SimulatorHelpProps {
    slides: HelpSlide[];
    onClose: () => void;
}

export default function SimulatorHelp({ slides, onClose }: SimulatorHelpProps) {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent(i => Math.max(0, i - 1));
    const next = () => setCurrent(i => Math.min(slides.length - 1, i + 1));

    const slide = slides[current];
    const isFirst = current === 0;
    const isLast = current === slides.length - 1;

    return (
        <div className="sim-help-overlay" onClick={onClose}>
            <div className="sim-help-modal" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="sim-help-header">
                    <span className="sim-help-label">How to Use</span>
                    <button className="sim-help-close" onClick={onClose} aria-label="Close help">✕</button>
                </div>

                {/* Slide body */}
                <div className="sim-help-body">
                    <h3 className="sim-help-title">{slide.title}</h3>
                    <p className="sim-help-description">{slide.description}</p>

                    {slide.items && (
                        <ul className="sim-help-items">
                            {slide.items.map((item, i) => (
                                <li key={i} className="sim-help-item">
                                    <div className="sim-help-item-top">
                                        <span className="sim-help-item-label">{item.label}</span>
                                        {item.badge && <span className="sim-help-item-badge">{item.badge}</span>}
                                    </div>
                                    <span className="sim-help-item-detail">{item.detail}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer: prev / dots / next */}
                <div className="sim-help-footer">
                    <button className="sim-help-nav" onClick={prev} disabled={isFirst} aria-label="Previous">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="sim-help-nav-icon">
                            <path d="M15 6l-6 6 6 6" />
                        </svg>
                    </button>

                    <div className="sim-help-dots">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                className={`sim-help-dot${i === current ? ' active' : ''}`}
                                onClick={() => setCurrent(i)}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    <button className="sim-help-nav" onClick={next} disabled={isLast} aria-label="Next">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="sim-help-nav-icon">
                            <path d="M9 6l6 6-6 6" />
                        </svg>
                    </button>
                </div>

            </div>
        </div>
    );
}
