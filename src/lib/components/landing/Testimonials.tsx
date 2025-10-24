import { StarFilled, UserOutlined } from '@ant-design/icons'
import { Card, Col, Flex, Rate, Row, Typography, theme } from 'antd'

const { Title, Paragraph, Text } = Typography

const testimonials = [
  {
    name: 'Nguyễn Thị Thảo',
    role: 'Giáo viên Tiểu học',
    school: 'Trường Tiểu học Bình Minh',
    image:
      'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=300',
    content:
      'ChillTeacher đã thay đổi hoàn toàn cách tôi quản lý lớp học. Các công cụ quản lý học sinh thật tuyệt vời và các em học sinh của tôi rất thích các bài học tương tác!',
    rating: 5,
  },
  {
    name: 'Trần Văn Hùng',
    role: 'Giáo viên Khoa học THCS',
    school: 'Trường THCS Chu Văn An',
    image:
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
    content:
      'Tính năng flashcard là một bước đột phá cho việc học từ vựng khoa học. Học sinh của tôi hứng thú hơn bao giờ hết và tôi tiết kiệm được rất nhiều thời gian chuẩn bị bài giảng.',
    rating: 5,
  },
  {
    name: 'Lê Thị Mai',
    role: 'Giáo viên Tiếng Anh THPT',
    school: 'Trường THPT Chuyên Lê Hồng Phong',
    image:
      'https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=300',
    content:
      'Tôi rất thích cách ChillTeacher giúp tôi tạo bảng tính và theo dõi tiến độ học sinh một cách dễ dàng. Việc giảng dạy trở nên thú vị và hiệu quả hơn rất nhiều.',
    rating: 5,
  },
  {
    name: 'Phạm Minh Đức',
    role: 'Giáo viên Toán',
    school: 'Học viện Khai Sáng',
    image:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
    content:
      'Các phân tích giúp tôi hiểu chính xác từng học sinh cần hỗ trợ ở đâu. Giống như có một trợ giảng không bao giờ ngủ vậy!',
    rating: 5,
  },
  {
    name: 'Đỗ Thị Lan',
    role: 'Giáo viên Mỹ thuật',
    school: 'Trường Nghệ thuật Sáng Tạo',
    image:
      'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=300',
    content:
      'Ngay cả với tư cách là một giáo viên mỹ thuật, tôi thấy ChillTeacher cực kỳ hữu ích để quản lý các dự án và thu hút học sinh bằng các bài thuyết trình tương tác.',
    rating: 5,
  },
  {
    name: 'Vũ Đình Khang',
    role: 'Giáo viên Thể dục',
    school: 'Học viện Thể thao Quốc Gia',
    image:
      'https://images.pexels.com/photos/2182973/pexels-photo-2182973.jpeg?auto=compress&cs=tinysrgb&w=300',
    content:
      'Ai mà ngờ một nền tảng kỹ thuật số lại có thể hiệu quả cho môn thể dục? Các tính năng trò chơi hóa đã làm cho việc theo dõi thể chất trở nên thú vị đối với học sinh của tôi.',
    rating: 5,
  },
]

const Testimonials = () => {
  const { token } = theme.useToken()
  return (
    <section
      id="testimonials"
      style={{
        padding: `${token.paddingXL * 2}px 0`,
        background: token.colorBgLayout,
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
            Được các giáo viên trên khắp Việt Nam yêu thích
          </Title>
          <Paragraph
            style={{
              fontSize: 20,
              color: token.colorTextDescription,
              maxWidth: 700,
              margin: '0 auto',
            }}
          >
            Đừng chỉ nghe chúng tôi nói. Đây là những gì các nhà giáo dục đang
            chia sẻ về ChillTeacher.
          </Paragraph>
        </div>

        {/* Testimonials Grid */}
        <Row gutter={[token.margin, token.margin]}>
          {testimonials.map((testimonial, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <Card
                hoverable
                style={{
                  borderRadius: token.borderRadiusLG,
                  boxShadow: token.boxShadowSecondary,
                  border: `1px solid ${token.colorBorder}`,
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  position: 'relative',
                }}
                bodyStyle={{ padding: token.paddingLG }}
              >
                {/* Quote Icon */}
                {/* <QuoteOutlined
									style={{
										position: "absolute",
										top: 16,
										right: 16,
										fontSize: 32,
										color: "#e6f4ff",
									}}
								/> */}

                {/* Stars */}
                <Flex
                  align="center"
                  gap={token.marginSM}
                  style={{ marginBottom: token.margin }}
                >
                  <UserOutlined
                    style={{ fontSize: 32, color: token.colorPrimary }}
                  />
                  <Rate
                    disabled
                    defaultValue={testimonial.rating}
                    count={5}
                    character={<StarFilled />}
                    style={{ color: token.colorWarning, marginBottom: 0 }}
                  />
                </Flex>

                {/* Content */}
                <Paragraph
                  style={{
                    color: token.colorText,
                    fontSize: 16,
                    marginBottom: token.margin,
                    fontStyle: 'italic',
                  }}
                >
                  &quot;{testimonial.content}&quot;
                </Paragraph>

                {/* Author */}
                <Flex align="center" gap={token.marginSM}>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  <div>
                    <Text strong style={{ color: token.colorTextHeading }}>
                      {testimonial.name}
                    </Text>
                    <div
                      style={{
                        fontSize: 14,
                        color: token.colorTextDescription,
                      }}
                    >
                      {testimonial.role}
                    </div>
                    <div style={{ fontSize: 14, color: token.colorPrimary }}>
                      {testimonial.school}
                    </div>
                  </div>
                </Flex>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Bottom CTA */}
        <div style={{ marginTop: token.marginXL * 2, textAlign: 'center' }}>
          <Flex
            align="center"
            justify="center"
            gap={token.marginSM}
            style={{ fontSize: 18, color: token.colorTextDescription }}
          >
            <Rate
              disabled
              defaultValue={5}
              count={5}
              character={<StarFilled />}
              style={{ color: token.colorWarning }}
            />
            <span>4.9/5 từ hơn 10.000 đánh giá</span>
          </Flex>
          <Paragraph
            style={{
              marginTop: token.margin,
              color: token.colorTextDescription,
            }}
          >
            Tham gia cộng đồng các nhà giáo dục đã thay đổi cách dạy của họ với
            ChillTeacher.
          </Paragraph>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
