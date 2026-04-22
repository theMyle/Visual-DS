'use client';

import { useState } from 'react';
import './ActionButton.css';

export interface OperationInfo {
    title: string;
    description: string;
    timeComplexity: string;
    spaceComplexity?: string;
}

interface ActionButtonProps {
    text: string;
    bgColor: string;
    shadowColor: string;
    onClick: () => void;
    disabled?: boolean;
    pressDepth?: number;
    duration?: number;
    info?: OperationInfo;
}

export default function ActionButton({
    text, bgColor, shadowColor, onClick, disabled = false, pressDepth = 6, duration = 150, info }: ActionButtonProps) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="action-button-wrapper">
            <button
                className="action-button"
                onClick={onClick}
                disabled={disabled}
                style={{
                    '--bg-color': bgColor,
                    '--shadow-color': shadowColor,
                    '--press-depth': `${pressDepth}px`,
                    '--duration': `${duration}ms`
                } as React.CSSProperties}
            >
                {text}
            </button>

            {info && (
                <button
                    className="action-info-button"
                    onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                    aria-label={`Learn about ${text}`}
                >
                    ⓘ
                </button>
            )}

            {showModal && info && (
                <div className="action-info-overlay" onClick={() => setShowModal(false)}>
                    <div className="action-info-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="action-info-modal-header">
                            <h3>{info.title}</h3>
                            <button className="action-info-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <p className="action-info-description">{info.description}</p>
                        <div className="action-info-complexities">
                            <div className="action-info-complexity">
                                <span className="action-info-complexity-label">Time Complexity:</span>
                                <span className="action-info-complexity-value">{info.timeComplexity}</span>
                            </div>
                            {info.spaceComplexity && (
                                <div className="action-info-complexity">
                                    <span className="action-info-complexity-label">Space:</span>
                                    <span className="action-info-complexity-value">{info.spaceComplexity}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
