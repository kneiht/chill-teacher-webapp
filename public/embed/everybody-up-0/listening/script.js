
document.addEventListener('DOMContentLoaded', () => {
    const exerciseData = window.exerciseData;
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const checkAnswersBtn = document.getElementById('check-answers-btn');
    let scores = {
        'listen-and-choose': { correct: 0, total: exerciseData.listenAndChoose.length },
        'fill-in-the-blank': { correct: 0, total: exerciseData.fillInTheBlank.length },
        'dialogues': { correct: 0, total: exerciseData.dialogues.reduce((acc, d) => acc + d.questions.length, 0) }
    };

    // Tab switching logic
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetType = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            tabContents.forEach(content => {
                content.id === targetType ? content.classList.remove('hidden') : content.classList.add('hidden');
            });
            document.querySelectorAll('.results-container').forEach(el => el.style.display = 'none');
            // Pause all audio when switching tabs
            document.querySelectorAll('audio').forEach(audio => audio.pause());
        });
    });

    // Check answers logic
    if (checkAnswersBtn) {
        checkAnswersBtn.addEventListener('click', () => {
            const activeTab = document.querySelector('.tab-btn.active');
            if (!activeTab) return;
            
            const exerciseType = activeTab.dataset.tab;
            
            if (exerciseType === 'listen-and-choose') {
                scores['listen-and-choose'].correct = 0;
                exerciseData.listenAndChoose.forEach(q => {
                    const qEl = document.getElementById(`lc_q_${q.id}`);
                    const selected = qEl.querySelector('input:checked');
                    const isCorrect = selected && selected.value === q.correctAnswer;
                    updateQuestionStyle(qEl, isCorrect);
                    if (isCorrect) scores['listen-and-choose'].correct++;
                });
            } else if (exerciseType === 'fill-in-the-blank') {
                scores['fill-in-the-blank'].correct = 0;
                exerciseData.fillInTheBlank.forEach(q => {
                    const qEl = document.getElementById(`fb_q_${q.id}`);
                    const input = qEl.querySelector('input[type="text"]');
                    const isCorrect = input && input.value.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                    updateQuestionStyle(qEl, isCorrect);
                    if (isCorrect) scores['fill-in-the-blank'].correct++;
                });
            } else if (exerciseType === 'dialogues') {
                scores['dialogues'].correct = 0;
                exerciseData.dialogues.forEach(d => {
                    d.questions.forEach(q => {
                        const qEl = document.getElementById(`diag_q_${d.id}_${q.id}`);
                        const selected = qEl.querySelector('input:checked');
                        const isCorrect = selected && selected.value === q.correctAnswer;
                        updateQuestionStyle(qEl, isCorrect);
                        if (isCorrect) scores['dialogues'].correct++;
                    });
                });
            }

            showResults(exerciseType);
        });
    }

    function updateQuestionStyle(qEl, isCorrect) {
        qEl.classList.remove('correct', 'incorrect');
        qEl.classList.add(isCorrect ? 'correct' : 'incorrect');
    }

    function showResults(exerciseType) {
        const resultsContainer = document.querySelector(`#${exerciseType} .results-container`);
        const score = scores[exerciseType];
        if (resultsContainer && score) {
            const percentage = score.total > 0 ? (score.correct / score.total) * 100 : 0;
            let feedbackEmoji = '🤔';
            if (percentage === 100) feedbackEmoji = '🎉';
            else if (percentage >= 75) feedbackEmoji = '👍';
            else if (percentage >= 50) feedbackEmoji = '🙂';

            resultsContainer.innerHTML = `
                <h3 class="text-3xl font-bold text-white mb-2">Great job! ${feedbackEmoji}</h3>
                <p class="text-2xl text-yellow-300">You got <span class="font-bold text-white">${score.correct}</span> out of <span class="font-bold text-white">${score.total}</span> correct!</p>
            `;
            resultsContainer.style.display = 'block';
        }
    }

    // Trigger click on the first tab to initialize view
    if (tabs.length > 0) {
        tabs[0].click();
    }
});
