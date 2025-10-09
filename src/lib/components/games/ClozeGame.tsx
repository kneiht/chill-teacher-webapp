import React, { useState } from 'react'

interface GameProps {
  vocabData: any[]
  backgroundUrl: string
  title: string
  onClose: () => void
  clozeData?: { paragraph: string; words: string[] }
}

const ClozeGame: React.FC<GameProps> = ({
  vocabData,
  backgroundUrl,
  title,
  onClose,
  clozeData,
}) => {
  if (!clozeData) return null

  const [answers, setAnswers] = useState<string[]>(
    new Array(clozeData.words.length).fill(''),
  )

  const checkAnswers = () => {
    const correct = answers.every(
      (answer, index) =>
        answer.trim().toLowerCase() === clozeData.words[index].toLowerCase(),
    )
    if (correct) {
      alert('Chúc mừng! Bạn đã hoàn thành!')
      onClose()
    } else {
      alert('Chưa đúng, thử lại nhé!')
    }
  }

  const parts = clozeData.paragraph.split('_____')

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white bg-opacity-90 rounded-xl p-8 shadow-2xl w-full max-w-4xl max-h-full overflow-auto">
        <h2 className="text-4xl font-bold text-indigo-700 mb-6 text-center">
          {title}
        </h2>
        <div className="text-2xl mb-6">
          {parts.map((part, index) => (
            <span key={index}>
              {part}
              {index < parts.length - 1 && (
                <input
                  type="text"
                  value={answers[index]}
                  onChange={(e) =>
                    setAnswers((prev) => {
                      const newA = [...prev]
                      newA[index] = e.target.value
                      return newA
                    })
                  }
                  className="border-b-2 border-gray-400 w-32 text-center mx-1"
                  placeholder="_____"
                />
              )}
            </span>
          ))}
        </div>
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4">Các từ cần điền:</h3>
          <ul className="list-disc list-inside text-xl">
            {clozeData.words.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={checkAnswers}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
          >
            Kiểm tra
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClozeGame
