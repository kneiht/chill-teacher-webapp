import { createFileRoute } from '@tanstack/react-router'
import { Card, Col, Row, Typography } from 'antd'
import { filterLessonsByUser, type Lesson } from '@/lib/utils/lesson-helpers'

const { Title } = Typography

export const Route = createFileRoute('/(main)/lessons/$course/')({
  loader: async ({ params }): Promise<Array<Lesson> | { error: string }> => {
    try {
      const data = (await import(
        `@/mock-data/courses/${params.course}.json`
      )) as { default: Array<Lesson> }
      const allLessons = data.default

      // Filter lessons based on user permissions
      const filteredLessons = await filterLessonsByUser(allLessons)

      return filteredLessons
    } catch {
      return { error: 'Cannot find this course' }
    }
  },
  component: LessonProgram,
})

function LessonProgram() {
  const data = Route.useLoaderData()

  if ('error' in data) {
    return (
      <div>
        <Title level={2}>Error</Title>
        <p>{data.error}</p>
      </div>
    )
  }

  const lessons: Lesson[] = data

  // Show message if no lessons available
  if (lessons.length === 0) {
    return (
      <div>
        <Title level={2}>Available Lessons</Title>
        <p>No lessons available for your account.</p>
      </div>
    )
  }

  return (
    <div>
      <Title level={2}>Available Lessons</Title>

      <Row gutter={[16, 16]}>
        {lessons.map((lesson) => {
          const lessonPath = `/lessons/${lesson.course}/${lesson.unit}/${lesson.lesson}`

          return (
            <Col
              key={lessonPath}
              xs={24} // 1 column for extra small screens
              sm={12} // 2 columns for small screens
              md={8} // 3 columns for medium screens and up
              lg={6} // 4 columns for large screens and up
            >
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
                        alt={lesson.title}
                        src={lesson.bg}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: '#fff',
                          fontSize: 24,
                          fontWeight: 700,
                          textAlign: 'center',
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                        }}
                      >
                        {lesson.title}
                      </div>
                    </div>
                  }
                >
                  <Card.Meta
                    title={lesson.title}
                    description={lesson.description}
                  />
                </Card>
              </a>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}
