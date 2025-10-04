import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  App as AntApp,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useAuth } from '@/hooks/use-auth'
import { addUser, deleteUser, getUsers, updateUser } from '@/server/users'
import {
  addSchool,
  deleteSchool,
  getSchools,
  updateSchool,
} from '@/server/schools'
import { useLang } from '@/hooks/use-lang'

const { Title, Text } = Typography

const AdminPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useLang()
  const { message } = AntApp.useApp()
  const [form] = Form.useForm()

  const [selectedDb, setSelectedDb] = useState('users')
  const [data, setData] = useState<Array<any>>([])
  const [columns, setColumns] = useState<Array<any>>([])
  const [searchText, setSearchText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate({ to: '/dashboard' })
    }
  }, [user, navigate])

  const fetchData = async () => {
    let result = []
    if (selectedDb === 'users') {
      result = await getUsers({} as any)
    } else {
      result = await getSchools({} as any)
    }
    setData(result)

    if (result.length > 0) {
      const firstRecord = result[0]
      const generatedColumns = Object.keys(firstRecord).map((key) => {
        let render = undefined
        if (key === 'status') {
          render = (text: string) => (
            <Tag
              color={
                text === 'Active' || text === 'active' ? 'green' : 'orange'
              }
            >
              {t(text)}
            </Tag>
          )
        }
        if (key === 'avatar' || key === 'logo') {
          render = (src: string) => <UserOutlined />
        }
        return {
          title: t(key.charAt(0).toUpperCase() + key.slice(1)),
          dataIndex: key,
          key: key,
          render,
        }
      })

      setColumns([
        ...generatedColumns,
        {
          title: t('Actions'),
          key: 'actions',
          render: (_: any, record: any) => (
            <Space>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
              />
            </Space>
          ),
        },
      ])
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedDb])

  const handleAdd = () => {
    setSelectedRecord(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record: any) => {
    setSelectedRecord(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: `${t('Are you sure you want to delete this record?')}`,
      content: t('This action cannot be undone.'),
      okText: t('Yes, Delete'),
      okType: 'danger',
      cancelText: t('Cancel'),
      async onOk() {
        try {
          if (selectedDb === 'users') {
            await deleteUser({ data: { id: record.id } } as any)
          } else {
            await deleteSchool({
              data: { id: record.id, userId: user?.id },
            } as any)
          }
          message.success(t('Record deleted successfully'))
          fetchData()
        } catch (error) {
          message.error(t('Delete failed'))
        }
      },
    })
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      if (selectedRecord) {
        if (selectedDb === 'users') {
          await updateUser({ data: { ...selectedRecord, ...values } } as any)
        } else {
          await updateSchool({
            data: { ...selectedRecord, ...values, userId: user?.id },
          } as any)
        }
        message.success(t('Record updated successfully'))
      } else {
        if (selectedDb === 'users') {
          await addUser({ data: values } as any)
        } else {
          await addSchool({ data: { ...values, userId: user?.id } } as any)
        }
        message.success(t('Record added successfully'))
      }
      fetchData()
      setIsModalOpen(false)
    } catch (error) {
      message.error(t('Operation failed'))
    }
  }

  const filteredData = data.filter((record) =>
    Object.values(record).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase()),
    ),
  )

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>{t('Admin Panel')}</Title>
        <Text type="secondary">{t('Manage users and schools data')}</Text>
      </div>

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
          <Select
            value={selectedDb}
            onChange={setSelectedDb}
            style={{ width: 200 }}
          >
            <Select.Option value="users">{t('Users')}</Select.Option>
            <Select.Option value="schools">{t('Schools')}</Select.Option>
          </Select>
          <Input
            placeholder={t('Search...')}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t('Add New')}
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t('of')} ${total}`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={selectedRecord ? t('Edit Record') : t('Add New Record')}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            {columns
              .filter((col) => col.key !== 'actions')
              .map((col) => (
                <Col span={12} key={col.key}>
                  <Form.Item
                    name={col.dataIndex}
                    label={col.title}
                    rules={[
                      {
                        required: true,
                        message: `${t('Please input the')} ${col.title}!`,
                      },
                    ]}
                  >
                    <Input
                      placeholder={`${t('Enter')} ${col.title.toLowerCase()}...`}
                    />
                  </Form.Item>
                </Col>
              ))}
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/(admin)/admin')({
  component: AdminPage,
})
