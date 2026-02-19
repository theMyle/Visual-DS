import Dexie, { Table } from 'dexie';

export interface LessonProgress {
    id?: number;
    lessonName: string;
    completed: boolean;
}

export class VisualDSDatabase extends Dexie {
    lessonProgress!: Table<LessonProgress>;

    constructor() {
        super('visual-ds-db');

        this.version(1).stores({
            lessonProgress: '++id, &lessonName, completed'
        });

        this.on('populate', () => {
            this.lessonProgress.bulkAdd([
                { lessonName: 'array-list', completed: false },
                { lessonName: 'queue', completed: false },
                { lessonName: 'linked-list', completed: false },
                { lessonName: 'stack', completed: false }
            ]);
        });
    }
}

export const db = new VisualDSDatabase();
