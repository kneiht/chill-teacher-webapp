# Hướng dẫn sử dụng Questions.json

File `questions.json` chứa danh sách câu hỏi cho game Candy Crush English.

## Cấu trúc câu hỏi

### 1. Multiple Choice (Trắc nghiệm)

```json
{
  "type": "multipleChoice",
  "question": "\"pencil\" nghĩa là gì?",
  "correctAnswer": "bút chì",
  "options": ["bút chì", "bút mực", "bút lông", "kéo"]
}
```

### 2. Listening (Nghe)

```json
{
  "type": "listening",
  "question": "🔊 Nghe và chọn từ đúng:",
  "correctAnswer": "marker",
  "options": ["marker", "pencil", "pen", "crayon"],
  "wordToSpeak": "marker"
}
```

### 3. Fill in the Blank (Điền từ)

```json
{
  "type": "fillBlank",
  "question": "Điền từ tiếng Anh cho: \"bút lông\"",
  "correctAnswer": "marker"
}
```

## Cách thêm câu hỏi mới

1. Mở file `questions.json`
2. Thêm object câu hỏi mới vào mảng (nhớ thêm dấu phẩy giữa các câu hỏi)
3. Đảm bảo đúng cấu trúc theo loại câu hỏi
4. Lưu file

## Lưu ý

- Game sẽ chọn **ngẫu nhiên** câu hỏi từ danh sách
- Câu hỏi có thể lặp lại trong 1 lượt chơi
- Đáp án đúng: **+2 lượt chơi**
- Đáp án sai: **-1 lượt chơi**
- Không giới hạn số câu hỏi
