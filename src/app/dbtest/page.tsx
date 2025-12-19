'use client'

// TODO - Remove this entire endpoint

import { useEffect, useState } from "react";
import { db, LessonProgress } from "../lib/db";

export default function DBTEST() {
    const [lesson, setLesson] = useState<LessonProgress | undefined>()

    useEffect(() => {
        db.lessonProgress
            .get({ lessonName: 'array-list' })
            .then(setLesson);
    }, [])

    return (
        <div>
            {
                lesson ?
                    (
                        <div>
                            {lesson.lessonName}
                            {lesson.completed}
                            {lesson.id}
                        </div>
                    )
                    :
                    (
                        <div>
                            <p>db entry not found</p>
                        </div>
                    )}
        </div>
    )
}