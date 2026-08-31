# Guaraní Shadowing MVP

## 1. Project Goal

Build a mobile-first, stateless web application for practicing the pronunciation and phonetics of Paraguayan Guaraní through shadowing.

The MVP should allow a learner to:

* Watch one predefined YouTube video.
* Follow a synchronized Guaraní transcript.
* See the currently spoken phrase highlighted.
* Click any transcript phrase to jump to that point in the video.
* Repeat individual phrases.
* Navigate to the previous or next phrase.
* Automatically loop the currently selected phrase.
* Change video playback speed.
* See a placeholder area for the phrase translation.

The MVP is intended to validate the core shadowing experience before adding larger content libraries, accounts, pronunciation analysis, or other advanced features.

---

# 2. Target User

The application is intended for anyone who wants to practice the phonetics and pronunciation of Paraguayan Guaraní.

Users may include:

* Complete beginners.
* Learners who already understand some Guaraní.
* Heritage learners.
* Spanish-speaking learners.
* Learners from other linguistic backgrounds.

The MVP should therefore not assume prior knowledge of Guaraní grammar or vocabulary.

---

# 3. MVP Scope

The MVP contains:

* One predefined lesson.
* One predefined YouTube video.
* One timestamped Guaraní transcript.
* Sentence-level transcript segmentation.
* Translation placeholders.
* Shadowing playback controls.
* Responsive/mobile-first interface.

The MVP does **not** require dynamic lesson discovery or user-generated content.

---

# 4. Technology Stack

Use a static frontend architecture.

Recommended stack:

* HTML
* CSS
* Vanilla JavaScript
* JSON
* YouTube IFrame Player API
* GitHub Pages for deployment

No backend is required.

No database is required.

---

# 5. Application Architecture

```text
GitHub Pages
│
├── index.html
│
├── css/
│   └── styles.css
│
├── js/
│   ├── app.js
│   ├── youtube-player.js
│   ├── transcript.js
│   └── shadowing-controls.js
│
├── data/
│   ├── lessons/
│   │   └── lesson-001.json
│   │
│   └── translations/
│       └── en.json
│
└── assets/
    ├── images/
    └── icons/
```

---

# 6. Core Data Model

Each lesson should have its own JSON file.

Example:

```json
{
  "id": "lesson-001",
  "title": "Guaraní Shadowing Demo",
  "language": "gn",
  "variant": "Paraguayan Guarani",

  "video": {
    "provider": "youtube",
    "videoId": "YOUTUBE_VIDEO_ID"
  },

  "segments": [
    {
      "id": "phrase-001",
      "start": 2.4,
      "end": 5.8,
      "text": "Mba'éichapa reiko?",
      "translationId": "translation-001"
    },
    {
      "id": "phrase-002",
      "start": 5.8,
      "end": 9.2,
      "text": "Che aime porã.",
      "translationId": "translation-002"
    }
  ]
}
```

---

# 7. Segment Structure

Each transcript segment must contain:

```text
id
start
end
text
translationId
```

Definitions:

### `id`

Unique identifier for the phrase.

Example:

```text
phrase-001
```

### `start`

Timestamp in seconds where the phrase begins.

Example:

```text
5.8
```

### `end`

Timestamp in seconds where the phrase ends.

Example:

```text
9.2
```

### `text`

Original Paraguayan Guaraní transcription.

### `translationId`

Identifier used to retrieve the translation separately from the lesson transcript.

---

# 8. Translation Structure

Translations should be separated from the original transcript.

Example:

```text
data/
└── translations/
    ├── en.json
    ├── es.json
    └── de.json
```

For the MVP, only one translation file is necessary.

Example `en.json`:

```json
{
  "translation-001": "Translation placeholder",
  "translation-002": "Translation placeholder"
}
```

This structure should allow additional translation languages to be added later without modifying the original Guaraní lesson data.

---

# 9. Main Application State

The application should maintain the concept of an active transcript segment.

Example:

```javascript
let activeSegmentIndex = 0;
```

The active segment determines:

* Highlighted transcript phrase.
* Current translation.
* Repeat behavior.
* Loop boundaries.
* Previous/next navigation.

During normal playback, the active segment should automatically follow the video's current timestamp.

---

# 10. YouTube Player

Use the YouTube IFrame Player API.

The application must support:

```text
initialize player
play
pause
seek
get current timestamp
change playback speed
```

The MVP does not require the YouTube Data API.

The video is predefined by its YouTube video ID inside the lesson JSON.

---

# 11. Transcript Synchronization

The application should periodically read the YouTube player's current playback position.

Recommended polling frequency:

```text
approximately every 100–250 milliseconds
```

Conceptual logic:

```javascript
const currentTime = player.getCurrentTime();

for (const segment of segments) {
    if (
        currentTime >= segment.start &&
        currentTime < segment.end
    ) {
        setActiveSegment(segment);
    }
}
```

When the active segment changes:

1. Highlight the corresponding transcript phrase.
2. Update the translation display.
3. Update shadowing controls.
4. Scroll the active phrase into view when appropriate.

---

# 12. Clicking Transcript Phrases

Every transcript phrase must be interactive.

When a user clicks a phrase:

```text
set phrase as active
        ↓
seek YouTube player to phrase.start
        ↓
play from that timestamp
```

Conceptually:

```javascript
player.seekTo(segment.start);
```

The transcript therefore acts both as:

* A synchronized transcript.
* Video navigation.

---

# 13. Active Phrase Highlighting

Only one phrase should normally be visually active.

Example:

```text
Mba'éichapa reiko?

▶ Che aime porã.

Ha nde?

Iporã.
```

The highlight should clearly indicate the phrase currently being spoken or practiced.

---

# 14. Shadowing Controls

The MVP must provide the following controls:

## Previous Phrase

Move to:

```text
activeSegmentIndex - 1
```

Then seek the video to that phrase's start timestamp.

---

## Next Phrase

Move to:

```text
activeSegmentIndex + 1
```

Then seek the video to that phrase's start timestamp.

---

## Repeat Phrase

Restart playback from:

```text
activeSegment.start
```

Example:

```javascript
player.seekTo(activeSegment.start);
player.playVideo();
```

---

## Automatic Loop

The user must be able to enable or disable phrase looping.

When looping is active:

```text
phrase start
     ↓
play
     ↓
phrase end
     ↓
seek back to phrase start
     ↓
repeat
```

Conceptual logic:

```javascript
if (
    loopEnabled &&
    currentTime >= activeSegment.end
) {
    player.seekTo(activeSegment.start);
}
```

---

## Playback Speed

Provide selectable playback speeds.

Recommended initial options:

```text
0.5×
0.75×
1×
1.25×
```

Only playback rates supported by the YouTube player should be exposed.

---

# 15. Mobile-First Interface

The application should be designed for mobile first.

Recommended mobile layout:

```text
┌─────────────────────────┐
│                         │
│      YouTube Video      │
│                         │
└─────────────────────────┘

     ◀   Repeat   ▶

       Loop   0.75×

───────────────────────────

Transcript

Mba'éichapa reiko?

▶ Che aime porã.

Ha nde?

Iporã.

───────────────────────────

Translation

Translation placeholder
```

The video should remain easily visible while the learner interacts with the transcript and shadowing controls.

---

# 16. Desktop Layout

Desktop may use a wider layout.

Example:

```text
┌────────────────────┬──────────────────────┐
│                    │                      │
│   YouTube Video    │     Transcript       │
│                    │                      │
│                    │ phrase 1             │
│                    │ > phrase 2           │
│                    │ phrase 3             │
│                    │                      │
├────────────────────┴──────────────────────┤
│ Previous | Repeat | Next | Loop | Speed  │
├───────────────────────────────────────────┤
│ Translation                              │
│ ...                                      │
└───────────────────────────────────────────┘
```

Desktop improvements must not compromise the mobile experience.

---

# 17. Automatic Transcript Scrolling

When video playback naturally advances to a new phrase, the corresponding transcript element may automatically scroll into view.

Example:

```javascript
activeElement.scrollIntoView({
    behavior: "smooth",
    block: "center"
});
```

Automatic scrolling should not constantly override the user's own manual scrolling.

---

# 18. JavaScript Module Responsibilities

## `youtube-player.js`

Responsible only for interaction with YouTube.

Responsibilities:

```text
initializePlayer()
play()
pause()
seekTo()
getCurrentTime()
setPlaybackRate()
```

This module should not contain transcript or Guaraní-specific logic.

---

## `transcript.js`

Responsible for transcript data and rendering.

Responsibilities:

```text
load lesson
render transcript
detect active segment
highlight segment
handle phrase selection
display translation
```

---

## `shadowing-controls.js`

Responsible for shadowing interactions.

Responsibilities:

```text
previous phrase
next phrase
repeat phrase
enable/disable loop
change playback speed
```

---

## `app.js`

Main application controller.

Responsibilities:

```text
load lesson JSON
initialize player
initialize transcript
initialize controls
connect player state to transcript state
manage active segment
```

---

# 19. Application Data Flow

```text
lesson-001.json
        │
        ▼
      app.js
        │
   ┌────┴─────┐
   │          │
   ▼          ▼
YouTube    Transcript
Player      Renderer
   │          │
   └────┬─────┘
        ▼
  activeSegment
        │
   ┌────┼──────────┐
   ▼    ▼          ▼
Highlight Translation Controls
```

The lesson JSON should function as the main content source.

The player implementation should remain reusable for future lessons.

---

# 20. Development Order

Implement the MVP in this order:

1. Create basic static page.
2. Add responsive/mobile-first layout.
3. Embed predefined YouTube video.
4. Load lesson JSON.
5. Render transcript from JSON.
6. Allow clicking transcript phrases.
7. Seek video when phrase is clicked.
8. Read YouTube current playback timestamp.
9. Automatically highlight active phrase.
10. Implement previous phrase.
11. Implement next phrase.
12. Implement repeat phrase.
13. Implement phrase looping.
14. Implement playback speed.
15. Load translation placeholder.
16. Add transcript auto-scrolling.
17. Polish mobile interaction.
18. Deploy with GitHub Pages.

Do not add advanced features before the basic shadowing interaction works reliably.

---

# 21. Explicitly Out of Scope

The MVP must **not** include:

* Backend server.
* Database.
* User accounts.
* Login or registration.
* Cookies.
* User tracking.
* Saved progress.
* Favorites.
* Audio recording.
* Microphone access.
* Speech recognition.
* Pronunciation scoring.
* AI transcription.
* Automatic translations.
* YouTube search.
* Random YouTube videos.
* Content management system.
* Admin dashboard.
* Lesson catalogue.
* Dynamic lesson discovery.

These may be considered in future versions.

---

# 22. Privacy / State

The MVP should be stateless.

No user data needs to be stored.

No application cookies are required.

Reloading the page may reset all application state.

HTTPS should be used through the hosting platform.

---

# 23. Content Ownership

The long-term application is intended to use original content owned or produced by the project creator.

The MVP may use one predefined video purely to demonstrate the shadowing architecture and user experience.

The application architecture should not depend on third-party transcript generation.

Transcripts and timestamps will be manually created.

---

# 24. Naming Convention

Internally use terminology such as:

```text
lesson
segment
phrase
transcript
activeSegment
translation
```

Avoid music-specific terminology such as:

```text
lyrics
verse
song line
```

because the platform should later support:

* Interviews.
* Conversations.
* Stories.
* Educational recordings.
* Oral history.
* Dialogue.
* Other spoken Guaraní content.

---

# 25. MVP Acceptance Criteria

The MVP is considered complete when a learner can:

* Open the website on a phone.
* See one predefined YouTube video.
* Start playing the video.
* See a Guaraní transcript.
* See the currently spoken phrase highlighted.
* Click a phrase to jump to it in the video.
* Move to the previous phrase.
* Move to the next phrase.
* Repeat the current phrase.
* Automatically loop the current phrase.
* Change playback speed.
* See the translation area update for the active phrase.
* Use the complete shadowing workflow without creating an account or storing user data.

The essential user experience is:

```text
watch
  ↓
listen
  ↓
follow transcript
  ↓
select phrase
  ↓
listen again
  ↓
repeat aloud
  ↓
loop if necessary
  ↓
continue to next phrase
```

---

# 26. Future Compatibility

Although these features are not part of the MVP, the architecture should avoid preventing future support for:

```text
multiple lessons
multiple speakers
multiple translation languages
learning notes
word-level vocabulary
difficulty levels
grammar explanations
phonetic annotations
cultural notes
lesson categories
search
user accounts
saved progress
recording
pronunciation analysis
original hosted video/audio
```

The MVP should remain simple and static while keeping lesson content separate from application logic.

---

# 27. Core Principle

Prioritize the quality of the shadowing interaction over feature quantity.

The first version only needs to prove that this experience works well:

```text
Guaraní video
      +
timestamped transcript
      +
phrase-level navigation
      +
repetition / looping
      +
translation
      =
useful shadowing lesson
```
