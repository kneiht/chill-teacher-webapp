'use client'

import { CheckOutlined, CloseOutlined, DollarOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, Flex, Row, Typography, theme } from 'antd'

const { Title, Paragraph } = Typography

const plans = [
  {
    name: 'Cơ Bản',
    price: 'Miễn phí',
    period: 'mãi mãi',
    description: 'Hoàn hảo cho giáo viên mới bắt đầu',
    features: [
      'Tối đa 30 học sinh',
      'Flashcard cơ bản',
      'Giáo án đơn giản',
      '5 bảng tính in được/tháng',
      'Hỗ trợ qua email',
      'Truy cập ứng dụng di động',
    ],
    notIncluded: [
      'Bài học tương tác',
      'Phân tích nâng cao',
      'Bảng tính không giới hạn',
      'Hỗ trợ ưu tiên',
    ],
    cta: 'Bắt đầu miễn phí',
    featured: false,
    color: 'border-gray-200',
  },
  {
    name: 'Chuyên Nghiệp',
    price: '250.000 VNĐ',
    period: 'mỗi tháng',
    description: 'Lý tưởng cho giáo viên năng động',
    features: [
      'Tối đa 150 học sinh',
      'Flashcard nâng cao có đa phương tiện',
      'Trình tạo bài học tương tác',
      'Bảng tính in được không giới hạn',
      'Trò chơi giáo dục',
      'Phân tích cơ bản',
      'Hỗ trợ ưu tiên qua email',
      'Truy cập ứng dụng di động',
    ],
    notIncluded: [
      'Phân tích nâng cao',
      'Tùy chỉnh thương hiệu',
      'Truy cập API',
      'Hỗ trợ chuyên biệt',
    ],
    cta: 'Bắt đầu dùng thử 14 ngày',
    featured: true,
    color: 'border-blue-500',
  },
  {
    name: 'Trường Học',
    price: '500.000 VNĐ',
    period: 'mỗi tháng',
    description: 'Tốt nhất cho các phòng ban và trường học',
    features: [
      'Không giới hạn học sinh',
      'Tất cả tính năng của gói Chuyên Nghiệp',
      'Phân tích & thông tin chuyên sâu',
      'Tùy chỉnh thương hiệu',
      'Công cụ cộng tác nhóm',
      'Truy cập API',
      'Quản lý tài khoản riêng',
      'Hỗ trợ qua điện thoại',
      'Tích hợp tùy chỉnh',
    ],
    notIncluded: [],
    cta: 'Liên hệ bộ phận kinh doanh',
    featured: false,
    color: 'border-orange-500',
  },
]

const Pricing = () => {
  const { token } = theme.useToken()
  return (
    <section
      id="pricing"
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
        {/* Header */}
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
            Chọn gói phù hợp với bạn
          </Title>
          <Paragraph
            style={{
              fontSize: 20,
              color: token.colorTextDescription,
              maxWidth: 700,
              margin: '0 auto',
            }}
          >
            Dù bạn mới bắt đầu hay quản lý cả một phòng ban, chúng tôi đều có
            gói dịch vụ phù hợp với nhu cầu và ngân sách của bạn.
          </Paragraph>
        </div>

        {/* Pricing Cards */}
        <Row
          gutter={[token.margin, token.margin]}
          style={{ marginBottom: token.marginXL * 2 }}
        >
          {plans.map((plan, index) => (
            <Col xs={24} md={8} key={index.toString()}>
              <Card
                hoverable
                style={{
                  borderRadius: token.borderRadius,
                  boxShadow: plan.featured
                    ? token.boxShadow
                    : token.boxShadowSecondary,
                  border: `2px solid ${plan.featured ? token.colorPrimary : token.colorBorder}`,
                  position: 'relative',
                  transform: plan.featured ? 'scale(1.05)' : undefined,
                }}
                bodyStyle={{
                  padding: token.paddingXL,
                  paddingTop: plan.featured
                    ? token.paddingXL * 2
                    : token.paddingXL,
                }}
              >
                {plan.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      background: `linear-gradient(90deg, ${token.colorPrimary} 0%, ${token.colorInfo} 100%)`,
                      color: token.colorWhite,
                      textAlign: 'center',
                      padding: '12px 0',
                      fontWeight: token.fontWeightStrong,
                      fontSize: 14,
                      borderTopLeftRadius: token.borderRadius,
                      borderTopRightRadius: token.borderRadius,
                    }}
                  >
                    Phổ biến nhất
                  </div>
                )}
                <Flex
                  align="center"
                  gap={token.marginSM}
                  style={{ marginBottom: token.margin }}
                >
                  <DollarOutlined
                    style={{
                      color: plan.featured
                        ? token.colorPrimary
                        : token.colorText,
                      fontSize: 28,
                    }}
                  />
                  <Title
                    level={3}
                    style={{
                      fontWeight: token.fontWeightStrong,
                      fontSize: 24,
                      color: token.colorTextHeading,
                      marginBottom: token.marginSM,
                    }}
                  >
                    {plan.name}
                  </Title>
                </Flex>
                <div style={{ marginBottom: token.margin }}>
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: token.fontWeightStrong,
                      color: token.colorTextHeading,
                    }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      style={{
                        color: token.colorTextDescription,
                        marginLeft: 8,
                      }}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <Paragraph
                  style={{
                    color: token.colorTextDescription,
                    marginBottom: token.margin,
                  }}
                >
                  {plan.description}
                </Paragraph>
                <Button
                  type={plan.featured ? 'primary' : 'default'}
                  size="large"
                  style={{
                    borderRadius: token.borderRadiusLG,
                    fontWeight: token.fontWeightStrong,
                    width: '100%',
                    marginBottom: token.margin,
                    background: plan.featured ? undefined : token.colorBgLayout,
                    color: plan.featured ? undefined : token.colorText,
                  }}
                >
                  {plan.cta}
                </Button>
                <Divider style={{ margin: `${token.marginLG}px 0` }} />
                <Flex vertical gap={token.marginSM}>
                  {plan.features.map((feature, indexFeature) => (
                    <Flex
                      key={indexFeature.toString()}
                      align="center"
                      style={{ color: token.colorText, fontSize: 16 }}
                    >
                      <CheckOutlined
                        style={{ color: token.colorSuccess, marginRight: 12 }}
                      />
                      {feature}
                    </Flex>
                  ))}
                  {plan.notIncluded.map((feature, indexNotIncluded) => (
                    <Flex
                      key={indexNotIncluded.toString()}
                      align="center"
                      style={{
                        color: token.colorTextDescription,
                        fontSize: 16,
                        opacity: 0.6,
                      }}
                    >
                      <CloseOutlined
                        style={{
                          color: token.colorTextDescription,
                          marginRight: 12,
                        }}
                      />
                      {feature}
                    </Flex>
                  ))}
                </Flex>
              </Card>
            </Col>
          ))}
        </Row>

        {/* FAQ Section */}
        <Card
          style={{
            background: token.colorBgLayout,
            borderRadius: token.borderRadius,
            padding: token.paddingXL * 2,
            textAlign: 'center',
          }}
          bodyStyle={{ background: 'transparent' }}
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
            Bạn không chắc kế hoạch nào phù hợp với mình?
          </Title>
          <Paragraph
            style={{
              color: token.colorTextDescription,
              marginBottom: token.margin,
            }}
          >
            Tất cả các kế hoạch đều đi kèm với bản dùng thử miễn phí 14 ngày.
            Không cần thẻ tín dụng.
          </Paragraph>
          <div
            style={{
              color: token.colorTextDescription,
              fontSize: 16,
              marginBottom: token.marginSM,
            }}
          >
            ✓ Hủy bất cứ lúc nào
          </div>
          <div
            style={{
              color: token.colorTextDescription,
              fontSize: 16,
              marginBottom: token.marginSM,
            }}
          >
            ✓ Đảm bảo hoàn tiền trong 30 ngày
          </div>
          <div style={{ color: token.colorTextDescription, fontSize: 16 }}>
            ✓ Di chuyển miễn phí từ các nền tảng khác
          </div>
        </Card>
      </div>
    </section>
  )
}

export default Pricing
