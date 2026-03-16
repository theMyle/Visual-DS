import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeAnimationState } from './types';

interface NodeData {
    value: string | number;
    animationState: NodeAnimationState;
    isHead: boolean;
    isTail: boolean;
}

const getNodeColor = (state: NodeAnimationState): string => {
    switch (state) {
        case NodeAnimationState.Default:
            return '#94A6FF';
        case NodeAnimationState.NewInserted:
            return '#4ADE80';
        case NodeAnimationState.BeingRemoved:
            return '#ef4444';
        case NodeAnimationState.Traversing:
            return '#7C3AED';
        case NodeAnimationState.HighlightedGreen:
            return '#10B981';
        case NodeAnimationState.HighlightedOrange:
            return '#FDBA74';
        default:
            return '#94A6FF';
    }
};

const getNodeScale = (state: NodeAnimationState): number => {
    switch (state) {
        case NodeAnimationState.Traversing:
            return 1.08;
        case NodeAnimationState.HighlightedGreen:
        case NodeAnimationState.HighlightedOrange:
            return 1.14;
        case NodeAnimationState.BeingRemoved:
            return 1.1;
        default:
            return 1;
    }
};

const LinkedListNodeComponent = ({ data }: { data: NodeData }) => {
    const color = getNodeColor(data.animationState);
    const scale = getNodeScale(data.animationState);
    const opacity = data.animationState === NodeAnimationState.BeingRemoved ? 0.5 : 1;

    return (
        <div className="relative">
            {/* Labels above node */}
            <div className="absolute -top-6 md:-top-7 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap">
                {data.isHead && <span className="text-blue-600">HEAD</span>}
                {data.isTail && !data.isHead && <span className="text-gray-600">TAIL</span>}
            </div>

            {/* Circular node - optimized for mobile */}
            <div
                className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-black text-sm md:text-base font-bold text-white transition-all duration-300"
                style={{
                    backgroundColor: color,
                    transform: `scale(${scale})`,
                    opacity: opacity,
                    transition: 'transform 220ms ease-in-out, background-color 220ms ease-in-out, opacity 220ms ease-in-out',
                }}
            >
                {data.value}
            </div>

            {/* Handles for connections */}
            <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
            {!data.isTail && <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />}
            {data.isTail && <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />}
        </div>
    );
};

export default memo(LinkedListNodeComponent);
