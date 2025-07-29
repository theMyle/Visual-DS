import { useState } from "react";
import VisualArray from "@/app/components/VisualArray";
import {ArrayElement} from "@/app/types/VisualArrayTypes";


export default function SimulationArray() {
    const [array, setArray] = useState<ArrayElement[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [insertIndex, setInsertIndex] = useState<number>(0);

    const createArrayElement = (
        value: string | number
    ): ArrayElement => {
        return { id: crypto.randomUUID(), value }
    };

    /* Layout
    * static nav on top
    * visualizer in the middle
    * control panel at the bottom
    * */

    // insertFront
    const insertFront = (value: ArrayElement) => {
        setArray(prev => [value, ...prev]);
    };

    // insertBack
    const insertBack = (value: ArrayElement) => {
        setArray(prev => [...prev, value]);
    }

    // insertAt
    const insertAt = (
        value: ArrayElement, index: number
    ) => {
        const original = [...array]
        const left = original.slice(0, index);
        const right = original.slice(index);
        const new_array = [...left, value, ...right];
        setArray(new_array);
    }

    // removeFront
    const removeFront = (): ArrayElement | undefined => {
        const new_array = [...array];
        const removed = new_array.shift();
        setArray(new_array);
        return removed;
    }

    // removeBack
    const removeBack = (): ArrayElement | undefined => {
        const new_array = [...array];
        const removed = new_array.pop();
        setArray(new_array);
        return removed;
    }


    // removeAt

    // set
    // get
    // length

    // sort??
    // find??

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 flex items-center justify-center bg-gray-100">
                <VisualArray array={array} />
            </div>
             <div className="p-4 bg-white border-t flex flex-col items-center gap-4">
                            <div className="flex gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700">Value</label>
                                    <input
                                        type="text"
                                        className="border px-2 py-1 rounded"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700">Index</label>
                                    <input
                                        type="number"
                                        className="border px-2 py-1 rounded w-20"
                                        value={insertIndex}
                                        onChange={(e) => setInsertIndex(Number(e.target.value))}
                                        min={0}
                                        max={array.length}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => insertFront(createArrayElement(inputValue))}
                                >
                                    Insert Front
                                </button>
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    onClick={() => insertBack(createArrayElement(inputValue))}
                                >
                                    Insert Back
                                </button>
                                <button
                                    className="bg-purple-500 text-white px-4 py-2 rounded"
                                    onClick={() => insertAt(createArrayElement(inputValue), insertIndex)}
                                    disabled={insertIndex < 0 || insertIndex > array.length}
                                >
                                    Insert At
                                </button>
                                <button onClick={() => removeFront()}
                                    className="bg-red-950 text-white px-4 py-2 rounded">
                                    Remove Front
                                </button>
                                <button onClick={() => removeBack()}
                                    className="bg-red-950 text-white px-4 py-2 rounded">
                                    Remove Back
                                </button>
                            </div>
                        </div>
                    </div>
                );
}
