'use client';

import { useEffect, useState } from "react";
import { ArrayElement, ArrayElementAnimationState } from "@/app/simulator/array-list/components/types";
import { createArrayElement, createArrayElements } from "@/app/simulator/array-list/components/utils";

import VisualArray from "@/app/simulator/array-list/components/VisualArray";
import ActionButton from "@/app/simulator/array-list/components/ActionButton";
import SimulatorHelp, { HelpSlide } from "@/app/simulator/components/SimulatorHelp";

enum OperationType {
  Insertion,
  Deletion,
  Others,
  Algorithms,
};

export default function SimulationArray() {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState<string>("");
  const [index, setIndex] = useState<number>(0);

  const [operationType, setOperationType] = useState<OperationType>(OperationType.Insertion);
  const [showHelp, setShowHelp] = useState<boolean>(true);

  const helpSlides: HelpSlide[] = [
    {
      title: 'Array Simulator',
      description: 'Interact with an array data structure in real time. Watch elements shift, swap, and sort as you trigger operations step by step.',
      items: [
        { label: 'Visual Array', detail: 'Each box is one element. Colour highlights show which element is being accessed, compared, or moved.' },
        { label: 'Controls Panel', detail: 'Pick a category tab on the right, fill in inputs if needed, then press a button to run the animation.' },
      ],
    },
    {
      title: 'Input Fields',
      description: 'Two fields let you control the value and index used by array operations.',
      items: [
        { label: 'Value', detail: 'The number to insert, search for, or set. Leave it blank and a random value (0–99) will be used.' },
        { label: 'Index', detail: 'Zero-based position for index-specific operations: Insert At, Remove At, Set At, and Get At.' },
      ],
    },
    {
      title: 'Operation Tabs',
      description: 'Select a tab to switch operation categories. Each tab reveals a set of buttons under the Input Fields.',
      items: [
        { label: 'Insertion', detail: 'Add elements at the front, back, or a specific index.' },
        { label: 'Deletion', detail: 'Remove elements from the front, back, or a specific index.' },
        { label: 'Others', detail: 'Directly read or overwrite a value at a given index.' },
        { label: 'Algorithms', detail: 'Run sorting and searching algorithms step by step on the current array.' },
      ],
    },
  ];

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const delay = {
    interval: 150,
    focus: 150,
    scan: 50, // Faster scanning for selection sort (lower = faster)
  }

  // Helper function to get value or generate random
  const getValueOrRandom = (value: string): string => {
    if (!value || value.trim() === '') {
      return Math.floor(Math.random() * 100).toString();
    }
    return value;
  };

  // Helper function to check if array is sorted
  const isArraySorted = (): boolean => {
    if (array.length <= 1) return true;

    for (let i = 0; i < array.length - 1; i++) {
      if (Number(array[i].value) > Number(array[i + 1].value)) {
        return false;
      }
    }
    return true;
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

    const maxElements = 20;
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

    const maxElements = 20;
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
    await sleep(delay.focus + 300);

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

  // Selection Sort Algorithm
  const selectionSort = async () => {
    if (isAnimating) return;

    if (array.length <= 1) {
      alert("List is sorted!\n\nTotal Steps: 0\nTotal Cycles: 0");
      return;
    }

    setIsAnimating(true);

    const newArray = [...array];
    const n = newArray.length;
    let stepCount = 0;
    let cycleCount = 0;

    for (let i = 0; i < n - 1; i++) {
      cycleCount++;
      let minIndex = i;

      // Highlight current position (start of unsorted portion)
      newArray[i].animationState = ArrayElementAnimationState.Comparing;
      setArray([...newArray]);
      await sleep(delay.interval);

      // Find minimum element in the remaining unsorted array
      for (let j = i + 1; j < n; j++) {
        stepCount++;
        // Highlight element being compared
        newArray[j].animationState = ArrayElementAnimationState.Comparing;
        setArray([...newArray]);
        await sleep(delay.scan); // Use faster scan delay

        // Compare values (convert to numbers for proper comparison)
        if (Number(newArray[j].value) < Number(newArray[minIndex].value)) {
          // Reset previous minimum element to default
          if (minIndex !== i) {
            newArray[minIndex].animationState = ArrayElementAnimationState.Default;
          }
          // Update minimum index and highlight new minimum
          minIndex = j;
          newArray[minIndex].animationState = ArrayElementAnimationState.MinElement;
        } else {
          // Reset compared element to default
          newArray[j].animationState = ArrayElementAnimationState.Default;
        }
        setArray([...newArray]);
        await sleep(delay.scan); // Use faster scan delay for this too
      }

      // Swap the found minimum element with the first element of unsorted portion
      if (minIndex !== i) {
        // Highlight both elements that will be swapped
        newArray[i].animationState = ArrayElementAnimationState.MinElement;
        newArray[minIndex].animationState = ArrayElementAnimationState.MinElement;
        setArray([...newArray]);
        await sleep(delay.focus);

        // Perform the swap - Framer Motion will handle the position animation
        const tempElement = newArray[i];
        newArray[i] = newArray[minIndex];
        newArray[minIndex] = tempElement;
        stepCount++;
        setArray([...newArray]);
        await sleep(delay.focus);
      }

      // Mark current position as sorted
      newArray[i].animationState = ArrayElementAnimationState.Sorted;
      // Reset the other element if it was highlighted
      if (minIndex !== i) {
        newArray[minIndex].animationState = ArrayElementAnimationState.Default;
      }
      setArray([...newArray]);
      await sleep(delay.interval);
    }

    // Mark last element as sorted
    if (n > 0) {
      newArray[n - 1].animationState = ArrayElementAnimationState.Sorted;
      setArray([...newArray]);
      await sleep(delay.focus);
    }

    alert(`List is sorted!\n\nTotal Steps: ${stepCount}\nTotal Cycles: ${cycleCount}`);

    // Reset all to default after a pause
    setTimeout(() => {
      const resetArray = newArray.map(element => ({
        ...element,
        animationState: ArrayElementAnimationState.Default
      }));
      setArray(resetArray);
      setIsAnimating(false);
    }, 1500);
  };

  // Linear Search Algorithm
  const linearSearch = async (target: number) => {
    if (isAnimating) return;

    if (inputValue === "") {
      alert("Please enter a value to search");
      return;
    }

    setIsAnimating(true);
    const newArray = [...array];
    let found = false;
    let foundIndex = -1;

    // Search through array sequentially
    for (let i = 0; i < newArray.length; i++) {
      // Highlight current element being checked
      newArray[i].animationState = ArrayElementAnimationState.Comparing;
      setArray([...newArray]);
      await sleep(delay.focus + 100);

      const currentValue = Number(newArray[i].value);

      if (currentValue === target) {
        // Found the target!
        newArray[i].animationState = ArrayElementAnimationState.HighlightedGreen;
        setArray([...newArray]);
        found = true;
        foundIndex = i;
        await sleep(500)
        alert(`✓ Search Successful!\n\nValue: ${target}\nIndex: ${foundIndex}\nTotal Cycles: ${i + 1}`);
        break;
      } else {
        // Not found, mark as checked and continue
        newArray[i].animationState = ArrayElementAnimationState.MinElement;
        setArray([...newArray]);
        await sleep(delay.scan);
      }
    }

    if (!found) {
      await sleep(500)
      alert(`✗ Item Not In List\n\nValue: ${target}\nTotal Cycles: ${newArray.length}`);
    }

    // Reset all to default after showing result
    setTimeout(() => {
      const resetArray = newArray.map(element => ({
        ...element,
        animationState: ArrayElementAnimationState.Default
      }));
      setArray(resetArray);
      setIsAnimating(false);
    }, 500);
  };

  // Binary Search Algorithm
  const binarySearch = async (target: number) => {
    if (isAnimating) return;

    if (inputValue === "") {
      alert("Please enter a value to search")
      return
    }

    // Check if array is sorted first
    if (!isArraySorted()) {
      // Show visual feedback that array is not sorted
      // const newArray = [...array];

      alert('Array must be sorted before performing binary search!');
      return;
    }

    setIsAnimating(true);
    const newArray = [...array];
    let left = 0;
    let right = newArray.length - 1;
    let found = false;
    let cycles = 0;

    while (left <= right && !found) {
      cycles++;
      // Highlight search range in orange
      for (let i = left; i <= right; i++) {
        newArray[i].animationState = ArrayElementAnimationState.HighlightedOrange;
      }
      setArray([...newArray]);
      await sleep(delay.focus); // Slower timing

      // Calculate and highlight middle element in blue (Comparing state)
      const mid = Math.floor((left + right) / 2);

      // Keep range in orange, highlight middle in blue for distinction
      newArray[mid].animationState = ArrayElementAnimationState.Comparing;
      setArray([...newArray]);
      await sleep(delay.focus + 500); // Even slower for middle element

      const midValue = Number(newArray[mid].value);

      if (midValue === target) {
        // Found the target! Reset all others to default and highlight only the found element
        for (let i = 0; i < newArray.length; i++) {
          if (i === mid) {
            newArray[i].animationState = ArrayElementAnimationState.HighlightedGreen;
          } else {
            newArray[i].animationState = ArrayElementAnimationState.Default;
          }
        }
        setArray([...newArray]);
        found = true;
        await sleep(600)
        alert(`✓ Search Successful!\n\nValue: ${target}\nIndex: ${mid}\nTotal Cycles: ${cycles}`);

      } else if (midValue < target) {
        // Target is in right half - show direction with brief red highlight
        newArray[mid].animationState = ArrayElementAnimationState.MinElement;
        setArray([...newArray]);
        await sleep(delay.focus);

        // Fade out left half including middle
        for (let i = left; i <= mid; i++) {
          newArray[i].animationState = ArrayElementAnimationState.Default;
        }
        left = mid + 1;
      } else {
        // Target is in left half - show direction with brief red highlight
        newArray[mid].animationState = ArrayElementAnimationState.MinElement;
        setArray([...newArray]);
        await sleep(delay.focus);

        // Fade out right half including middle
        for (let i = mid; i <= right; i++) {
          newArray[i].animationState = ArrayElementAnimationState.Default;
        }
        right = mid - 1;
      }

      setArray([...newArray]);
      await sleep(delay.focus); // Slower between iterations
    }

    if (!found) {
      // Target not found - show all elements briefly
      newArray.forEach(element => {
        element.animationState = ArrayElementAnimationState.MinElement;
      });
      setArray([...newArray]);
      await sleep(delay.focus);

      await sleep(600)
      alert(`✗ Item Not In List\n\nValue: ${target}\nTotal Cycles: ${cycles}`);
    }

    // Reset all to default after showing result
    setTimeout(() => {
      const resetArray = newArray.map(element => ({
        ...element,
        animationState: ArrayElementAnimationState.Default
      }));
      setArray(resetArray);
      setIsAnimating(false);
    }, 500); // Reduced display time for final result
  };

  return (
    <div className="h-full bg-gray-50 overflow-hidden">
      {showHelp && (
        <SimulatorHelp slides={helpSlides} onClose={() => setShowHelp(false)} />
      )}
      <main className="flex flex-col lg:flex-row h-full max-w-7xl mx-auto bg-white">

        {/* Array display - Constrained height */}
        <div className="flex-1 lg:flex-[3] h-full overflow-hidden">

          {/* Title */}
          <div className="flex-shrink-0 mb-2 md:mb-4 pt-6 relative flex items-center justify-center px-4">
            <h1 className="text-base md:text-xl font-semibold text-gray-600 text-center">
              Array Data Structure
            </h1>
            <button
              className="absolute right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 text-sm font-bold transition-colors flex items-center justify-center"
              onClick={() => setShowHelp(true)}
              aria-label="Open simulator help"
            >
              ?
            </button>
          </div>

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
              { type: OperationType.Algorithms, label: 'Algorithms', bgActive: 'bg-blue-100' },
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
                  type="number"
                  className="bg-white border border-gray-200 rounded-lg text-center flex-1 text-sm md:text-lg py-1.5 md:py-2 focus:border-blue-300 focus:outline-none transition-colors"
                  value={inputValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers (including negative numbers and decimals)
                    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                      setInputValue(value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      insertBack(createArrayElement(getValueOrRandom(inputValue)));
                      setInputValue(''); // Clear the input after insertion
                    }
                  }}
                  placeholder="Enter number"
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

            {/* Array info - simplified */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-2 md:p-3 rounded-lg flex-shrink-0">
              <div className="flex justify-between gap-1 text-xs md:text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Size:</span>
                  <span className="text-blue-600 font-bold">{array.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Sorted:</span>
                  <span className={`font-bold ${isArraySorted() ? 'text-green-600' : 'text-red-600'}`}>
                    {isArraySorted() ? 'Yes' : 'No'}
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
                    info={{
                      title: "Insert Front",
                      description: "Inserts a new element at the beginning of the array. Every existing element must shift one position to the right to make room, so all n elements are touched.",
                      timeComplexity: "O(n)",
                    }}
                  />
                  <ActionButton
                    text="Insert Back"
                    bgColor="#2A9D8F"
                    shadowColor="#1F7A6B"
                    onClick={() => insertBack(createArrayElement(getValueOrRandom(inputValue)))}
                    info={{
                      title: "Insert Back",
                      description: "Appends a new element at the end of the array. No shifting is needed — the element lands directly in the next available slot.",
                      timeComplexity: "O(1)",
                    }}
                  />
                  <ActionButton
                    text="Insert At"
                    bgColor="#2A9D8F"
                    shadowColor="#1F7A6B"
                    onClick={() => insertAt(createArrayElement(getValueOrRandom(inputValue)), index)}
                    info={{
                      title: "Insert At Index",
                      description: "Inserts a new element at a chosen index. All elements from that index to the end shift one position right to create the gap.",
                      timeComplexity: "O(n)",
                    }}
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
                    info={{
                      title: "Remove Front",
                      description: "Removes the first element of the array. All remaining elements must shift one position left to fill the gap, touching every element in the array.",
                      timeComplexity: "O(n)",
                    }}
                  />
                  <ActionButton
                    text="Remove Back"
                    bgColor="#C7573B"
                    shadowColor="#A0422E"
                    onClick={() => removeBack()}
                    info={{
                      title: "Remove Back",
                      description: "Removes the last element of the array. No shifting is required — the array size simply decreases by one.",
                      timeComplexity: "O(1)",
                    }}
                  />
                  <ActionButton
                    text="Remove At"
                    bgColor="#C7573B"
                    shadowColor="#A0422E"
                    onClick={() => removeAt(index)}
                    info={{
                      title: "Remove At Index",
                      description: "Removes the element at a chosen index. All elements after the removed position shift one position left to close the gap.",
                      timeComplexity: "O(n)",
                    }}
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
                    info={{
                      title: "Set At Index",
                      description: "Updates the value at a specific index. Arrays allow direct index access via pointer arithmetic, so no traversal is needed — the target slot is reached instantly.",
                      timeComplexity: "O(1)",
                    }}
                  />
                  <ActionButton
                    text="Get At"
                    bgColor="#6C757D"
                    shadowColor="#495057"
                    onClick={() => getAt(Number(index))}
                    info={{
                      title: "Get At Index",
                      description: "Reads the value at a specific index. Because arrays occupy contiguous memory, any index can be accessed directly in constant time.",
                      timeComplexity: "O(1)",
                    }}
                  />
                </>
              )}

              {/* ALGORITHMS */}
              {operationType === OperationType.Algorithms && (
                <>
                  <ActionButton
                    text="Selection Sort"
                    bgColor="#3B82F6"
                    shadowColor="#1E40AF"
                    onClick={() => selectionSort()}
                    info={{
                      title: "Selection Sort",
                      description: "Repeatedly finds the smallest element in the unsorted portion and swaps it into the correct position. Makes n−1 passes, each time scanning the remaining unsorted elements to find the minimum.",
                      timeComplexity: "O(n²)",
                    }}
                  />
                  <ActionButton
                    text="Linear Search"
                    bgColor="#10B981"
                    shadowColor="#059669"
                    onClick={() => {
                      const target = Number(inputValue) ?? Math.floor(Math.random() * 100);
                      linearSearch(target);
                    }}
                    info={{
                      title: "Linear Search",
                      description: "Scans every element one by one from the start until the target is found or the end is reached. Works on both sorted and unsorted arrays.",
                      timeComplexity: "O(n)",
                    }}
                  />
                  <ActionButton
                    text="Binary Search"
                    bgColor="#8B5CF6"
                    shadowColor="#6D28D9"
                    onClick={() => {
                      const target = Number(inputValue) ?? Math.floor(Math.random() * 100);
                      binarySearch(target);
                    }}
                    info={{
                      title: "Binary Search",
                      description: "Requires a sorted array. Compares the target with the middle element and eliminates half the remaining search space each step, making it far faster than linear search on large arrays.",
                      timeComplexity: "O(log n)",
                    }}
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
