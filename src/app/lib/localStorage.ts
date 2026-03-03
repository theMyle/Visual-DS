/**
 * Type Definitions
 */
export interface SubLesson {
  title: string;
  href: string;
  completed: boolean;
}

const CATEGORY_PREFIX = "lesson_";
const DATA_VERSION = "1.01";

const isClient = typeof window !== "undefined" && !!window.localStorage;

export const LocalStorage = {
  /**
   * Core Generic Methods
   */
  setItem<T>(key: string, value: T): boolean {
    if (!isClient) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[LocalStorage] Save Error (key: ${key}):`, error);
      return false;
    }
  },

  getItem<T>(key: string, defaultValue: T): T {
    if (!isClient) return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.error(`[LocalStorage] Read Error (key: ${key}):`, error);
      return defaultValue;
    }
  },

  removeItem(key: string): void {
    if (isClient) window.localStorage.removeItem(key);
  },

  /**
   * Domain-Specific Lesson Methods
   */

  /**
   * syncCategory ensures the local data matches your static code definition.
   * It preserves the 'completed' status of existing lessons while updating
   * titles, adding new lessons, or handling version migrations.
   */
  syncCategory(path: string, staticLessons: SubLesson[]): SubLesson[] {
    if (!isClient) return staticLessons;

    const storageKey = `${CATEGORY_PREFIX}${path}`;
    const versionKey = `${storageKey}_version`;

    const stored = this.getCategory(path);
    const localVersion = window.localStorage.getItem(versionKey);

    // If version is current and data exists, don't overwrite
    if (localVersion === DATA_VERSION && stored.length > 0) {
      return stored;
    }

    // Version mismatch or empty data: Perform a "Smart Merge"
    const merged = staticLessons.map((staticItem) => {
      // Find matching user progress by the unique 'href'
      const userProgress = stored.find((s) => s.href === staticItem.href);
      return {
        ...staticItem,
        completed: userProgress ? userProgress.completed : staticItem.completed,
      };
    });

    // Update storage with merged data and new version
    this.setCategory(path, merged);
    window.localStorage.setItem(versionKey, DATA_VERSION);

    return merged;
  },

  getCategory(path: string): SubLesson[] {
    return this.getItem<SubLesson[]>(`${CATEGORY_PREFIX}${path}`, []);
  },

  setCategory(path: string, lessons: SubLesson[]): boolean {
    return this.setItem(`${CATEGORY_PREFIX}${path}`, lessons);
  },

  updateSubLesson(path: string, href: string, completed: boolean): boolean {
    const lessons = this.getCategory(path);
    const exists = lessons.some((l) => l.href === href);

    if (!exists) return false;

    const updated = lessons.map((l) =>
      l.href === href ? { ...l, completed } : l,
    );
    return this.setCategory(path, updated);
  },

  getProgress(path: string): number {
    const lessons = this.getCategory(path);
    if (!lessons.length) return 0;

    const completedCount = lessons.filter((l) => l.completed).length;

    return Math.round((completedCount / lessons.length) * 100);
  },

  // ...existing code...
  deleteCategory(path: string): void {
    const storageKey = `${CATEGORY_PREFIX}${path}`;
    this.removeItem(storageKey);
    this.removeItem(`${storageKey}_version`);
  },

  /**
   * Debugging / Dev Tools
   */
  clearAll(): void {
    if (!isClient) return;

    // Collect keys to remove to avoid index shifting issues during iteration
    const keysToRemove: string[] = [];

    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && (key.startsWith(CATEGORY_PREFIX) || key === "theme")) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => window.localStorage.removeItem(key));
    console.log(`[LocalStorage] Cleared ${keysToRemove.length} entries.`);
  },
};
