---
title: Types of Array
---

# Types of Array

There are **two** types of arrays, it can either be **Static** or **Dynamic**:

## Static Array

A static array is a **fixed-size** data structure where the number of elements is determined at the time of declaration. In memory, the system allocates a specific, contiguous block that **cannot be resized**, expanded, or shrunk during the program's execution.

If you reach the capacity of a static array and need to add more data, you must manually allocate a new, larger array and copy every existing element into the new block of memory before deleting the old one.

![Adding new item to static array](/lessons/array/array-static-append.png)

This type is common in low-level languages like C or C++ where memory management is explicit. Because the size is constant, static arrays are highly memory-efficient as there is no "extra" space allocated for potential growth.

## Dynamic Array

A dynamic array is an improved version that can **grow** or **shrink** its capacity as needed during runtime. In high-level or interpreted languages like Python (List), JavaScript (Array), or Java (ArrayList), C++ (Vectors), this is the default behavior.

Under the hood, a dynamic array still uses a static array, but it **automates the resizing process**. To do this efficiently, it maintains a distinction between its **size** (the number of items currently inside) and its **capacity** (the total amount of space it has reserved). When the size reaches the capacity, the structure allocates a new, larger block of memory, copies the items over, and updates its reference. Because it allocates more room than it needs, it often contains a block of memory that is currently unused. This "slack space" is a deliberate trade-off that allows most additions to happen in constant time, as the array only has to perform the slow work of rebuilding itself once in a while.

![Dynamic array size vs capacity](/lessons/array/array-dynamic.png)

This provides the flexibility of a list that "expands" while maintaining the fast, index-based access of a traditional array. Some implementations also include a "shrink" mechanic where memory is released if a significant number of elements are deleted, ensuring the program does not waste memory.
