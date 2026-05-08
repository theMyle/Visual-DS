# VisualDS Lesson Markdown Guide

This guide explains the custom markdown syntax and components supported by the `LessonRenderer` in VisualDS.

## 1. Headings
Standard markdown headings are styled to match the VisualDS design system.
```markdown
# Level 1 Heading (Main Title)
## Level 2 Heading (Section)
### Level 3 Heading (Subsection)
```

## 2. Callouts (Alerts)
Use blockquotes with a specific tag at the beginning to create styled callouts.
Supported tags: `[info]`, `[warning]`, `[success]`, `[tip]`, `[danger]`.

```markdown
> [info] This is an information callout.
> It can span multiple lines.

> [warning] Use this for important warnings.

> [tip] Pro-tip: You can use other markdown inside callouts too!
```

## 3. Media (Images & Videos)
The renderer automatically distinguishes between images and videos based on the URL.

### Images
Standard markdown image syntax.
```markdown
![Alternative Text](https://example.com/image.png)
```

### Videos
If the URL ends in `.mp4`, `.webm`, or is a YouTube/Cloud Storage link, it will render as an interactive video player.
```markdown
![Video Title](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
![Local Video](/videos/demo.mp4)
```

## 4. Tables
Tables are rendered with a clean, responsive layout using the `TableSection` component.
```markdown
| Feature | Description |
| :--- | :--- |
| Fast | Optimized for speed |
| Interactive | Supports user input |
```

## 5. Inline Styling
- **Code**: ` `code` ` will render as a highlighted "pill" using the `Highlight` component.
- **Links**: Standard `[Text](URL)` links use the `TextLink` component with custom hover effects.

## 6. Inline Quizzes (Self-Check)
You can embed interactive multiple-choice quizzes directly in your lessons using the `quiz` code block.

### Syntax:
````markdown
```quiz
[Question Text]
a. [Option 1]
b. [Option 2]
c. [Option 3]
Answer: [Correct Option Letter]
Feedback Correct: [Message for correct answer]
Feedback Wrong: [Message for wrong answer]
```
````

### Rules:
- **Options**: Must start with a letter and a period (e.g., `a. `).
- **Answer**: Must be `Answer: x` where `x` is the letter of the correct option.
- **Feedback**: Both `Feedback Correct:` and `Feedback Wrong:` are optional but recommended for a better learning experience.
- **Retry**: A "Retry" button automatically appears if the user picks the wrong answer. It disappears once they get it right.

### Example:
````markdown
```quiz
What is the time complexity of searching in a Hash Map (average case)?
a. O(n)
b. O(log n)
c. O(1)
d. O(n^2)
Answer: c
Feedback Correct: Correct! Hash maps provide constant time complexity on average.
Feedback Wrong: Not quite. Remember that hash maps use a hash function to jump directly to the data.
```
````

## 7. Lists
Both ordered and unordered lists are styled with custom markers and spacing.
```markdown
- Item 1
- Item 2
  - Sub-item A

1. First Step
2. Second Step
```

---
*Note: The renderer uses `remark-gfm` and `react-markdown`, so standard GitHub Flavored Markdown features are also supported.*
