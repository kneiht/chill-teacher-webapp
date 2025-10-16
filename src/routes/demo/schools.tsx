import React, { useEffect, useState } from 'react'
import {
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  App as AntApp,
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  List,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd'
import { createFileRoute } from '@tanstack/react-router'
import type { ColumnsType } from 'antd/es/table'
import type {
  School,
  SchoolCreateInput,
  SchoolDeleteInput,
  SchoolUpdateInput,
} from '@/types'
import {
  addSchool,
  deleteSchool,
  getSchoolsByUserId,
  updateSchool,
} from '@/server/schools'
import { useAuth } from '@/lib/hooks/use-auth'
import { useLang } from '@/lib/hooks/use-lang'

const { Title, Text } = Typography

const Schools: React.FC = () => {
  const { t } = useLang()
  console.log('render school')
  // const router = useRouter()
  const { message } = AntApp.useApp()
  const { user } = useAuth()
  const userId = user?.id
  // const { schools: initialSchools } = Route.useLoaderData()
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  // State cho schools, khởi tạo từ loader
  const [schools, setSchools] = useState<Array<School>>([])

  useEffect(() => {
    if (userId) {
      getSchoolsByUserId({ data: { userId } } as any).then(setSchools)
    }
  }, [userId])

  // Status color mapping
  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'green' : 'orange'
  }

  // Handle Add School
  const handleAddSchool = () => {
    setSelectedSchool(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  // Handle Edit School
  const handleEditSchool = (schoolData: School) => {
    setSelectedSchool(schoolData)
    form.setFieldsValue(schoolData)
    setIsModalOpen(true)
  }

  // Handle View School
  const handleViewSchool = (schoolData: School) => {
    setSelectedSchool(schoolData)
    setIsDrawerOpen(true)
  }

  // Handle Delete School
  const handleDeleteSchool = async (schoolId: string) => {
    Modal.confirm({
      title: t('Are you sure you want to delete this school?'),
      content: t('This action cannot be undone.'),
      okText: t('Yes, Delete'),
      okType: 'danger',
      cancelText: t('Cancel'),
      onOk: async () => {
        try {
          if (!userId) throw new Error('No user')
          const deleteData: SchoolDeleteInput = { id: schoolId, userId }
          await deleteSchool({ data: deleteData } as any)
          const userSchools = await getSchoolsByUserId({
            data: { userId },
          } as any)
          setSchools(userSchools)
          message.success(t('School deleted successfully'))
        } catch (err: any) {
          message.error(err?.message || t('Delete failed'))
        }
      },
    })
  }

  // Modal Submit
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      console.log(values)
      if (!userId) throw new Error('No user')
      if (selectedSchool) {
        const updateData: SchoolUpdateInput = {
          ...selectedSchool,
          ...values,
          userId,
        }
        await updateSchool({ data: updateData } as any)
        message.success(t('School updated successfully'))
      } else {
        const createData: SchoolCreateInput = { ...values, userId }
        console.log(createData)
        await addSchool({ data: createData } as any)
        message.success(t('School added successfully'))
      }
      const userSchools = await getSchoolsByUserId({ data: { userId } } as any)
      setSchools(userSchools)
      setIsModalOpen(false)
      form.resetFields()
    } catch (err: any) {
      if (err?.errorFields) return // validation error
      message.error(err?.message || t('Operation failed'))
    }
  }

  // Filter schools
  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchText.toLowerCase()) ||
      school.address.toLowerCase().includes(searchText.toLowerCase())

    const matchesStatus = !selectedStatus || school.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  // Table columns
  const columns: ColumnsType<School> = [
    {
      title: t('School Name'),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary">{record.id}</Text>
        </div>
      ),
    },
    {
      title: t('Address'),
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={text === 'Active' ? 'green' : 'orange'}>{t(text)}</Tag>
      ),
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewSchool(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditSchool(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteSchool(record.id)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>{t('Schools')}</Title>
        <Text type="secondary">
          {t('Manage school information and settings')}
        </Text>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('Total Schools')}
              value={schools.length}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('Active Schools')}
              value={schools.filter((s) => s.status === 'Active').length}
              prefix={<BookOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* Filters and Search */}
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Input
            placeholder={t('Search schools...')}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            placeholder={t('Filter by status')}
            allowClear
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: 150 }}
          >
            <Select.Option value="Active">{t('Active')}</Select.Option>
            <Select.Option value="Inactive">{t('Inactive')}</Select.Option>
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddSchool}
          >
            {t('Add School')}
          </Button>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredSchools}
          pagination={{
            total: filteredSchools.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t('of')} ${total} ${t('schools')}`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={selectedSchool ? t('Edit School') : t('Add New School')}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={t('School Name')}
            name="name"
            rules={[{ required: true, message: t('Please enter school name') }]}
          >
            <Input placeholder={t('Enter school name')} />
          </Form.Item>
          <Form.Item
            label={t('Address')}
            name="address"
            rules={[{ required: true, message: t('Please enter address') }]}
          >
            <Input placeholder={t('Enter school address')} />
          </Form.Item>
          <Form.Item
            label={t('Status')}
            name="status"
            rules={[{ required: true, message: t('Please select status') }]}
          >
            <Select>
              <Select.Option value="Active">{t('Active')}</Select.Option>
              <Select.Option value="Inactive">{t('Inactive')}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Drawer */}
      <Drawer
        title={t('School Details')}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width={500}
      >
        {selectedSchool && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <Title level={4}>{selectedSchool.name}</Title>
              <Text type="secondary">{selectedSchool.id}</Text>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={[
                { label: t('Address'), value: selectedSchool.address },
                {
                  label: t('Status'),
                  value: (
                    <Tag color={getStatusColor(selectedSchool.status)}>
                      {t(selectedSchool.status)}
                    </Tag>
                  ),
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text strong>{item.label}</Text>}
                    description={<Text>{item.value}</Text>}
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Drawer>
    </div>
  )
}

export const Route = createFileRoute('/demo/schools')({
  // loader: async () => {
  // 	const schools = await getSchools({data: {userId: "01984024-a714-7093-9587-8d64594ce73e"}})
  // 	return { schools }
  // },
  component: Schools,
})
