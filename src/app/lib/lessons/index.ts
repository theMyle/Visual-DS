import { ARRAY } from "./array";
import { BIG_O } from "./big-o";
import { INTRODUCTION } from "./introduction";
import { LINKED_LIST } from "./linked-list";
import { QUEUE } from "./queue";
import { STACK } from "./stack";
import { TREE } from "./tree";
import { Category } from "./types";

export const LESSON_MAP: Record<string, Category> = {
  introduction: INTRODUCTION,
  "big-o": BIG_O,
  array: ARRAY,
  stack: STACK,
  queue: QUEUE,
  "linked-list": LINKED_LIST,
  tree: TREE,
};
