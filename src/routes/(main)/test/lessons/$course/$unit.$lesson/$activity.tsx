// Router
import { createFileRoute, useNavigate, notFound } from '@tanstack/react-router'
import { Route as parentRoute } from './route'

// Activity Components (vocab-based only, slides have dedicated routes)
import Flashcard from '@/lib/components/activities/Flashcard'
import Vocabulary from '@/lib/components/activities/Vocabulary'
import MatchingGame from '@/lib/components/activities/MatchingGame'
import MemoryGame from '@/lib/components/activities/MemoryGame'
import AnagramGame from '@/lib/components/activities/AnagramGame'
import MultipleChoiceEnViGame from '@/lib/components/activities/MultipleChoiceEnViGame'
import MultipleChoiceViEnGame from '@/lib/components/activities/MultipleChoiceViEnGame'
import UnjumbleGame from '@/lib/components/activities/UnjumbleGame'
import ClozeGame from '@/lib/components/activities/ClozeGame'
import PictureChoiceEnGame from '@/lib/components/activities/PictureChoiceEnGame'
import PictureTypingEnGame from '@/lib/components/activities/PictureTypingEnGame'
import ImageRevealChoiceGame from '@/lib/components/activities/ImageRevealChoiceGame'
import ListeningTypingEnGame from '@/lib/components/activities/ListeningTypingEnGame'
import ListeningSentenceTypingGame from '@/lib/components/activities/ListeningSentenceTypingGame'
import VietnameseToEnglishTranslationGame from '@/lib/components/activities/VietnameseToEnglishTranslationGame'
import CandyCrushEnglishGame from '@/lib/components/activities/CandyCrushEnglishGame'
import ContentPageSlide from '@/lib/components/activities/ContentPageSlide'

// Activity Components Registry
const activityComponents: Record<string, React.FC<any>> = {
  Flashcard: Flashcard,
  Vocabulary: Vocabulary,
  MatchingGame: MatchingGame,
  MemoryGame: MemoryGame,
  AnagramGame: AnagramGame,
  MultipleChoiceEnViGame: MultipleChoiceEnViGame,
  MultipleChoiceViEnGame: MultipleChoiceViEnGame,
  UnjumbleGame: UnjumbleGame,
  ClozeGame: ClozeGame,
  PictureChoiceEnGame: PictureChoiceEnGame,
  PictureTypingEnGame: PictureTypingEnGame,
  ImageRevealChoiceGame: ImageRevealChoiceGame,
  ListeningTypingEnGame: ListeningTypingEnGame,
  ListeningSentenceTypingGame: ListeningSentenceTypingGame,
  VietnameseToEnglishTranslationGame: VietnameseToEnglishTranslationGame,
  CandyCrushEnglishGame: CandyCrushEnglishGame,
  ContentPageSlide: ContentPageSlide,
}

// Activity Metadata Registry - Fixed configuration for all activities
export const ACTIVITY_REGISTRY: Record<
  string,
  {
    title: string
    icon: string
    component: string
    description?: string
  }
> = {
  vocabulary: {
    title: 'Vocabulary',
    icon: '📚',
    component: 'Vocabulary',
    description: 'Learn new words',
  },
  flashcards: {
    title: 'Flashcards',
    icon: '🎴',
    component: 'Flashcard',
    description: 'Practice with flashcards',
  },
  'matching-game': {
    title: 'Matching Game',
    icon: '🎯',
    component: 'MatchingGame',
    description: 'Match words with meanings',
  },
  'memory-game': {
    title: 'Memory Game',
    icon: '🧠',
    component: 'MemoryGame',
    description: 'Test your memory',
  },
  'multiple-choice-envi': {
    title: 'Multiple Choice (EN→VI)',
    icon: '✅',
    component: 'MultipleChoiceEnViGame',
    description: 'Choose correct Vietnamese meaning',
  },
  'multiple-choice-vien': {
    title: 'Multiple Choice (VI→EN)',
    icon: '✔️',
    component: 'MultipleChoiceViEnGame',
    description: 'Choose correct English word',
  },
  'anagram-game': {
    title: 'Anagram Game',
    icon: '🔤',
    component: 'AnagramGame',
    description: 'Unscramble the letters',
  },
  'unjumble-game': {
    title: 'Unjumble Game',
    icon: '📝',
    component: 'UnjumbleGame',
    description: 'Put words in order',
  },
  'cloze-game': {
    title: 'Fill in the Blanks',
    icon: '📋',
    component: 'ClozeGame',
    description: 'Complete the sentences',
  },
  'picture-choice': {
    title: 'Picture Choice',
    icon: '🖼️',
    component: 'PictureChoiceEnGame',
    description: 'Choose the correct word for picture',
  },
  'picture-typing': {
    title: 'Picture Typing',
    icon: '⌨️',
    component: 'PictureTypingEnGame',
    description: 'Type the word for picture',
  },
  'listening-typing': {
    title: 'Listening & Typing',
    icon: '🎧',
    component: 'ListeningTypingEnGame',
    description: 'Listen and type what you hear',
  },
  'listening-sentence': {
    title: 'Listening Sentence',
    icon: '🎵',
    component: 'ListeningSentenceTypingGame',
    description: 'Listen and type the sentence',
  },
  'translation-game': {
    title: 'Translation (VI→EN)',
    icon: '🌐',
    component: 'VietnameseToEnglishTranslationGame',
    description: 'Translate to English',
  },
  'candy-crush': {
    title: 'Candy Crush Quiz',
    icon: '🍬',
    component: 'CandyCrushEnglishGame',
    description: 'Answer questions to crush candies',
  },
  'image-reveal': {
    title: 'Image Reveal',
    icon: '🎨',
    component: 'ImageRevealChoiceGame',
    description: 'Reveal the hidden image',
  },
}

export const Route = createFileRoute(
  '/(main)/test/lessons/$course/$unit/$lesson/$activity',
)({
  component: ActivityComponent,
})

function ActivityComponent() {
  const navigate = useNavigate()
  const { activity: activityId } = Route.useParams()
  const lessonData = parentRoute.useLoaderData()
  const { background, vocab, title, activities, clozeData, questions } =
    lessonData

  // Check if activity exists in lesson's enabled activities
  if (!activities.includes(activityId)) {
    throw notFound()
  }

  // Get activity metadata from registry
  const activityMeta = ACTIVITY_REGISTRY[activityId]

  if (!activityMeta) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-red-600">
          Activity "{activityId}" not found in registry
        </div>
      </div>
    )
  }

  const handleClose = () => {
    navigate({ to: '..' })
  }

  // Get component from registry
  const ActivityComponent = activityComponents[activityMeta.component]

  if (!ActivityComponent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-red-600">
          Component "{activityMeta.component}" not found
        </div>
      </div>
    )
  }

  // Prepare props based on activity type
  const baseProps = {
    vocabData: vocab,
    title: `${activityMeta.title} - ${title}`,
    backgroundUrl: background,
    onClose: handleClose,
  }

  // Add special data for specific games
  if (activityMeta.component === 'ClozeGame') {
    return <ActivityComponent {...baseProps} clozeData={clozeData} />
  }

  if (activityMeta.component === 'CandyCrushEnglishGame') {
    return <ActivityComponent {...baseProps} questionsData={questions} />
  }
  // Render standard vocab-based activity
  return <ActivityComponent {...baseProps} />
}
