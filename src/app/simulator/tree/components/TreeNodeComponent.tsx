import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { TreeNodeAnimationState } from './types';

interface NodeData {
    value: string | number;
    animationState: TreeNodeAnimationState;
    isRoot: boolean;
    isLeaf: boolean;
}

const getNodeColor = (state: TreeNodeAnimationState): string => {
    switch (state) {
        case TreeNodeAnimationState.Default:
            return '#94A6FF';
        case TreeNodeAnimationState.NewInserted:
            return '#4ADE80';
        case TreeNodeAnimationState.BeingRemoved:
            return '#ef4444';
        case TreeNodeAnimationState.Visiting:
            return '#FBBF24'; // Yellow
        case TreeNodeAnimationState.Visited:
            return '#93C5FD'; // Light blue
        case TreeNodeAnimationState.HighlightedGreen:
            return '#10B981';
        case TreeNodeAnimationState.HighlightedOrange:
            return '#FDBA74';
        default:
            return '#94A6FF';
    }
};

const getNodeScale = (state: TreeNodeAnimationState): number => {
    switch (state) {
        case TreeNodeAnimationState.Visiting:
            return 1.1;
        case TreeNodeAnimationState.HighlightedGreen:
        case TreeNodeAnimationState.HighlightedOrange:
            return 1.3;
        case TreeNodeAnimationState.BeingRemoved:
            return 1.2;
        default:
            return 1;
    }
};

const TreeNodeComponent = ({ data }: { data: NodeData }) => {
    const color = getNodeColor(data.animationState);
    const scale = getNodeScale(data.animationState);
    const opacity = data.animationState === TreeNodeAnimationState.BeingRemoved ? 0.5 : 1;

    return (
        <div className="relative">
            {/* Label above node */}
            <div className="absolute -top-6 md:-top-7 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap">
                {data.isRoot && <span className="text-blue-600">ROOT</span>}
            </div>

            {/* Circular node */}
            <div
                className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-black text-sm md:text-base font-bold text-white transition-all duration-300"
                style={{
                    backgroundColor: color,
                    transform: `scale(${scale})`,
                    opacity: opacity,
                }}
            >
                {data.value}
            </div>

            {/* Handles for connections - top for parent, bottom left/right for children */}
            <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
            {!data.isLeaf && (
                <>
                    <Handle type="source" position={Position.Bottom} id="left" style={{ left: '25%', opacity: 0 }} />
                    <Handle type="source" position={Position.Bottom} id="right" style={{ left: '75%', opacity: 0 }} />
                </>
            )}
        </div>
    );
};

export default memo(TreeNodeComponent);
