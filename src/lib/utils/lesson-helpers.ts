import { LocalStorageKeys, getFromLocalStorage } from './local-storage-helpers'
import type { AuthSuccessData } from '@/lib/fetches/auth.fetch'

export interface Lesson {
  course: string
  unit: string
  lesson: string
  bg: string
  courseDisplay?: string
  unitDisplay?: string
  lessonDisplay?: string
  description?: string
}

export interface AllowedLesson {
  course: string
  unit: string
  lesson: string
}

export interface StudentLessons {
  username: string
  allowedLessons: AllowedLesson[]
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): AuthSuccessData['user'] | null {
  return getFromLocalStorage<AuthSuccessData['user']>(LocalStorageKeys.USER)
}

/**
 * Load student lessons configuration for a specific user
 * Returns null if the file doesn't exist or user is not a student
 */
export async function loadStudentLessons(
  username: string,
): Promise<StudentLessons | null> {
  try {
    const data = (await import(
      `@/mock-data/student-lessons/${username}.json`
    )) as { default: StudentLessons }
    return data.default
  } catch {
    // File doesn't exist for this user, return null
    return null
  }
}

/**
 * Check if a lesson is allowed for a user
 */
function isLessonAllowed(
  lesson: Lesson,
  allowedLessons: AllowedLesson[],
): boolean {
  return allowedLessons.some(
    (allowed) =>
      allowed.course === lesson.course &&
      allowed.unit === lesson.unit &&
      allowed.lesson === lesson.lesson,
  )
}

/**
 * Check if a user has access to a specific lesson
 * Returns true if user is Admin/Teacher or if the lesson is in their allowed list
 */
export async function hasLessonAccess(
  course: string,
  unit: string,
  lesson: string,
): Promise<boolean> {
  const user = getCurrentUser()

  // If no user, deny access
  if (!user) {
    return false
  }

  // Admin and Teacher can access all lessons
  if (user.role === 'Admin' || user.role === 'Teacher') {
    return true
  }

  // For Students, check if lesson is in their allowed list
  if (user.role === 'Student' && user.username) {
    const studentLessons = await loadStudentLessons(user.username)
    if (studentLessons) {
      return studentLessons.allowedLessons.some(
        (allowed) =>
          allowed.course === course &&
          allowed.unit === unit &&
          allowed.lesson === lesson,
      )
    }
    // If no student-lessons file exists, deny access
    return false
  }

  // Default: deny access (fallback)
  return false
}

/**
 * Filter lessons based on user permissions
 * - If user is Admin or Teacher: return all lessons
 * - If user is Student: filter based on student-lessons file
 * - If student-lessons file doesn't exist: return empty array (or all lessons, depending on requirement)
 */
export async function filterLessonsByUser(
  lessons: Lesson[],
): Promise<Lesson[]> {
  const user = getCurrentUser()

  // If no user, return empty array (shouldn't happen due to route protection, but safe guard)
  if (!user) {
    return []
  }

  // Admin and Teacher can see all lessons
  if (user.role === 'Admin' || user.role === 'Teacher') {
    return lessons
  }

  // For Students, filter based on student-lessons file
  if (user.role === 'Student' && user.username) {
    const studentLessons = await loadStudentLessons(user.username)
    if (studentLessons) {
      return lessons.filter((lesson) =>
        isLessonAllowed(lesson, studentLessons.allowedLessons),
      )
    }
    // If no student-lessons file exists, return empty array
    // Change this behavior if you want to show all lessons by default
    return []
  }

  // Default: return all lessons (fallback)
  return lessons
}
