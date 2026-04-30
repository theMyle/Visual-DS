---
title: What is a Queue
---

# What is a Queue

A queue is a fundamental linear data structure that operates on the **First-In, First-Out (FIFO)** principle, meaning the first element added to the structure is the first one to be removed. Think of it like a real-world waiting line at a coffee shop: the person who arrives first is served first, and new arrivals join the back of the line. In computing, this behavior is managed through two primary actions known as **enqueue** (adding to the back) and **dequeue** (removing from the front). This makes it an essential tool for managing shared resources, print jobs, and data packets in networking.

## Queue Data Structure

Under the hood, a queue is usually implemented with either a circular array or a linked list to maintain its linear **FIFO** order efficiently.

### The Circular Buffer (Array-Based)

A standard array is actually a poor choice for a queue because removing an item from the front would leave an empty hole, forcing the system to shift every other element forward. This would make removal a slow O(n) operation. The **Circular Queue** solves this by connecting the last position of the array back to the first. It uses two pointers (**Head** and **Tail**) that move independently. When the Tail reaches the end of the memory block, it simply wraps back around to any empty slots at the beginning, ensuring that both adding and removing items remain constant time O(1) without wasting space.

### Linked List

Alternatively, a linked list implementation is used when you need a dynamic capacity. In this setup, each element is an independent "node" containing the data and a pointer to the next item. By maintaining a reference to both the head and the tail nodes, the system can perform additions at the back and removals at the front in strict O(1) time. This approach is ideal for environments where the maximum size of the queue is unpredictable, as it only uses as much memory as there are items currently in the line.

## Additional Resources

![Additional Resources Video](https://www.youtube.com/embed/mDCi1lXd9hc?si=XYdVjzMh0KsRRAw2)
