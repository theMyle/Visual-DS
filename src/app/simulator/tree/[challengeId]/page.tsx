"use client";

import { useEffect, useRef, useState } from "react";
import { TreeNode, TreeNodeAnimationState } from "@/app/simulator/components/tree/types";
import { createNode } from "@/app/simulator/components/tree/utils";
import ChallengeInstructions from "@/app/simulator/components/ChallengeInstructions";
import ChallengeCompletedModal from "@/app/simulator/components/ChallengeCompletedModal";
import CodeEditorPanel from "@/app/simulator/components/CodeEditorPanel";
import VisualTree from "@/app/simulator/components/tree/VisualTree";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { syncSimulatorProgress } from "../../../lib/simulatorProgress";
import { fetchSimulatorChallenge, SimulatorChallengeDTO } from "@/app/lib/simulators";
import { ChallengeConfig, createChallengeRunner, ChallengeRunner, DEFAULT_RUNNER_PARAMETER_NAMES } from "../challenges/runner";
import SimulatorError from "../../components/SimulatorError";

type ChallengeResultSummary = {
    name: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean | null;
    statusText: string;
};

type TreeNodeHandle = {
    id: string;
    value: () => string | number | undefined;
    setValue: (value: string | number) => Promise<void>;
    left: () => TreeNodeHandle | null;
    setLeft: (left: TreeNodeHandle | null) => TreeNodeHandle;
    right: () => TreeNodeHandle | null;
    setRight: (right: TreeNodeHandle | null) => TreeNodeHandle;
};

type TreeData = {
    nodes: TreeNode[];
    rootId: string | null;
};

export default function SimulationTreeChallenge() {
    const params = useParams<{ challengeId: string }>();
    const challengeId = params?.challengeId;
    const [challenge, setChallenge] = useState<SimulatorChallengeDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!challengeId) return;
        
        setLoading(true);
        fetchSimulatorChallenge("tree", challengeId)
            .then(setChallenge)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [challengeId]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-slate-500">Loading challenge...</p>
                </div>
            </div>
        );
    }

    if (error || !challenge) {
        return (
            <SimulatorError 
                title={error ? "Failed to Load Challenge" : "Challenge Not Found"}
                message={error || "The requested challenge could not be found."}
                onRetry={() => window.location.reload()}
            />
        );
    }

    // Map DTO to ChallengeConfig format expected by core component
    const config: ChallengeConfig = {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        initialEditorCode: challenge.initial_code,
        programStructure: challenge.program_structure,
        testCases: challenge.test_cases,
        maxCapacity: challenge.capacity,
    };

    return <SimulationTreeCore challenge={config} challengeId={challengeId} nextChallengeSlug={challenge.next_challenge_slug} />;
}

function SimulationTreeCore({ challenge, challengeId, nextChallengeSlug }: { challenge: ChallengeConfig, challengeId: string, nextChallengeSlug?: string }) {
    const router = useRouter();
    const { isLoaded, isSignedIn, userId, getToken } = useAuth();
    const searchParams = useSearchParams();
    const nextPath = searchParams.get("next");
    
    const inferredNextPath = nextChallengeSlug 
        ? `/simulator/tree/${nextChallengeSlug}`
        : "/simulator";

    const runnerParameterNames = challenge.programStructure?.parameterNames
        ?? challenge.runnerParameterNames
        ?? DEFAULT_RUNNER_PARAMETER_NAMES;

    const dsParam = runnerParameterNames[0] || 'tree';
    const firstCase = challenge.testCases[0];
    const initialInputs = firstCase?.inputs
        ? firstCase.inputs
        : (firstCase?.input && !Array.isArray(firstCase.input) && typeof firstCase.input === 'object')
            ? (firstCase.input as Record<string, any>)
            : { [dsParam]: firstCase?.input ?? [] };

    const initialEditorCode = challenge.initialEditorCode;

    const syncChallengeResult = async (passed: boolean) => {
        try {
            await syncSimulatorProgress({
                category: "tree",
                path: `/simulator/tree/${challengeId}`,
                isCompleted: passed,
                isLoaded,
                isSignedIn,
                userId,
                getToken,
            });
        } catch (error) {
            console.error("Failed to sync simulator progress", error);
        }
    };

    const handleChallengeCompleted = () => {
        void syncChallengeResult(true);
    };

    const [trees, setTrees] = useState<Record<string, TreeData>>({});
    const [editorCode, setEditorCode] = useState<string>(initialEditorCode);
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [resultSummaries, setResultSummaries] = useState<ChallengeResultSummary[] | null>(null);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [isChallengeCompletedModalOpen, setIsChallengeCompletedModalOpen] = useState<boolean>(false);
    const [showNextAction, setShowNextAction] = useState<boolean>(false);
    const [leftPaneWidth, setLeftPaneWidth] = useState<number>(50);
    const [isResizing, setIsResizing] = useState<boolean>(false);

    const workspaceRef = useRef<HTMLDivElement | null>(null);
    const treesRef = useRef<Record<string, TreeData>>({});
    const nodeActionQueueRef = useRef(Promise.resolve());
    const consoleWriteQueueRef = useRef(Promise.resolve());
    const leftPointerShadowRef = useRef<Map<string, string | null>>(new Map());
    const rightPointerShadowRef = useRef<Map<string, string | null>>(new Map());
    const valueShadowRef = useRef<Map<string, string | number>>(new Map());
    const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    // Responsive max depth
    const [maxDepth, setMaxDepth] = useState<number>(challenge.maxCapacity.desktop === 15 ? 4 : 4);

    useEffect(() => {
        const handleResize = () => {
            setMaxDepth(window.innerWidth <= 768 ? 3 : 4); // Match visual tree responsive bounds
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const cloneNodes = (list: TreeNode[]) => list.map((node) => ({ ...node }));

    // Recompute levels for nodes starting from root
    const recomputeLevels = (nodes: TreeNode[], rootId: string | null) => {
        if (!rootId) return;

        const queue: { id: string, level: number }[] = [{ id: rootId, level: 0 }];
        const visited = new Set<string>();

        while (queue.length > 0) {
            const { id, level } = queue.shift()!;
            if (visited.has(id)) continue;
            visited.add(id);

            const node = nodes.find(n => n.id === id);
            if (node) {
                node.level = level;
                if (node.left) queue.push({ id: node.left, level: level + 1 });
                if (node.right) queue.push({ id: node.right, level: level + 1 });
            }
        }
    };

    const commitTrees = (nextTrees: Record<string, TreeData>) => {
        treesRef.current = nextTrees;
        setTrees(nextTrees);
    };

    const commitTree = (treeName: string, nextNodes: TreeNode[], forceRoot?: string | null) => {
        const cloned = cloneNodes(nextNodes);
        let nextRoot = forceRoot;

        if (nextRoot === undefined) {
            nextRoot = treesRef.current[treeName]?.rootId ?? null;
        }

        recomputeLevels(cloned, nextRoot);

        const newTreeData: TreeData = {
            nodes: cloned,
            rootId: nextRoot ?? null,
        };

        commitTrees({ ...treesRef.current, [treeName]: newTreeData });
    };

    const enqueueNodeAction = <T,>(action: () => Promise<T>): Promise<T> => {
        const next = nodeActionQueueRef.current.then(action, action);
        nodeActionQueueRef.current = next.then(() => undefined, () => undefined);
        return next;
    };

    const updateNodeAnimationState = (treeName: string, nodeId: string, animationState: TreeNodeAnimationState) => {
        const currentData = treesRef.current[treeName];
        if (!currentData) return;

        const nextNodes = cloneNodes(currentData.nodes);
        const target = nextNodes.find((node) => node.id === nodeId);
        if (!target) return;

        target.animationState = animationState;
        commitTree(treeName, nextNodes, currentData.rootId);
    };

    const writeToConsole = (message: unknown) => {
        const nextWrite = consoleWriteQueueRef.current.then(async () => {
            const resolvedMessage = await Promise.resolve(message);
            const nextLine =
                typeof resolvedMessage === "string"
                    ? resolvedMessage
                    : resolvedMessage instanceof Error
                        ? resolvedMessage.message
                        : String(resolvedMessage);
            setConsoleOutput((prev) => [...prev, nextLine]);
        });

        consoleWriteQueueRef.current = nextWrite.then(() => undefined, () => undefined);
        return nextWrite;
    };

    const createNodeHandle = (treeName: string, nodeId: string | null): TreeNodeHandle | null => {
        if (!nodeId) return null;

        const self: TreeNodeHandle = {
            id: nodeId,
            value: () => {
                const shadowValue = valueShadowRef.current.get(nodeId);
                const currentData = treesRef.current[treeName];
                const currentValue = shadowValue !== undefined
                    ? shadowValue
                    : currentData?.nodes.find((node) => node.id === nodeId)?.value;

                enqueueNodeAction(async () => {
                    updateNodeAnimationState(treeName, nodeId, TreeNodeAnimationState.HighlightedGreen);
                    await new Promise((resolve) => setTimeout(resolve, 220));
                    updateNodeAnimationState(treeName, nodeId, TreeNodeAnimationState.Default);
                });

                return currentValue;
            },
            setValue: (value) => {
                valueShadowRef.current.set(nodeId, value);

                return enqueueNodeAction(async () => {
                    const currentData = treesRef.current[treeName];
                    if (!currentData) return;

                    const nextNodes = cloneNodes(currentData.nodes);
                    const target = nextNodes.find((node) => node.id === nodeId);
                    if (!target) return;

                    updateNodeAnimationState(treeName, nodeId, TreeNodeAnimationState.HighlightedOrange);
                    await sleep(180);

                    target.value = value;
                    commitTree(treeName, nextNodes, currentData.rootId);

                    const shadowValue = valueShadowRef.current.get(nodeId);
                    if (shadowValue === value) {
                        valueShadowRef.current.delete(nodeId);
                    }

                    await sleep(120);

                    updateNodeAnimationState(treeName, nodeId, TreeNodeAnimationState.Default);
                });
            },
            left: () => {
                const shadowLeft = leftPointerShadowRef.current.get(nodeId);
                const currentData = treesRef.current[treeName];
                const resolvedLeftId = shadowLeft !== undefined
                    ? shadowLeft
                    : (currentData?.nodes.find((node) => node.id === nodeId)?.left ?? null);

                const nextHandle = createNodeHandle(treeName, resolvedLeftId);

                enqueueNodeAction(async () => {
                    updateNodeAnimationState(treeName, nodeId, TreeNodeAnimationState.Visiting);
                    await sleep(180);
                    updateNodeAnimationState(treeName, nodeId, TreeNodeAnimationState.Default);
                });

                return nextHandle;
            },
            setLeft: (left) => {
                const nextId = left ? left.id : null;
                leftPointerShadowRef.current.set(nodeId, nextId);

                void enqueueNodeAction(async () => {
                    const currentData = treesRef.current[treeName];
                    if (!currentData) return;

                    const nextNodes = cloneNodes(currentData.nodes);
                    const target = nextNodes.find((node) => node.id === nodeId);
                    if (!target) return;

                    // Capacity limit check
                    if (target.level >= maxDepth) {
                        writeToConsole(`ERROR: Maximum depth of ${maxDepth} reached. Cannot insert left child.`);
                        return;
                    }

                    target.animationState = TreeNodeAnimationState.HighlightedOrange;
                    commitTree(treeName, nextNodes, currentData.rootId);
                    await sleep(140);

                    target.left = nextId;
                    commitTree(treeName, nextNodes, currentData.rootId);

                    const shadowLeft = leftPointerShadowRef.current.get(nodeId);
                    if (shadowLeft === nextId) {
                        leftPointerShadowRef.current.delete(nodeId);
                    }

                    await sleep(100);

                    target.animationState = TreeNodeAnimationState.Default;
                    commitTree(treeName, nextNodes, currentData.rootId);
                });

                return self;
            },
            right: () => {
                const shadowRight = rightPointerShadowRef.current.get(nodeId);
                const currentData = treesRef.current[treeName];
                const resolvedRightId = shadowRight !== undefined
                    ? shadowRight
                    : (currentData?.nodes.find((node) => node.id === nodeId)?.right ?? null);

                const nextHandle = createNodeHandle(treeName, resolvedRightId);

                enqueueNodeAction(async () => {
                    updateNodeAnimationState(treeName, nodeId, TreeNodeAnimationState.Visiting);
                    await sleep(180);
                    updateNodeAnimationState(treeName, nodeId, TreeNodeAnimationState.Default);
                });

                return nextHandle;
            },
            setRight: (right) => {
                const nextId = right ? right.id : null;
                rightPointerShadowRef.current.set(nodeId, nextId);

                void enqueueNodeAction(async () => {
                    const currentData = treesRef.current[treeName];
                    if (!currentData) return;

                    const nextNodes = cloneNodes(currentData.nodes);
                    const target = nextNodes.find((node) => node.id === nodeId);
                    if (!target) return;

                    // Capacity limit check
                    if (target.level >= maxDepth) {
                        writeToConsole(`ERROR: Maximum depth of ${maxDepth} reached. Cannot insert right child.`);
                        return;
                    }

                    target.animationState = TreeNodeAnimationState.HighlightedOrange;
                    commitTree(treeName, nextNodes, currentData.rootId);
                    await sleep(140);

                    target.right = nextId;
                    commitTree(treeName, nextNodes, currentData.rootId);

                    const shadowRight = rightPointerShadowRef.current.get(nodeId);
                    if (shadowRight === nextId) {
                        rightPointerShadowRef.current.delete(nodeId);
                    }

                    await sleep(100);

                    target.animationState = TreeNodeAnimationState.Default;
                    commitTree(treeName, nextNodes, currentData.rootId);
                });

                return self;
            },
        };

        return self;
    };

    const createChallengeApi = (treeName: string) => ({
        root: () => {
            const currentData = treesRef.current[treeName];
            const handle = createNodeHandle(treeName, currentData?.rootId ?? null);
            if (!handle) return null;

            enqueueNodeAction(async () => {
                updateNodeAnimationState(treeName, handle.id, TreeNodeAnimationState.HighlightedGreen);
                await sleep(180);
                updateNodeAnimationState(treeName, handle.id, TreeNodeAnimationState.Default);
            });

            return handle;
        },
        setRoot: (nextRoot: TreeNodeHandle | null) => {
            return enqueueNodeAction(async () => {
                const currentData = treesRef.current[treeName];
                if (!currentData) return;

                const nextNodes = cloneNodes(currentData.nodes);
                const nextRootId = nextRoot?.id ?? null;

                if (nextRootId) {
                    const target = nextNodes.find((node) => node.id === nextRootId);
                    if (target) {
                        target.animationState = TreeNodeAnimationState.HighlightedOrange;
                        commitTree(treeName, nextNodes, currentData.rootId);
                        await sleep(140);
                    }
                }

                commitTree(treeName, nextNodes, nextRootId);

                if (nextRootId) {
                    const target = nextNodes.find((node) => node.id === nextRootId);
                    if (target) {
                        target.animationState = TreeNodeAnimationState.Default;
                        commitTree(treeName, nextNodes, nextRootId);
                    }
                }
            });
        },
        size: () => {
            const currentData = treesRef.current[treeName];
            return currentData?.nodes.length || 0;
        },
        newNode: (value: string | number) => {
            const newNode = createNode(value);
            const currentData = treesRef.current[treeName];
            if (!currentData) return null;

            const nextNodes = cloneNodes(currentData.nodes);

            if (!nextNodes.some((node) => node.id === newNode.id)) {
                newNode.animationState = TreeNodeAnimationState.NewInserted;
                nextNodes.push(newNode);
                commitTree(treeName, nextNodes, currentData.rootId);

                void enqueueNodeAction(async () => {
                    await sleep(220);
                    const settledData = treesRef.current[treeName];
                    const settledNodes = cloneNodes(settledData.nodes);
                    const target = settledNodes.find((node) => node.id === newNode.id);
                    if (!target) return;

                    target.animationState = TreeNodeAnimationState.Default;
                    commitTree(treeName, settledNodes, settledData.rootId);
                });
            }

            return createNodeHandle(treeName, newNode.id);
        },
    });

    const levelOrderSerialize = (listName: string) => {
        const out: (string | number | null)[] = [];
        const currentData = treesRef.current[listName];
        if (!currentData || !currentData.rootId) return out;

        const queue: (string | null)[] = [currentData.rootId];

        while (queue.length > 0) {
            // Check if queue has any non-null nodes
            if (queue.every(n => n === null)) break;

            const currentId = queue.shift()!;
            if (currentId === null) {
                out.push(null);
                queue.push(null, null);
                continue;
            }

            const current = currentData.nodes.find((node) => node.id === currentId);
            if (!current) {
                out.push(null);
                queue.push(null, null);
                continue;
            }

            out.push(current.value);
            queue.push(current.left, current.right);
        }

        // Trim trailing nulls
        while (out.length > 0 && out[out.length - 1] === null) {
            out.pop();
        }

        return out;
    };

    // Helper to generate tree from level-order array
    const createTreeNodesFromArray = (arr: (string | number | null)[]) => {
        if (!arr || arr.length === 0 || arr[0] === null) return { nodes: [], rootId: null };

        const nodes: TreeNode[] = [];
        const root = createNode(arr[0]!);
        nodes.push(root);

        const queue: TreeNode[] = [root];
        let i = 1;

        while (queue.length > 0 && i < arr.length) {
            const current = queue.shift()!;

            if (i < arr.length && arr[i] !== null) {
                const leftNode = createNode(arr[i]!);
                current.left = leftNode.id;
                nodes.push(leftNode);
                queue.push(leftNode);
            }
            i++;

            if (i < arr.length && arr[i] !== null) {
                const rightNode = createNode(arr[i]!);
                current.right = rightNode.id;
                nodes.push(rightNode);
                queue.push(rightNode);
            }
            i++;
        }

        recomputeLevels(nodes, root.id);

        return { nodes, rootId: root.id };
    };

    useEffect(() => {
        const initialTrees: Record<string, TreeData> = {};
        for (const [key, value] of Object.entries(initialInputs)) {
            if (Array.isArray(value)) {
                const { nodes, rootId } = createTreeNodesFromArray(value);
                initialTrees[key] = { nodes, rootId };
            }
        }
        commitTrees(initialTrees);
    }, []);

    useEffect(() => {
        if (!isResizing) return;

        const onMouseMove = (event: MouseEvent) => {
            if (!workspaceRef.current) return;

            const bounds = workspaceRef.current.getBoundingClientRect();
            const nextPercent = ((event.clientX - bounds.left) / bounds.width) * 100;
            const clampedPercent = Math.max(45, Math.min(60, nextPercent));
            setLeftPaneWidth(clampedPercent);
        };

        const onMouseUp = () => setIsResizing(false);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [isResizing]);

    const formatArray = (items: (string | number | null)[]) => `[${items.map(i => i === null ? 'null' : i).join(", ")}]`;

    const formatOutput = (out: unknown) => {
        if (out === undefined) return "undefined";
        if (out === null) return "null";
        if (Array.isArray(out)) return formatArray(out);
        if (typeof out === 'object' && out !== null) {
            const entries = Object.entries(out);
            if (entries.length === 1 && Array.isArray(entries[0][1])) {
                return formatArray(entries[0][1]);
            }
            return entries.map(([k, v]) => `${k}: ${Array.isArray(v) ? formatArray(v as any) : String(v)}`).join(" | ");
        }
        return String(out);
    }

    const normalizeComparableValue = (value: unknown): unknown => {
        if (
            value !== null &&
            typeof value === 'object' &&
            !Array.isArray(value)
        ) {
            const entries = Object.entries(value as Record<string, unknown>);
            if (entries.length === 1) {
                return normalizeComparableValue(entries[0][1]);
            }
        }

        return value;
    };

    const valuesEqual = (left: unknown, right: unknown): boolean => {
        const normalizedLeft = normalizeComparableValue(left);
        const normalizedRight = normalizeComparableValue(right);

        if (Array.isArray(normalizedLeft) && Array.isArray(normalizedRight)) {
            if (normalizedLeft.length !== normalizedRight.length) {
                return false;
            }

            for (let i = 0; i < normalizedLeft.length; i++) {
                if (!valuesEqual(normalizedLeft[i], normalizedRight[i])) {
                    return false;
                }
            }

            return true;
        }

        if (
            typeof normalizedLeft === 'object' &&
            typeof normalizedRight === 'object' &&
            normalizedLeft !== null &&
            normalizedRight !== null
        ) {
            const leftKeys = Object.keys(normalizedLeft as Record<string, unknown>);
            const rightKeys = Object.keys(normalizedRight as Record<string, unknown>);
            if (leftKeys.length !== rightKeys.length) return false;

            for (const key of leftKeys) {
                if (!valuesEqual(
                    (normalizedLeft as Record<string, unknown>)[key],
                    (normalizedRight as Record<string, unknown>)[key],
                )) {
                    return false;
                }
            }

            return true;
        }

        return String(normalizedLeft) === String(normalizedRight);
    };

    const outputsEqual = (left: any, right: any) => valuesEqual(left, right);

    const createCaseSummary = (
        caseIndex: number,
        inputs: any,
        expected: any,
        actual: any,
        caseName?: string,
        expectedReturn?: string | number,
        actualReturn?: unknown,
    ): ChallengeResultSummary => {
        if (expectedReturn !== undefined) {
            const passed = actualReturn === expectedReturn;
            return {
                name: caseName || `Test Case ${caseIndex + 1}`,
                input: formatOutput(inputs),
                expected: formatOutput(expectedReturn),
                actual: formatOutput(actualReturn),
                passed,
                statusText: passed
                    ? "PASS: Returned value matches expected."
                    : "FAIL: Returned value does not match expected.",
            };
        }

        const normalizedExpected = expected ?? [];
        const passed = outputsEqual(actual, normalizedExpected);
        return {
            name: caseName || `Test Case ${caseIndex + 1}`,
            input: formatOutput(inputs),
            expected: formatOutput(normalizedExpected),
            actual: formatOutput(actual),
            passed,
            statusText: passed
                ? "PASS: Challenge output matches expected."
                : "FAIL: Challenge output does not match expected.",
        };
    };

    const createHeadlessChallengeApi = (seedInputs: Record<string, any>) => {
        type HeadlessNode = { id: string; value: string | number; left: string | null; right: string | null; };

        const apis: Record<string, any> = {};
        const getValuesMap: Record<string, () => any> = {};

        for (const [name, value] of Object.entries(seedInputs)) {
            if (!Array.isArray(value)) {
                apis[name] = value;
                getValuesMap[name] = () => value;
                continue;
            }

            const seedArr = value;
            const store = new Map<string, HeadlessNode>();
            let rootId: string | null = null;
            let idCounter = 0;

            const makeId = () => `${name}-n-${idCounter++}`;

            // Setup initial tree from level order
            if (seedArr && seedArr.length > 0 && seedArr[0] !== null) {
                rootId = makeId();
                store.set(rootId, { id: rootId, value: seedArr[0], left: null, right: null });

                const queue = [rootId];
                let i = 1;
                while (queue.length > 0 && i < seedArr.length) {
                    const currentId = queue.shift()!;
                    const current = store.get(currentId)!;

                    if (i < seedArr.length && seedArr[i] !== null) {
                        const leftId = makeId();
                        store.set(leftId, { id: leftId, value: seedArr[i]!, left: null, right: null });
                        current.left = leftId;
                        queue.push(leftId);
                    }
                    i++;

                    if (i < seedArr.length && seedArr[i] !== null) {
                        const rightId = makeId();
                        store.set(rightId, { id: rightId, value: seedArr[i]!, left: null, right: null });
                        current.right = rightId;
                        queue.push(rightId);
                    }
                    i++;
                }
            }

            const serialize = () => {
                const out: (string | number | null)[] = [];
                if (!rootId) return out;

                const queue: (string | null)[] = [rootId];
                while (queue.length > 0) {
                    if (queue.every(n => n === null)) break;

                    const currentId = queue.shift()!;
                    if (currentId === null) {
                        out.push(null);
                        queue.push(null, null);
                        continue;
                    }

                    const current = store.get(currentId);
                    if (!current) {
                        out.push(null);
                        queue.push(null, null);
                        continue;
                    }

                    out.push(current.value);
                    queue.push(current.left, current.right);
                }

                while (out.length > 0 && out[out.length - 1] === null) {
                    out.pop();
                }

                return out;
            };

            const createHandle = (nodeId: string | null): TreeNodeHandle | null => {
                if (!nodeId) return null;
                if (!store.has(nodeId)) return null;

                return {
                    id: nodeId,
                    value: () => store.get(nodeId)?.value,
                    setValue: async (value) => {
                        const target = store.get(nodeId);
                        if (!target) return;
                        target.value = value;
                    },
                    left: () => createHandle(store.get(nodeId)?.left ?? null),
                    setLeft: (left) => {
                        const target = store.get(nodeId);
                        if (!target) return createHandle(nodeId)!;
                        target.left = left?.id ?? null;
                        return createHandle(nodeId)!;
                    },
                    right: () => createHandle(store.get(nodeId)?.right ?? null),
                    setRight: (right) => {
                        const target = store.get(nodeId);
                        if (!target) return createHandle(nodeId)!;
                        target.right = right?.id ?? null;
                        return createHandle(nodeId)!;
                    },
                };
            };

            apis[name] = {
                root: () => createHandle(rootId),
                setRoot: async (nextRoot: TreeNodeHandle | null) => {
                    rootId = nextRoot?.id ?? null;
                },
                size: () => store.size, // Approximate
                newNode: (value: string | number) => {
                    const id = makeId();
                    store.set(id, { id, value, left: null, right: null });
                    return createHandle(id);
                },
            };

            getValuesMap[name] = serialize;
        }

        return {
            apis,
            getValues: () => {
                const res: Record<string, any> = {};
                for (const [name, fn] of Object.entries(getValuesMap)) {
                    const val = fn();
                    if (Array.isArray(val)) {
                        res[name] = val;
                    }
                }
                return res;
            },
        };
    };


    const buildRunnerArgs = (runtimeContext: Record<string, unknown>) => {
        return runnerParameterNames.map((parameterName) => runtimeContext[parameterName]);
    };

    const runBackgroundTestCases = async (code: string): Promise<ChallengeResultSummary[]> => {
        const additionalCases = challenge.testCases.slice(1);
        if (additionalCases.length === 0) return [];

        let runner: ChallengeRunner;
        try {
            runner = createChallengeRunner(code, runnerParameterNames);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Syntax Error";
            return additionalCases.map((testCase, i) => ({
                name: testCase.name || `Test Case ${i + 2}`,
                input: formatOutput(testCase.inputs ?? testCase.input ?? []),
                expected: testCase.expectedReturn !== undefined
                    ? formatOutput(testCase.expectedReturn)
                    : formatOutput(testCase.expected ?? []),
                actual: "Syntax Error",
                passed: false,
                statusText: `FAIL: ${message}`,
            }));
        }

        const summaries: ChallengeResultSummary[] = [];

        for (let i = 0; i < additionalCases.length; i++) {
            const testCase = additionalCases[i];
            const caseIndex = i + 1;
            const caseInputs = testCase.inputs
                ? testCase.inputs
                : (testCase.input && !Array.isArray(testCase.input) && typeof testCase.input === 'object')
                    ? (testCase.input as Record<string, any>)
                    : { [dsParam]: testCase.input ?? [] };
            const { apis, getValues } = createHeadlessChallengeApi(caseInputs);
            const silentIo = {
                println: (_message: unknown) => { },
            };

            const context: Record<string, unknown> = { io: silentIo };
            for (const [name, api] of Object.entries(apis)) {
                context[name] = api;
            }

            try {
                const result = runner(...buildRunnerArgs(context));
                let resolvedResult: unknown = result;
                if (result instanceof Promise) {
                    resolvedResult = await result;
                }

                summaries.push(
                    createCaseSummary(
                        caseIndex,
                        testCase.inputs ?? testCase.input ?? [],
                        testCase.expected,
                        getValues(),
                        testCase.name || `Test Case ${caseIndex + 1}`,
                        testCase.expectedReturn,
                        resolvedResult,
                    ),
                );
            } catch {
                summaries.push({
                    name: testCase.name || `Test Case ${caseIndex + 1}`,
                    input: formatOutput(testCase.inputs ?? testCase.input ?? []),
                    expected: testCase.expectedReturn !== undefined
                        ? formatOutput(testCase.expectedReturn)
                        : formatOutput(testCase.expected ?? []),
                    actual: "Execution Error",
                    passed: false,
                    statusText: "FAIL: Runtime error while evaluating this test case.",
                });
            }
        }

        return summaries;
    };

    const submitEditorCode = async () => {
        try {
            setConsoleOutput([]);
            setResultSummaries(null);
            setIsCompleted(false);
            setIsChallengeCompletedModalOpen(false);
            setShowNextAction(false);
            nodeActionQueueRef.current = Promise.resolve();
            consoleWriteQueueRef.current = Promise.resolve();
            leftPointerShadowRef.current.clear();
            rightPointerShadowRef.current.clear();
            valueShadowRef.current.clear();

            const runner = createChallengeRunner(editorCode, runnerParameterNames);
            const context: Record<string, unknown> = { io: { println: writeToConsole } };
            const treeNames = Object.keys(initialInputs);
            for (const [name, value] of Object.entries(initialInputs)) {
                if (Array.isArray(value)) {
                    context[name] = createChallengeApi(name);
                } else {
                    context[name] = value;
                }
            }

            const result = runner(...buildRunnerArgs(context));
            let resolvedResult: unknown = result;
            if (result instanceof Promise) {
                resolvedResult = await result;
            }

            await nodeActionQueueRef.current;
            await consoleWriteQueueRef.current;
            await sleep(1000);

            const finalValues: Record<string, any> = {};
            for (const [name, value] of Object.entries(initialInputs)) {
                if (Array.isArray(value)) {
                    finalValues[name] = levelOrderSerialize(name);
                }
            }

            const primaryCase = challenge.testCases[0];

            if (!primaryCase) {
                setResultSummaries([
                    {
                        name: "Test Case 1",
                        input: "-",
                        expected: "-",
                        actual: formatOutput(finalValues),
                        passed: null,
                        statusText: "No test case configured",
                    },
                ]);
                return;
            }

            const primarySummary = createCaseSummary(
                0,
                primaryCase.inputs ?? primaryCase.input ?? [],
                primaryCase.expected,
                finalValues,
                primaryCase.name || "Test Case 1",
                primaryCase.expectedReturn,
                resolvedResult,
            );

            setResultSummaries([primarySummary]);

            void runBackgroundTestCases(editorCode).then((backgroundSummaries) => {
                const nextResults = [primarySummary, ...backgroundSummaries];

                if (backgroundSummaries.length === 0) {
                    if (nextResults.every((summary) => summary.passed === true)) {
                        setIsCompleted(true);
                        setShowNextAction(true);
                        handleChallengeCompleted();
                        setIsChallengeCompletedModalOpen(true);
                    }
                    return;
                }

                setResultSummaries(nextResults);

                if (nextResults.every((summary) => summary.passed === true)) {
                    setIsCompleted(true);
                    setShowNextAction(true);
                    handleChallengeCompleted();
                    setIsChallengeCompletedModalOpen(true);
                }
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown editor execution error";
            const line = getSimulatorErrorLine(error);
            setShowNextAction(false);
            writeToConsole(`ERROR${line ? ` (Line ${line})` : ""}: ${message}`);
            writeToConsole("NOTICE: Execution stopped. Press Reset to restore a clean state.");
        }
    };

    const handleChallengeNext = () => {
        setIsChallengeCompletedModalOpen(false);
        router.push(nextPath || inferredNextPath || "/simulator");
    };

    const handleChallengeMenu = () => {
        setIsChallengeCompletedModalOpen(false);
        router.push("/simulator");
    };

    const getSimulatorErrorLine = (error: unknown): number | null => {
        if (!(error instanceof Error) || !error.stack) return null;
        const match = error.stack.match(/simulator-solution\.js:(\d+)/) || 
                      error.stack.match(/<anonymous>:(\d+):(\d+)/) || 
                      error.stack.match(/Function:(\d+):(\d+)/);
        if (match) {
            const line = parseInt(match[1], 10);
            return Math.max(1, line - 2);
        }
        return null;
    };

    const resetEditorCode = () => {
        setEditorCode(initialEditorCode);
        setIsCompleted(false);
        setIsChallengeCompletedModalOpen(false);
        setShowNextAction(false);
        setResultSummaries(null);
        writeToConsole("Code editor reset to starter template.");
    };

    const resetStructureState = () => {
        const initialTrees: Record<string, TreeData> = {};
        for (const [key, value] of Object.entries(initialInputs)) {
            if (Array.isArray(value)) {
                const { nodes, rootId } = createTreeNodesFromArray(value);
                initialTrees[key] = { nodes, rootId };
            }
        }
        commitTrees(initialTrees);
        setIsCompleted(false);
        setConsoleOutput([]);
        setResultSummaries(null);
    };

    // Calculate height, nodes count, leaves
    const getStats = (treeName: string) => {
        const data = trees[treeName];
        if (!data || !data.rootId) return { height: 0, count: 0, leaves: 0 };

        let maxHeight = 0;
        let count = 0;
        let leaves = 0;

        const queue = [{ id: data.rootId, h: 1 }];
        const visited = new Set();

        while (queue.length > 0) {
            const { id, h } = queue.shift()!;
            if (visited.has(id)) continue;
            visited.add(id);

            const node = data.nodes.find(n => n.id === id);
            if (!node) continue;

            count++;
            if (h > maxHeight) maxHeight = h;
            if (!node.left && !node.right) leaves++;

            if (node.left) queue.push({ id: node.left, h: h + 1 });
            if (node.right) queue.push({ id: node.right, h: h + 1 });
        }

        return { height: maxHeight, count, leaves };
    };

    const numTrees = Object.keys(trees).length;

    return (
        <div className="h-full bg-gray-50 overflow-hidden">
            <ChallengeCompletedModal
                isOpen={isChallengeCompletedModalOpen}
                onClose={() => setIsChallengeCompletedModalOpen(false)}
                onMenu={handleChallengeMenu}
                onNext={handleChallengeNext}
                testCaseLabels={challenge.testCases.map((_, index) => `Test Case ${index + 1}`)}
            />

            <main
                ref={workspaceRef}
                className={`flex flex-col lg:grid h-full max-w-[1500px] mx-auto bg-white ${isResizing ? "select-none" : ""}`}
                style={{ gridTemplateColumns: `${leftPaneWidth}fr 10px ${100 - leftPaneWidth}fr` }}
            >
                {/* Tree display */}
                <div className="flex flex-col h-[40vh] lg:h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200">
                    <ChallengeInstructions
                        title={challenge.title}
                        description={challenge.description}
                        completed={isCompleted}
                    />

                    <div className={`flex-1 overflow-hidden relative flex ${numTrees > 1 ? 'flex-col' : 'flex-col'}`}>
                        {Object.entries(trees).map(([name, treeData]) => {
                            return (
                                <div key={name} className="flex-1 flex flex-col border-b border-gray-100 last:border-b-0 min-h-0">
                                    {numTrees > 1 && (
                                        <div className="text-sm font-semibold text-gray-500 pt-2 pb-1 bg-gray-50 w-full text-center border-b border-gray-200 shadow-sm">
                                            {name}
                                        </div>
                                    )}
                                    <div className="flex-1 relative w-full h-full min-h-0 overflow-hidden">
                                        <VisualTree nodes={treeData.nodes} rootId={treeData.rootId} onNodeClick={() => { }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div
                    className="hidden lg:flex items-center justify-center cursor-col-resize bg-gray-200 hover:bg-blue-200 transition-colors"
                    onMouseDown={() => setIsResizing(true)}
                    role="separator"
                    aria-orientation="vertical"
                    aria-label="Resize panels"
                >
                    <div className="h-14 w-1 rounded bg-gray-500" />
                </div>

                <CodeEditorPanel
                    code={editorCode}
                    output={consoleOutput}
                    resultSummaries={resultSummaries}
                    onCodeChange={setEditorCode}
                    onReset={resetEditorCode}
                    onResetArray={resetStructureState}
                    onSubmit={submitEditorCode}
                    onNext={handleChallengeNext}
                    showNextButton={showNextAction}
                    resetDisabled={false}
                    resetArrayDisabled={false}
                    submitDisabled={false}
                    nextDisabled={false}
                />
            </main>
        </div>
    );
}
