---
title: Queue Operations
---

# Queue Operations

A queue is defined by a specific set of operations. Because the system always knows exactly where the head and tail are located, these operations are incredibly fast.

## Enqueue and Dequeue

The two primary operations are **Enqueue** and **Dequeue**. When you Enqueue, you add a new element to the rear of the queue. This is an O(1) operation because you are simply placing an item at a known end-point. Conversely, Dequeue removes the element at the front. This is also an O(1) operation; the queue provides the front item and simply moves the head pointer to the next element in line, effectively "forgetting" the old data.

```c++
#include <queue>
#include <string>

int main() {
    // initialize queue
    std::queue<std::string> printQueue;

    // enqueue items to the back
    printQueue.push("Project_Report.pdf");
    printQueue.push("Photo_Album.jpg");
    printQueue.push("Invoice.docx");

    // dequeue/remove the item from the front
    std::string nextJob = printQueue.front(); 
    printQueue.pop(); // removes "Project_Report.pdf"
}
```

## Front and IsEmpty

Two informational operations help manage the structure: **Front** (or Peek) and **IsEmpty**. Front allows you to see the value of the next item in line without actually removing it. Since it only involves a single read of the head position, it is an O(1) operation. IsEmpty is a simple boolean check used to determine if the queue contains any data. This is crucial for preventing errors that occur if you try to dequeue from a structure that is already empty.

```c++
#include <queue>
#include <iostream>

int main() {
    // initialize queue
    std::queue<int> ticketNumbers;

    ticketNumbers.push(101);
    ticketNumbers.push(102);

    // prints the front of the queue
    std::cout << "Front item: " << ticketNumbers.front() << std::endl;
    // "101"

    // result of empty check
    std::cout << "Is queue empty: " << (ticketNumbers.empty() ? "Yes" : "No") << std::endl;
    // "No"
}
```

## Queue Operations Complexity Table

| Queue Operation | Time Complexity |
| --- | --- |
| Enqueue | O(1) |
| Dequeue | O(1) |
| Front/Peek | O(1) |
| IsEmpty | O(1) |
