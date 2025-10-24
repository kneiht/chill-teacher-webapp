import { createFileRoute } from '@tanstack/react-router'
import {
  BarChartOutlined,
  BookOutlined,
  CalendarOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import {
  Bar,
  BarChart,
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
import type { ColumnsType } from 'antd/es/table'
import { useLang } from '@/lib/hooks/use-lang'

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs

interface ReportData {
  student: string
  class: string
  subject: string
  attendance: number
  grade: string
  behavior: string
  assignments: number
}

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<string>('attendance')
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  // TODO: fix this bug
  // const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([dayjs().subtract(30, 'days'), dayjs()])
  const [exportFormat, setExportFormat] = useState<string>('pdf')
  const { t } = useLang()

  // Mock data for reports
  const attendanceData = [
    { month: 'Jan', attendance: 92 },
    { month: 'Feb', attendance: 88 },
    { month: 'Mar', attendance: 95 },
    { month: 'Apr', attendance: 90 },
    { month: 'May', attendance: 87 },
    { month: 'Jun', attendance: 93 },
  ]

  const gradeDistribution = [
    { grade: 'A', count: 45, color: '#52c41a' },
    { grade: 'B', count: 78, color: '#1890ff' },
    { grade: 'C', count: 32, color: '#faad14' },
    { grade: 'D', count: 15, color: '#ff4d4f' },
    { grade: 'F', count: 5, color: '#8c8c8c' },
  ]

  const classPerformance = [
    { class: '10-A', avgGrade: 85, attendance: 92 },
    { class: '10-B', avgGrade: 78, attendance: 88 },
    { class: '11-A', avgGrade: 88, attendance: 95 },
    { class: '11-B', avgGrade: 82, attendance: 90 },
    { class: '12-A', avgGrade: 90, attendance: 87 },
    { class: '12-B', avgGrade: 86, attendance: 93 },
  ]

  const studentReportData: Array<ReportData> = [
    {
      student: 'An An',
      class: '10-A',
      subject: 'Toán',
      attendance: 95,
      grade: 'A',
      behavior: 'Xuất sắc',
      assignments: 18,
    },
    {
      student: 'Bình An',
      class: '10-A',
      subject: 'Toán',
      attendance: 88,
      grade: 'B+',
      behavior: 'Tốt',
      assignments: 16,
    },
    {
      student: 'Chiêu Dương',
      class: '10-A',
      subject: 'Toán',
      attendance: 92,
      grade: 'A-',
      behavior: 'Xuất sắc',
      assignments: 19,
    },
    {
      student: 'David Wilson',
      class: '10-B',
      subject: 'Lý',
      attendance: 85,
      grade: 'B',
      behavior: 'Tốt',
      assignments: 15,
    },
    {
      student: 'Emma Brown',
      class: '10-B',
      subject: 'Lý',
      attendance: 90,
      grade: 'B+',
      behavior: 'Tốt',
      assignments: 17,
    },
  ]

  const teacherReportData = [
    {
      teacher: 'Cô Sarah Wilson',
      subject: 'Toán',
      classes: 3,
      students: 85,
      avgAttendance: 92,
      avgGrade: 'B+',
      satisfaction: 4.8,
    },
    {
      teacher: 'Thầy John Davis',
      subject: 'Lý',
      classes: 2,
      students: 60,
      avgAttendance: 88,
      avgGrade: 'B',
      satisfaction: 4.6,
    },
    {
      teacher: 'Cô Emma Thompson',
      subject: 'Văn',
      classes: 2,
      students: 55,
      avgAttendance: 95,
      avgGrade: 'A-',
      satisfaction: 4.9,
    },
  ]

  const handleExport = () => {
    const format = exportFormat === 'pdf' ? 'PDF' : 'Excel'
    console.log(`Exporting ${reportType} report as ${format}`)
    // Implementation would go here
  }

  const handlePrint = () => {
    window.print()
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'green'
    if (grade.startsWith('B')) return 'blue'
    if (grade.startsWith('C')) return 'orange'
    if (grade.startsWith('D')) return 'red'
    return 'default'
  }

  const getBehaviorColor = (behavior: string) => {
    switch (behavior.toLowerCase()) {
      case 'excellent':
        return 'green'
      case 'good':
        return 'blue'
      case 'fair':
        return 'orange'
      case 'poor':
        return 'red'
      default:
        return 'default'
    }
  }

  const studentColumns: ColumnsType<ReportData> = [
    {
      title: t('Student'),
      dataIndex: 'student',
      key: 'student',
      sorter: (a, b) => a.student.localeCompare(b.student),
    },
    {
      title: t('Class'),
      dataIndex: 'class',
      key: 'class',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: t('Subject'),
      dataIndex: 'subject',
      key: 'subject',
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: t('Attendance'),
      dataIndex: 'attendance',
      key: 'attendance',
      render: (value) => (
        <div>
          <Text strong>{value}%</Text>
          <Progress
            percent={value}
            size="small"
            showInfo={false}
            strokeColor={
              value >= 90 ? '#52c41a' : value >= 75 ? '#faad14' : '#ff4d4f'
            }
          />
        </div>
      ),
      sorter: (a, b) => a.attendance - b.attendance,
    },
    {
      title: t('Grade'),
      dataIndex: 'grade',
      key: 'grade',
      render: (text) => <Tag color={getGradeColor(text)}>{text}</Tag>,
    },
    {
      title: t('Behavior'),
      dataIndex: 'behavior',
      key: 'behavior',
      render: (text) => <Tag color={getBehaviorColor(text)}>{text}</Tag>,
    },
    {
      title: t('Assignments'),
      dataIndex: 'assignments',
      key: 'assignments',
      render: (value) => <Text>{value}/20</Text>,
      sorter: (a, b) => a.assignments - b.assignments,
    },
  ]

  const teacherColumns = [
    {
      title: t('Teacher'),
      dataIndex: 'teacher',
      key: 'teacher',
    },
    {
      title: t('Subject'),
      dataIndex: 'subject',
      key: 'subject',
      render: (text: string) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: t('Classes'),
      dataIndex: 'classes',
      key: 'classes',
    },
    {
      title: t('Students'),
      dataIndex: 'students',
      key: 'students',
    },
    {
      title: t('Avg. Attendance'),
      dataIndex: 'avgAttendance',
      key: 'avgAttendance',
      render: (value: number) => `${value}%`,
    },
    {
      title: t('Avg. Grade'),
      dataIndex: 'avgGrade',
      key: 'avgGrade',
      render: (text: string) => <Tag color={getGradeColor(text)}>{text}</Tag>,
    },
    {
      title: t('Satisfaction'),
      dataIndex: 'satisfaction',
      key: 'satisfaction',
      render: (value: number) => (
        <div>
          <Text strong>{value}/5.0</Text>
          <Progress
            percent={(value / 5) * 100}
            size="small"
            showInfo={false}
            strokeColor="#52c41a"
          />
        </div>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>{t('Reports & Analytics')}</Title>
        <Text type="secondary">
          {t(
            'Generate comprehensive reports on student performance, attendance, and school metrics',
          )}
        </Text>
      </div>

      {/* Report Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Text strong>{t('Report Type:')}</Text>
          </Col>
          <Col>
            <Select
              value={reportType}
              onChange={setReportType}
              style={{ width: 150 }}
            >
              <Option value="attendance">{t('Attendance')}</Option>
              <Option value="academic">{t('Academic')}</Option>
              <Option value="behavior">{t('Behavior')}</Option>
              <Option value="financial">{t('Financial')}</Option>
            </Select>
          </Col>
          <Col>
            <Text strong>{t('Class')}:</Text>
          </Col>
          <Col>
            <Select
              placeholder={t('All Classes')}
              allowClear
              value={selectedClass}
              onChange={setSelectedClass}
              style={{ width: 120 }}
            >
              <Option value="10-A">10-A</Option>
              <Option value="10-B">10-B</Option>
              <Option value="11-A">11-A</Option>
              <Option value="11-B">11-B</Option>
              <Option value="12-A">12-A</Option>
              <Option value="12-B">12-B</Option>
            </Select>
          </Col>
          <Col>
            <Text strong>{t('Subject')}:</Text>
          </Col>
          <Col>
            <Select
              placeholder={t('All Subjects')}
              allowClear
              value={selectedSubject}
              onChange={setSelectedSubject}
              style={{ width: 150 }}
            >
              <Option value="Mathematics">Mathematics</Option>
              <Option value="Physics">Physics</Option>
              <Option value="Chemistry">Chemistry</Option>
              <Option value="Literature">Literature</Option>
              <Option value="History">History</Option>
            </Select>
          </Col>
          <Col>
            <Text strong>{t('Period:')}</Text>
          </Col>
          <Col>
            <RangePicker
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates)}
            />
          </Col>
        </Row>
      </Card>

      {/* Export Options */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Text strong>{t('Export Format:')}</Text>
          </Col>
          <Col>
            <Radio.Group
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <Radio.Button value="pdf">
                <FilePdfOutlined /> PDF
              </Radio.Button>
              <Radio.Button value="excel">
                <FileExcelOutlined /> Excel
              </Radio.Button>
            </Radio.Group>
          </Col>
          <Col flex="auto" style={{ textAlign: 'right' }}>
            <Space>
              <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                {t('Print')}
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                {t('Export Report')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Report Content */}
      <Tabs defaultActiveKey="overview">
        <TabPane tab={t('Overview')} key="overview">
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title={t('Total Students')}
                  value={1245}
                  prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title={t('Avg. Attendance')}
                  value={91.2}
                  suffix="%"
                  prefix={<CalendarOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title={t('Active Classes')}
                  value={45}
                  prefix={<BookOutlined style={{ color: '#faad14' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title={t('Avg. Grade')}
                  value="B+"
                  prefix={<BarChartOutlined style={{ color: '#722ed1' }} />}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title={t('Attendance Trend')}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#1890ff"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title={t('Grade Distribution')}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ grade, count }) => `${grade}: ${count}`}
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab={t('Student Performance')} key="students">
          <Card title={t('Student Performance Report')}>
            <Table
              columns={studentColumns}
              dataSource={studentReportData}
              rowKey="student"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} ${t('of')} ${total} ${t('students')}`,
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab={t('Teacher Performance')} key="teachers">
          <Card title={t('Teacher Performance Report')}>
            <Table
              columns={teacherColumns}
              dataSource={teacherReportData}
              rowKey="teacher"
              pagination={false}
            />
          </Card>
        </TabPane>

        <TabPane tab={t('Class Analysis')} key="classes">
          <Card title={t('Class Performance Analysis')}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={classPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="avgGrade"
                  fill="#1890ff"
                  name={t('Average Grade')}
                />
                <Bar
                  dataKey="attendance"
                  fill="#52c41a"
                  name={t('Attendance %')}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Divider />

          <Row gutter={[16, 16]}>
            {classPerformance.map((cls) => (
              <Col xs={24} sm={12} lg={8} key={cls.class}>
                <Card title={`${t('Class')} ${cls.class}`} size="small">
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">{t('Average Grade')}</Text>
                    <div>
                      <Text strong style={{ fontSize: 24 }}>
                        {cls.avgGrade}
                      </Text>
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">{t('Attendance Rate')}</Text>
                    <Progress
                      percent={cls.attendance}
                      strokeColor={
                        cls.attendance >= 90
                          ? '#52c41a'
                          : cls.attendance >= 75
                            ? '#faad14'
                            : '#ff4d4f'
                      }
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </TabPane>
      </Tabs>
    </div>
  )
}

export const Route = createFileRoute('/(main)/(teacher)/reports')({
  component: Reports,
})
