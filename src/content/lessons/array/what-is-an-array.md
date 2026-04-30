---
title: What is an Array?
---

# What is an Array?

Traditionally, an array is a container that holds a fixed number of values of a single type stored in contiguous (next to each other) memory locations. It is one of the fundamental data structures that other structures are built upon.

Arrays store data in elements which are accessed using indices. An index acts as an offset; it tells the computer exactly how far to jump from the starting memory address to find the desired value. By convention, indexing starts at 0, meaning the first element has an offset of zero from the start of the array.

![Array diagram](/lessons/array/array-diagram.png)

When an array is initialized, the system allocates a single, unbroken block of memory. This physical layout is the defining characteristic of the structure. Because the elements are adjacent, the computer calculates the physical address of any element using **Address Calculation Formula** formula. If you know the starting address and the size of the data type, you can jump to any specific element immediately without traversing the ones before it.

![Address Calculation Formula](/lessons/array/array-address-calculation.png)

![Array index calculation diagram](/lessons/array/array-index-calculation.png)

This leads to a key superpower of the array: extremely fast random access. Since the position can be calculated mathematically, the computer achieves constant time O(1) access regardless of whether it is retrieving the first or the last item in the list.

## Key Characteristics of an Array

- **Contiguous Memory Allocation:** Elements are stored in a single, unbroken block of memory where each item is physically adjacent to the next.
- **Constant Time Random Access:** Any element can be accessed in O(1) time because its position is calculated mathematically rather than by searching.
- **Fixed Size:** The total capacity is defined at the time of initialization and cannot be changed without reallocating a new block of memory.

## Additional Resources

![Additional Resources Video](https://www.youtube.com/embed/QJNwK2uJyGs?si=fJNEhddFoCLpVQxl)
