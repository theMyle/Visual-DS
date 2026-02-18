'use client';

import { useState, useEffect } from 'react';
import { LocalStorage, LessonProgressData } from '@/app/lib/localStorage';

export default function DbTestPage() {
    // ============================================================
    // STATE: Store lesson progress data in component state
    // ============================================================
    // Structure: { 'lesson-id': { 'sub-lesson-id': boolean, ... }, ... }
    const [progress, setProgress] = useState<LessonProgressData>({
        'array-list': {
            'introduction': false,
            'operations': false,
            'complexity': false,
        },
        'linked-list': {
            'introduction': false,
            'types': false,
            'operations': false,
        },
        'stack': {
            'introduction': false,
            'push-pop': false,
            'applications': false,
        },
    });

    // State to display the JSON data visually (for testing/debugging)
    const [loadedData, setLoadedData] = useState<string>('');

    // ============================================================
    // LOAD: Automatically load saved progress when page loads
    // ============================================================
    useEffect(() => {
        // Get saved data from localStorage (returns empty {} if nothing saved)
        const saved = LocalStorage.getItem<LessonProgressData>('lesson-progress', {});

        // If we found saved data, use it to populate our state
        if (saved && Object.keys(saved).length > 0) {
            setProgress(saved);
            setLoadedData(JSON.stringify(saved, null, 2)); // Format for display
        }
    }, []); // Empty array = run once on mount

    // ============================================================
    // TOGGLE: Mark a sub-lesson as complete/incomplete
    // ============================================================
    const toggleCompletion = (lesson: string, subLesson: string) => {
        setProgress((prev) => {
            // Create updated progress object with toggled value
            const updated = {
                ...prev, // Keep all other lessons unchanged
                [lesson]: {
                    ...prev[lesson], // Keep all other sub-lessons unchanged
                    [subLesson]: !prev[lesson][subLesson], // Toggle this sub-lesson
                },
            };

            // IMPORTANT: Automatically save to localStorage after update
            LocalStorage.setItem('lesson-progress', updated);

            // Update display to show current stored data
            setLoadedData(JSON.stringify(updated, null, 2));

            return updated; // Return new state
        });
    };

    // ============================================================
    // CLEAR: Reset all progress (for testing purposes)
    // ============================================================
    const clearProgress = () => {
        // Remove from localStorage
        LocalStorage.removeItem('lesson-progress');

        // Reset to default (all false)
        const defaultProgress: LessonProgressData = {
            'array-list': {
                'introduction': false,
                'operations': false,
                'complexity': false,
            },
            'linked-list': {
                'introduction': false,
                'types': false,
                'operations': false,
            },
            'stack': {
                'introduction': false,
                'push-pop': false,
                'applications': false,
            },
        };

        setProgress(defaultProgress);
        setLoadedData('');
    };

    // ============================================================
    // UI: Render the lesson progress interface
    // ============================================================
    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">LocalStorage Test</h1>

                {/* Header: Info text and clear button */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={clearProgress}
                        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Clear Progress
                    </button>
                    <p className="text-gray-600 flex items-center">
                        Progress is automatically saved when you toggle completion status
                    </p>
                </div>

                {/* Lesson Cards: Loop through each lesson and display sub-lessons */}
                <div className="space-y-6">
                    {/* Object.entries converts {key: value} to [[key, value], ...] array */}
                    {Object.entries(progress).map(([lessonId, subLessons]) => (
                        <div key={lessonId} className="bg-white p-6 rounded-lg shadow">
                            {/* Lesson Title */}
                            <h2 className="text-xl font-semibold mb-4 capitalize">
                                {lessonId.replace('-', ' ')}
                            </h2>

                            {/* Sub-lesson rows with toggle buttons */}
                            <div className="space-y-2">
                                {Object.entries(subLessons).map(([subLessonId, completed]) => (
                                    <div key={subLessonId} className="flex items-center justify-between">
                                        {/* Sub-lesson name */}
                                        <span className="capitalize">{subLessonId.replace('-', ' ')}</span>

                                        {/* Toggle button - auto-saves on click */}
                                        <button
                                            onClick={() => toggleCompletion(lessonId, subLessonId)}
                                            className={`px-4 py-2 rounded transition-colors ${completed
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                                                }`}
                                        >
                                            {completed ? '✓ Completed' : 'Mark Complete'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Debug Display: Show the actual JSON stored in localStorage */}
                {loadedData && (
                    <div className="mt-8 bg-gray-900 text-green-400 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Stored Data:</h3>
                        <pre className="text-sm overflow-x-auto">{loadedData}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}
