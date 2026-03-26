export type AssessmentMenuItem = {
  id: string;
  title: string;
  path: string;
};

export const ASSESSMENT_LIST: AssessmentMenuItem[] = [
  {
    id: "array-list-1",
    title: "Array",
    path: "/assessment/array-list",
  },
  {
    id: "linked-list-1",
    title: "Linked List",
    path: "/assessment/linked-list",
  },
  {
    id: "stack-1",
    title: "Stack",
    path: "/assessment/stack",
  },
  {
    id: "queue-1",
    title: "Queue",
    path: "/assessment/queue",
  },
];
