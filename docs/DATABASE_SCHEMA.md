# VisualDS Database Schema

Here is the Mermaid JS Entity-Relationship (ER) diagram representing the current database schema in the backend. Unused fields (if any) are omitted, and relations reflect the active query and data models.

```mermaid
erDiagram
    users {
        UUID user_id PK
        TEXT clerk_id UK
        UUID course_id FK
        VARCHAR first_name
        VARCHAR middle_name
        VARCHAR last_name
        VARCHAR email
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
        TEXT block_id
    }

    courses {
        UUID course_id PK
        TEXT course_name
    }

    assessments {
        TEXT id PK
        TEXT category
        INT max_attempts
    }

    questions {
        TEXT id PK
        TEXT assessment_id FK
        TEXT text
        TEXT image_url
        TEXT type
        TEXT feedback_correct
        TEXT feedback_incorrect
    }

    choices {
        TEXT id PK
        TEXT question_id FK
        TEXT text
        BOOLEAN is_correct
    }

    question_stats {
        TEXT question_id PK, FK
        INT correct
        INT mistakes
    }

    quiz_results {
        UUID id PK
        UUID user_id FK
        TEXT quiz_category
        TEXT quiz_id
        INT score
        INT total_items
        TIMESTAMPTZ taken_at
    }

    user_seen_questions {
        UUID user_id PK, FK
        TEXT assessment_id PK, FK
        TEXT question_id PK, FK
    }

    lesson_categories {
        UUID category_id PK
        TEXT slug UK
        TEXT title
        TEXT description
        INT order_index
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    lessons {
        UUID lesson_id PK
        UUID category_id FK
        TEXT slug UK
        TEXT title
        TEXT content
        INT order_index
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    lesson_progress {
        UUID user_id PK, FK
        TEXT lesson_category PK
        TEXT lesson_id PK
        TIMESTAMPTZ completed_at
    }

    simulators {
        TEXT id PK
        TEXT slug UK
        TEXT name
        TEXT description
        BOOLEAN is_active
        TEXT initial_code
    }

    simulator_challenges {
        TEXT id PK
        TEXT simulator_id FK
        TEXT slug
        TEXT title
        TEXT description
        INTEGER order_index
        TEXT initial_code
        JSONB program_structure
        JSONB test_cases
        JSONB capacity
        TEXT next_challenge_id FK
        BOOLEAN is_active
    }

    simulator_progress {
        UUID user_id PK, FK
        TEXT path PK
        TEXT simulator_category
        BOOLEAN is_completed
        TIMESTAMPTZ updated_at
        TEXT last_submitted_code
    }

    simulator_submissions {
        UUID id PK
        UUID user_id FK
        TEXT simulator_id
        TEXT challenge_id FK
        TEXT code
        TEXT status
        TIMESTAMPTZ created_at
    }

    %% Relationships
    courses ||--o{ users : "has"
    users ||--o{ quiz_results : "takes"
    users ||--o{ lesson_progress : "tracks"
    users ||--o{ simulator_progress : "tracks"
    users ||--o{ simulator_submissions : "submits"
    users ||--o{ user_seen_questions : "views"

    assessments ||--o{ questions : "contains"
    questions ||--o{ choices : "has"
    questions ||--o| question_stats : "tracks"
    assessments ||--o{ user_seen_questions : "included_in"
    questions ||--o{ user_seen_questions : "included_in"

    lesson_categories ||--o{ lessons : "contains"
    
    simulators ||--o{ simulator_challenges : "has"
    simulator_challenges ||--o| simulator_challenges : "next"
    simulator_challenges ||--o{ simulator_submissions : "receives"
```
