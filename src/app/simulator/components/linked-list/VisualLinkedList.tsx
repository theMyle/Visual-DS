'use client';

import { useEffect, useState } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Background,
    Controls,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    Position,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { LinkedListNode } from './types';
import LinkedListNodeComponent from './LinkedListNodeComponent';

interface VisualLinkedListProps {
    nodes: LinkedListNode[];
    head: string | null;
}

const nodeTypes = {
    linkedListNode: LinkedListNodeComponent,
};

const VisualLinkedListInner = ({ nodes, head }: VisualLinkedListProps) => {
    const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isMobile, setIsMobile] = useState(false);

    // Detect viewport size for responsive spacing
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Zigzag layout - alternating top/bottom for better space usage
        const horizontalSpacing = isMobile ? 40 : 60;
        const verticalOffset = isMobile ? 70 : 100;

        // Build ordered array by following the linked list chain from head
        const orderedNodes: LinkedListNode[] = [];
        if (head) {
            let currentId: string | null = head;
            while (currentId) {
                const node = nodes.find(n => n.id === currentId);
                if (node) {
                    orderedNodes.push(node);
                    currentId = node.next;
                } else {
                    break;
                }
            }
        }

        // Convert linked list nodes to React Flow nodes with zigzag pattern
        // Use orderedNodes instead of nodes array to ensure correct positioning
        const flowNodes: Node[] = orderedNodes.map((node, index) => {
            const isBottom = index % 2 === 1;
            const x = index * horizontalSpacing;
            const y = isBottom ? verticalOffset : 0;

            return {
                id: node.id,
                type: 'linkedListNode',
                position: { x, y },
                data: {
                    value: node.value,
                    animationState: node.animationState,
                    isHead: node.id === head,
                    isTail: node.next === null,
                },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                draggable: false,
            };
        });

        // Create edges
        const flowEdges: Edge[] = [];
        orderedNodes.forEach((node) => {
            if (node.next) {
                flowEdges.push({
                    id: `${node.id}-${node.next}`,
                    source: node.id,
                    target: node.next,
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
    }, [nodes, head, isMobile, setReactFlowNodes, setEdges]);

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={reactFlowNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                defaultViewport={{ x: 0, y: 0, zoom: 0.55 }}
                fitView
                fitViewOptions={{ padding: 0.2, minZoom: 0.4, maxZoom: 1.1 }}
                attributionPosition="bottom-right"
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={true}
                selectionOnDrag={false}
                zoomOnScroll={true}
                minZoom={0.4}
                maxZoom={2}
            >
                <Background />
                <Controls showInteractive={false} />
            </ReactFlow>
        </div>
    );
};

const VisualLinkedList = (props: VisualLinkedListProps) => {
    return (
        <ReactFlowProvider>
            <VisualLinkedListInner {...props} />
        </ReactFlowProvider>
    );
};

export default VisualLinkedList;
