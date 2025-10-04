'use client'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Card, Collapse, Typography, theme } from 'antd'

const { Title, Paragraph } = Typography

const faqs = [
  {
    question: 'Dùng thử miễn phí hoạt động ra sao?',
    answer:
      'Bạn được toàn quyền sử dụng các tính năng của gói Chuyên Nghiệp trong 14 ngày mà không cần nhập thông tin thanh toán. Sau thời gian này, bạn có thể đăng ký gói trả phí hoặc tiếp tục với gói Miễn Phí.',
  },
  {
    question: 'Tôi có thể thay đổi gói dịch vụ không?',
    answer:
      'Chắc chắn rồi! Bạn có thể nâng cấp hoặc hạ cấp gói dịch vụ bất cứ lúc nào. Thay đổi sẽ được áp dụng ngay lập tức và chúng tôi sẽ tự động điều chỉnh chi phí cho bạn.',
  },
  {
    question: 'Dữ liệu của tôi có được bảo mật?',
    answer:
      'Có, bảo mật là ưu tiên hàng đầu của chúng tôi. Mọi dữ liệu đều được mã hóa trong quá trình truyền tải và lưu trữ. Chúng tôi tuân thủ các tiêu chuẩn bảo mật nghiêm ngặt nhất cho dữ liệu giáo dục.',
  },
  {
    question: 'Có ưu đãi cho trường học không?',
    answer:
      'Có chứ! Chúng tôi có chính sách chiết khấu hấp dẫn cho các trường học và tổ chức giáo dục. Hãy liên hệ với bộ phận kinh doanh để nhận báo giá tốt nhất.',
  },
  {
    question: 'Tôi có thể nhập dữ liệu cũ không?',
    answer:
      'Có, chúng tôi hỗ trợ chuyển dữ liệu miễn phí, giúp bạn dễ dàng nhập thông tin học sinh, giáo án và các tài liệu khác từ hệ thống cũ.',
  },
  {
    question: 'ChillTeacher hỗ trợ khách hàng như thế nào?',
    answer:
      'Chúng tôi hỗ trợ qua email cho mọi khách hàng. Gói Chuyên Nghiệp và Trường Học sẽ được ưu tiên hỗ trợ qua email và điện thoại. Ngoài ra, chúng tôi còn có hệ thống tài liệu và video hướng dẫn chi tiết.',
  },
  {
    question: 'ChillTeacher có dùng offline được không?',
    answer:
      'Một vài tính năng trên ứng dụng di động có thể hoạt động ngoại tuyến, ví dụ như xem lại bài giảng hay flashcard đã lưu. Tuy nhiên, để trải nghiệm đầy đủ, bạn cần có kết nối internet.',
  },
  {
    question: 'Phụ huynh có xem được kết quả học tập của con không?',
    answer:
      'Có, với gói Chuyên Nghiệp và Trường Học, bạn có thể dễ dàng chia sẻ báo cáo học tập của học sinh cho phụ huynh thông qua cổng thông tin riêng.',
  },
]

const FAQ = () => {
  const { token } = theme.useToken()
  return (
    <section
      id="faq"
      style={{
        padding: `${token.paddingXL * 2}px 0`,
        background: token.colorBgLayout,
      }}
    >
      <div
        style={{
          maxWidth: 900,
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
            <QuestionCircleOutlined
              style={{ color: token.colorPrimary, marginRight: 8 }}
            />
            Giải Đáp Thắc Mắc
          </Title>
          <Paragraph
            style={{ fontSize: 20, color: token.colorTextDescription }}
          >
            Bạn có thắc mắc? Chúng tôi đã có câu trả lời. Nếu không tìm thấy
            điều bạn cần, đừng ngần ngại liên hệ đội ngũ hỗ trợ của chúng tôi.
          </Paragraph>
        </div>
        <Collapse
          accordion
          bordered={false}
          style={{ background: 'transparent' }}
          items={faqs.map((faq, index) => ({
            key: index,
            label: (
              <span style={{ fontWeight: 600, fontSize: 18 }}>
                {faq.question}
              </span>
            ),
            children: (
              <Paragraph style={{ color: token.colorText, fontSize: 16 }}>
                {faq.answer}
              </Paragraph>
            ),
            style: {
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
              marginBottom: token.margin,
              boxShadow: token.boxShadowSecondary,
            },
          }))}
        />
        <div style={{ marginTop: token.marginXL * 2, textAlign: 'center' }}>
          <Card
            style={{
              background: token.colorPrimary,
              borderRadius: token.borderRadius,
              padding: token.paddingXL * 2,
              color: token.colorWhite,
            }}
            bodyStyle={{ background: 'transparent', color: token.colorWhite }}
          >
            <Title
              level={3}
              style={{ color: token.colorWhite, marginBottom: token.marginLG }}
            >
              Vẫn còn thắc mắc?
            </Title>
            <Paragraph
              style={{ color: token.colorInfoBg, marginBottom: token.marginXL }}
            >
              Đội ngũ hỗ trợ thân thiện của chúng tôi luôn sẵn sàng giúp bạn.
            </Paragraph>
            <Button
              type="default"
              size="large"
              style={{
                borderRadius: token.borderRadiusLG,
                fontWeight: token.fontWeightStrong,
                background: token.colorWhite,
                color: token.colorPrimary,
              }}
            >
              Liên Hệ Hỗ Trợ
            </Button>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default FAQ
