---
title: Properties of a Queue
---

# Properties of a Queue

The most defining property of a queue is **First-In, First-Out (FIFO)**. This means the order of processing strictly follows the order of arrival. Unlike a stack, a queue has two points of interaction: the **Front** (where data leaves) and the **Rear** (where data enters). You cannot legally reach into the middle of the structure; you must process every item that arrived before your target.

## Ordered Processing

A queue's primary property is its ability to preserve the temporal order of data. This ensures fairness. If three tasks are sent to a printer, the queue ensures Task 1 finishes before Task 2 begins. This property is vital in asynchronous systems where data is produced at a different rate than it is consumed, acting as a buffer to prevent data loss or "overflowing" the receiver.
