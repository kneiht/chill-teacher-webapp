import React, { useState } from 'react'
import Slide from '@/lib/components/presentation/Slide'
import GoogleSlide from '@/lib/components/presentation/GoogleSlide'

interface SlideProps {
  isActive: boolean
}

const Slide1: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <div className="flex flex-col items-center justify-start h-full text-center">
        <h1 className="text-2xl font-bold text-indigo-700 mb-8">
          GRAMMAR FOR PRE-GRADE 7
        </h1>
        <div className="bg-yellow-400 text-4xl font-bold px-6 py-3 rounded-full mb-5 shadow-lg floating">
          Present Continuous Tense
        </div>
        <div className="flex flex-row items-center justify-center gap-8">
          <div className="mt-6 flex justify-center">
            <img
              src="https://img.freepik.com/free-photo/notebook-with-grammar-word-school-suplies_23-2149436698.jpg"
              alt="Grammar Learning"
              className="object-cover h-52 rounded-xl floating"
            />
          </div>
          <div className="bg-gradient-to-r from-indigo-100 to-green-200 border-l-4 border-indigo-500 py-5 px-10 text-left rounded-xl text-2xl">
            <p className="font-bold text-indigo-800">Mục tiêu bài học:</p>
            <ul className="list-disc pl-5 text-gray-700 text-2xl">
              <li>Hiểu và vận dụng thì Present Continuous</li>
              <li>Nắm vững cấu trúc khẳng định, phủ định, nghi vấn</li>
              <li>Biết cách sử dụng đúng thời điểm</li>
              <li>Phân biệt Present Continuous và Present Simple</li>
            </ul>
          </div>
        </div>
        <div className="my-3 opacity-0">---</div>
      </div>
    </Slide>
  )
}

const Slide2: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        1. Thì Present Continuous là gì?
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-2xl mb-4">
          Thì Present Continuous (Hiện tại tiếp diễn) dùng để diễn tả những hành
          động
          <span className="font-bold text-green-500">đang xảy ra</span> tại thời
          điểm nói hoặc
          <span className="font-bold text-green-500">
            xung quanh thời điểm nói
          </span>
          .
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-800">
              Đang xảy ra ngay lúc nói
            </p>
            <p className="text-2xl">"I am reading now."</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-800">
              Xung quanh thời điểm nói
            </p>
            <p className="text-2xl">"I am studying English this week."</p>
          </div>
        </div>
        <div className="mt-6 bg-yellow-100 p-4 rounded-lg">
          <p className="font-bold text-yellow-800 text-2xl">
            💡 Dấu hiệu nhận biết: now, at the moment, at present, currently,
            this week/month/year, today, right now
          </p>
        </div>
      </div>
    </Slide>
  )
}

const Slide3: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <Slide isActive={isActive} className="text-2xl">
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        2. Cấu trúc Present Continuous
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-2xl mb-4">
          Cấu trúc cơ bản của thì Present Continuous:
          <span className="font-bold text-red-500">S + be + V-ing</span>
        </p>
        <div className="mt-6 bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
          <p className="font-bold text-blue-800 text-2xl">Công thức:</p>
          <p className="text-2xl font-bold text-center mt-3 text-purple-700">
            S + am/is/are + V-ing + (O)
          </p>
        </div>
        <div className="mt-4 space-y-4">
          <div className="verb-example">
            <p className="text-2xl">
              <span className="font-bold text-blue-500">I</span>
              <span className="font-bold text-green-500">am reading</span> a
              book.
            </p>
            <p className="text-gray-600">(Tôi đang đọc sách.)</p>
          </div>
          <div className="verb-example">
            <p className="text-2xl">
              <span className="font-bold text-blue-500">She</span>
              <span className="font-bold text-green-500">is cooking</span>
              dinner.
            </p>
            <p className="text-gray-600">(Cô ấy đang nấu bữa tối.)</p>
          </div>
          <div className="verb-example">
            <p className="text-2xl">
              <span className="font-bold text-blue-500">They</span>
              <span className="font-bold text-green-500">are playing</span>
              football.
            </p>
            <p className="text-gray-600">(Họ đang chơi bóng đá.)</p>
          </div>
        </div>
      </div>
    </Slide>
  )
}

const Slide4: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <Slide isActive={isActive} className="text-2xl">
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        3. Cách thêm -ing vào động từ
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-2xl mb-4">
          Để tạo thì Present Continuous, ta cần thêm
          <span className="font-bold text-red-500">-ing</span> vào động từ. Có
          một số quy tắc cần nhớ:
        </p>
        <div className="mt-6 space-y-4">
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="font-bold text-green-800 text-2xl">
              1. Động từ thường: thêm -ing
            </p>
            <p className="text-2xl">
              play → playing, read → reading, work → working
            </p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="font-bold text-blue-800 text-2xl">
              2. Động từ kết thúc bằng -e: bỏ -e, thêm -ing
            </p>
            <p className="text-2xl">
              write → writing, dance → dancing, make → making
            </p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p className="font-bold text-yellow-800 text-2xl">
              3. Động từ 1 âm tiết, kết thúc bằng phụ âm-nguyên âm-phụ âm: gấp
              đôi phụ âm cuối
            </p>
            <p className="text-2xl">
              run → running, sit → sitting, swim → swimming
            </p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="font-bold text-red-800 text-2xl">
              4. Động từ kết thúc bằng -ie: đổi thành -y
            </p>
            <p className="text-2xl">lie → lying, die → dying, tie → tying</p>
          </div>
        </div>
      </div>
    </Slide>
  )
}

const Slide5: React.FC<SlideProps> = ({ isActive }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({})

  const checkInput = (exerciseId: string, correctAnswer: string) => {
    const userAnswer = (answers[exerciseId] || '')
      .trim()
      .toLowerCase()
      .replace(/[.?]/g, '')
    const correct = correctAnswer.toLowerCase().replace(/[.?]/g, '')
    if (userAnswer === correct) {
      setFeedback((prev) => ({ ...prev, [exerciseId]: 'correct' }))
    } else {
      setFeedback((prev) => ({ ...prev, [exerciseId]: 'incorrect' }))
    }
  }

  const resetExercise = (exerciseId: string) => {
    setAnswers((prev) => ({ ...prev, [exerciseId]: '' }))
    setFeedback((prev) => ({ ...prev, [exerciseId]: '' }))
  }

  return (
    <Slide isActive={isActive}>
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        Bài tập 1: Thêm -ing vào động từ
      </h2>
      <p className="text-2xl mb-8">Chuyển các động từ sau sang dạng -ing:</p>
      <div className="grid grid-cols-1 gap-4">
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            write →
            <input
              type="text"
              className="exercise-input"
              value={answers['write'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, write: e.target.value }))
              }
            />
            (viết)
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['write']
                  ? resetExercise('write')
                  : checkInput('write', 'writing')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['write'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['write'] === 'correct' ? 'correct' : feedback['write'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['write'] === 'correct'
                ? '✓ Đúng: writing'
                : '✗ Sai: Đáp án đúng là "writing"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            run →
            <input
              type="text"
              className="exercise-input"
              value={answers['run'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, run: e.target.value }))
              }
            />
            (chạy)
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['run']
                  ? resetExercise('run')
                  : checkInput('run', 'running')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['run'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['run'] === 'correct' ? 'correct' : feedback['run'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['run'] === 'correct'
                ? '✓ Đúng: running'
                : '✗ Sai: Đáp án đúng là "running"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            lie →
            <input
              type="text"
              className="exercise-input"
              value={answers['lie'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, lie: e.target.value }))
              }
            />
            (nằm)
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['lie']
                  ? resetExercise('lie')
                  : checkInput('lie', 'lying')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['lie'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['lie'] === 'correct' ? 'correct' : feedback['lie'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['lie'] === 'correct'
                ? '✓ Đúng: lying'
                : '✗ Sai: Đáp án đúng là "lying"'}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

const Slide6: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        4. Câu khẳng định Present Continuous
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-2xl mb-4">
          Câu khẳng định dùng để diễn tả hành động đang xảy ra. Ta sử dụng
          <span className="font-bold text-red-500">am/is/are + V-ing</span>.
        </p>
        <table className="w-full mt-3 text-center bg-white rounded-lg overflow-hidden text-2xl">
          <thead className="bg-indigo-200">
            <tr>
              <th className="p-2">Chủ ngữ</th>
              <th className="p-2">Be + V-ing</th>
              <th className="p-2">Ví dụ</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">I</td>
              <td className="p-2 font-bold text-red-500">am + V-ing</td>
              <td className="p-2">I am studying.</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">He, She, It</td>
              <td className="p-2 font-bold text-red-500">is + V-ing</td>
              <td className="p-2">She is cooking.</td>
            </tr>
            <tr>
              <td className="p-2">You, We, They</td>
              <td className="p-2 font-bold text-red-500">are + V-ing</td>
              <td className="p-2">They are playing.</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 space-y-2">
          <p className="text-2xl">
            Ví dụ: I <span className="highlight">am reading</span> a book now.
          </p>
          <p className="text-2xl">
            Ví dụ: He <span className="highlight">is working</span> at the
            moment.
          </p>
          <p className="text-2xl">
            Ví dụ: We <span className="highlight">are learning</span> English
            this week.
          </p>
        </div>
      </div>
    </Slide>
  )
}

const Slide7: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        5. Câu phủ định Present Continuous
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-2xl mb-4">
          Để tạo câu phủ định, ta thêm
          <span className="font-bold text-red-500">"not"</span> sau động từ
          <span className="font-bold text-red-500">be</span>.
        </p>
        <div className="mt-6 bg-gradient-to-r from-red-100 to-orange-100 p-4 rounded-lg">
          <p className="font-bold text-red-800 text-2xl">Công thức:</p>
          <p className="text-2xl font-bold text-center mt-3 text-purple-700">
            S + am/is/are + not + V-ing + (O)
          </p>
          <p className="text-2xl font-bold text-center mt-2">
            Viết tắt: am not, isn't (is not), aren't (are not)
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-2xl">
            Ví dụ: I <span className="highlight">am not watching</span> TV now.
            (I'm not watching TV now.)
          </p>
          <p className="text-2xl">
            Ví dụ: He <span className="highlight">is not sleeping</span>. (He
            <span className="highlight">isn't sleeping</span>.)
          </p>
          <p className="text-2xl">
            Ví dụ: They
            <span className="highlight">are not playing</span> games. (They
            <span className="highlight">aren't playing</span> games.)
          </p>
        </div>
      </div>
    </Slide>
  )
}

const Slide8: React.FC<SlideProps> = ({ isActive }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({})

  const checkInput = (exerciseId: string, correctAnswer: string) => {
    const userAnswer = (answers[exerciseId] || '')
      .trim()
      .toLowerCase()
      .replace(/[.?]/g, '')
    const correct = correctAnswer.toLowerCase().replace(/[.?]/g, '')
    if (userAnswer === correct) {
      setFeedback((prev) => ({ ...prev, [exerciseId]: 'correct' }))
    } else {
      setFeedback((prev) => ({ ...prev, [exerciseId]: 'incorrect' }))
    }
  }

  const resetExercise = (exerciseId: string) => {
    setAnswers((prev) => ({ ...prev, [exerciseId]: '' }))
    setFeedback((prev) => ({ ...prev, [exerciseId]: '' }))
  }

  return (
    <Slide isActive={isActive}>
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        Bài tập 2: Chuyển sang câu phủ định
      </h2>
      <p className="text-2xl mb-8">Chuyển các câu sau sang dạng phủ định:</p>
      <div className="grid grid-cols-1 gap-4">
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            I am studying English. → I
            <input
              type="text"
              className="exercise-input"
              value={answers['study'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, study: e.target.value }))
              }
            />
            .
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['study']
                  ? resetExercise('study')
                  : checkInput('study', 'am not studying English')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['study'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['study'] === 'correct' ? 'correct' : feedback['study'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['study'] === 'correct'
                ? '✓ Đúng: am not studying English'
                : '✗ Sai: Đáp án đúng là "am not studying English"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            She is cooking dinner. → She
            <input
              type="text"
              className="exercise-input"
              value={answers['cook'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, cook: e.target.value }))
              }
            />
            .
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['cook']
                  ? resetExercise('cook')
                  : checkInput('cook', "isn't cooking dinner")
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['cook'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['cook'] === 'correct' ? 'correct' : feedback['cook'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['cook'] === 'correct'
                ? "✓ Đúng: isn't cooking dinner"
                : '✗ Sai: Đáp án đúng là "isn\'t cooking dinner"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            They are playing football. → They
            <input
              type="text"
              className="exercise-input"
              value={answers['play'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, play: e.target.value }))
              }
            />
            .
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['play']
                  ? resetExercise('play')
                  : checkInput('play', "aren't playing football")
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['play'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['play'] === 'correct' ? 'correct' : feedback['play'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['play'] === 'correct'
                ? "✓ Đúng: aren't playing football"
                : '✗ Sai: Đáp án đúng là "aren\'t playing football"'}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

const Slide9: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        6. Câu hỏi Yes/No Present Continuous
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-2xl mb-4">
          Để đặt câu hỏi Yes/No, ta đảo động từ
          <span className="font-bold text-red-500">be</span> lên đầu câu.
        </p>
        <div className="mt-6 bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
          <p className="font-bold text-blue-800 text-2xl">Công thức:</p>
          <p className="text-2xl font-bold text-center mt-3 text-purple-700">
            Am/Is/Are + S + V-ing + (O)?
          </p>
          <p className="text-2xl font-bold text-center mt-2">
            Cách trả lời ngắn:
          </p>
          <ul className="list-disc pl-8 text-2xl">
            <li>Yes, S + am/is/are.</li>
            <li>No, S + am not/isn't/aren't.</li>
          </ul>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-2xl">
            Ví dụ: <span className="highlight">Are</span> you
            <span className="highlight">studying</span> now? - Yes, I am. / No,
            I'm not.
          </p>
          <p className="text-2xl">
            Ví dụ: <span className="highlight">Is</span> she
            <span className="highlight">cooking</span> dinner? - Yes, she is. /
            No, she isn't.
          </p>
          <p className="text-2xl">
            Ví dụ: <span className="highlight">Are</span> they
            <span className="highlight">playing</span> games? - Yes, they are. /
            No, they aren't.
          </p>
        </div>
      </div>
    </Slide>
  )
}

const Slide10: React.FC<SlideProps> = ({ isActive }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({})

  const checkInput = (exerciseId: string, correctAnswer: string) => {
    const userAnswer = (answers[exerciseId] || '')
      .trim()
      .toLowerCase()
      .replace(/[.?]/g, '')
    const correct = correctAnswer.toLowerCase().replace(/[.?]/g, '')
    if (userAnswer === correct) {
      setFeedback((prev) => ({ ...prev, [exerciseId]: 'correct' }))
    } else {
      setFeedback((prev) => ({ ...prev, [exerciseId]: 'incorrect' }))
    }
  }

  const resetExercise = (exerciseId: string) => {
    setAnswers((prev) => ({ ...prev, [exerciseId]: '' }))
    setFeedback((prev) => ({ ...prev, [exerciseId]: '' }))
  }

  return (
    <Slide isActive={isActive}>
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        Bài tập 3: Đặt câu hỏi Yes/No
      </h2>
      <p className="text-2xl mb-8">Đặt câu hỏi Yes/No cho các câu sau:</p>
      <div className="grid grid-cols-1 gap-4">
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            They are playing soccer. →
            <input
              type="text"
              className="exercise-input"
              value={answers['soccer'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, soccer: e.target.value }))
              }
            />
            ?
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['soccer']
                  ? resetExercise('soccer')
                  : checkInput('soccer', 'Are they playing soccer')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['soccer'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['soccer'] === 'correct' ? 'correct' : feedback['soccer'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['soccer'] === 'correct'
                ? '✓ Đúng: Are they playing soccer'
                : '✗ Sai: Đáp án đúng là "Are they playing soccer"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            He is working in a hospital. →
            <input
              type="text"
              className="exercise-input"
              value={answers['hospital'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, hospital: e.target.value }))
              }
            />
            ?
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['hospital']
                  ? resetExercise('hospital')
                  : checkInput('hospital', 'Is he working in a hospital')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['hospital'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['hospital'] === 'correct' ? 'correct' : feedback['hospital'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['hospital'] === 'correct'
                ? '✓ Đúng: Is he working in a hospital'
                : '✗ Sai: Đáp án đúng là "Is he working in a hospital"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            I am reading a book. →
            <input
              type="text"
              className="exercise-input"
              value={answers['book'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, book: e.target.value }))
              }
            />
            ?
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['book']
                  ? resetExercise('book')
                  : checkInput('book', 'Are you reading a book')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['book'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['book'] === 'correct' ? 'correct' : feedback['book'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['book'] === 'correct'
                ? '✓ Đúng: Are you reading a book'
                : '✗ Sai: Đáp án đúng là "Are you reading a book"'}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

const Slide11: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        7. Câu hỏi WH- Present Continuous
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-2xl mb-4">
          Câu hỏi WH- dùng để hỏi thông tin cụ thể. Ta thêm từ để hỏi (WH-word)
          vào đầu câu hỏi Yes/No.
        </p>
        <div className="mt-6 bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg">
          <p className="font-bold text-orange-800 text-2xl">Công thức:</p>
          <p className="text-2xl font-bold text-center mt-3 text-purple-700">
            WH-word + am/is/are + S + V-ing?
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-2xl">
            Ví dụ: <span className="highlight">What</span> are you doing now?
          </p>
          <p className="text-2xl">
            Ví dụ: <span className="highlight">Where</span> is she going?
          </p>
          <p className="text-2xl">
            Ví dụ: <span className="highlight">Why</span> are they crying?
          </p>
          <p className="text-2xl">
            Ví dụ: <span className="highlight">How</span> is he feeling today?
          </p>
        </div>
        <div className="mt-4 bg-blue-100 p-4 rounded-lg">
          <p className="font-bold text-blue-800 text-2xl">
            💡 Các từ để hỏi thường dùng: What, Where, When, Why, How, Who,
            Which
          </p>
        </div>
      </div>
    </Slide>
  )
}

const Slide12: React.FC<SlideProps> = ({ isActive }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({})

  const checkInput = (exerciseId: string, correctAnswer: string) => {
    const userAnswer = (answers[exerciseId] || '')
      .trim()
      .toLowerCase()
      .replace(/[.?]/g, '')
    const correct = correctAnswer.toLowerCase().replace(/[.?]/g, '')
    if (userAnswer === correct) {
      setFeedback((prev) => ({ ...prev, [exerciseId]: 'correct' }))
    } else {
      setFeedback((prev) => ({ ...prev, [exerciseId]: 'incorrect' }))
    }
  }

  const resetExercise = (exerciseId: string) => {
    setAnswers((prev) => ({ ...prev, [exerciseId]: '' }))
    setFeedback((prev) => ({ ...prev, [exerciseId]: '' }))
  }

  return (
    <Slide isActive={isActive}>
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        Bài tập 4: Đặt câu hỏi WH-
      </h2>
      <p className="text-2xl mb-8">Đặt câu hỏi cho phần gạch chân:</p>
      <div className="grid grid-cols-1 gap-4">
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-2">
            They are playing <span className="highlight">football</span>.
          </p>
          <input
            type="text"
            className="exercise-input w-full"
            value={answers['football'] || ''}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, football: e.target.value }))
            }
            placeholder="Đặt câu hỏi"
          />
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() =>
                feedback['football']
                  ? resetExercise('football')
                  : checkInput('football', 'What are they playing')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['football'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['football'] === 'correct' ? 'correct' : feedback['football'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['football'] === 'correct'
                ? '✓ Đúng: What are they playing'
                : '✗ Sai: Đáp án đúng là "What are they playing"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-2">
            She is going <span className="highlight">to school</span>.
          </p>
          <input
            type="text"
            className="exercise-input w-full"
            value={answers['school'] || ''}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, school: e.target.value }))
            }
            placeholder="Đặt câu hỏi"
          />
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() =>
                feedback['school']
                  ? resetExercise('school')
                  : checkInput('school', 'Where is she going')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['school'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['school'] === 'correct' ? 'correct' : feedback['school'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['school'] === 'correct'
                ? '✓ Đúng: Where is she going'
                : '✗ Sai: Đáp án đúng là "Where is she going"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-2">
            He is crying <span className="highlight">because he is sad</span>.
          </p>
          <input
            type="text"
            className="exercise-input w-full"
            value={answers['sad'] || ''}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, sad: e.target.value }))
            }
            placeholder="Đặt câu hỏi"
          />
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() =>
                feedback['sad']
                  ? resetExercise('sad')
                  : checkInput('sad', 'Why is he crying')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['sad'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['sad'] === 'correct' ? 'correct' : feedback['sad'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['sad'] === 'correct'
                ? '✓ Đúng: Why is he crying'
                : '✗ Sai: Đáp án đúng là "Why is he crying"'}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

const Slide13: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        8. So sánh Present Continuous và Present Simple
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-2xl mb-4">
          Hai thì này có cách sử dụng khác nhau. Hãy so sánh:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800 text-2xl mb-3">
              Present Simple
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-2xl">
              <li>Hành động thường xuyên, lặp lại</li>
              <li>Thói quen, sở thích</li>
              <li>Sự thật hiển nhiên</li>
              <li>Lịch trình, thời gian biểu</li>
            </ul>
            <div className="mt-3 p-3 bg-white rounded">
              <p className="text-2xl font-bold">Ví dụ:</p>
              <p className="text-2xl">I play football every Sunday.</p>
              <p className="text-2xl">She likes coffee.</p>
              <p className="text-2xl">The sun rises in the east.</p>
            </div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-bold text-green-800 text-2xl mb-3">
              Present Continuous
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-2xl">
              <li>Hành động đang xảy ra ngay lúc nói</li>
              <li>Hành động tạm thời</li>
              <li>Kế hoạch đã sắp xếp</li>
              <li>Hành động đang diễn ra xung quanh thời điểm nói</li>
            </ul>
            <div className="mt-3 p-3 bg-white rounded">
              <p className="text-2xl font-bold">Ví dụ:</p>
              <p className="text-2xl">I am playing football now.</p>
              <p className="text-2xl">She is drinking coffee.</p>
              <p className="text-2xl">We are having a party tonight.</p>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

const Slide14: React.FC<SlideProps> = ({ isActive }) => {
  const [selected, setSelected] = useState<{ [key: string]: string }>({})
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({})

  const checkMCQ = (
    exerciseId: string,
    userAnswer: string,
    correctAnswer: string,
  ) => {
    if (userAnswer === correctAnswer) {
      setFeedback((prev) => ({ ...prev, [exerciseId]: 'correct' }))
    } else {
      setFeedback((prev) => ({ ...prev, [exerciseId]: 'incorrect' }))
    }
  }

  const resetMCQ = (exerciseId: string) => {
    setSelected((prev) => ({ ...prev, [exerciseId]: '' }))
    setFeedback((prev) => ({ ...prev, [exerciseId]: '' }))
  }

  return (
    <Slide isActive={isActive}>
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        Bài tập 5: Chọn thì đúng
      </h2>
      <p className="text-2xl mb-8">
        Chọn thì Present Simple hoặc Present Continuous phù hợp:
      </p>
      <div className="grid grid-cols-1 gap-4">
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">Look! The children ___ in the garden.</p>
          <div className="grid grid-cols-2 gap-2 text-2xl">
            <button
              onClick={() => {
                setSelected((prev) => ({ ...prev, garden: 'play' }))
                checkMCQ('garden', 'play', 'are playing')
              }}
              className={`px-4 py-2 rounded-lg font-bold ${selected['garden'] === 'play' ? (feedback['garden'] === 'correct' ? 'bg-green-500 text-white' : feedback['garden'] === 'incorrect' ? 'bg-red-500 text-white' : 'bg-gray-200') : 'bg-gray-200'}`}
              disabled={!!feedback['garden']}
            >
              play
            </button>
            <button
              onClick={() => {
                setSelected((prev) => ({ ...prev, garden: 'are playing' }))
                checkMCQ('garden', 'are playing', 'are playing')
              }}
              className={`px-4 py-2 rounded-lg font-bold ${selected['garden'] === 'are playing' ? (feedback['garden'] === 'correct' ? 'bg-green-500 text-white' : feedback['garden'] === 'incorrect' ? 'bg-red-500 text-white' : 'bg-gray-200') : 'bg-gray-200'}`}
              disabled={!!feedback['garden']}
            >
              are playing
            </button>
          </div>
          <div
            className={`text-2xl mt-2 ${feedback['garden'] === 'correct' ? 'correct' : feedback['garden'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
          >
            {feedback['garden'] === 'correct'
              ? '✓ Chính xác!'
              : '✗ Sai rồi! Đáp án đúng là: are playing'}
          </div>
          {feedback['garden'] && (
            <button
              onClick={() => resetMCQ('garden')}
              className="btn-check px-4 py-2 rounded-lg font-bold mt-2"
            >
              Làm lại
            </button>
          )}
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">She usually ___ to school by bus.</p>
          <div className="grid grid-cols-2 gap-2 text-2xl">
            <button
              onClick={() => {
                setSelected((prev) => ({ ...prev, bus: 'goes' }))
                checkMCQ('bus', 'goes', 'goes')
              }}
              className={`px-4 py-2 rounded-lg font-bold ${selected['bus'] === 'goes' ? (feedback['bus'] === 'correct' ? 'bg-green-500 text-white' : feedback['bus'] === 'incorrect' ? 'bg-red-500 text-white' : 'bg-gray-200') : 'bg-gray-200'}`}
              disabled={!!feedback['bus']}
            >
              goes
            </button>
            <button
              onClick={() => {
                setSelected((prev) => ({ ...prev, bus: 'is going' }))
                checkMCQ('bus', 'is going', 'goes')
              }}
              className={`px-4 py-2 rounded-lg font-bold ${selected['bus'] === 'is going' ? (feedback['bus'] === 'correct' ? 'bg-green-500 text-white' : feedback['bus'] === 'incorrect' ? 'bg-red-500 text-white' : 'bg-gray-200') : 'bg-gray-200'}`}
              disabled={!!feedback['bus']}
            >
              is going
            </button>
          </div>
          <div
            className={`text-2xl mt-2 ${feedback['bus'] === 'correct' ? 'correct' : feedback['bus'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
          >
            {feedback['bus'] === 'correct'
              ? '✓ Chính xác!'
              : '✗ Sai rồi! Đáp án đúng là: goes'}
          </div>
          {feedback['bus'] && (
            <button
              onClick={() => resetMCQ('bus')}
              className="btn-check px-4 py-2 rounded-lg font-bold mt-2"
            >
              Làm lại
            </button>
          )}
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">I ___ English every day.</p>
          <div className="grid grid-cols-2 gap-2 text-2xl">
            <button
              onClick={() => {
                setSelected((prev) => ({ ...prev, english: 'study' }))
                checkMCQ('english', 'study', 'study')
              }}
              className={`px-4 py-2 rounded-lg font-bold ${selected['english'] === 'study' ? (feedback['english'] === 'correct' ? 'bg-green-500 text-white' : feedback['english'] === 'incorrect' ? 'bg-red-500 text-white' : 'bg-gray-200') : 'bg-gray-200'}`}
              disabled={!!feedback['english']}
            >
              study
            </button>
            <button
              onClick={() => {
                setSelected((prev) => ({ ...prev, english: 'am studying' }))
                checkMCQ('english', 'am studying', 'study')
              }}
              className={`px-4 py-2 rounded-lg font-bold ${selected['english'] === 'am studying' ? (feedback['english'] === 'correct' ? 'bg-green-500 text-white' : feedback['english'] === 'incorrect' ? 'bg-red-500 text-white' : 'bg-gray-200') : 'bg-gray-200'}`}
              disabled={!!feedback['english']}
            >
              am studying
            </button>
          </div>
          <div
            className={`text-2xl mt-2 ${feedback['english'] === 'correct' ? 'correct' : feedback['english'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
          >
            {feedback['english'] === 'correct'
              ? '✓ Chính xác!'
              : '✗ Sai rồi! Đáp án đúng là: study'}
          </div>
          {feedback['english'] && (
            <button
              onClick={() => resetMCQ('english')}
              className="btn-check px-4 py-2 rounded-lg font-bold mt-2"
            >
              Làm lại
            </button>
          )}
        </div>
      </div>
    </Slide>
  )
}

const Slide15: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <div className="flex flex-col items-center justify-start h-full">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
          Tổng kết bài học
        </h2>
        <div className="w-full bg-white p-6 rounded-xl shadow-md">
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-2xl font-bold text-blue-800 text-center">
              Kiến thức trọng tâm
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <p className="text-2xl font-bold text-green-800">
              1. Cấu trúc Present Continuous
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <span className="highlight">Khẳng định:</span> S + am/is/are +
                V-ing + (O)
              </li>
              <li>
                <span className="highlight">Phủ định:</span> S + am/is/are + not
                + V-ing + (O)
              </li>
              <li>
                <span className="highlight">Yes/No Question:</span> Am/Is/Are +
                S + V-ing + (O)?
              </li>
              <li>
                <span className="highlight">WH- Question:</span> WH-word +
                am/is/are + S + V-ing?
              </li>
            </ul>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg mb-4">
            <p className="text-2xl font-bold text-purple-800">
              2. Cách sử dụng
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Hành động đang xảy ra ngay lúc nói</li>
              <li>Hành động tạm thời xung quanh thời điểm nói</li>
              <li>Kế hoạch đã sắp xếp trong tương lai gần</li>
              <li>Hành động đang diễn ra trong khoảng thời gian hiện tại</li>
            </ul>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-yellow-800">
              3. Dấu hiệu nhận biết
            </p>
            <p className="text-2xl">
              now, at the moment, at present, currently, this week/month/year,
              today, right now, look!, listen!
            </p>
          </div>
        </div>
      </div>
    </Slide>
  )
}

const Slide16: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <div className="flex flex-col items-center justify-start h-full text-center">
        <h1 className="text-2xl font-bold text-indigo-700 mb-3">Chúc mừng!</h1>
        <div className="text-2xl md:text-3xl text-gray-700 mb-3">
          <p className="mb-4">Bạn đã hoàn thành bài học về</p>
          <div className="bg-gradient-to-r from-yellow-400 to-red-500 text-white text-4xl font-bold px-6 py-2 rounded-full inline-block">
            PRESENT CONTINUOUS TENSE
          </div>
        </div>
        <div className="flex justify-center mb-3">
          <img
            src="https://t3.ftcdn.net/jpg/04/09/09/92/360_F_409099227_cinbeFsXrOrLKZkFzAUYnXRppExHtbXL.jpg"
            className="h-32 rounded-xl object-cover"
            alt="Celebration Image"
          />
        </div>
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-xl max-w-xl">
          <p className="text-2xl md:text-2xl font-bold mb-2">
            Bây giờ bạn đã biết cách sử dụng thì Present Continuous!
          </p>
          <p className="text-xl">Hẹn gặp lại trong bài học tiếp theo!</p>
        </div>
      </div>
    </Slide>
  )
}

const Slide17: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <GoogleSlide isActive={isActive} style={{ overflow: 'hidden' }}>
      <iframe
        src="https://docs.google.com/presentation/d/e/2PACX-1vQD_Kjx3u1n71tBseCyScoYfdSEsQ-Kgc6WFrLRstqat7unOA38uOa0KiL1Xy5sHMMmh7fTbxMycViR/pubembed"
        style={{ border: 0 }}
        width="100%"
        height="103.9%"
        allowFullScreen
        className="rounded-xl"
      ></iframe>
    </GoogleSlide>
  )
}

export {
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  Slide7,
  Slide8,
  Slide9,
  Slide10,
  Slide11,
  Slide12,
  Slide13,
  Slide14,
  Slide15,
  Slide16,
  Slide17,
}
