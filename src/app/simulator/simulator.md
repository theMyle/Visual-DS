Viewed routes.go:38-62

Here is a clean, copy-pasteable mini-spec you can hand directly to your frontend LLM to have it build the data fetching hooks/services:

***

### 🌐 Simulator Progress API Specification

**Authentication:** All routes are protected and require the standard authentication context/token (the backend automatically extracts the `user_id` from the request context).

#### Data Models

**SimulatorProgressResponse** (Returned by all successful responses)
```typescript
interface SimulatorProgressResponse {
  user_id: string;              // UUID
  simulator_category: string;   // e.g., "array", "linkedlist"
  path: string;                 // e.g., /simulator/array/challenge-1
  is_completed: boolean;
  updated_at: string | null;    // ISO 8601 Datetime string
}
```

---

#### 1. Get All Simulator Progress
- **Method:** `GET`
- **Route:** `/simulator-progress`
- **Description:** Fetches the entire history of the user's simulator progress, sorted by category and path.
- **Response (`200 OK`):** `SimulatorProgressResponse[]`

#### 2. Get Simulator Progress by Category
- **Method:** `GET`
- **Route:** `/simulator-progress/{category}`
- **Description:** Fetches progress strictly for a specific category hub (e.g., only "arrays").
- **Path Parameters:**
  - `category` (string): The simulator category.
- **Response (`200 OK`):** `SimulatorProgressResponse[]`

#### 3. Get Specific Simulator Progress
- **Method:** `GET`
- **Route:** `/simulator-progress/{category}/{path}`
- **Description:** Fetches the state of one exact challenge (useful for hydrating the state when a user first opens a specific simulator page).
- **Path Parameters:**
  - `category` (string): The simulator category.
  - `path` (string): The challenge identifier/path (e.g., `two-sum`).
- **Response (`200 OK`):** `SimulatorProgressResponse`
- **Response (`404 Not Found`):** Returned if the user has no saved progress for this specific challenge.

#### 4. Upsert (Save/Update) Simulator Progress
- **Method:** `POST`
- **Route:** `/simulator-progress/{category}`
- **Description:** Saves a user's progress. If they have already completed or attempted it, it cleanly updates the existing record and bumps the `updated_at` timestamp.
- **Path Parameters:**
  - `category` (string): The simulator category.
- **JSON Request Body:**
  ```typescript
  {
    "path": string,           // /simulator/array/challenge-1
    "is_completed": boolean   // Whether they solved it
  }
  ```
- **Response (`201 Created`):** `SimulatorProgressResponse` (Returns the newly updated database record).

***