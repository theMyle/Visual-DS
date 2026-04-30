---
title: Properties of a Linked List
---

# Properties of a Linked List

In the previous lesson, we established that linked lists are collections of **Nodes**, where each node is connected to the next one. A standard node consists of a **Data** field, which holds the value, and a **Next** field (or pointer), which references the subsequent node in the sequence.

![LinkedList Node](/lessons/linkedlist/node-2.png)

## Key Properties

A singly linked list typically maintains several key properties to manage its structure and facilitate operations.

- **Head**
- **Tail**
- **Length**

The **Head** is a crucial reference that points to the first node in the linked list. It serves as the necessary entry point for starting any traversal or operation that needs to access the beginning of the list.

The **Tail** is a reference that points directly to the last node in the list. Maintaining a tail reference enables quick access for operations like appending a new node to the end of the list without needing to traverse the entire list first.

The **Length** property represents the current number of nodes in the list. While this property is sometimes optional (as the length can be determined by traversing all nodes from the head), keeping an explicit length counter allows for O(1) determination of the list's size.

![LinkedList Structure](/lessons/linkedlist/linkedlist-2.png)
