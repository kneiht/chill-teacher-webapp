import { createFileRoute } from '@tanstack/react-router'
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

const { Title, Text } = Typography

const Dashboard: React.FC = () => {
  const { t } = useLang()
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
        <Text type="secondary">{t('Welcome back!')}</Text>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/(main)/dashboard')({
  component: Dashboard,
})
