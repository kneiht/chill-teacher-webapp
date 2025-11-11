import { createFileRoute } from '@tanstack/react-router'
import { Card, Col, Row, Typography, Empty, Divider, Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { filterLessonsByUser, type Lesson } from '@/lib/utils/lesson-helpers'
import { useAuth } from '@/lib/hooks/use-auth'
import { useState } from 'react'
import { LessonEditModal } from '@/lib/components/admin/LessonEditModal'

const { Title, Text } = Typography

// List of available courses
const AVAILABLE_COURSES = ['advanced-topics', 'everybody-up-starter'] as const

export const Route = createFileRoute('/(main)/lessons/')({
  loader: async (): Promise<{
    lessons: Lesson[]
    groupedByCourseAndUnit: Record<string, Record<string, Lesson[]>>
  }> => {
    const allLessons: Lesson[] = []
    const groupedByCourseAndUnit: Record<string, Record<string, Lesson[]>> = {}

    // Load lessons from all courses
    for (const course of AVAILABLE_COURSES) {
      try {
        const data = (await import(`@/mock-data/courses/${course}.json`)) as {
          default: Array<Lesson>
        }
        const courseLessons = data.default
        allLessons.push(...courseLessons)
      } catch (error) {
        console.error(`Error loading course ${course}:`, error)
      }
    }

    // Filter lessons based on user permissions
    const filteredLessons = await filterLessonsByUser(allLessons)

    // Group lessons by course and unit
    filteredLessons.forEach((lesson) => {
      if (!groupedByCourseAndUnit[lesson.course]) {
        groupedByCourseAndUnit[lesson.course] = {}
      }
      if (!groupedByCourseAndUnit[lesson.course][lesson.unit]) {
        groupedByCourseAndUnit[lesson.course][lesson.unit] = []
      }
      groupedByCourseAndUnit[lesson.course][lesson.unit].push(lesson)
    })

    return {
      lessons: filteredLessons,
      groupedByCourseAndUnit,
    }
  },
  component: LessonsList,
})

function LessonsList() {
  const { lessons, groupedByCourseAndUnit } = Route.useLoaderData()
  const { user } = useAuth()
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [editModalVisible, setEditModalVisible] = useState(false)

  // Get display name for course (use courseDisplay if available, otherwise format)
  const getCourseDisplayName = (course: string, lessons: Lesson[]): string => {
    const firstLesson = lessons.find((l) => l.course === course)
    if (firstLesson?.courseDisplay) {
      return firstLesson.courseDisplay
    }
    return course
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Get display name for unit (use unitDisplay if available, otherwise format)
  const getUnitDisplayName = (unit: string, lessons: Lesson[]): string => {
    const firstLesson = lessons.find((l) => l.unit === unit)
    if (firstLesson?.unitDisplay) {
      return firstLesson.unitDisplay
    }
    return unit
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Get display name for lesson (use lessonDisplay if available, otherwise format)
  const getLessonDisplayName = (lesson: Lesson): string => {
    if (lesson.lessonDisplay) {
      return lesson.lessonDisplay
    }
    return lesson.lesson
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Check if user is admin
  const isAdmin = user?.role === 'Admin'

  // Handle edit button click
  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setEditModalVisible(true)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setEditingLesson(null)
    setEditModalVisible(false)
  }

  if (lessons.length === 0) {
    return (
      <div>
        <Title level={2}>Available Lessons</Title>
        <Empty
          description="No lessons available for your account."
          style={{ marginTop: '2rem' }}
        />
      </div>
    )
  }

  return (
    <div>
      <Title level={2}>Available Lessons</Title>
      <Text
        type="secondary"
        style={{ marginBottom: '1.5rem', display: 'block' }}
      >
        Total: {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
      </Text>

      {/* Display lessons grouped by course and unit */}
      {Object.entries(groupedByCourseAndUnit).map(
        ([course, units], courseIndex) => (
          <div key={course} style={{ marginBottom: '3rem' }}>
            {courseIndex > 0 && <Divider style={{ margin: '2rem 0' }} />}
            <Title level={3} style={{ marginBottom: '1rem' }}>
              {getCourseDisplayName(course, lessons)}
            </Title>

            {/* Display units within course */}
            {Object.entries(units).map(([unit, unitLessons], unitIndex) => (
              <div
                key={`${course}-${unit}`}
                style={{ marginBottom: '2rem', marginLeft: '1rem' }}
              >
                {unitIndex > 0 && (
                  <Divider style={{ margin: '1.5rem 0' }} orientation="left" />
                )}
                <Title level={4} style={{ marginBottom: '0.5rem' }}>
                  {getUnitDisplayName(unit, lessons)}
                </Title>
                <Text
                  type="secondary"
                  style={{ display: 'block', marginBottom: '1rem' }}
                >
                  {unitLessons.length} lesson
                  {unitLessons.length !== 1 ? 's' : ''} available
                </Text>
                <Row gutter={[16, 16]}>
                  {unitLessons.map((lesson) => {
                    const lessonPath = `/lessons/${lesson.course}/${lesson.unit}/${lesson.lesson}`

                    return (
                      <Col
                        key={lessonPath}
                        xs={24}
                        sm={12}
                        md={8}
                        lg={6}
                        xl={6}
                      >
                        <div style={{ position: 'relative' }}>
                          <a
                            href={lessonPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none' }}
                          >
                            <Card
                              hoverable
                              cover={
                                <div
                                  style={{
                                    position: 'relative',
                                    height: 200,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <img
                                    alt={
                                      lesson.lessonDisplay ||
                                      lesson.lesson ||
                                      'Lesson'
                                    }
                                    src={lesson.bg}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                    }}
                                    onError={(e) => {
                                      // Fallback to a placeholder if image fails to load
                                      ;(e.target as HTMLImageElement).src =
                                        'https://via.placeholder.com/400x200?text=Lesson'
                                    }}
                                  />
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                      color: '#fff',
                                      fontSize: 20,
                                      fontWeight: 700,
                                      textAlign: 'center',
                                      width: '100%',
                                      padding: '12px 16px',
                                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                      textShadow:
                                        '0 2px 8px rgba(0, 0, 0, 0.5)',
                                    }}
                                  >
                                    {getLessonDisplayName(lesson)}
                                  </div>
                                </div>
                              }
                            >
                              <Card.Meta
                                title={`${getUnitDisplayName(
                                  lesson.unit,
                                  lessons,
                                )}`}
                                description={lesson.description}
                              />
                            </Card>
                          </a>
                          {isAdmin && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                display: 'flex',
                                gap: 4,
                              }}
                            >
                              <Button
                                type="primary"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleEditLesson(lesson)
                                }}
                                style={{
                                  backgroundColor: 'rgba(24, 144, 255, 0.9)',
                                  borderColor: '#1890ff',
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </Col>
                    )
                  })}
                </Row>
              </div>
            ))}
          </div>
        ),
      )}

      {/* Lesson Edit Modal */}
      {editModalVisible && editingLesson && (
        <LessonEditModal
          lesson={editingLesson}
          visible={editModalVisible}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
