'use client';

import {useEffect, useState} from "react";
import {ArrayElement, ArrayElementAnimationState} from "@/app/components/visual-array/types";
import {createArrayElement, createArrayElements} from "@/app/components/visual-array/utils";
import VisualArray from "@/app/components/visual-array/VisualArray";
import { invisibleValues } from "framer-motion";

export default function SimulationArray() {
    const [array, setArray] = useState<ArrayElement[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [insertIndex, setInsertIndex] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const delay = {
      interval: 350,
      focus: 600,
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


    // Insert item at start of the array
    // shifting all elements to the right first to create space
    // showing the process of resizing
    const insertFront = async (value: ArrayElement) => {
        if (isAnimating) return;
        setIsAnimating(true);

        // create "empty" space at the end
        const invisible = createArrayElement("", ArrayElementAnimationState.Invisible);
        invisible.value = value.value

        let newArray = [...array, invisible];

        setArray(newArray);
        await sleep(600);

        // move the invisible space across the list
        // from end to the front
        // then insert the actual value
        for (let i = newArray.length - 1; i >= 1; i--) {
            const temp = [...newArray];
            temp[i] = temp[i-1];
            temp[i-1] = invisible;
            setArray(temp);
            await sleep(delay.interval);
            newArray = [...temp];
        }

        // show the invisible item
        invisible.animationState = ArrayElementAnimationState.Default
        setArray([...newArray]);
        setIsAnimating(false)
    };


    // Insert at end
    const insertBack = async (value: ArrayElement) => {
        if (isAnimating) return;
        if (array.length == 0) {
          insertFront(value);
          return;
        }
        setArray([...array, value])
    }


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
        invisible.animationState = ArrayElementAnimationState.Invisible;

        // allocate space
        let newArray = [...array, invisible];
        setArray(newArray);
        sleep(delay.focus);

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
        invisible.animationState = ArrayElementAnimationState.Default;
        setArray([...newArray]);
        setIsAnimating(false);
    }


    // remove item from the front
    // shift the rest of the items forward
    //
    // *PUTA*
    // *PUTA*
    const removeFront = async (): Promise<ArrayElement | undefined> => {
        // make the front invisible but keep space
        // show shifting of items
        // once invisible item is at the end, remove it

        if (isAnimating) return;
        setIsAnimating(true);

        let newArray = [...array]
        const invisible = newArray[0];

        // animate removal
        invisible.animationState = ArrayElementAnimationState.RemovedInvisible;
        setArray(newArray);
        await sleep(delay.focus);

        invisible.animationState = ArrayElementAnimationState.Invisible;

        // loop until invisible is at the last index then remove
        for (let i = 1; i < newArray.length; i++) {
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


    // remove last item
    const removeBack = (): ArrayElement | undefined => {
        const new_array = [...array];
        const removed = new_array.pop();
        setArray(new_array);
        return removed;
    }


    // removeAt
    const removeAt = async (index: number) => {
      // TODO
    }


    // set value at specific index
    const setAt = (newValue: number | string, index: number) => {
        if (isAnimating) return;
        // TODO - validate idx

        const newArray = [...array];
        newArray[index].value = newValue;
        setArray(newArray);
    }
    

    //get item at specific idx
    const getAt = (i: number): ArrayElement | undefined => {
        if (!isAnimating) return;
        // TODO - validate idx
        
        return array[i];
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
