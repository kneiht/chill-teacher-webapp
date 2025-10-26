import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  // ArrowDownOutlined,
  ArrowUpOutlined,
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Col,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Typography,
} from 'antd'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type React from 'react'
import { useLang } from '@/lib/hooks/use-lang'
import { useAuth } from '@/lib/hooks/use-auth'

const { Title, Text } = Typography

const Dashboard: React.FC = () => {
  const { t } = useLang()
  const { user } = useAuth()
  const navigate = useNavigate()
  const userRole = user?.role?.toLowerCase()

  if (userRole === 'student') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Card style={{ maxWidth: 600, padding: '2rem' }}>
          <Title level={2}>{t('Dashboard')}</Title>
          <Text
            style={{
              fontSize: '1.1rem',
              marginBottom: '2rem',
              display: 'block',
            }}
          >
            {t('The dashboard page is under construction')}
          </Text>
          {/* <Button
            type="primary"
            size="large"
            icon={<BookOutlined />}
            onClick={() => navigate({ to: '/lessons' })}
          >
            {t('Go to Lessons')}
          </Button> */}
        </Card>
      </div>
    )
  }
  const enrollmentData = [
    { month: 'Jan', students: 320 },
    { month: 'Feb', students: 340 },
    { month: 'Mar', students: 380 },
    { month: 'Apr', students: 395 },
    { month: 'May', students: 420 },
    { month: 'Jun', students: 445 },
  ]

  const gradeDistribution = [
    { name: 'Grade A', value: 85, color: '#52c41a' },
    { name: 'Grade B', value: 120, color: '#1890ff' },
    { name: 'Grade C', value: 95, color: '#faad14' },
    { name: 'Grade D', value: 45, color: '#ff4d4f' },
  ]

  const upcomingEvents = [
    {
      title: t('Parent-Teacher Meeting'),
      date: '2024-01-15',
      type: t('Meeting'),
      color: '#1890ff',
    },
    {
      title: t('Science Fair'),
      date: '2024-01-20',
      type: t('Event'),
      color: '#52c41a',
    },
    {
      title: t('Mid-term Exams'),
      date: '2024-01-25',
      type: t('Exam'),
      color: '#faad14',
    },
    {
      title: t('Sports Day'),
      date: '2024-02-01',
      type: t('Event'),
      color: '#722ed1',
    },
  ]

  const topPerformers = [
    {
      name: 'An An',
      grade: 'A+',
      percentage: 96,
      avatar:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Bình An',
      grade: 'A+',
      percentage: 94,
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Chiêu Dương',
      grade: 'A',
      percentage: 92,
      avatar:
        'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>{t('Dashboard')}</Title>
        <Text type="secondary">
          {t("Welcome back! Here's what's happening at your school.")}
        </Text>
      </div>

      {/* Key Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('Total Students')}
              value={1245}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              suffix={
                <div style={{ fontSize: 14, color: '#52c41a' }}>
                  <ArrowUpOutlined /> 12%
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('Teachers')}
              value={89}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              suffix={
                <div style={{ fontSize: 14, color: '#52c41a' }}>
                  <ArrowUpOutlined /> 5%
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('Active Classes')}
              value={45}
              prefix={<BookOutlined style={{ color: '#faad14' }} />}
              suffix={
                <div style={{ fontSize: 14, color: '#faad14' }}>
                  <ArrowUpOutlined /> 2%
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('Attendance Rate')}
              value={92.4}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Student Enrollment Trend */}
        <Col xs={24} lg={16}>
          <Card title={t('Student Enrollment Trend')} style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#1890ff"
                  strokeWidth={3}
                  dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Grade Distribution */}
        <Col xs={24} lg={8}>
          <Card title={t('Grade Distribution')} style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16 }}>
              {gradeDistribution.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Space>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: item.color,
                      }}
                    />
                    <Text>{item.name}</Text>
                  </Space>
                  <Text strong>{item.value}</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Top Performers */}
        <Col xs={24} lg={12}>
          <Card title={t('Top Performers')} style={{ height: 400 }}>
            <List
              dataSource={topPerformers}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div style={{ position: 'relative' }}>
                        <Avatar src={item.avatar} size={40} />
                        <div
                          style={{
                            position: 'absolute',
                            top: -4,
                            left: -4,
                            width: 20,
                            height: 20,
                            background:
                              index === 0
                                ? '#faad14'
                                : index === 1
                                  ? '#c0c0c0'
                                  : '#cd7f32',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          {index + 1}
                        </div>
                      </div>
                    }
                    title={<Text strong>{item.name}</Text>}
                    description={`${t('Grade')}: ${item.grade}`}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>{item.percentage}%</Text>
                    </div>
                    <Progress
                      percent={item.percentage}
                      size="small"
                      showInfo={false}
                      strokeColor={index === 0 ? '#52c41a' : '#1890ff'}
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Upcoming Events */}
        <Col xs={24} lg={12}>
          <Card title={t('Upcoming Events')} style={{ height: 400 }}>
            <List
              dataSource={upcomingEvents}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          backgroundColor: item.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CalendarOutlined
                          style={{ color: 'white', fontSize: 16 }}
                        />
                      </div>
                    }
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <Space>
                        <Text type="secondary">{item.date}</Text>
                        <Text type="secondary">•</Text>
                        <Text type="secondary">{item.type}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export const Route = createFileRoute('/(main)/(common)/dashboard')({
  component: Dashboard,
})
