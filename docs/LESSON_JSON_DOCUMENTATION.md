# Lesson JSON File Documentation

This document provides a comprehensive guide on how to create lesson JSON files for the Chill Teacher Frontend application.

## Table of Contents

1. [File Structure](#file-structure)
2. [Basic Lesson Structure](#basic-lesson-structure)
3. [Vocabulary Data](#vocabulary-data)
4. [Menu System](#menu-system)
5. [Activities](#activities)
6. [External Content](#external-content)
7. [Pages](#pages)
8. [Special Data Types](#special-data-types)
9. [Complete Examples](#complete-examples)

---

## File Structure

### File Location

Lesson JSON files must be placed in the following directory structure:

```
src/routes/(main)/lessons/mock-data/lessons/{course}/{unit}/{lesson-name}.json
```

**Example:**
```
src/routes/(main)/lessons/mock-data/lessons/advanced-topics/multiple-intelligence-theory/lesson-1-vocab.json
```

### File Format

Each JSON file must contain a single object with a key matching the lesson filename (without `.json` extension). The lesson data is nested under this key.

**Structure:**
```json
{
  "lesson-name": {
    // Lesson data here
  }
}
```

**Example:**
```json
{
  "lesson-1-vocab": {
    "background": "...",
    "title": "...",
    // ... rest of lesson data
  }
}
```

---

## Basic Lesson Structure

Every lesson JSON file must include these required fields:

### Required Fields

```json
{
  "lesson-name": {
    "background": "string",      // URL to background image
    "title": "string",            // Main lesson title
    "description": "string",      // Lesson subtitle/description
    "menu": []                    // Array of menu items (see Menu System)
  }
}
```

**Field Descriptions:**

- **`background`** (string, required): URL to the background image used throughout the lesson
  - Example: `"https://storage.chillteacher.com/backgrounds/lessons/multiple-intelligence-theory.webp"`

- **`title`** (string, required): The main title displayed on the lesson homepage
  - Example: `"Multiple Intelligence Theory"`

- **`description`** (string, required): Subtitle or description shown below the title
  - Example: `"Lesson 1: Vocabulary - Part 1"`

- **`menu`** (array, required): Defines the order and items displayed on the lesson homepage
  - See [Menu System](#menu-system) for details

---

## Vocabulary Data

The `vocab` array contains vocabulary items that power most vocabulary-based activities.

### Vocabulary Item Structure

```json
{
  "vocab": [
    {
      "word": "string",                    // Required: English word
      "phonics": "string",                  // Required: Phonetic pronunciation
      "partOfSpeech": "string",             // Optional: Part of speech (n, v, adj, etc.)
      "image": "string",                    // Optional: URL to word image
      "vietnameseMeaning": "string",        // Required: Vietnamese translation
      "sampleSentence": "string",           // Required: Example sentence in English
      "vietnameseTranslation": "string",    // Required: Translation of sample sentence
      "wordPronunciation": "string",        // Optional: Custom pronunciation URL/ID
      "sentencePronunciation": "string"     // Optional: Custom sentence pronunciation
    }
  ]
}
```

**Example:**
```json
{
  "vocab": [
    {
      "word": "intelligence",
      "phonics": "/ɪnˈtɛlədʒəns/",
      "partOfSpeech": "n",
      "image": "https://storage.chillteacher.com/images-words/intelligence.webp",
      "vietnameseMeaning": "trí thông minh",
      "sampleSentence": "Emotional intelligence is as important as IQ.",
      "vietnameseTranslation": "Trí tuệ cảm xúc cũng quan trọng như IQ."
    },
    {
      "word": "theory",
      "phonics": "/ˈθɪri/",
      "partOfSpeech": "n",
      "image": "",
      "vietnameseMeaning": "lý thuyết",
      "sampleSentence": "The students studied the theory of evolution.",
      "vietnameseTranslation": "Học sinh đã học về lý thuyết tiến hóa."
    }
  ]
}
```

**Notes:**
- If `image` is empty or omitted, activities will display without images
- `partOfSpeech` is optional but recommended for better vocabulary learning
- All fields except `partOfSpeech`, `image`, `wordPronunciation`, and `sentencePronunciation` are required for vocabulary items

---

## Menu System

The `menu` array defines what appears on the lesson homepage and in what order. Each menu item references content by type and ID.

### Menu Item Types

Menu items can be one of five types:
1. **`activity`** - Interactive learning activities
2. **`page`** - Custom content pages
3. **`video`** - YouTube videos
4. **`googleSlide`** - Embedded Google Slides presentations
5. **`embedPage`** - External embedded pages

### Menu Item Structure

```json
{
  "menu": [
    { "type": "activity", "id": "vocabulary" },
    { "type": "page", "id": "assignments" },
    { "type": "video", "id": "lesson-video" },
    { "type": "googleSlide", "id": "presentation" },
    { "type": "embedPage", "id": "exercise-page" }
  ]
}
```

**Important:**
- The order in the `menu` array determines the display order on the homepage
- The `id` must match:
  - For activities: a valid activity ID from the registry (see [Activities](#activities))
  - For pages: an `id` in the `pages` array
  - For videos/slides/embeds: an `id` in the respective `externalContent` array

---

## Activities

Activities are interactive learning games and exercises. They are referenced in the menu using `{ "type": "activity", "id": "activity-id" }`.

### Available Activities

| Activity ID | Title | Description | Requires Vocab |
|------------|-------|-------------|----------------|
| `vocabulary` | Vocabulary | Learn new words | ✅ Yes |
| `flashcards` | Flashcards | Practice with flashcards | ✅ Yes |
| `matching-game` | Matching Game | Match words with meanings | ✅ Yes |
| `memory-game` | Memory Game | Test your memory | ✅ Yes |
| `multiple-choice-envi` | Multiple Choice (EN→VI) | Choose correct Vietnamese meaning | ✅ Yes |
| `multiple-choice-vien` | Multiple Choice (VI→EN) | Choose correct English word | ✅ Yes |
| `anagram-game` | Anagram Game | Unscramble the letters | ✅ Yes |
| `unjumble-game` | Unjumble Game | Put words in order | ✅ Yes |
| `cloze-game` | Fill in the Blanks | Complete the sentences | ❌ No (needs `clozeData`) |
| `picture-choice` | Picture Choice | Choose the correct word for picture | ✅ Yes |
| `picture-typing` | Picture Typing | Type the word for picture | ✅ Yes |
| `listening-typing` | Listening & Typing | Listen and type what you hear | ✅ Yes |
| `listening-sentence` | Listening Sentence | Listen and type the sentence | ✅ Yes |
| `translation-game` | Translation (VI→EN) | Translate to English | ✅ Yes |
| `candy-crush` | Candy Crush Quiz | Answer questions to crush candies | ❌ No (needs `questions`) |
| `image-reveal` | Image Reveal | Reveal the hidden image | ✅ Yes |
| `reading-comprehension` | Reading Comprehension | Reading comprehension with various question types | ❌ No (needs `readingData`) |

### Activity Requirements

**Most activities require vocabulary data:**
- If an activity uses `vocab`, you must include the `vocab` array in your lesson JSON
- Activities automatically use all vocabulary items from the `vocab` array

**Special activities require additional data:**

1. **`cloze-game`** requires `clozeData` (see [Cloze Data](#cloze-data))

2. **`candy-crush`** requires `questions` array (see [Candy Crush Questions](#candy-crush-questions))

3. **`reading-comprehension`** requires `readingData` (see [Reading Comprehension Data](#reading-comprehension-data))

### Example Menu with Activities

```json
{
  "menu": [
    { "type": "page", "id": "assignments" },
    { "type": "activity", "id": "vocabulary" },
    { "type": "activity", "id": "flashcards" },
    { "type": "activity", "id": "matching-game" },
    { "type": "activity", "id": "memory-game" },
    { "type": "activity", "id": "cloze-game" }
  ],
  "vocab": [ /* vocabulary items */ ],
  "clozeData": { /* cloze data */ }
}
```

---

## External Content

External content includes videos, Google Slides, and embedded pages. These are defined in the `externalContent` object and referenced in the menu.

### External Content Structure

```json
{
  "externalContent": {
    "videos": [
      {
        "id": "string",          // Required: Unique ID (used in menu)
        "url": "string",          // Required: YouTube URL
        "title": "string"         // Optional: Display title
      }
    ],
    "googleSlides": [
      {
        "id": "string",          // Required: Unique ID (used in menu)
        "url": "string",          // Required: Google Slides embed URL
        "title": "string"         // Optional: Display title
      }
    ],
    "embedPages": [
      {
        "id": "string",          // Required: Unique ID (used in menu)
        "url": "string",         // Required: Full URL to embed
        "title": "string"        // Optional: Display title
      }
    ]
  }
}
```

### Video Format

Videos use YouTube URLs. Supported formats:
- Full URL: `https://www.youtube.com/watch?v=VIDEO_ID`
- Short URL: `https://youtu.be/VIDEO_ID`

**Example:**
```json
{
  "externalContent": {
    "videos": [
      {
        "id": "lesson-video",
        "url": "https://youtu.be/GIZX0HYxCYw",
        "title": "Video Overview"
      }
    ]
  },
  "menu": [
    { "type": "video", "id": "lesson-video" }
  ]
}
```

### Google Slides Format

Use the Google Slides publish/embed URL format:
```
https://docs.google.com/presentation/d/e/2PACX-1v.../pubembed
```

**Example:**
```json
{
  "externalContent": {
    "googleSlides": [
      {
        "id": "presentation",
        "url": "https://docs.google.com/presentation/d/e/2PACX-1vQD_Kjx3u1n71tBseCyScoYfdSEsQ-Kgc6WFrLRstqat7unOA38uOa0KiL1Xy5sHMMmh7fTbxMycViR/pubembed",
        "title": "Bài giảng"
      }
    ]
  },
  "menu": [
    { "type": "googleSlide", "id": "presentation" }
  ]
}
```

### Embed Pages Format

Embed pages allow you to include external HTML pages via iframe:
```json
{
  "externalContent": {
    "embedPages": [
      {
        "id": "listening-exercise",
        "url": "https://storage.chillteacher.com/pages/multiple-intelligence-theory/listening/index.html",
        "title": "Listening Exercise"
      }
    ]
  },
  "menu": [
    { "type": "embedPage", "id": "listening-exercise" }
  ]
}
```

---

## Pages

Pages are custom content pages that can contain rich HTML-like content. They are useful for assignments, instructions, or supplementary materials.

### Page Structure

Pages use an HTML-like tree structure with tags, attributes, and children:

```json
{
  "pages": [
    {
      "id": "string",                    // Required: Unique ID (used in menu)
      "title": "string",                 // Optional: Page title
      "subtitle": "string",              // Optional: Page subtitle
      "scrollable": boolean,             // Optional: Enable scrolling (default: false)
      "root": [                          // Required: Array of content blocks
        {
          "tag": "string",               // HTML tag name
          "attributes": {                // Optional: HTML attributes
            "class": "string",
            "style": "string",
            // ... other HTML attributes
          },
          "children": [                  // Child elements
            { "text": "string" },        // Text content
            // ... or nested elements
          ]
        }
      ],
      "containerClassName": "string"     // Optional: CSS class for container
    }
  ]
}
```

### Supported HTML Tags

Commonly used tags:
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Headings
- `p` - Paragraphs
- `ol`, `ul` - Ordered/unordered lists
- `li` - List items
- `table`, `thead`, `tbody`, `tr`, `th`, `td` - Tables
- `div`, `span` - Containers
- `strong`, `em`, `b`, `i` - Text formatting
- `a` - Links
- `img` - Images

### Page Example

```json
{
  "pages": [
    {
      "id": "assignments",
      "title": "Nhiệm vụ",
      "scrollable": true,
      "root": [
        {
          "tag": "h1",
          "attributes": {
            "class": "text-4xl font-bold text-indigo-700 text-center"
          },
          "children": [{ "text": "Multiple Intelligence Theory" }]
        },
        {
          "tag": "h3",
          "attributes": {
            "class": "text-3xl text-gray-800 mb-4 text-center"
          },
          "children": [{ "text": "Hãy hoàn thành các nhiệm vụ sau:" }]
        },
        {
          "tag": "ol",
          "attributes": {
            "class": "text-3xl text-left text-gray-800 space-y-8"
          },
          "children": [
            {
              "tag": "li",
              "children": [{ "text": "Xem video bài học." }]
            },
            {
              "tag": "li",
              "children": [{ "text": "Luyện tập từ vựng bằng các hoạt động tương tác." }]
            }
          ]
        }
      ],
      "containerClassName": "bg-white bg-opacity-90 rounded-xl p-10 shadow-2xl"
    }
  ],
  "menu": [
    { "type": "page", "id": "assignments" }
  ]
}
```

### Nested Elements

You can nest elements within lists and other containers:

```json
{
  "tag": "ol",
  "children": [
    {
      "tag": "li",
      "children": [
        { "text": "Task description with " },
        {
          "tag": "strong",
          "children": [{ "text": "bold text" }]
        },
        { "text": " and more content." }
      ]
    }
  ]
}
```

---

## Special Data Types

### Cloze Data

Cloze data is used by the `cloze-game` activity. It provides sentences with blanks for students to fill.

**Structure:**
```json
{
  "clozeData": {
    "sentences": [
      {
        "sentence": "string",    // Sentence with blank (use _____ for blank)
        "word": "string"         // Correct word to fill the blank
      }
    ]
    // OR
    "paragraph": "string",       // Full paragraph with blanks
    "words": ["string", ...]     // Array of correct words in order
  }
}
```

**Example with sentences:**
```json
{
  "clozeData": {
    "sentences": [
      {
        "sentence": "You need good _____ to solve math problems.",
        "word": "logical-mathematical skills"
      },
      {
        "sentence": "Your _____ shows how smart you are on a test.",
        "word": "Intelligence Quotient"
      }
    ]
  }
}
```

**Example with paragraph:**
```json
{
  "clozeData": {
    "paragraph": "Teachers can combine activities for different intelligences. A short reading and writing task supports _____ learners. A concept map benefits _____ thinkers.",
    "words": ["linguistic", "spatial", "musical"]
  }
}
```

---

### Candy Crush Questions

The `candy-crush` activity uses a questions array with various question types.

**Question Types:**
- `multipleChoice` - Multiple choice questions
- `listening` - Listening comprehension (with audio)
- `fillBlank` - Fill in the blank questions
- `imageChoice` - Choose correct image
- `imageToVietnamese` - Match image to Vietnamese word

**Structure:**
```json
{
  "questions": [
    {
      "type": "multipleChoice",
      "question": "string",           // Question text
      "correctAnswer": "string",      // Correct answer
      "options": ["string", ...]      // Array of answer options
    },
    {
      "type": "listening",
      "question": "string",
      "correctAnswer": "string",
      "options": ["string", ...],
      "wordToSpeak": "string"        // Word to pronounce
    },
    {
      "type": "fillBlank",
      "question": "string",
      "correctAnswer": "string"
    },
    {
      "type": "imageChoice",
      "question": "string",
      "correctAnswer": "string",
      "options": ["string", ...],
      "image": "string"              // URL to image
    }
  ]
}
```

**Example:**
```json
{
  "questions": [
    {
      "type": "multipleChoice",
      "question": "\"reflection\" nghĩa là gì?",
      "correctAnswer": "suy ngẫm, phản chiếu",
      "options": ["suy ngẫm, phản chiếu", "độc lập", "quan sát", "kết luận"]
    },
    {
      "type": "listening",
      "question": "🔊 Nghe và chọn từ đúng:",
      "correctAnswer": "reflection",
      "options": ["reflection", "independent", "separate", "creative"],
      "wordToSpeak": "reflection"
    },
    {
      "type": "fillBlank",
      "question": "Điền từ tiếng Anh cho: \"suy ngẫm, phản chiếu\"",
      "correctAnswer": "reflection"
    }
  ]
}
```

---

### Reading Comprehension Data

Reading comprehension data is used by the `reading-comprehension` activity. It includes a passage and various question types.

**Structure:**
```json
{
  "readingData": {
    "title": "string",                    // Reading passage title
    "passage": [                          // Array of passage paragraphs
      {
        "heading": "string",              // Optional: Section heading
        "content": "string",              // Paragraph text
        "text": "string",                 // Alternative to "content"
        "list": ["string", ...],          // Optional: List items
        "dialog": ["string", ...],        // Optional: Dialog lines
        "className": "string"             // Optional: CSS class
      }
    ],
    "items": {                            // Optional: Dictionary for image-based questions
      "item-key": {
        "label": "string",
        "image": "string"                 // Image URL
      }
    },
    "questions": {
      "singleChoice": [ /* ... */ ],
      "tfng": [ /* ... */ ],
      "matching": { /* ... */ },
      "summary": [ /* ... */ ],
      "shortAnswer": [ /* ... */ ],
      "multiSelectItem": [ /* ... */ ],
      "pictureChoice": [ /* ... */ ],
      "textComprehension": [ /* ... */ ]
    }
  }
}
```

#### Question Types

**1. Single Choice Questions:**
```json
{
  "singleChoice": [
    {
      "id": "string",                    // Unique question ID
      "prompt": "string",                 // Question text
      "options": [
        {
          "value": "string",             // Option value
          "label": "string"              // Display label
        }
      ],
      "correct": "string"                // Correct option value
    }
  ]
}
```

**2. True/False/Not Given Questions:**
```json
{
  "tfng": [
    {
      "id": "string",
      "statement": "string",
      "correct": "true" | "false" | "not_given"
    }
  ]
}
```

**3. Matching Questions:**
```json
{
  "matching": {
    "questions": [
      {
        "id": "string",
        "statement": "string",
        "correct": "string"              // Option value
      }
    ],
    "options": [
      {
        "value": "string",
        "label": "string"
      }
    ]
  }
}
```

**4. Summary Questions:**
```json
{
  "summary": [
    {
      "id": "string",
      "prompt": "string",                // Sentence with blank
      "answers": ["string", ...]         // Acceptable answers
    }
  ]
}
```

**5. Short Answer Questions:**
```json
{
  "shortAnswer": [
    {
      "id": "string",
      "prompt": "string"
    }
  ]
}
```

**6. Multi-Select Item Questions:**
```json
{
  "multiSelectItem": [
    {
      "id": "string",
      "name": "string",
      "prompt": "string",
      "options": ["string", ...],        // Item keys
      "correct": ["string", ...]         // Correct item keys
    }
  ]
}
```

**7. Picture Choice Questions:**
```json
{
  "pictureChoice": [
    {
      "id": "string",
      "prompt": "string",
      "options": ["string", ...],        // Item keys
      "correct": "string"                // Correct item key
    }
  ]
}
```

**8. Text Comprehension Questions:**
```json
{
  "textComprehension": [
    {
      "id": "string",
      "prompt": "string",
      "answers": ["string", ...],        // Text options
      "correct": "string"                // Correct text answer
    }
  ]
}
```

**Complete Reading Comprehension Example:**
```json
{
  "readingData": {
    "title": "Applying Multiple Intelligence Theory in the Classroom",
    "passage": [
      {
        "content": "Multiple Intelligence (MI) theory suggests that learners have different strengths, such as linguistic, logical-mathematical, spatial, musical, bodily-kinesthetic, interpersonal, intrapersonal, and naturalist intelligences."
      },
      {
        "heading": "Benefits and Considerations",
        "content": "Classrooms using MI-informed lessons often report higher engagement, more equitable participation, and deeper retention."
      }
    ],
    "questions": {
      "singleChoice": [
        {
          "id": "sc1",
          "prompt": "What is the main idea behind Multiple Intelligence theory?",
          "options": [
            { "value": "one-score", "label": "Intelligence should be measured by a single score." },
            { "value": "varied-strengths", "label": "Learners have varied strengths that can be developed." },
            { "value": "music-only", "label": "Music is the most important form of intelligence." }
          ],
          "correct": "varied-strengths"
        }
      ],
      "tfng": [
        {
          "id": "tf1",
          "statement": "MI theory argues that students can develop multiple intelligences.",
          "correct": "true"
        }
      ],
      "matching": {
        "questions": [
          {
            "id": "m1",
            "statement": "Activity for spatial intelligence",
            "correct": "option2"
          }
        ],
        "options": [
          { "value": "option1", "label": "Small-group discussion" },
          { "value": "option2", "label": "Concept map / visual organizer" }
        ]
      },
      "summary": [
        {
          "id": "sum1",
          "prompt": "Complete: MI encourages offering diverse ______ points to learning.",
          "answers": ["entry", "entry points"]
        }
      ],
      "shortAnswer": [
        {
          "id": "sa1",
          "prompt": "Design a short activity sequence that touches at least three intelligences."
        }
      ]
    }
  }
}
```

---

## Complete Examples

### Example 1: Simple Vocabulary Lesson

```json
{
  "lesson-1-vocab": {
    "background": "https://storage.chillteacher.com/backgrounds/lessons/multiple-intelligence-theory.webp",
    "title": "Multiple Intelligence Theory",
    "description": "Lesson 1: Vocabulary - Part 1",
    "menu": [
      { "type": "page", "id": "assignments" },
      { "type": "video", "id": "youtube-lesson" },
      { "type": "activity", "id": "vocabulary" },
      { "type": "activity", "id": "flashcards" },
      { "type": "activity", "id": "matching-game" }
    ],
    "externalContent": {
      "videos": [
        {
          "id": "youtube-lesson",
          "url": "https://youtu.be/BXx6jqf9nyM",
          "title": "Lesson Video"
        }
      ]
    },
    "vocab": [
      {
        "word": "intelligence",
        "phonics": "/ɪnˈtɛlədʒəns/",
        "partOfSpeech": "n",
        "image": "",
        "vietnameseMeaning": "trí thông minh",
        "sampleSentence": "Emotional intelligence is as important as IQ.",
        "vietnameseTranslation": "Trí tuệ cảm xúc cũng quan trọng như IQ."
      }
    ],
    "pages": [
      {
        "id": "assignments",
        "title": "Nhiệm vụ",
        "scrollable": true,
        "root": [
          {
            "tag": "h1",
            "attributes": { "class": "text-4xl font-bold text-indigo-700 text-center" },
            "children": [{ "text": "Multiple Intelligence Theory" }]
          },
          {
            "tag": "ol",
            "attributes": { "class": "text-3xl text-left text-gray-800 space-y-8" },
            "children": [
              {
                "tag": "li",
                "children": [{ "text": "Xem video bài học." }]
              },
              {
                "tag": "li",
                "children": [{ "text": "Luyện tập từ vựng bằng các hoạt động tương tác." }]
              }
            ]
          }
        ],
        "containerClassName": "bg-white bg-opacity-90 rounded-xl p-10 shadow-2xl"
      }
    ]
  }
}
```

### Example 2: Lesson with Cloze Game

```json
{
  "lesson-1-vocab": {
    "background": "https://storage.chillteacher.com/backgrounds/lessons/multiple-intelligence-theory.webp",
    "title": "Multiple Intelligence Theory",
    "description": "Lesson 1: Vocabulary - Part 1",
    "menu": [
      { "type": "activity", "id": "cloze-game" }
    ],
    "vocab": [
      {
        "word": "intelligence",
        "phonics": "/ɪnˈtɛlədʒəns/",
        "vietnameseMeaning": "trí thông minh",
        "sampleSentence": "Emotional intelligence is as important as IQ.",
        "vietnameseTranslation": "Trí tuệ cảm xúc cũng quan trọng như IQ."
      }
    ],
    "clozeData": {
      "sentences": [
        {
          "sentence": "People with high _____ work well together in groups.",
          "word": "intelligence"
        },
        {
          "sentence": "You need good _____ to solve math problems.",
          "word": "logical-mathematical skills"
        }
      ]
    }
  }
}
```

### Example 3: Lesson with Reading Comprehension

```json
{
  "lesson-4-reading": {
    "background": "https://storage.chillteacher.com/backgrounds/lessons/multiple-intelligence-theory.webp",
    "title": "Multiple Intelligence Theory",
    "description": "Lesson 4: Reading",
    "menu": [
      { "type": "activity", "id": "reading-comprehension" }
    ],
    "readingData": {
      "title": "Applying Multiple Intelligence Theory in the Classroom",
      "passage": [
        {
          "content": "Multiple Intelligence (MI) theory suggests that learners have different strengths."
        }
      ],
      "questions": {
        "singleChoice": [
          {
            "id": "sc1",
            "prompt": "What is the main idea behind Multiple Intelligence theory?",
            "options": [
              { "value": "varied-strengths", "label": "Learners have varied strengths that can be developed." }
            ],
            "correct": "varied-strengths"
          }
        ],
        "tfng": [
          {
            "id": "tf1",
            "statement": "MI theory argues that students can develop multiple intelligences.",
            "correct": "true"
          }
        ]
      }
    }
  }
}
```

---

## Best Practices

1. **File Naming**: Use kebab-case for lesson filenames (e.g., `lesson-1-vocab.json`)

2. **ID Consistency**: Ensure all IDs referenced in `menu` exist in their respective arrays:
   - Activity IDs must be valid activity registry IDs
   - Page IDs must exist in the `pages` array
   - Video/Slide/Embed IDs must exist in `externalContent`

3. **Vocabulary Images**: Use web-optimized image formats (`.webp`) when possible for better performance

4. **Menu Order**: Place the most important items (like assignments) at the beginning of the menu array

5. **Content Organization**: Keep vocabulary items logically grouped and ordered

6. **Background Images**: Use consistent background images across related lessons for visual continuity

7. **Testing**: Always test your lesson JSON by loading it in the application to ensure all activities and content work correctly

---

## Troubleshooting

### Common Issues

1. **Activity not showing**: Check that the activity ID is valid and matches an entry in the activity registry

2. **Page not found**: Ensure the page `id` in the menu matches an `id` in the `pages` array

3. **External content not loading**: Verify URLs are correct and accessible

4. **Vocabulary activities empty**: Ensure the `vocab` array is included and contains valid vocabulary items

5. **Cloze game not working**: Check that `clozeData` is included with proper structure

6. **Candy Crush game not working**: Verify `questions` array is included with valid question objects

7. **Reading comprehension error**: Ensure `readingData` has correct structure with `title`, `passage`, and `questions`

---

## Additional Resources

- Activity component source code: `src/lib/components/activities/`
- Lesson route handler: `src/routes/(main)/lessons/$course/$unit.$lesson/route.tsx`
- Activity router: `src/routes/(main)/lessons/$course/$unit.$lesson/$activity.tsx`
- Example lessons: `src/routes/(main)/lessons/mock-data/lessons/`

---

**Last Updated**: Based on codebase analysis as of documentation creation date.

