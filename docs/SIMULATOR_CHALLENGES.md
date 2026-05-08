# VisualDS Simulator Challenge Configuration

This document defines the official JSON structure for challenges.

## 1. `program_structure`
*   **`parameterNames`**: List of arguments for the `Solution` function.
    *   Example: `["array", "io"]`

## 2. `test_cases`
*   **`name`**: Label for the test case.
*   **`input`**: Initial array for the visualizer.
*   **`expectedReturn`**: The value the function must return.

## 3. `capacity`
*   **`mobile`**: Max elements (mobile).
*   **`desktop`**: Max elements (desktop).

---

## Canonical JSON Example
```json
{
  "program_structure": {
    "parameterNames": [
      "array",
      "io"
    ]
  },
  "test_cases": [
    {
      "name": "Test Case 1",
      "input": [ 12, 7, 19, 4, 33, 28, 5, 16, 41, 10, 22, 3, 8, 27, 14, 9, 30, 11, 6, 25 ],
      "expectedReturn": -30
    },
    {
      "name": "Test Case 2",
      "input": [ 45, 18, 2, 39, 24, 7, 31, 40, 13, 26, 50, 1, 34, 29, 6, 17, 8, 21, 14, 3 ],
      "expectedReturn": 16
    }
  ],
  "capacity": {
    "mobile": 20,
    "desktop": 40
  }
}
```
