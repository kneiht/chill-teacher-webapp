import { createFileRoute } from '@tanstack/react-router'
import { Card, Col, Row, Typography } from 'antd'

const { Title } = Typography

const lessons = [
  {
    title: 'Everybody Up Starter - Unit 1',
    description: 'Lesson 1: School Supplies - Vocabulary 1',
    path: '../../lessons/everybody-up-0/unit-1/lesson-1/',
    imageUrl: '/backgrounds/EU0-U1L1.webp',
  },
  {
    title: 'Everybody Up Starter - Unit 1',
    description: 'Lesson 2: School Supplies - Vocabulary 2',
    path: '../../lessons/everybody-up-0/unit-1/lesson-2/',
    imageUrl: '/backgrounds/EU0-U1L2.webp',
  },
  {
    title: 'Everybody Up Starter - Unit 1',
    description: 'Lesson 3: School Supplies - Reading',
    path: '../../lessons/everybody-up-0/unit-1/lesson-3/',
    imageUrl: '/backgrounds/EU0-U1L2.webp',
  },
]

export const Route = createFileRoute('/(main)/lessons/eu')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Title level={2}>Available Lessons</Title>
      <Row gutter={[16, 16]}>
        {lessons.map((lesson) => (
          <Col key={lesson.path} xs={24} sm={12} md={8} lg={6}>
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
