'use client';

import { useEffect, useState } from "react";
import { ArrayElement, ArrayElementAnimationState } from "@/app/simulator/array-list/components/types";
import { createArrayElement, createArrayElements } from "@/app/simulator/array-list/components/utils";

import VisualArray from "@/app/simulator/array-list/components/VisualArray";
import ActionButton from "@/app/simulator/array-list/components/ActionButton";

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
    interval: 200,
    focus: 400,
  }

  // Helper function to get value or generate random
  const getValueOrRandom = (value: string): string => {
    if (!value || value.trim() === '') {
      return Math.floor(Math.random() * 100).toString();
    }
    return value;
  };

  useEffect(() => {
    const initial = createArrayElements(...["1", "2", "3", "4", "5"])
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

    // Limit to 20 elements on mobile (screen width < 768px), 50 on desktop
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const maxElements = isMobile ? 20 : 50;
    if (array.length >= maxElements) return;

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
    
    // Limit to 20 elements on mobile (screen width < 768px), 50 on desktop
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const maxElements = isMobile ? 20 : 50;
    if (array.length >= maxElements) return;
    
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

    if (array.length > 0 && index === array.length) {
      setIndex(current => current - 1);
    }

    return removed;
  }


  // set value at specific index
  const setAt = async (newValue: number | string, index: number) => {
    if (isAnimating) return;

    // TODO - validate idx
    if (index < 0 || index >= array.length) {
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

    setInputValue("");
    setIsAnimating(false);
  }


  //get item at specific idx
  const getAt = async (index: number): Promise<ArrayElement | undefined> => {
    if (isAnimating) return;

    // TODO - validate idx
    if (index < 0 || index >= array.length) {
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

  return (
    <div className="h-full bg-gray-50 overflow-hidden">
      <main className="flex flex-col lg:flex-row h-full max-w-7xl mx-auto bg-white">
        
        {/* Array display - Constrained height */}
        <div className="flex-1 lg:flex-[3] h-full overflow-hidden">
          <div className="flex items-center justify-center px-4 md:px-9 py-4 h-full">
            <VisualArray array={array} />
          </div>
        </div>

        {/* Controls section */}
        <div className="flex-1 lg:flex-[2] flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 h-full overflow-hidden">
          {/* Operation type selector */}
          <div className="flex border-b border-gray-200 flex-shrink-0">
            {[
              { type: OperationType.Insertion, label: 'Insertion', bgActive: 'bg-green-100' },
              { type: OperationType.Deletion, label: 'Deletion', bgActive: 'bg-red-100' },
              { type: OperationType.Others, label: 'Others', bgActive: 'bg-purple-100' },
            ].map(({ type, label, bgActive }) => (
              <button
                key={type}
                onClick={() => setOperationType(type)}
                className={`flex-1 py-2 text-center text-xs md:text-sm font-medium transition-colors duration-150 ease-in-out
                        ${operationType === type ? bgActive + ' text-gray-800' : 'bg-white hover:bg-gray-50 text-gray-600'}
                        focus:outline-none`}
                aria-pressed={operationType === type}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Input Fields and Info */}
          <div className="flex-1 p-2 md:p-4 flex flex-col gap-2 md:gap-3 overflow-y-auto min-h-0 max-h-full">
            {/* Input fields - improved mobile layout */}
            <div className="flex flex-col gap-2 md:gap-3 flex-shrink-0">
              <div className="flex gap-2 md:gap-3 items-center">
                <label className="text-xs md:text-sm font-medium text-gray-700 min-w-[40px] md:min-w-[50px]">Value:</label>
                <input
                  type="text"
                  className="bg-white border border-gray-200 rounded-lg text-center flex-1 text-sm md:text-lg py-1.5 md:py-2 focus:border-blue-300 focus:outline-none transition-colors"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value"
                />
              </div>
              <div className="flex gap-2 md:gap-3 items-center">
                <label className="text-xs md:text-sm font-medium text-gray-700 min-w-[40px] md:min-w-[50px]">Index:</label>
                <input
                  type="number"
                  className="bg-white border border-gray-200 rounded-lg text-center flex-1 text-sm md:text-lg py-1.5 md:py-2 focus:border-blue-300 focus:outline-none transition-colors"
                  value={index}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= array.length) {
                      setIndex(array.length > 0 ? array.length - 1 : 0);
                    } else {
                      setIndex(value);
                    }
                  }}
                  min={0}
                  max={array.length}
                  placeholder="Index"
                />
              </div>
            </div>

            {/* Array info - more useful information */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-2 md:p-3 rounded-lg flex-shrink-0">
              <div className="flex justify-between gap-1 text-xs md:text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Size:</span>
                  <span className="text-blue-600 font-bold">{array.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">First:</span>
                  <span className="text-green-600 font-bold truncate max-w-[60px]">
                    {array.length > 0 ? array[0].value : 'None'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Last:</span>
                  <span className="text-purple-600 font-bold truncate max-w-[60px]">
                    {array.length > 0 ? array[array.length - 1].value : 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons - more compact */}
            <div className="flex flex-col gap-2.5 md:gap-2 w-full flex-shrink-0">

              {/* INSERTION */}
              {operationType === OperationType.Insertion && (
                <>
                  <ActionButton 
                    text="Insert Front" 
                    bgColor="#2A9D8F"
                    shadowColor="#1F7A6B" 
                    onClick={() => insertFront(createArrayElement(getValueOrRandom(inputValue)))} 
                  />
                  <ActionButton 
                    text="Insert Back" 
                    bgColor="#2A9D8F"
                    shadowColor="#1F7A6B" 
                    onClick={() => insertBack(createArrayElement(getValueOrRandom(inputValue)))} 
                  />
                  <ActionButton 
                    text="Insert At" 
                    bgColor="#2A9D8F"
                    shadowColor="#1F7A6B" 
                    onClick={() => insertAt(createArrayElement(getValueOrRandom(inputValue)), index)} 
                  />
                </>
              )}

              {/* DELETION */}
              {operationType === OperationType.Deletion && (
                <>
                  <ActionButton 
                    text="Remove Front" 
                    bgColor="#C7573B"
                    shadowColor="#A0422E" 
                    onClick={() => removeFront()} 
                  />
                  <ActionButton 
                    text="Remove Back" 
                    bgColor="#C7573B"
                    shadowColor="#A0422E" 
                    onClick={() => removeBack()} 
                  />
                  <ActionButton 
                    text="Remove At" 
                    bgColor="#C7573B"
                    shadowColor="#A0422E" 
                    onClick={() => removeAt(index)} 
                  />
                </>
              )}

              {/* OTHERS */}
              {operationType === OperationType.Others && (
                <>
                  <ActionButton 
                    text="Set At" 
                    bgColor="#6C757D"
                    shadowColor="#495057" 
                    onClick={() => setAt(getValueOrRandom(inputValue), index)} 
                  />
                  <ActionButton 
                    text="Get At" 
                    bgColor="#6C757D"
                    shadowColor="#495057" 
                    onClick={() => getAt(Number(index))} 
                  />
                  <ActionButton 
                    text="Size" 
                    bgColor="#6C757D"
                    shadowColor="#495057" 
                    onClick={() => { }} 
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
