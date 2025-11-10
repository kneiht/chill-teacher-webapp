// Define types locally to avoid import issues
interface VocabItem {
  word: string
  translation: string
  sentence: string
  image?: string
  wordPronunciation?: string
  sentencePronunciation?: string
}

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  image?: string
}

interface ReadingSlide {
  text: string
  image?: string
  audio?: string
}

interface ContentBlock {
  type: string
  src?: string
  [key: string]: any
}

interface Page {
  title: string
  content?: ContentBlock[]
}

interface LessonData {
  background?: string
  title: string
  description: string
  vocab?: VocabItem[]
  questions?: Question[]
  readingSlidesData?: ReadingSlide[]
  pages?: Page[]
  [key: string]: any
}

/**
 * Extracts all image URLs from lesson data
 */
function extractImageUrls(lessonData: LessonData): string[] {
  const imageUrls: string[] = []
  
  // Extract from background
  if (lessonData.background) {
    imageUrls.push(lessonData.background)
  }
  
  // Extract from vocab items
  if (lessonData.vocab) {
    lessonData.vocab.forEach((item: VocabItem) => {
      if (item.image) {
        imageUrls.push(item.image)
      }
    })
  }
  
  // Extract from questions
  if (lessonData.questions) {
    lessonData.questions.forEach((question: Question) => {
      if (question.image) {
        imageUrls.push(question.image)
      }
    })
  }
  
  // Extract from reading slides data
  if (lessonData.readingSlidesData) {
    lessonData.readingSlidesData.forEach((slide: ReadingSlide) => {
      if (slide.image) {
        imageUrls.push(slide.image)
      }
    })
  }
  
  // Extract from pages content
  if (lessonData.pages) {
    lessonData.pages.forEach((page: Page) => {
      if (page.content) {
        page.content.forEach((block: ContentBlock) => {
          if (block.type === 'image' && block.src) {
            imageUrls.push(block.src)
          }
        })
      }
    })
  }
  
  return imageUrls
}

/**
 * Extracts all audio URLs from lesson data
 */
function extractAudioUrls(lessonData: LessonData): string[] {
  const audioUrls: string[] = []
  
  // Extract from vocab items
  if (lessonData.vocab) {
    lessonData.vocab.forEach((item: VocabItem) => {
      if (item.wordPronunciation) {
        audioUrls.push(item.wordPronunciation)
      }
      if (item.sentencePronunciation) {
        audioUrls.push(item.sentencePronunciation)
      }
    })
  }
  
  // Extract from reading slides data
  if (lessonData.readingSlidesData) {
    lessonData.readingSlidesData.forEach((slide: ReadingSlide) => {
      if (slide.audio) {
        audioUrls.push(slide.audio)
      }
    })
  }
  
  return audioUrls
}

/**
 * Preloads an image
 */
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
    img.src = url
  })
}

/**
 * Preloads an audio file
 */
function preloadAudio(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    audio.oncanplaythrough = () => resolve()
    audio.onerror = () => reject(new Error(`Failed to load audio: ${url}`))
    audio.src = url
  })
}

/**
 * Preloads all media assets (images and audio) from lesson data
 */
export async function preloadLessonMedia(lessonData: LessonData): Promise<void> {
  const imageUrls = extractImageUrls(lessonData)
  const audioUrls = extractAudioUrls(lessonData)
  
  // Preload all images
  const imagePromises = imageUrls.map(url => 
    preloadImage(url).catch(error => {
      console.warn(`Failed to preload image: ${url}`, error)
      // Continue with other images even if one fails
      return Promise.resolve()
    })
  )
  
  // Preload all audio
  const audioPromises = audioUrls.map(url => 
    preloadAudio(url).catch(error => {
      console.warn(`Failed to preload audio: ${url}`, error)
      // Continue with other audio files even if one fails
      return Promise.resolve()
    })
  )
  
  // Wait for all media to preload
  await Promise.all([...imagePromises, ...audioPromises])
}

/**
 * Preloads all media assets from lesson data without waiting for completion
 * This is useful when you want to start preloading but not block the UI
 */
export function preloadLessonMediaAsync(lessonData: LessonData): void {
  // Fire and forget - don't await
  preloadLessonMedia(lessonData).catch(error => {
    console.error('Error preloading lesson media:', error)
  })
}