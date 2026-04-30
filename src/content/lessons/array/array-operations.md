---
title: Array Operations
---

# Array Operations

Since static arrays cannot change in size, most discussion regarding "dynamic" operations (like adding or removing) actually describes the mechanics of Dynamic Arrays (like ArrayList or Python Lists). These structures automate the heavy lifting of memory management so the user doesn't have to manually create new arrays.

1. Access & Update
2. Insertion
3. Deletion
4. Traversal & Search

## Access And Update

These are the fastest operations for an array. Since an array is a contiguous block of memory, the computer doesn't need to "search" for a position. It uses the index to calculate the exact physical memory address instantly (BaseAddress + Index). Whether you are reading a value (Access) or overwriting it (Update), it takes the same amount of effort regardless of the array's size

```c++
#include <iostream>

int main() {
    // Accessing an element in a fixed-size array
    int staticArr[5] = {1, 2, 3, 4, 5};
    std::cout << staticArr[0] << '\n'; // prints: 1
    return 0;
}
```

```c++
#include <iostream>
#include <vector>

int main() {
    // Updating an element in a dynamic array (vector)
    std::vector<int> dynamicArr = {10, 20, 30, 40, 50};
    dynamicArr[4] = 100;

    for (int x : dynamicArr) {
        std::cout << x << " ";
    }
    std::cout << '\n'; // Result: 10 20 30 40 100

    return 0;
}
```

## Insertion

- **Insertion at the end**: This is usually very fast **O(1)**. You are simply placing a value into the next available slot. The only exception is when the underlying dynamic array is full and must "resize," but in daily use, we treat this as [amortized](https://en.wikipedia.org/wiki/Amortized_analysis) constant-time operation.
- **Insertion at front or middle**: This is an "*expensive*" operation **O(n)**. Because there are no gaps allowed between items, you have to manually **shift** to the right every single element that comes after your new spot to make a hole. If you have a thousand items and want to put one at the very front, you have to move all one thousand items first. Imagine having a million items.

```c++
#include <iostream>
#include <vector>

int main() {
    // Insertion at the end
    std::vector<int> nums = {1, 2, 3, 4, 5};
    nums.push_back(6);

    for (int x : nums) {
        std::cout << x << " ";
    }
    std::cout << '\n'; // Result: 1 2 3 4 5 6

    return 0;
}
```

```c++
#include <iostream>
#include <vector>

int main() {
    // Insertion at the front
    std::vector<int> nums = {10, 20, 30, 40, 50};
    nums.insert(nums.begin(), 5);

    for (int x : nums) {
        std::cout << x << " ";
    }
    std::cout << '\n'; // Result: 5 10 20 30 40 50

    return 0;
}
```

```c++
#include <iostream>
#include <vector>

int main() {
    // Insertion around middle (at index 2)
    std::vector<int> nums = {10, 20, 30, 40, 50};
    nums.insert(nums.begin() + 2, 100);

    for (int x : nums) {
        std::cout << x << " ";
    }
    std::cout << '\n'; // Result: 10 20 100 30 40 50

    return 0;
}
```

## Deletion

- **Deletion at the end**: Like insertion at the end, this is very fast **O(1)**. You simply remove the last item or tell the array to ignore that slot. No other elements are affected.
- **Deletion at front or middle**: This is an expensive operation as list grows **O(n)**. When you remove an element from the middle, it leaves a "hole" in the memory block. To keep the data contiguous, you must shift to the left every subsequent element to fill that slot.

```c++
#include <iostream>
#include <vector>

int main() {
    // Deletion at the end: fast (no shifting needed)
    std::vector<int> nums = {10, 20, 30, 40, 50};
    nums.pop_back();

    for (int x : nums) {
        std::cout << x << " ";
    }
    std::cout << '\n'; // Result: 10 20 30 40

    return 0;
}
```

```c++
#include <iostream>
#include <vector>

int main() {
    // Deletion in the middle (removes the element at index 2)
    std::vector<int> nums = {10, 20, 30, 40, 50};
    nums.erase(nums.begin() + 2);

    for (int x : nums) {
        std::cout << x << " ";
    }
    std::cout << '\n'; // Result: 10 20 40 50

    return 0;
}
```

## Traversal & Search

- **Traversal**: This is the act of visiting every element in the array once (e.g., printing all items). Because you must visit every item in the list, this operation has a complexity of **O(n)**.
- **Search**: This is a traversal with a condition. In an unsorted array, you perform a *linear search* by checking each item one by one starting at index 0. In the worst-case scenario, the item is at the very end or not there at all, requiring **n steps** to finish. This makes it an **O(n)** operation.

```c++
#include <iostream>

int main() {
    // Traversal: printing every element
    int nums[] = {1, 2, 3, 4, 5};

    for (int x : nums) {
        std::cout << x << " ";
    }
    std::cout << '\n';

    return 0;
}
```

```c++
#include <iostream>

int main() {
    // Search: finding a specific value (linear search)
    int nums[] = {10, 20, 30, 40, 50};
    int target = 30;
    bool found = false;

    for (int x : nums) {
        if (x == target) {
            found = true;
            break;
        }
    }

    if (found) {
        std::cout << "Found 30!" << '\n';
    } else {
        std::cout << "Item not found" << '\n';
    }

    return 0;
}
```

## Array Operations Complexity Table

| Array Operation | Complexity |
| --- | --- |
| Access | O(1) |
| Update | O(1) |
| Insert Front | O(n) |
| Insert Middle | O(n) |
| Insert End | O(1) |
| Delete Front | O(n) |
| Delete Middle | O(n) |
| Delete End | O(1) |
| Traversal | O(n) |
| Search (unsorted) | O(n) |

The required **shifting** makes arrays a poor fit for frequent inserts or deletes at the **beginning** and **middle** as arrays grow larger. However, arrays are excellent for fast [random access](https://en.wikipedia.org/wiki/Random_access) (direct access) no matter what the size is. This trade-off is exactly why we study other data structures: one structure’s weakness is often another’s strength.
