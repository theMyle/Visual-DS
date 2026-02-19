import { Category } from "./types";

export const SAMPLE_LESSON: Category = {
  title: "Sample",
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
