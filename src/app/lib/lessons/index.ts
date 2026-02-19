import { Category } from "../lessons";
import { ARRAY } from "./array";
import { BIG_O } from "./big-o";
import { INTRODUCTION } from "./introduction";
import { LINKED_LIST } from "./linked-list";
import { QUEUE } from "./queue";
import { SAMPLE_LESSON } from "./sample-lesson";
import { STACK } from "./stack";
import { TREE } from "./tree";

export const LESSON_MAP: Record<string, Category> = {
  sample: SAMPLE_LESSON,
  "introduction-1": INTRODUCTION,
  "big-o": BIG_O,
  array: ARRAY,
  stack: STACK,
  queue: QUEUE,
  "linked-list": LINKED_LIST,
  tree: TREE,
};
