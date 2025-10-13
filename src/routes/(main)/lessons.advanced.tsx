import { createFileRoute } from '@tanstack/react-router'
import { Card, Col, Row, Typography } from 'antd'

const { Title } = Typography

const lessons = [
  {
    title: 'Multiple Intelligence Theory',
    description: 'Lesson 1: Vocabulary - Part 1',
    path: '../../lessons/advanced-topics/multiple-intelligence-theory/lesson-1/',
    imageUrl: '/backgrounds/multiple-intelligence-theory.webp',
  },
  {
    title: 'Multiple Intelligence Theory',
    description: 'Lesson 1: Vocabulary - Part 2',
    path: '../../lessons/advanced-topics/multiple-intelligence-theory/lesson-2/',
    imageUrl: '/backgrounds/multiple-intelligence-theory.webp',
  },
  {
    title: 'Multiple Intelligence Theory',
    description: 'Lesson 1: Vocabulary - Part 3',
    path: '../../lessons/advanced-topics/multiple-intelligence-theory/lesson-3/',
    imageUrl: '/backgrounds/multiple-intelligence-theory.webp',
  },
]

export const Route = createFileRoute('/(main)/lessons/advanced')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Title level={2}>Available Lessons</Title>
      <Row gutter={[16, 16]}>
        {lessons.map((lesson) => (
          <Col
            key={lesson.path}
            xs={24} // 1 column for extra small screens
            sm={12} // 2 columns for small screens
            md={8} // 3 columns for medium screens and up
            lg={6} // 4 columns for large screens and up
          >
            <a
              href={lesson.path}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Card
                hoverable
                cover={
                  <img
                    alt={lesson.title}
                    src={lesson.imageUrl}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta
                  title={lesson.title}
                  description={lesson.description}
                />
              </Card>
            </a>
          </Col>
        ))}
      </Row>
    </div>
  )
}
