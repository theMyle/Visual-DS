---
title: What is a Stack
---

# What is a Stack

A **stack** is a fundamental linear data structure that operates on the **Last-In, First-Out (LIFO)** principle, meaning the most recently added element is the first one to be removed. Think of it like a physical stack of plates in a cafeteria: you add new items to the top and retrieve them from the top, while the items at the bottom remain inaccessible until everything above them is cleared. In computing, this behavior is managed through two primary operations **push** (adding an item) and **pop**(removing an item) making it an essential tool for managing function calls, undo mechanisms in software, and expression parsing.

![A generic stack image](/lessons/stack/stack.png)

Under the hood, a stack is usually implemented with either an **array** or a **linked** list because these structures provide the linear foundation needed to maintain **LIFO** order. An **array-based implementation** is often the default choice for its memory efficiency and speed; it stores elements in contiguous blocks and utilizes a simple integer pointer to track the "top," making access nearly instantaneous. While adding an element is generally **amortized constant time O(1)**, it may occasionally require a "resize" to a larger memory block if the stack becomes full. Conversely, removal is extremely fast because the system simply decrements the pointer, effectively ignoring the old data without needing to physically erase it or shrink the allocated memory.

Alternatively, a **linked list implementation** is used when dynamic scaling and guaranteed performance are the priorities. This approach provides a **strict O(1) constant** time for every push and pop operation because it never needs to pause for a resize. Instead of one large block, each element is an independent "node" that points to the next, allowing the stack to grow or shrink seamlessly as long as memory is available. While this avoids the "hiccups" of an array, it does carry a small memory overhead since each node must store an extra pointer alongside the actual data. This makes linked lists ideal for environments where the maximum stack size is unpredictable or where memory is heavily fragmented.

## Additional Resources

![Additional Resources Video](https://www.youtube.com/embed/I5lq6sCuABE?si=CQz-R0uxd1LkTOYa)
