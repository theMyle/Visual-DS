---
title: Stack Operations
---

# Stack Operations

A stack is defined by a very limited and specific set of operations. Because you only ever interact with the "top" of the structure, these operations are incredibly efficient, typically executing in **constant time O(1)**.

- Push and Pop
- Peek and isEmpty

## Push and Pop

```c++
#include <stack>

// …initialize stack
std::stack<std::string> undoStack;

// push items into the stack
undoStack.push("Draw Circle");
undoStack.push("Fill Red");
undoStack.push("Resize 50%");

// pop/take the item from the top of stack
// returns "Resize 50%" and removes it from the stack
std::string lastAction = undoStack.pop(); 
```

## Peek and IsEmpty

To help manage the stack, two informational operations are used: Peek (or Top) and IsEmpty. **Peek** allows you to look at the value of the top element without actually removing it. Since it only involves a single "read" of the top position, it is a constant time O(1) operation. **IsEmpty** is a simple boolean check used to determine if the stack contains any data. It returns true if the stack is empty and false otherwise, which is a lightning-fast O(1) check. This is crucial for preventing **"Stack Underflow"** errors, which occur if you try to Pop from a stack that has nothing left in it.

```c++
#include <stack>

// …initialize stack
std::stack<std::string> bookStack;

bookStack.push("The Hobbit");
bookStack.push("Great Expectations");
bookStack.push("Harry Potter");


// prints the top of the stack
std::cout << "Peek result: " << bookStack.top() << std::endl;
// “Harry Potter”

// result of isEmpty (true or false)
std::cout << "IsEmpty result: " << bookStack.empty() << std::endl;
“false”
```

## Stack Operations Complexity Table

| Stack Operations | Time Complexity |
| --- | --- |
| Push | O(1) |
| Pop | O(1) |
| Peek | O(1) |
| isEmpty | O(1) |
