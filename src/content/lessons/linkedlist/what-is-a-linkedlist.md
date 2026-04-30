---
title: What Is A Linked List
---

# What Is A Linked List

A Linked List is a fundamental linear data structure that organizes data in a sequence, similar to an array. However, unlike arrays, which allocate memory contiguously, linked lists store elements **non-contiguously**. This non-contiguous storage method is what makes linked lists significantly more efficient for operations involving **frequent insertions and deletions**. The linked list is a vital building block for creating many other, more complex data structures.

![A generic linked list image](/lessons/linkedlist/linkedlist.png)

A **linked list** is a dynamic data structure whose name describes its underlying organization. Unlike an array, which stores elements sequentially in contiguous memory, a linked list consists of separate blocks of memory, called **nodes**, that point or link to one another.

### Nodes have two parts:
- **Data**: This holds the actual value (such as an integer, a string, or a complex object)
- **Next Pointer**: This holds the memory address of the following node in the sequence.

![Image of a Linked list node showing data, and next pointer.](/lessons/linkedlist/node.png)

Because each node "knows" where the next one is, the list can be scattered across different locations in your computer's memory (the Heap) and doesn’t require its elements to be stored beside each other. Consequently, linked lists are dynamically sized by default.

This structure offers a key advantage: operations such as **insertion and deletion are more efficient** because they only require updating a node's next pointer, rather than shifting individual elements. However, this flexibility comes at a cost: you lose access by index and **can only access items sequentially**, as accessing any specific node requires traversing every single node that precedes it.

## Key Characteristics of Linked Lists

1. **Node Based**: Composed of nodes.
2. **Non-Contigous**: Nodes are scattered in memory but linked together.
3. **Dynamic Size**: Can easily shrink or grow.
4. **Sequential Access**: Starts from the first node, to the next one, and so on.

## Additional Resources

![Additional Resources Video](https://www.youtube.com/embed/odW9FU8jPRQ?si=wzMT5wReCR3CcGm1)
