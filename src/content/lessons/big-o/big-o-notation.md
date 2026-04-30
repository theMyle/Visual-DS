---
title: Big-O Notation
---

# Big-O Notation

First introduced by mathematician Paul Bachmann in 1894, **Big-O notation** has become the universal language for measuring algorithmic efficiency.

In computer science, it allows us to compare how algorithms scale without getting bogged down by specific hardware, programming languages, or clock speeds.

> Big-O characterizes an algorithm’s **worst-case growth rate**; telling us exactly how much more time or memory is required as the input size (**n**) increases.

We write it as **`O(n)`**, where **n** is a formula representing the growth curve.

## Common Big-O Classes

| Class | Name | Example |
| :--- | :--- | :--- |
| O(1) | Constant | Accessing an array element |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Simple loop through array |
| O(n²) | Quadratic | Nested loops |
| O(2ⁿ) | Exponential | Recursive Fibonacci |
| O(n!) | Factorial | Factorial |

The following chart shows the growth rate of several different Big-O categories. The size of the input is shown on the **x - axis** and how long the algorithm will take to complete is shown on the **y - axis**.

![Big-O Chart](/lessons/big-o-chart.png)

As the size of inputs grows, the algorithms become slower to complete (take longer to run). The rate at which they become slower is defined by their Big-O category.

For example, O(n) algorithms slow down more slowly than O(n²) algorithms.

## Big-O Analysis

![Big-O Analysis Video](https://storage.googleapis.com/qvault-webapp-dynamic-assets/lesson_videos/big-o-notation-v1-23-00-x264-1920x1080.mp4)
