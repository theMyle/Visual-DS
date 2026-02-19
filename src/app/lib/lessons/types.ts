import { SubLesson } from "../localStorage";

export interface LessonCategory {
  title: string;
  description?: string;
  lessons: SubLesson[];
}
