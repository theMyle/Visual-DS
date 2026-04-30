---
title: Linked List Operations
---

# Linked List Operations

Let’s talk about what you can do with a linked list. We are focusing on operations regarding a singly linked list for simplicity. There are lots of different types of linked lists out there, like [doubly linked list](https://www.geeksforgeeks.org/dsa/doubly-linked-list/) and [circular linked list](https://www.geeksforgeeks.org/dsa/circular-linked-list/), but the core concepts are very similar.

### Common Linked List Operations:
- **Access**
- **Insertion**
- **Deletion**
- **Traversal**

## Access

- First and Last Items: **O(1)**
- Anywhere Else: **O(n)**

Unlike arrays, linked lists do **not** support random access. Because nodes are **not** stored in a continuous block of memory, the computer cannot calculate an address to "jump" to a specific spot. Accessing the Head or Tail is near-instant O(1) because the list maintains direct pointers to these specific nodes.

Accessing any other element however whether it is in the middle or just one step away from the end requires traversal. You must start at the Head and follow the "Next" pointers node-by-node, resulting in a linear search time of O(n).

## Insertion

- Fist, Middle, and Last: **O(1)**

Linked lists offer O(1) insertion because the operation only requires updating the pointers of the immediate neighbors. Unlike arrays, which must shift elements to create space, a linked list simply hooks a new node into the chain.

The operation is constant time at the head and tail where you have direct access. However, if you don't have a reference to a middle node, it becomes O(n) because you must first traverse the list to find the insertion point.

## Deletion

- Fist, Middle, and Last: **O(1)**

Deletion is a constant O(1) operation because you simply change a pointer to "skip" the node you want to remove. This is instantaneous at the head where the pointer is already available.

The operation itself is constant time, but if you don't have access to the middle node, it becomes O(n) due to the search traversal. Deleting the last item in a singly linked list is also O(n) because you must traverse the list to find the node right before the tail to update its pointer.

## Traversal

- Traversal: **O(n)**

Traversal is the act of visiting every node in the list exactly once. Since a linked list is a linear structure, the time it takes is directly proportional to the number of nodes (n). This is the foundation for many other operations, such as searching for a specific value or printing the entire collection.

| Linked List Operation | Time Complexity |
| --- | --- |
| Access: First Item | O(1) |
| Access: Last Item | O(1) |
| Access: Middle Items | O(n) |
| Insertion | O(1) |
| Deletion | O(1) |

As we've seen, linked lists are most efficient when dealing with the first and last items of a collection. This is where the linked list truly beats an array: it allows for frequent insertion and deletion in O(1) time, without the expensive "shifting" of elements that arrays require. While you sacrifice the ability to jump instantly to any position/index, you gain a structure that is incredibly flexible for adding and removing data on the fly.

The insertion and deletion operations themselves are constant time O(1), as they only require changing a few pointers. However, if you don't have direct access to the specific node you want to change, the process becomes linear O(n) because you must traverse the list from the beginning to reach that specific point.
