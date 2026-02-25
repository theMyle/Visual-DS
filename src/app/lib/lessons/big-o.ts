import { Category } from "./types";

export const BIG_O: Category = {
  title: "Big-O",
  description:
    "This module discusses the universal language used to compare algorithmic efficiency. You'll learn how to classify algorithms by their worst-case growth rates; from linear O(n) to quadratic O(n²); and understand why theoretical scaling matters more than raw execution time when dealing with large datasets.",
  lessons: [
    {
      title: "2.1 - Introduction",
      href: "/lesson/big-o/introduction",
      completed: false,
    },
    {
      title: "2.2 - What is Big-O?",
      href: "/lesson/big-o/big-o-notation",
      completed: false,
    },
  ],
};
