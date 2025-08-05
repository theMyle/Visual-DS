'use client';

import {useEffect, useState} from "react";
import {ArrayElement, ArrayElementAnimationState} from "@/app/components/visual-array/types";
import {createArrayElement, createArrayElements} from "@/app/components/visual-array/utils";
import VisualArray from "@/app/components/visual-array/VisualArray";

export default function SimulationArray() {
    const [array, setArray] = useState<ArrayElement[]>([]);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const [inputValue, setInputValue] = useState<string>("");
    const [insertIndex, setInsertIndex] = useState<number>(0);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const delay = {
      interval: 350,
      focus: 750,
    }

    useEffect(() => {
        const initial = createArrayElements(..."helloworld".split(""))
        setArray(initial);
    },[]);

    // INSERT OPERATIONS
    // TODO - Add fucking insert animation like green green or some shit
    // [/] - Insert Front 
    // [/] - Insert Back 
    // [/] - Insert At     
    //
    // REMOVAL OPERATIONS
    // [/] - Remove Front
    // [/] - Remove Back
    // [ ] - Remove At      | Not yet implemented
    //
    // UPDATE OPERATIONS
    // [/] - Set
    //
    // PROPERTIES
    // [/] - Size
    // [/] - At
    // [/] - Get


    // Insert an item at a specific index
    // by creating an empty space at the end
    // and sliding all elements starting from the target 
    // index to the end 
    const insertAt = async (value: ArrayElement, index: number) => {
        if (isAnimating) return;

        // prolly need to add check if index is invalid
        // better checking needed + frontend information feedback
        if (index < 0 || index > array.length) {
          console.log(`Invalid Index: {Array Size: array[${array.length}], target_index: [${index}]}`);
          return;
        }

        setIsAnimating(true);

        const invisible = value;
        value.animationState = ArrayElementAnimationState.Invisible;

        // allocate space
        let newArray = [...array, invisible];

        setArray([...newArray]);
        await sleep(delay.interval);

        // move the invisible item to the desired index
        for (let i = newArray.length-1; i > index; i--) {
           const temp = [...newArray];
           temp[i] = temp[i-1];
           temp[i-1] = invisible;
           setArray(temp);
           await sleep(delay.interval);
           newArray = temp;
        };

        // show/insert the new item into the array
        invisible.animationState = ArrayElementAnimationState.NewInserted;
        setArray([...newArray]);

        await sleep(delay.focus + 200);

        invisible.animationState = ArrayElementAnimationState.Default;
        setArray(prev => [...prev]);

        setIsAnimating(false);
    }


    // Insert item at start of the array
    const insertFront = async (value: ArrayElement) => {
        insertAt(value, 0);
    };


    // Insert at the end of the array 
    const insertBack = async (value: ArrayElement) => {
        if (isAnimating) return;
        if (array.length == 0) {
          insertFront(value);
          return;
        }
        setArray([...array, value])
    }


    // remove item at specific index
    // shift the rest of the items forward / to the left
    //
    // *PUTA*
    // *PUTA*
    const removeAt = async (index: number) => {
        // make the front invisible but keep space
        // show shifting of items
        // once invisible item is at the end, remove it

        if (isAnimating) return;
        if (array.length === 0 || index < 0 || index > array.length - 1) return;
        setIsAnimating(true);

        let newArray = [...array]
        const invisible = newArray[index];

        // animate removal
        invisible.animationState = ArrayElementAnimationState.RemovedInvisible;
        setArray(newArray);
        await sleep(delay.focus);

        invisible.animationState = ArrayElementAnimationState.Invisible;

        for (let i = index + 1; i < newArray.length; i++) {
            const temp = [...newArray];
            temp[i-1] = temp[i];
            temp[i] = invisible;
            setArray(temp);
            await sleep(delay.interval);
            newArray = [...temp];
        }

        // remove the shit
        setArray(prev => prev.slice(0,-1));
        setIsAnimating(false);
        return invisible;
    }


    // remove item from the front
    const removeFront = async () => {
        removeAt(0);
    }


    // remove last item
    const removeBack = (): ArrayElement | undefined => {
        if (isAnimating) return;
        const new_array = [...array];
        const removed = new_array.pop();
        setArray(new_array);
        return removed;
    }


    // set value at specific index
    const setAt = async (newValue: number | string, index: number) => {
        if (isAnimating) return;
        // TODO - validate idx
        
        setIsAnimating(true);

        // highlight current first
        // sleep
        // chage value
        // sleep
        // go back
        const newArray = [...array];

        newArray[index].animationState = ArrayElementAnimationState.HighlightedOrange;
        setArray(newArray);
        await sleep(delay.focus + 100);

        newArray[index].value = newValue;
        setArray([...newArray]);
        await sleep(delay.focus);

        newArray[index].animationState = ArrayElementAnimationState.Default;
        setArray([...newArray]);

        setIsAnimating(false);
    }
    

    //get item at specific idx
    const getAt = async (index: number): Promise<ArrayElement | undefined> => {
        if (isAnimating) return;
        // TODO - validate idx
        
        setIsAnimating(true);

        let newArray = [...array];

        newArray[index].animationState = ArrayElementAnimationState.HighlightedGreen;
        setArray([...newArray]);

        await sleep(delay.focus + 200);

        newArray[index].animationState = ArrayElementAnimationState.Default;
        setArray([...newArray]);

        setIsAnimating(false);

        return newArray[index];
    }
    

    // return array length
    const getLength = (): number | undefined => {
        if (isAnimating) return;
        return array.length;
    }

    // sort??
    // find??
    // BIG MAYBE BUT RN NAH

    /* Layout / UI
    * static nav on top
    * visualizer in the middle
    * control panel at the bottom
    *
    * [ ] TODO - The fucking buttons my dude
    * [ ] TODO - IDK the fucking layout as well
    * [ ] TODO - the fun buttons animation
    *
    * */

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center bg-gray-100 px-9 py-4">
                <VisualArray array={array} />
            </div>
            <div className="flex-1 p-4 bg-white border-t flex flex-col items-center gap-4">
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
                <div className="flex gap-4 flex-wrap">

                    {/* INSERTION */}

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

                    {/* DELETION */}

                    <button onClick={() => removeFront()}
                            className="bg-red-950 text-white px-4 py-2 rounded">
                        Remove Front
                    </button>
                    <button onClick={() => removeBack()}
                            className="bg-red-950 text-white px-4 py-2 rounded">
                        Remove Back
                    </button>
                    <button onClick={() => removeAt(insertIndex)}
                            className="bg-red-950 text-white px-4 py-2 rounded">
                        Remove At 
                    </button>

                    {/* OTHERS */}
                    <button onClick={() => setAt(inputValue, insertIndex)}
                            className="bg-orange-400 text-white px-4 py-2 rounded">
                        Set
                    </button>
                    <button onClick={() => getAt(insertIndex)}
                            className="bg-red-950 text-white px-4 py-2 rounded">
                        At
                    </button>
                    <button onClick={() => getLength()}
                            className="bg-red-950 text-white px-4 py-2 rounded">
                        Size
                    </button>

                </div>
            </div>
        </div>
    );
}
