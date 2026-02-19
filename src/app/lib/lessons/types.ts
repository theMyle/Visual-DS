import { SubLesson } from "../localStorage";

export interface Category {
  title: string;
  description?: string;
  lessons: SubLesson[];
}
