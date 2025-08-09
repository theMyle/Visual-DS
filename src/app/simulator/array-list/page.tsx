'use client';

import { useEffect, useState } from "react";
import { ArrayElement, ArrayElementAnimationState } from "@/app/components/visual-array/types";
import { createArrayElement, createArrayElements } from "@/app/components/visual-array/utils";
import VisualArray from "@/app/components/visual-array/VisualArray";

enum OperationType {
  Insertion,
  Deletion,
  Others,
};

export default function SimulationArray() {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState<string>("");
  const [index, setIndex] = useState<number>(0);

  const [operationType, setOperationType] = useState<OperationType>(OperationType.Insertion);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const delay = {
    interval: 350,
    focus: 750,
  }

  useEffect(() => {
    const initial = createArrayElements(..."helloworld".split(""))
    setArray(initial);
  }, []);

  // TODO
  // clear inputs when button is pressed

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
    for (let i = newArray.length - 1; i > index; i--) {
      const temp = [...newArray];
      temp[i] = temp[i - 1];
      temp[i - 1] = invisible;
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
      temp[i - 1] = temp[i];
      temp[i] = invisible;
      setArray(temp);
      await sleep(delay.interval);
      newArray = [...temp];
    }

    // remove the shit
    setArray(prev => prev.slice(0, -1));
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
    if (index < 0 || index > array.length) {
      console.log(`Invalid Index: {Array Size: array[${array.length}], target_index: [${index}]}`);
      return;
    }

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
    if (index < 0 || index > array.length) {
      console.log(`Invalid Index: {Array Size: array[${array.length}], target_index: [${index}]}`);
      return;
    }

    setIsAnimating(true);

    const newArray = [...array];

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
      <div className="flex-2 flex items-center justify-center bg-gray-100 px-9 py-4">
        <VisualArray array={array} />
      </div>

      {/* Types of operation options */}

      <div className="grid grid-cols-3 w-full border-t-[1.8px] border-b-[1.8px] border-gray-200">
        <button
          onClick={() => { setOperationType(OperationType.Insertion) }}
          className="active:bg-green-100 transition-all duration-150 ease-in-out">Insertion</button>
        <button
          onClick={() => { setOperationType(OperationType.Deletion) }}
          className="active:bg-red-100 transition-all duration-150 ease-in-out">Deletion</button>
        <button
          onClick={() => { setOperationType(OperationType.Others) }}
          className="active:bg-gray-100 transition-all duration-150 ease-in-out">Others</button>
      </div>



      <div className="flex-1 p-4 flex flex-col gap-4">

        {/* Input Fields */}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Value</label>
            <input
              type="number"
              className="bg-gray-200 rounded-md text-center w-full text-xl"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Index</label>
            <input
              type="number"
              className="bg-gray-200 rounded-md text-center w-full text-xl"
              value={index}
              onChange={(e) => setIndex(Number(e.target.value))}
              min={0}
              max={array.length}
            />
          </div>
        </div>

        {/* Buttons and stuff */}

        <div className="grid grid-cols-2 gap-4 w-full md:grid-cols-3">

          {/* INSERTION */}

          {operationType == OperationType.Insertion && (
            <>
              <button
                className="bg-[#2A9D8F] border-b-4 border-[#18635A] text-white px-4 py-2 rounded-xl active:border-0 active:translate-y-1 transition-all duration-150 ease-in-out"
                onClick={() => insertFront(createArrayElement(inputValue))}
              >
                Insert Front
              </button>
              <button
                className="bg-[#2A9D8F] border-b-4 border-[#18635A] text-white px-4 py-2 rounded-xl active:border-0 active:translate-y-1 transition-all duration-150 ease-in-out"
                onClick={() => insertBack(createArrayElement(inputValue))}
              >
                Insert Back
              </button>
              <button
                className="bg-[#2A9D8F] border-b-4 border-[#18635A] text-white px-4 py-2 rounded-xl active:border-0 active:translate-y-1 transition-all duration-150 ease-in-out"
                onClick={() => insertAt(createArrayElement(inputValue), Number(index))}
                disabled={Number(index) < 0 || Number(index) > array.length}
              >
                Insert At
              </button>
            </>
          )}

          {/* DELETION */}

          {operationType == OperationType.Deletion && (
            <>
              <button onClick={() => removeFront()}
                className="bg-[#C7573B] border-b-4 border-[#8E3E2A] text-white px-4 py-2 rounded-xl active:border-0 active:translate-y-1 transition-all duration-150 ease-in-out">
                Remove Front
              </button>
              <button onClick={() => removeBack()}
                className="bg-[#C7573B] border-b-4 border-[#8E3E2A] text-white px-4 py-2 rounded-xl active:border-0 active:translate-y-1 transition-all duration-150 ease-in-out">
                Remove Back
              </button>
              <button onClick={() => removeAt(Number(index))}
                className="bg-[#C7573B] border-b-4 border-[#8E3E2A] text-white px-4 py-2 rounded-xl active:border-0 active:translate-y-1 transition-all duration-150 ease-in-out">
                Remove At
              </button>
            </>
          )}

          {/* OTHERS */}

          {operationType == OperationType.Others && (
            <>
              <button onClick={() => setAt(inputValue, Number(index))}
                className="bg-[#6C757D] border-b-4 border-[#48525C] text-white px-4 py-2 rounded-xl active:border-0 active:translate-y-1 transition-all duration-150 ease-in-out">
                Set At
              </button>
              <button onClick={() => getAt(Number(index))}
                className="bg-[#6C757D] border-b-4 border-[#48525C] text-white px-4 py-2 rounded-xl active:border-0 active:translate-y-1 transition-all duration-150 ease-in-out">
                Get At
              </button>
              <button onClick={() => getLength()}
                className="bg-[#6C757D] border-b-4 border-[#48525C] text-white px-4 py-2 rounded-xl active:border-0 active:translate-y-1 transition-all duration-150 ease-in-out">
                Size
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
