import "./ActionButton.css"

interface ActionButtonProps {
    text: string;
    bgColor: string; // Tailwind-compatible color (e.g. '#2A9D8F' or 'bg-teal-600')
    shadowColor: string; // Tailwind-compatible color for shadow
    onClick: () => void;
    disabled?: boolean;
    pressDepth?: number; // in px
    duration?: number; // in ms
}

export default function ActionButton({
    text, bgColor, shadowColor, onClick, disabled = false, pressDepth = 6, duration = 150 }: ActionButtonProps) {
    return (
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
    );
}
