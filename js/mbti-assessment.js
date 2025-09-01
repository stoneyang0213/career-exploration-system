// MBTI测评主逻辑
class MBTIAssessment {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        this.startTime = null;
        this.questionTimes = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedProgress();
    }

    bindEvents() {
        // 键盘快捷键支持
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('questionScreen').style.display !== 'none') {
                if (e.key >= '1' && e.key <= '3') {
                    const optionIndex = parseInt(e.key) - 1;
                    this.selectOption(optionIndex);
                } else if (e.key === 'ArrowLeft' && !document.getElementById('prevButton').disabled) {
                    this.prevQuestion();
                } else if (e.key === 'ArrowRight' && !document.getElementById('nextButton').disabled) {
                    this.nextQuestion();
                }
            }
        });
    }

    // 开始测评
    startTest() {
        this.startTime = Date.now();
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('questionScreen').classList.remove('hidden');
        
        this.showQuestion(0);
        this.updateProgress();
        
        // 记录开始事件
        this.trackEvent('assessment_started', { type: 'mbti' });
    }

    // 显示问题
    showQuestion(index) {
        if (index < 0 || index >= MBTI_QUESTIONS.length) return;
        
        this.currentQuestion = index;
        const question = MBTI_QUESTIONS[index];
        const questionStartTime = Date.now();
        
        // 更新问题内容
        document.getElementById('questionIcon').className = `${question.icon} text-2xl text-indigo-600`;
        document.getElementById('questionTitle').textContent = `问题 ${index + 1}: ${question.category}`;
        document.getElementById('questionText').textContent = question.question;
        
        // 生成选项
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, optionIndex) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-button p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all';
            optionElement.innerHTML = `
                <div class="flex items-center">
                    <div class="w-6 h-6 border-2 border-gray-300 rounded-full mr-4 flex items-center justify-center">
                        <span class="text-sm font-semibold text-gray-400">${optionIndex + 1}</span>
                    </div>
                    <div class="flex-1">
                        <p class="text-gray-800">${option.text}</p>
                    </div>
                </div>
            `;
            
            optionElement.addEventListener('click', () => this.selectOption(optionIndex));
            optionsContainer.appendChild(optionElement);
        });
        
        // 恢复之前的选择
        if (this.answers[index] !== undefined) {
            this.selectOption(this.answers[index], false);
        }
        
        // 更新按钮状态
        this.updateButtonStates();
        
        // 更新进度
        this.updateProgress();
        
        // 动画效果
        this.animateQuestionCard();
        
        // 记录问题开始时间
        this.questionTimes[index] = { start: questionStartTime };
    }

    // 选择选项
    selectOption(optionIndex, recordTime = true) {
        const options = document.querySelectorAll('.option-button');
        
        // 清除之前的选择
        options.forEach(opt => {
            opt.classList.remove('selected');
            opt.querySelector('.w-6').innerHTML = `<span class="text-sm font-semibold text-gray-400">${Array.from(options).indexOf(opt) + 1}</span>`;
        });
        
        // 标记新选择
        const selectedOption = options[optionIndex];
        selectedOption.classList.add('selected');
        selectedOption.querySelector('.w-6').innerHTML = '<i class="fas fa-check text-white text-sm"></i>';
        
        // 记录答案和时间
        this.answers[this.currentQuestion] = optionIndex;
        
        if (recordTime && this.questionTimes[this.currentQuestion]) {
            this.questionTimes[this.currentQuestion].end = Date.now();
            this.questionTimes[this.currentQuestion].duration = 
                this.questionTimes[this.currentQuestion].end - this.questionTimes[this.currentQuestion].start;
        }
        
        // 更新按钮状态
        this.updateButtonStates();
        
        // 保存进度
        this.saveProgress();
        
        // 自动跳转到下一题（延迟500ms）
        setTimeout(() => {
            if (this.currentQuestion < MBTI_QUESTIONS.length - 1) {
                this.nextQuestion();
            } else {
                // 最后一题，显示完成按钮
                const nextButton = document.getElementById('nextButton');
                nextButton.innerHTML = '<i class="fas fa-flag-checkered mr-2"></i>查看结果';
                nextButton.onclick = () => this.completeAssessment();
            }
        }, 500);
    }

    // 上一题
    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.showQuestion(this.currentQuestion - 1);
        }
    }

    // 下一题
    nextQuestion() {
        if (this.currentQuestion < MBTI_QUESTIONS.length - 1) {
            this.showQuestion(this.currentQuestion + 1);
        } else {
            this.completeAssessment();
        }
    }

    // 更新按钮状态
    updateButtonStates() {
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        
        prevButton.disabled = this.currentQuestion === 0;
        prevButton.classList.toggle('opacity-50', this.currentQuestion === 0);
        prevButton.classList.toggle('cursor-not-allowed', this.currentQuestion === 0);
        
        const hasAnswer = this.answers[this.currentQuestion] !== undefined;
        nextButton.disabled = !hasAnswer;
        nextButton.classList.toggle('opacity-50', !hasAnswer);
        nextButton.classList.toggle('cursor-not-allowed', !hasAnswer);
    }

    // 更新进度
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / MBTI_QUESTIONS.length) * 100;
        const circumference = 2 * Math.PI * 20;
        const offset = circumference - (progress / 100) * circumference;
        
        document.getElementById('progressRing').style.strokeDashoffset = offset;
        document.getElementById('questionCounter').textContent = `${this.currentQuestion + 1}/${MBTI_QUESTIONS.length}`;
        
        // 更新进度文本
        const progressTexts = [
            '探索你的社交能量来源...',
            '了解你的信息处理方式...',
            '发现你的决策风格...',
            '揭示你的生活态度...'
        ];
        
        const progressIndex = Math.floor((this.currentQuestion / MBTI_QUESTIONS.length) * progressTexts.length);
        document.getElementById('progressText').textContent = progressTexts[Math.min(progressIndex, progressTexts.length - 1)];
    }

    // 问题卡片动画
    animateQuestionCard() {
        const questionCard = document.querySelector('.question-card');
        questionCard.classList.remove('active');
        
        setTimeout(() => {
            questionCard.classList.add('active');
        }, 100);
    }

    // 完成测评
    completeAssessment() {
        // 计算分数
        this.calculateScores();
        
        // 确定MBTI类型
        const mbtiType = this.determineMBTIType();
        
        // 显示结果界面
        document.getElementById('questionScreen').style.display = 'none';
        document.getElementById('resultScreen').classList.remove('hidden');
        
        // 延迟显示结果（营造分析效果）
        setTimeout(() => {
            this.showResults(mbtiType);
        }, 2000);
        
        // 记录完成事件
        this.trackEvent('assessment_completed', {
            type: 'mbti',
            result: mbtiType,
            duration: Date.now() - this.startTime,
            questions_answered: this.answers.filter(a => a !== undefined).length
        });
    }

    // 计算分数
    calculateScores() {
        this.scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        
        this.answers.forEach((answerIndex, questionIndex) => {
            if (answerIndex !== undefined) {
                const question = MBTI_QUESTIONS[questionIndex];
                const selectedOption = question.options[answerIndex];
                
                // 累加分数
                Object.keys(selectedOption.score).forEach(dimension => {
                    this.scores[dimension] += selectedOption.score[dimension];
                });
            }
        });
    }

    // 确定MBTI类型
    determineMBTIType() {
        const type = [
            this.scores.E > this.scores.I ? 'E' : 'I',
            this.scores.S > this.scores.N ? 'S' : 'N', 
            this.scores.T > this.scores.F ? 'T' : 'F',
            this.scores.J > this.scores.P ? 'J' : 'P'
        ].join('');
        
        return type;
    }

    // 显示结果
    showResults(mbtiType) {
        const typeInfo = MBTI_TYPES[mbtiType];
        const resultContainer = document.getElementById('mbtiResult');
        
        // 计算各维度的倾向程度
        const dimensions = [
            { 
                name: 'E/I', 
                primary: this.scores.E > this.scores.I ? 'E' : 'I',
                score: this.scores.E > this.scores.I ? this.scores.E : this.scores.I,
                total: this.scores.E + this.scores.I,
                description: this.scores.E > this.scores.I ? DIMENSION_DESCRIPTIONS.E : DIMENSION_DESCRIPTIONS.I
            },
            { 
                name: 'S/N', 
                primary: this.scores.S > this.scores.N ? 'S' : 'N',
                score: this.scores.S > this.scores.N ? this.scores.S : this.scores.N,
                total: this.scores.S + this.scores.N,
                description: this.scores.S > this.scores.N ? DIMENSION_DESCRIPTIONS.S : DIMENSION_DESCRIPTIONS.N
            },
            { 
                name: 'T/F', 
                primary: this.scores.T > this.scores.F ? 'T' : 'F',
                score: this.scores.T > this.scores.F ? this.scores.T : this.scores.F,
                total: this.scores.T + this.scores.F,
                description: this.scores.T > this.scores.F ? DIMENSION_DESCRIPTIONS.T : DIMENSION_DESCRIPTIONS.F
            },
            { 
                name: 'J/P', 
                primary: this.scores.J > this.scores.P ? 'J' : 'P',
                score: this.scores.J > this.scores.P ? this.scores.J : this.scores.P,
                total: this.scores.J + this.scores.P,
                description: this.scores.J > this.scores.P ? DIMENSION_DESCRIPTIONS.J : DIMENSION_DESCRIPTIONS.P
            }
        ];

        resultContainer.innerHTML = `
            <div class="text-center mb-8">
                <div class="inline-block p-6 rounded-full mb-6" style="background-color: ${typeInfo.color}20; border: 3px solid ${typeInfo.color}">
                    <span class="text-4xl font-bold" style="color: ${typeInfo.color}">${mbtiType}</span>
                </div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">${typeInfo.name}</h1>
                <p class="text-xl text-gray-600 mb-4">${typeInfo.nickname}</p>
                <p class="text-lg text-gray-700 max-w-2xl mx-auto">${typeInfo.description}</p>
                <div class="mt-4 text-sm text-gray-500">
                    <i class="fas fa-users mr-1"></i>
                    约占人口的 ${typeInfo.percentage}%
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-8 mb-8">
                <!-- 维度分析 -->
                <div class="bg-gray-50 rounded-xl p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">
                        <i class="fas fa-chart-bar mr-2 text-indigo-600"></i>
                        你的性格维度
                    </h3>
                    <div class="space-y-4">
                        ${dimensions.map(dim => {
                            const percentage = Math.round((dim.score / dim.total) * 100);
                            return `
                                <div>
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="font-medium text-gray-700">${dim.description.name}</span>
                                        <span class="text-sm font-semibold" style="color: ${typeInfo.color}">${percentage}%</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-3">
                                        <div class="h-3 rounded-full transition-all duration-1000" 
                                             style="width: ${percentage}%; background-color: ${typeInfo.color}"></div>
                                    </div>
                                    <p class="text-sm text-gray-600 mt-1">${dim.description.description}</p>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- 核心特质 -->
                <div class="bg-gray-50 rounded-xl p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">
                        <i class="fas fa-star mr-2 text-yellow-500"></i>
                        你的核心优势
                    </h3>
                    <div class="space-y-2">
                        ${typeInfo.strengths.map(strength => `
                            <div class="flex items-center">
                                <i class="fas fa-check-circle text-green-500 mr-2"></i>
                                <span class="text-gray-700">${strength}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-8 mb-8">
                <!-- 适合的职业 -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">
                        <i class="fas fa-briefcase mr-2 text-blue-600"></i>
                        适合的职业领域
                    </h3>
                    <div class="grid grid-cols-1 gap-2">
                        ${typeInfo.careers.slice(0, 6).map(career => `
                            <div class="bg-white bg-opacity-60 rounded-lg p-3 text-sm font-medium text-gray-700">
                                <i class="fas fa-arrow-right mr-2 text-blue-500"></i>
                                ${career}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- 发展建议 -->
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">
                        <i class="fas fa-lightbulb mr-2 text-green-600"></i>
                        成长建议
                    </h3>
                    <div class="space-y-3">
                        ${typeInfo.challenges.map(challenge => `
                            <div class="bg-white bg-opacity-60 rounded-lg p-3">
                                <p class="text-sm text-gray-700">
                                    <i class="fas fa-exclamation-circle mr-2 text-orange-500"></i>
                                    注意：${challenge}
                                </p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- 名人案例 -->
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 mb-8">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">
                    <i class="fas fa-crown mr-2 text-purple-600"></i>
                    与你同类型的名人
                </h3>
                <div class="flex flex-wrap gap-3">
                    ${typeInfo.famous.map(person => `
                        <div class="bg-white bg-opacity-60 rounded-full px-4 py-2 text-sm font-medium text-gray-700">
                            <i class="fas fa-user-tie mr-2 text-purple-500"></i>
                            ${person}
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 行动按钮 -->
            <div class="text-center space-y-4">
                <div class="flex flex-col md:flex-row gap-4 justify-center">
                    <button onclick="mbtiAssessment.continueToHolland()" 
                            class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all">
                        <i class="fas fa-compass mr-2"></i>
                        继续霍兰德测评
                    </button>
                    
                    <button onclick="mbtiAssessment.downloadReport()" 
                            class="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-all">
                        <i class="fas fa-download mr-2"></i>
                        下载详细报告
                    </button>
                </div>
                
                <div class="flex justify-center space-x-6 text-sm text-gray-600">
                    <button onclick="mbtiAssessment.shareResult()" class="hover:text-indigo-600 transition-colors">
                        <i class="fas fa-share-alt mr-1"></i>
                        分享结果
                    </button>
                    <button onclick="mbtiAssessment.retakeTest()" class="hover:text-indigo-600 transition-colors">
                        <i class="fas fa-redo mr-1"></i>
                        重新测试
                    </button>
                    <a href="../index.html" class="hover:text-indigo-600 transition-colors">
                        <i class="fas fa-home mr-1"></i>
                        返回首页
                    </a>
                </div>
            </div>
        `;
        
        resultContainer.classList.remove('hidden');
        
        // 保存结果
        this.saveResult(mbtiType, typeInfo);
    }

    // 继续霍兰德测评
    continueToHolland() {
        window.location.href = 'holland.html';
    }

    // 下载报告
    downloadReport() {
        // 生成PDF报告的逻辑
        this.showMessage('报告生成功能正在开发中，敬请期待！', 'info');
    }

    // 分享结果
    shareResult() {
        if (navigator.share) {
            navigator.share({
                title: 'MBTI性格测评结果',
                text: '我刚完成了MBTI性格测评，快来看看我的结果！',
                url: window.location.href
            });
        } else {
            // 复制链接到剪贴板
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showMessage('链接已复制到剪贴板！', 'success');
            });
        }
    }

    // 重新测试
    retakeTest() {
        if (confirm('确定要重新开始测试吗？当前进度将会丢失。')) {
            this.resetAssessment();
            this.startTest();
        }
    }

    // 重置测评
    resetAssessment() {
        this.currentQuestion = 0;
        this.answers = [];
        this.scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        this.startTime = null;
        this.questionTimes = [];
        
        document.getElementById('resultScreen').style.display = 'none';
        document.getElementById('questionScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'block';
        
        localStorage.removeItem('mbti_progress');
    }

    // 保存进度
    saveProgress() {
        const progressData = {
            currentQuestion: this.currentQuestion,
            answers: this.answers,
            startTime: this.startTime,
            questionTimes: this.questionTimes,
            timestamp: Date.now()
        };
        
        localStorage.setItem('mbti_progress', JSON.stringify(progressData));
    }

    // 加载保存的进度
    loadSavedProgress() {
        try {
            const savedData = localStorage.getItem('mbti_progress');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // 检查是否是今天的数据（避免加载过期数据）
                const today = new Date().toDateString();
                const savedDate = new Date(data.timestamp).toDateString();
                
                if (today === savedDate) {
                    this.currentQuestion = data.currentQuestion || 0;
                    this.answers = data.answers || [];
                    this.startTime = data.startTime;
                    this.questionTimes = data.questionTimes || [];
                    
                    // 如果有进度，询问是否继续
                    if (this.answers.length > 0) {
                        if (confirm('检测到未完成的测评，是否继续？')) {
                            this.startTest();
                            this.showQuestion(this.currentQuestion);
                        }
                    }
                }
            }
        } catch (error) {
            console.log('加载进度失败:', error);
        }
    }

    // 保存结果
    saveResult(mbtiType, typeInfo) {
        const resultData = {
            type: mbtiType,
            typeInfo: typeInfo,
            scores: this.scores,
            completedAt: Date.now(),
            duration: Date.now() - this.startTime,
            answers: this.answers,
            questionTimes: this.questionTimes
        };
        
        localStorage.setItem('mbti_result', JSON.stringify(resultData));
        
        // 清除进度数据
        localStorage.removeItem('mbti_progress');
    }

    // 保存并退出
    saveAndExit() {
        this.saveProgress();
        if (confirm('确定要暂时退出吗？你的进度已保存，可以随时回来继续。')) {
            window.location.href = '../index.html';
        }
    }

    // 显示消息
    showMessage(message, type = 'info') {
        const colors = {
            success: 'green',
            error: 'red',
            info: 'blue',
            warning: 'yellow'
        };
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `fixed top-4 right-4 bg-${colors[type]}-100 border border-${colors[type]}-400 text-${colors[type]}-700 px-4 py-3 rounded z-50`;
        messageDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-info-circle mr-2"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-${colors[type]}-600 hover:text-${colors[type]}-800">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        // 3秒后自动消失
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 3000);
    }

    // 事件追踪
    trackEvent(eventName, properties = {}) {
        // 这里可以集成Google Analytics或其他分析工具
        console.log('Event:', eventName, properties);
        
        // 示例：发送到分析服务
        // gtag('event', eventName, properties);
    }
}

// 初始化MBTI测评
const mbtiAssessment = new MBTIAssessment();

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧠 MBTI性格测评系统已加载完成！');
    
    // 添加页面可见性变化监听，用于暂停/恢复计时
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 页面隐藏时暂停计时
            mbtiAssessment.saveProgress();
        } else {
            // 页面显示时恢复计时
            // 可以在这里添加恢复逻辑
        }
    });
});