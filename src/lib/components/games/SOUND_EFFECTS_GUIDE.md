# Sound Effects Integration Guide

This guide shows how to add sound effects to games using the `useSoundEffects` hook.

## Quick Start

### 1. Import the hook

```tsx
import { useSoundEffects } from '@/lib/hooks/useSoundEffects'
```

### 2. Initialize in your component

```tsx
const { play: playSound } = useSoundEffects({ volume: 0.6 })
```

### 3. Play sounds at key moments

```tsx
// On game start
playSound('start')

// On correct answer
playSound('correct')

// On incorrect answer
playSound('incorrect')

// On user interaction (click, select)
playSound('click')

// On game completion
playSound('success')

// On card flip (Memory game)
playSound('flip')

// On successful match
playSound('match')
```

## Available Sound Types

- `'correct'` - When user answers correctly
- `'incorrect'` - When user answers incorrectly
- `'click'` - On card/option selection
- `'success'` - When game is completed
- `'start'` - When game starts
- `'flip'` - When flipping cards (Memory game)
- `'match'` - When matching pairs

## Example: MatchingGame (Already Implemented)

```tsx
const MatchingGameCore: React.FC<MatchingGameProps> = ({
  vocabData,
  title,
}) => {
  // Initialize sound effects
  const { play: playSound } = useSoundEffects({ volume: 0.6 })

  const startGame = () => {
    // ... game setup code
    playSound('start')
  }

  const handleCardClick = (index: number) => {
    playSound('click')
    // ... handle card selection
  }

  const checkMatch = (selected: Array<number>) => {
    if (isMatch) {
      playSound('correct')
      if (isGameComplete) {
        playSound('success')
      }
    } else {
      playSound('incorrect')
    }
  }
}
```

## Example: Multiple Choice Games

```tsx
const MultipleChoiceGame = () => {
  const { play: playSound } = useSoundEffects()

  const handleAnswer = (selectedOption: string) => {
    playSound('click')

    if (selectedOption === correctAnswer) {
      playSound('correct')
      // Update score and move to next question
    } else {
      playSound('incorrect')
      // Handle wrong answer
    }
  }

  const handleGameComplete = () => {
    playSound('success')
    // Show results
  }
}
```

## Example: Memory Game

```tsx
const MemoryGame = () => {
  const { play: playSound } = useSoundEffects()

  const handleCardFlip = (index: number) => {
    playSound('flip')
    // Flip card logic
  }

  const checkForMatch = () => {
    if (cardsMatch) {
      playSound('match')
      // Keep cards revealed
    } else {
      playSound('incorrect')
      // Flip cards back
    }
  }
}
```

## Example: Typing Games

```tsx
const TypingGame = () => {
  const { play: playSound } = useSoundEffects()

  const handleSubmit = () => {
    if (userAnswer === correctAnswer) {
      playSound('correct')
    } else {
      playSound('incorrect')
    }
  }
}
```

## Advanced Options

### Custom Volume

```tsx
const { play: playSound } = useSoundEffects({ volume: 0.8 }) // 0.0 to 1.0
```

### Disable Sounds

```tsx
const { play: playSound } = useSoundEffects({ enabled: false })
```

### Additional Methods

```tsx
const { play, stop, stopAll, setVolume } = useSoundEffects()

// Play a sound
play('correct')

// Stop a specific sound
stop('correct')

// Stop all sounds
stopAll()

// Change volume dynamically
setVolume(0.5)
```

## Games to Update

Here's a checklist of games that need sound effects:

- [x] MatchingGame - ✅ Already implemented
- [ ] AnagramGame
- [ ] MultipleChoiceEnViGame
- [ ] MultipleChoiceViEnGame
- [ ] MemoryGame (use 'flip' sound)
- [ ] ListeningTypingEnGame
- [ ] UnjumbleGame
- [ ] ListeningSentenceTypingGame
- [ ] VietnameseToEnglishTranslationGame
- [ ] PictureChoiceEnGame
- [ ] ImageRevealChoiceGame
- [ ] PictureTypingEnGame
- [ ] ClozeGame

## Tips

1. **Play sounds at the right time**: Don't overuse sounds - only on significant events
2. **Volume levels**: Keep volume between 0.4-0.7 for best experience
3. **User preference**: Consider adding a settings toggle to enable/disable sounds
4. **Performance**: The hook caches audio instances, so it's efficient to use
5. **Error handling**: The hook gracefully handles missing sound files

## Testing Without Sound Files

The hook will work even if sound files don't exist yet - it will just log warnings to console. You can implement the code now and add actual sound files later.
