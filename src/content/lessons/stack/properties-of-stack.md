---
title: Properties of a Stack
---

# Properties of a Stack

The most defining property of a stack is **Last-In, First-Out (LIFO)**. This means the last element added to the stack is the first one to be removed. Access is strictly limited to the "top" of the stack; you cannot legally reach into the middle or the bottom of the structure without first removing everything sitting above your target.

## Dynamic vs. Static Capacity

A stack's capacity property depends entirely on its underlying implementation. When implemented with an **array**, the stack often has a **fixed capacity** or "static" nature. If you try to add an item to a full array-based stack, you encounter a property known as **Stack Overflow**. Conversely, a **linked list** implementation gives the stack a **dynamic capacity**, allowing it to grow and shrink in memory as needed, only limited by the total available RAM of the system.
