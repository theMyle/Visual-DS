'use client';

import { useEffect, useState } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Background,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    Position,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { TreeNode } from './types';
import TreeNodeComponent from './TreeNodeComponent';

interface VisualTreeProps {
    nodes: TreeNode[];
    rootId: string | null;
    onNodeClick?: (nodeId: string) => void;
}

const nodeTypes = {
    treeNode: TreeNodeComponent,
};

interface NodePosition {
    x: number;
    y: number;
}

const VisualTreeInner = ({ nodes, rootId, onNodeClick }: VisualTreeProps) => {
    const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Calculate positions recursively with dynamic spacing
    const calculatePositions = (
        nodeId: string | null,
        level: number,
        leftBound: number,
        rightBound: number,
        positions: Map<string, NodePosition>
    ): void => {
        if (!nodeId) return;

        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;

        // Position this node in the center of its bounds
        const x = (leftBound + rightBound) / 2;
        const y = level * 120; // Fixed vertical spacing

        positions.set(nodeId, { x, y });

        // Calculate spacing for children based on level
        // horizontalSpacing = 400 / (2^level)
        const spacing = 400 / Math.pow(2, level);
        const childSpacing = spacing / 2;

        // Position left child
        if (node.left) {
            calculatePositions(
                node.left,
                level + 1,
                leftBound,
                x,
                positions
            );
        }

        // Position right child
        if (node.right) {
            calculatePositions(
                node.right,
                level + 1,
                x,
                rightBound,
                positions
            );
        }
    };

    useEffect(() => {
        if (!rootId) {
            setReactFlowNodes([]);
            setEdges([]);
            return;
        }

        // Calculate positions for all nodes
        const positions = new Map<string, NodePosition>();
        calculatePositions(rootId, 0, -400, 400, positions);

        // Convert tree nodes to React Flow nodes
        const flowNodes: Node[] = nodes.map((node) => {
            const pos = positions.get(node.id) || { x: 0, y: 0 };
            const isLeaf = !node.left && !node.right;

            return {
                id: node.id,
                type: 'treeNode',
                position: pos,
                data: {
                    value: node.value,
                    animationState: node.animationState,
                    isRoot: node.id === rootId,
                    isLeaf: isLeaf,
                    onClick: () => onNodeClick?.(node.id),
                },
                sourcePosition: Position.Bottom,
                targetPosition: Position.Top,
                draggable: false,
            };
        });

        // Create edges from parent to children
        const flowEdges: Edge[] = [];
        nodes.forEach((node) => {
            if (node.left) {
                flowEdges.push({
                    id: `${node.id}-left`,
                    source: node.id,
                    sourceHandle: 'left',
                    target: node.left,
                    type: 'default',
                    animated: false,
                    style: { stroke: '#94A6FF', strokeWidth: 2 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#94A6FF',
                    },
                });
            }
            if (node.right) {
                flowEdges.push({
                    id: `${node.id}-right`,
                    source: node.id,
                    sourceHandle: 'right',
                    target: node.right,
                    type: 'default',
                    animated: false,
                    style: { stroke: '#94A6FF', strokeWidth: 2 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#94A6FF',
                    },
                });
            }
        });

        setReactFlowNodes(flowNodes);
        setEdges(flowEdges);
    }, [nodes, rootId, setReactFlowNodes, setEdges]);

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={reactFlowNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={(event, node) => onNodeClick?.(node.id)}
                nodeTypes={nodeTypes}
                defaultViewport={{ x: 400, y: 50, zoom: 0.8 }}
                fitView
                fitViewOptions={{ padding: 0.2, minZoom: 0.5, maxZoom: 1.5 }}
                attributionPosition="bottom-right"
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={true}
                panOnDrag={true}
                selectionOnDrag={false}
                zoomOnScroll={true}
                minZoom={0.3}
                maxZoom={2}
            >
                <Background />
            </ReactFlow>
        </div>
    );
};

const VisualTree = (props: VisualTreeProps) => {
    return (
        <ReactFlowProvider>
            <VisualTreeInner {...props} />
        </ReactFlowProvider>
    );
};

export default VisualTree;
