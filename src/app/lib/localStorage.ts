/**
 * Generic utility class for saving and loading JSON data to/from browser localStorage.
 * All methods are SSR-safe and will return fallback values when localStorage is unavailable.
 */
export class LocalStorage {
  /**
   * Check if localStorage is available (client-side only)
   */
  private static isAvailable(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    );
  }

  /**
   * Save a value to localStorage with the specified key.
   * @param key - The storage key
   * @param value - The value to store (will be serialized to JSON)
   * @returns true if successful, false otherwise
   */
  static setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage (key: ${key}):`, error);
      return false;
    }
  }

  /**
   * Retrieve a value from localStorage by key.
   * @param key - The storage key
   * @param defaultValue - Optional default value to return if key doesn't exist or parsing fails
   * @returns The parsed value, defaultValue if provided, or null
   */
  static getItem<T>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable()) {
      return defaultValue !== undefined ? defaultValue : null;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue !== undefined ? defaultValue : null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return defaultValue !== undefined ? defaultValue : null;
    }
  }

  /**
   * Remove a specific item from localStorage by key.
   * @param key - The storage key to remove
   */
  static removeItem(key: string): void {
    if (!this.isAvailable()) {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
    }
  }

  /**
   * Clear all items from localStorage.
   */
  static clear(): void {
    if (!this.isAvailable()) {
      return;
    }

    try {
      window.localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }
}

/**
 * Example type for lesson progress structure.
 * You can use this as a reference or define your own types.
 */
export type LessonProgressData = Record<string, Record<string, boolean>>;
