'use client';

import { useEffect, useState } from "react";
import { StackElement, StackElementAnimationState } from "@/app/simulator/stack/components/types";
import { createStackElement, createStackElements } from "@/app/simulator/stack/components/utils";

import VisualStack from "@/app/simulator/stack/components/VisualStack";
import ActionButton from "@/app/simulator/stack/components/ActionButton";

enum OperationType {
  Basic,
  Advanced,
}

export default function SimulationStack() {
  const [stack, setStack] = useState<StackElement[]>([]);
  const [isPopping, setIsPopping] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState<string>("");
  const [operationType, setOperationType] = useState<OperationType>(OperationType.Basic);

  useEffect(() => {
    // Initialize with some sample data
    const initial = createStackElements(1, 2, 3, 4, 5);
    setStack(initial);
  }, []);

  // STACK OPERATIONS

  // Push an element onto the stack
  const push = async (value: StackElement) => {
    // Limit to 7 elements on mobile (screen width < 768px), 12 on desktop
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const maxElements = isMobile ? 7 : 12;
    if (stack.length >= maxElements) return;
    
    value.animationState = StackElementAnimationState.NewPushed;
    setStack(prev => [value, ...prev]); // Add to the beginning (top)

    // Reset to default after animation
    setTimeout(() => {
      value.animationState = StackElementAnimationState.Default;
      setStack(prev => [...prev]);
    }, 200);

    setInputValue("");
  };

  // Pop an element from the stack
  const pop = async () => {
    if (stack.length === 0 || isPopping) return;
    // setIsPopping(true);

    // Directly remove the element - exit animation will handle the visual effect
    setStack(prev => prev.slice(1));
    
    // Reset the popping state after animation completes
    setTimeout(() => {
      setIsPopping(false);
    }, 400);
  };

  // Peek at the top element
  const peek = async () => {
    if (stack.length === 0 || isAnimating) return;
    setIsAnimating(true);

    const newStack = [...stack];

    // Highlight the top element (first element in array)
    newStack[0].animationState = StackElementAnimationState.HighlightedGreen;
    setStack(newStack);

    // Return to default state after a brief moment
    setTimeout(() => {
      newStack[0].animationState = StackElementAnimationState.Default;
      setStack([...newStack]);
      setIsAnimating(false);
    }, 800);
  };

  // Check if stack is empty
  const isEmpty = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Visual feedback for empty check
    if (stack.length === 0) {
      // Just a simple check, no animation needed
      setIsAnimating(false);
      return;
    } else {
      // Highlight all elements briefly to show it's not empty
      const newStack = stack.map(element => ({
        ...element,
        animationState: StackElementAnimationState.HighlightedOrange
      }));
      setStack(newStack);

      // Return to default state
      setTimeout(() => {
        const defaultStack = newStack.map(element => ({
          ...element,
          animationState: StackElementAnimationState.Default
        }));
        setStack(defaultStack);
        setIsAnimating(false);
      }, 600);
    }
  };

  // Get stack size
  const size = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Highlight all elements to show the size
    if (stack.length > 0) {
      const newStack = stack.map(element => ({
        ...element,
        animationState: StackElementAnimationState.HighlightedGreen
      }));
      setStack(newStack);

      // Return to default state
      setTimeout(() => {
        const defaultStack = newStack.map(element => ({
          ...element,
          animationState: StackElementAnimationState.Default
        }));
        setStack(defaultStack);
        setIsAnimating(false);
      }, 800);
    } else {
      setIsAnimating(false);
    }
  };

  // Clear the entire stack
  const clear = async () => {
    if (isAnimating) return;
    // Simply clear the stack without complex animations
    setStack([]);
  };

  return (
    <div className="h-full bg-gray-50 overflow-hidden">
      <main className="flex flex-col lg:flex-row h-full max-w-7xl mx-auto bg-white">
        
        {/* Stack display - Constrained height */}
        <div className="flex-1 lg:flex-[3] h-full overflow-hidden">
          <VisualStack stack={stack} />
        </div>

        {/* Controls section */}
        <div className="flex-1 lg:flex-[2] flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 h-full overflow-hidden">
          {/* Operation type selector */}
          <div className="flex border-b border-gray-200 flex-shrink-0">
            {[
              { type: OperationType.Basic, label: 'Basic', bgActive: 'bg-blue-100' },
              { type: OperationType.Advanced, label: 'Others', bgActive: 'bg-purple-100' },
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
            {/* Input field for value - compact on mobile */}
            <div className="flex gap-2 md:gap-3 items-center flex-shrink-0">
              <label className="text-xs md:text-sm font-medium text-gray-700 min-w-[40px] md:min-w-[50px]">Value:</label>
              <input
                type="text"
                className="bg-white border border-gray-200 rounded-lg text-center flex-1 text-sm md:text-lg py-1.5 md:py-2 focus:border-blue-300 focus:outline-none transition-colors"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
              />
            </div>

            {/* Stack info - more compact for mobile */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-2 md:p-3 rounded-lg flex-shrink-0">
              <div className="flex justify-between gap-1 text-xs md:text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Size:</span>
                  <span className="text-blue-600 font-bold">{stack.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Top:</span>
                  <span className="text-green-600 font-bold truncate max-w-[60px]">
                    {stack.length > 0 ? stack[0].value : 'None'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Empty:</span>
                  <span className="text-red-600 font-bold">
                    {stack.length === 0 ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons - more compact */}
            <div className="flex flex-col gap-2.5 md:gap-2 w-full flex-shrink-0">

              {/* BASIC OPERATIONS */}
              {operationType === OperationType.Basic && (
                <>
                  <ActionButton 
                    text="Push" 
                    bgColor="#2A9D8F"
                    shadowColor="#1F7A6B" 
                    onClick={() => push(createStackElement(inputValue || Math.floor(Math.random() * 100)))} 
                  />
                  <ActionButton 
                    text="Pop" 
                    bgColor="#C7573B"
                    shadowColor="#A0422E" 
                    onClick={() => pop()} 
                  />
                  <ActionButton 
                    text="Peek" 
                    bgColor="#6C757D"
                    shadowColor="#495057" 
                    onClick={() => peek()} 
                  />
                </>
              )}

              {/* ADVANCED OPERATIONS */}
              {operationType === OperationType.Advanced && (
                <>
                  <ActionButton 
                    text="Size" 
                    bgColor="#6C757D"
                    shadowColor="#495057" 
                    onClick={() => size()} 
                  />
                  <ActionButton 
                    text="Clear All" 
                    bgColor="#C7573B"
                    shadowColor="#A0422E" 
                    onClick={() => clear()} 
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
