import { SubLesson } from "./localStorage";

export interface Category {
  title: string;
  description?: string; // Optional: for the menu cards
  lessons: SubLesson[];
}

// Define your types for the map
export const LESSON_MAP: Record<string, Category> = {};

const SAMPLE_LESSON: Category = {
  title: "Sample Lesson",
  description:
    "This is a sample lesson sub menu showing sub lesson that you can navigate and mark for progress tracking. Currently lessons point to nothing so you will be redirected to an error page. Thanks",
  lessons: [
    {
      title: "lesson 1.1",
      href: "/lesson/sample-lesson-1-1",
      completed: false,
    },
    {
      title: "lesson 1.2",
      href: "/lesson/sample-lesson-1-2",
      completed: false,
    },
    {
      title: "lesson 1.3",
      href: "/lesson/sample-lesson-1-3",
      completed: false,
    },
    {
      title: "lesson 1.4",
      href: "/lesson/sample-lesson-1-4",
      completed: false,
    },
    {
      title: "lesson 1.5",
      href: "/lesson/sample-lesson-1-5",
      completed: false,
    },
  ],
};

const INTRODUCTION: Category = {
  title: "Introduction to Data Structures",
  description:
    "Welcome to introduction to datastructure, here we do bla bla bla about data structure and more datastructre thingy. You can sleep now good night",
  lessons: [
    {
      title: "lessons 2.1",
      href: "/lesson/introduction-2-1",
      completed: false,
    },
    {
      title: "lessons 2.2",
      href: "/lesson/introduction-2-2",
      completed: false,
    },
  ],
};

const BIG_O: Category = {
  title: "Big-O",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  lessons: [
    {
      title: "lessons 2.1",
      href: "/lesson/introduction-2-1",
      completed: false,
    },
    {
      title: "lessons 2.2",
      href: "/lesson/introduction-2-2",
      completed: false,
    },
  ],
};

const ARRAY: Category = {
  title: "Array",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  lessons: [
    {
      title: "lessons 2.1",
      href: "/lesson/introduction-2-1",
      completed: false,
    },
    {
      title: "lessons 2.2",
      href: "/lesson/introduction-2-2",
      completed: false,
    },
    {
      title: "lessons 2.3",
      href: "/lesson/introduction-2-3",
      completed: false,
    },
  ],
};

const STACK: Category = {
  title: "Stack",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  lessons: [
    {
      title: "lessons 2.1",
      href: "/lesson/introduction-2-1",
      completed: false,
    },
    {
      title: "lessons 2.2",
      href: "/lesson/introduction-2-2",
      completed: false,
    },
    {
      title: "lessons 2.3",
      href: "/lesson/introduction-2-3",
      completed: false,
    },
  ],
};

const QUEUE: Category = {
  title: "Queue",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  lessons: [
    {
      title: "lessons 2.1",
      href: "/lesson/introduction-2-1",
      completed: false,
    },
    {
      title: "lessons 2.2",
      href: "/lesson/introduction-2-2",
      completed: false,
    },
    {
      title: "lessons 2.3",
      href: "/lesson/introduction-2-3",
      completed: false,
    },
  ],
};

const LINKED_LIST: Category = {
  title: "Linked List",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  lessons: [
    {
      title: "lessons 2.1",
      href: "/lesson/introduction-2-1",
      completed: false,
    },
    {
      title: "lessons 2.2",
      href: "/lesson/introduction-2-2",
      completed: false,
    },
    {
      title: "lessons 2.3",
      href: "/lesson/introduction-2-3",
      completed: false,
    },
  ],
};

const TREE: Category = {
  title: "Tree",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  lessons: [
    {
      title: "lessons 2.1",
      href: "/lesson/introduction-2-1",
      completed: false,
    },
    {
      title: "lessons 2.2",
      href: "/lesson/introduction-2-2",
      completed: false,
    },
    {
      title: "lessons 2.3",
      href: "/lesson/introduction-2-3",
      completed: false,
    },
  ],
};

// Lesson Registration
LESSON_MAP["sample-lesson"] = SAMPLE_LESSON;
LESSON_MAP["introduction1"] = INTRODUCTION;
LESSON_MAP["big-o"] = BIG_O;
LESSON_MAP["array"] = ARRAY;
LESSON_MAP["stack"] = STACK;
LESSON_MAP["queue"] = QUEUE;
LESSON_MAP["linked-list"] = LINKED_LIST;
LESSON_MAP["tree"] = TREE;
