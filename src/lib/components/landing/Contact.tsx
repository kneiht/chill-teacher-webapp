'use client'

import {
  CalendarOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Typography,
  theme,
} from 'antd'

const { Title, Paragraph } = Typography

const Contact = () => {
  const { token } = theme.useToken()
  return (
    <section
      id="contact"
      style={{
        padding: `${token.paddingXL * 2}px 0`,
        background: token.colorBgContainer,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: `0 ${token.paddingLG}px`,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: token.marginXL * 2 }}>
          <Title
            level={2}
            style={{
              fontWeight: token.fontWeightStrong,
              fontSize: 36,
              color: token.colorTextHeading,
              marginBottom: token.marginLG,
            }}
          >
            Liên Hệ
          </Title>
          <Paragraph
            style={{
              fontSize: 20,
              color: token.colorTextDescription,
              maxWidth: 700,
              margin: '0 auto',
            }}
          >
            Sẵn sàng đổi mới trải nghiệm dạy học của bạn? Chúng tôi luôn sẵn
            lòng lắng nghe. Hãy kết nối để cùng nhau làm cho việc dạy học trở
            nên hứng khởi hơn.
          </Paragraph>
        </div>
        <Row gutter={[token.marginXL, token.marginXL]}>
          {/* Contact Form */}
          <Col xs={24} lg={12}>
            <Card
              style={{
                background: token.colorBgLayout,
                borderRadius: token.borderRadius,
              }}
            >
              <Title
                level={3}
                style={{
                  fontWeight: token.fontWeightStrong,
                  fontSize: 24,
                  color: token.colorTextHeading,
                  marginBottom: token.marginLG,
                }}
              >
                Gửi Lời Nhắn
              </Title>
              <Form layout="vertical">
                <Row gutter={token.margin}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Tên" name="firstName">
                      <Input
                        placeholder="An"
                        size="large"
                        style={{ borderRadius: token.borderRadius }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Họ" name="lastName">
                      <Input
                        placeholder="Nguyễn"
                        size="large"
                        style={{ borderRadius: token.borderRadius }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Email" name="email">
                  <Input
                    type="email"
                    placeholder="nguyen.an@truonghoc.edu.vn"
                    size="large"
                    style={{ borderRadius: token.borderRadius }}
                  />
                </Form.Item>
                <Form.Item label="Chủ đề" name="subject">
                  <Select
                    placeholder="Chọn chủ đề"
                    size="large"
                    style={{ borderRadius: token.borderRadius }}
                  >
                    <Select.Option value="sales">
                      Tư vấn & Mua hàng
                    </Select.Option>
                    <Select.Option value="support">
                      Hỗ trợ kỹ thuật
                    </Select.Option>
                    <Select.Option value="demo">Yêu cầu dùng thử</Select.Option>
                    <Select.Option value="partnership">Hợp tác</Select.Option>
                    <Select.Option value="other">Khác</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Lời nhắn" name="message">
                  <Input.TextArea
                    rows={4}
                    placeholder="Bạn cần chúng tôi hỗ trợ điều gì?"
                    style={{ borderRadius: token.borderRadius }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{
                      borderRadius: token.borderRadiusLG,
                      fontWeight: token.fontWeightStrong,
                      width: '100%',
                    }}
                  >
                    Gửi Lời Nhắn
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          {/* Contact Information */}
          <Col xs={24} lg={12}>
            <Flex vertical gap={token.marginXL}>
              <Card
                style={{ borderRadius: token.borderRadius }}
                bodyStyle={{ padding: token.paddingXL }}
              >
                <Title
                  level={3}
                  style={{
                    fontWeight: token.fontWeightStrong,
                    fontSize: 24,
                    color: token.colorTextHeading,
                    marginBottom: token.marginLG,
                  }}
                >
                  Kết Nối Với Chúng Tôi
                </Title>
                <Paragraph
                  style={{
                    color: token.colorTextDescription,
                    fontSize: 16,
                    marginBottom: token.marginXL,
                  }}
                >
                  Chúng tôi luôn ở đây để cùng bạn thành công. Dù bạn có câu hỏi
                  về nền tảng, cần hỗ trợ kỹ thuật, hay muốn tìm kiếm cơ hội hợp
                  tác, đừng ngần ngại liên hệ.
                </Paragraph>
                <Flex vertical gap={token.marginLG}>
                  <Flex align="start" gap={token.marginSM}>
                    <MailOutlined
                      style={{ fontSize: 24, color: token.colorPrimary }}
                    />
                    <div>
                      <div
                        style={{
                          fontWeight: token.fontWeightStrong,
                          color: token.colorTextHeading,
                          marginBottom: 4,
                        }}
                      >
                        Gửi Email
                      </div>
                      <div style={{ color: token.colorTextDescription }}>
                        support@chillteacher.com
                      </div>
                      <div style={{ color: token.colorTextDescription }}>
                        sales@chillteacher.com
                      </div>
                    </div>
                  </Flex>
                  <Flex align="start" gap={token.marginSM}>
                    <PhoneOutlined
                      style={{ fontSize: 24, color: token.colorSuccess }}
                    />
                    <div>
                      <div
                        style={{
                          fontWeight: token.fontWeightStrong,
                          color: token.colorTextHeading,
                          marginBottom: 4,
                        }}
                      >
                        Hotline
                      </div>
                      <div style={{ color: token.colorTextDescription }}>
                        1900-CHILL
                      </div>
                      <div style={{ color: token.colorTextDescription }}>
                        (1900-244-55)
                      </div>
                    </div>
                  </Flex>
                  <Flex align="start" gap={token.marginSM}>
                    <EnvironmentOutlined
                      style={{ fontSize: 24, color: token.colorInfo }}
                    />
                    <div>
                      <div
                        style={{
                          fontWeight: token.fontWeightStrong,
                          color: token.colorTextHeading,
                          marginBottom: 4,
                        }}
                      >
                        Địa chỉ
                      </div>
                      <div style={{ color: token.colorTextDescription }}>
                        123 Đường Giáo Dục
                      </div>
                      <div style={{ color: token.colorTextDescription }}>
                        Quận 1, TP. Hồ Chí Minh
                      </div>
                    </div>
                  </Flex>
                  <Flex align="start" gap={token.marginSM}>
                    <ClockCircleOutlined
                      style={{ fontSize: 24, color: token.colorWarning }}
                    />
                    <div>
                      <div
                        style={{
                          fontWeight: token.fontWeightStrong,
                          color: token.colorTextHeading,
                          marginBottom: 4,
                        }}
                      >
                        Thời Gian Hỗ Trợ
                      </div>
                      <div style={{ color: token.colorTextDescription }}>
                        Thứ Hai - Thứ Sáu: 8:00 - 18:00
                      </div>
                      <div style={{ color: token.colorTextDescription }}>
                        Thứ Bảy: 8:00 - 16:00
                      </div>
                    </div>
                  </Flex>
                </Flex>
              </Card>
              <Card
                style={{
                  background: token.colorBgLayout,
                  borderRadius: token.borderRadius,
                }}
              >
                <div
                  style={{
                    fontWeight: token.fontWeightStrong,
                    color: token.colorTextHeading,
                    marginBottom: token.margin,
                    fontSize: 18,
                  }}
                >
                  Thao Tác Nhanh
                </div>
                <Flex vertical gap={token.marginSM}>
                  <Button
                    block
                    icon={<CalendarOutlined />}
                    style={{
                      textAlign: 'left',
                      borderRadius: token.borderRadius,
                    }}
                  >
                    Đặt Lịch Dùng Thử
                  </Button>
                  <Button
                    block
                    icon={<DownloadOutlined />}
                    style={{
                      textAlign: 'left',
                      borderRadius: token.borderRadius,
                    }}
                  >
                    Tải Tài Liệu Miễn Phí
                  </Button>
                </Flex>
              </Card>
            </Flex>
          </Col>
        </Row>
      </div>
    </section>
  )
}

export default Contact
