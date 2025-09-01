// 职业价值观测评主逻辑
class ValuesAssessment {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.scores = {
            achievement: 0,
            social: 0,
            self_actualization: 0,
            life_balance: 0,
            economic: 0,
            security: 0,
            power: 0,
            independence: 0
        };
        this.startTime = null;
        this.questionTimes = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedProgress();
        this.animateValueCards();
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

    // 动画显示价值观卡片
    animateValueCards() {
        const cards = document.querySelectorAll('.value-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 100);
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
        this.trackEvent('values_assessment_started');
    }

    // 显示问题
    showQuestion(index) {
        if (index < 0 || index >= VALUES_QUESTIONS.length) return;
        
        this.currentQuestion = index;
        const question = VALUES_QUESTIONS[index];
        const questionStartTime = Date.now();

        // 更新问题内容
        const icons = [
            'fas fa-balance-scale', 'fas fa-heart', 'fas fa-star', 'fas fa-home',
            'fas fa-dollar-sign', 'fas fa-shield-alt', 'fas fa-crown', 'fas fa-rocket',
            'fas fa-lightbulb', 'fas fa-compass', 'fas fa-gem', 'fas fa-trophy',
            'fas fa-magic', 'fas fa-fire', 'fas fa-leaf', 'fas fa-crown'
        ];
        
        document.getElementById('questionIcon').className = `${icons[index] || 'fas fa-heart'} text-2xl text-pink-600`;
        document.getElementById('questionTitle').textContent = `情境 ${index + 1} - 价值选择`;
        document.getElementById('questionText').textContent = question.scenario;
        document.getElementById('questionHint').textContent = question.question;

        // 生成选项
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, optionIndex) => {
            const dimension = VALUE_DIMENSIONS[option.dimension];
            const optionElement = document.createElement('div');
            optionElement.className = 'p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-pink-300 hover:bg-pink-50 transition-all bg-white';
            
            optionElement.innerHTML = `
                <div class="flex items-start">
                    <div class="flex-shrink-0 mr-4">
                        <div class="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 font-bold">
                            ${optionIndex + 1}
                        </div>
                    </div>
                    <div class="flex-1">
                        <p class="text-gray-800 font-medium mb-3 leading-relaxed">${option.text}</p>
                        <div class="flex items-center text-sm">
                            <div class="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                <i class="${dimension.icon} mr-2" style="color: ${dimension.color}"></i>
                                <span class="text-gray-700 font-medium">${dimension.name}</span>
                            </div>
                            <div class="ml-3 text-gray-500">
                                ${dimension.english}
                            </div>
                        </div>
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
        
        // 记录问题开始时间
        this.questionTimes[index] = { start: questionStartTime };
    }

    // 选择选项
    selectOption(optionIndex, recordTime = true) {
        const options = document.querySelectorAll('#optionsContainer > div');
        
        // 清除之前的选择
        options.forEach((opt, idx) => {
            opt.classList.remove('selected');
            opt.style.backgroundColor = 'white';
            opt.style.color = 'inherit';
            opt.style.borderColor = '#e5e7eb';
            
            const numberCircle = opt.querySelector('.w-12');
            numberCircle.innerHTML = `${idx + 1}`;
            numberCircle.className = 'w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 font-bold';
        });
        
        // 标记新选择
        const selectedOption = options[optionIndex];
        selectedOption.classList.add('selected');
        selectedOption.style.background = 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)';
        selectedOption.style.color = 'white';
        selectedOption.style.borderColor = '#EC4899';
        selectedOption.style.transform = 'translateY(-2px) scale(1.02)';
        selectedOption.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.3)';
        
        const selectedCircle = selectedOption.querySelector('.w-12');
        selectedCircle.innerHTML = '<i class="fas fa-heart text-white"></i>';
        selectedCircle.className = 'w-12 h-12 rounded-full border-2 border-pink-300 bg-pink-500 flex items-center justify-center text-white font-bold';
        
        // 更新选项内的标签样式
        const valueTag = selectedOption.querySelector('.bg-gray-100');
        if (valueTag) {
            valueTag.className = 'flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1';
        }
        
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
        
        // 自动跳转到下一题（延迟700ms）
        setTimeout(() => {
            if (this.currentQuestion < VALUES_QUESTIONS.length - 1) {
                this.nextQuestion();
            } else {
                // 最后一题，显示完成按钮
                const nextButton = document.getElementById('nextButton');
                nextButton.innerHTML = '<i class="fas fa-heart mr-2"></i>查看结果';
                nextButton.onclick = () => this.completeAssessment();
            }
        }, 700);
    }

    // 上一题
    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.showQuestion(this.currentQuestion - 1);
        }
    }

    // 下一题
    nextQuestion() {
        if (this.currentQuestion < VALUES_QUESTIONS.length - 1) {
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
        const progress = ((this.currentQuestion + 1) / VALUES_QUESTIONS.length) * 100;
        const circumference = 2 * Math.PI * 20;
        const offset = circumference - (progress / 100) * circumference;
        
        document.getElementById('progressRing').style.strokeDashoffset = offset;
        document.getElementById('questionCounter').textContent = `${this.currentQuestion + 1}/${VALUES_QUESTIONS.length}`;
        
        // 更新进度文本
        const progressTexts = [
            '探索你的成就追求...',
            '了解你的社会责任感...',
            '发现你的自我实现渴望...',
            '分析你的生活平衡需求...',
            '评估你的经济价值观...',
            '了解你的安全感需求...',
            '探索你的权力地位观...',
            '分析你的独立自主性...'
        ];
        
        const progressIndex = Math.floor((this.currentQuestion / VALUES_QUESTIONS.length) * progressTexts.length);
        document.getElementById('progressText').textContent = progressTexts[Math.min(progressIndex, progressTexts.length - 1)];
    }

    // 完成测评
    completeAssessment() {
        // 计算分数
        this.calculateScores();
        
        // 生成价值观排序
        const valueRanking = generateValueRanking(this.scores);
        
        // 显示结果界面
        document.getElementById('questionScreen').style.display = 'none';
        document.getElementById('resultScreen').classList.remove('hidden');
        
        // 延迟显示结果（营造分析效果）
        setTimeout(() => {
            this.showResults(valueRanking);
        }, 3000);
        
        // 记录完成事件
        this.trackEvent('values_assessment_completed', {
            topValue: valueRanking.ranking[0].value,
            topValues: valueRanking.topValues,
            duration: Date.now() - this.startTime,
            questions_answered: this.answers.filter(a => a !== undefined).length
        });
    }

    // 计算分数
    calculateScores() {
        // 重置分数
        Object.keys(this.scores).forEach(key => {
            this.scores[key] = 0;
        });
        
        this.answers.forEach((answerIndex, questionIndex) => {
            if (answerIndex !== undefined) {
                const question = VALUES_QUESTIONS[questionIndex];
                const selectedOption = question.options[answerIndex];
                this.scores[selectedOption.dimension] += selectedOption.score;
            }
        });
    }

    // 显示结果
    showResults(valueRanking) {
        const topValue = valueRanking.ranking[0];
        const secondValue = valueRanking.ranking[1];
        const resultContainer = document.getElementById('valuesResult');
        
        resultContainer.innerHTML = `
            <div class="text-center mb-8">
                <div class="flex justify-center items-center mb-6">
                    <div class="relative">
                        <div class="w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center text-white shadow-xl pulse-glow" 
                             style="background: linear-gradient(135deg, ${topValue.info.color} 0%, ${secondValue.info.color} 100%); border-color: ${topValue.info.color}">
                            <i class="${topValue.info.icon} text-3xl mb-1"></i>
                            <span class="text-sm font-semibold">#${topValue.rank}</span>
                        </div>
                        <div class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                            <i class="fas fa-crown text-white text-sm"></i>
                        </div>
                    </div>
                </div>
                
                <h1 class="text-3xl font-bold text-gray-800 mb-2">你的核心价值观</h1>
                <div class="flex justify-center items-center space-x-4 mb-4">
                    <div class="flex items-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-4 py-2">
                        <i class="${topValue.info.icon} mr-2" style="color: ${topValue.info.color}"></i>
                        <span class="font-semibold text-lg">${topValue.info.name}</span>
                    </div>
                    <span class="text-gray-400">+</span>
                    <div class="flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-4 py-2">
                        <i class="${secondValue.info.icon} mr-2" style="color: ${secondValue.info.color}"></i>
                        <span class="font-semibold text-lg">${secondValue.info.name}</span>
                    </div>
                </div>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">${topValue.info.description}</p>
            </div>

            <div class="grid md:grid-cols-2 gap-8 mb-8">
                <!-- 价值观排序 -->
                <div class="bg-gray-50 rounded-xl p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-6 text-center">
                        <i class="fas fa-sort-amount-down mr-2 text-pink-600"></i>
                        你的价值观排序
                    </h3>
                    <div class="space-y-3">
                        ${valueRanking.ranking.map((item, index) => `
                            <div class="flex items-center justify-between p-4 bg-white rounded-lg border-l-4" style="border-color: ${item.info.color}">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 text-sm" style="background-color: ${item.info.color}">
                                        ${item.rank}
                                    </div>
                                    <div>
                                        <div class="font-medium text-gray-800">${item.info.name}</div>
                                        <div class="text-xs text-gray-500">${item.info.english}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="font-bold text-lg" style="color: ${item.info.color}">${item.score}</div>
                                    <div class="w-16 bg-gray-200 rounded-full h-2 mt-1">
                                        <div class="h-2 rounded-full transition-all duration-1000" 
                                             style="width: ${item.percentage}%; background-color: ${item.info.color}"></div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- 核心特质 -->
                <div class="bg-gray-50 rounded-xl p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">
                        <i class="fas fa-star mr-2 text-yellow-500"></i>
                        你的核心特质
                    </h3>
                    <div class="space-y-3 mb-6">
                        ${topValue.info.traits.map(trait => `
                            <div class="flex items-center p-3 bg-white rounded-lg">
                                <i class="fas fa-check-circle text-green-500 mr-3"></i>
                                <span class="text-gray-700">${trait}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-100">
                        <h4 class="font-semibold text-gray-800 mb-2">
                            <i class="fas fa-briefcase mr-2 text-pink-600"></i>
                            工作风格
                        </h4>
                        <p class="text-sm text-gray-700">${topValue.info.workStyle}</p>
                    </div>
                </div>
            </div>

            ${valueRanking.combination ? `
                <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 mb-8">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">
                        <i class="fas fa-puzzle-piece mr-2 text-blue-600"></i>
                        你的价值观组合类型
                    </h3>
                    <div class="mb-4">
                        <h4 class="font-bold text-lg text-gray-800 mb-2">${valueRanking.combination.description}</h4>
                        <p class="text-gray-700 mb-4">${valueRanking.combination.careerPath}</p>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="bg-white bg-opacity-70 rounded-lg p-4">
                            <h4 class="font-semibold text-gray-800 mb-3">
                                <i class="fas fa-briefcase mr-2 text-green-600"></i>
                                推荐职业
                            </h4>
                            <div class="space-y-2">
                                ${valueRanking.combination.suitableCareers.map(career => `
                                    <div class="flex items-center">
                                        <i class="fas fa-arrow-right mr-2 text-green-500 text-sm"></i>
                                        <span class="text-gray-700 text-sm">${career}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="bg-white bg-opacity-70 rounded-lg p-4">
                            <h4 class="font-semibold text-gray-800 mb-3">
                                <i class="fas fa-lightbulb mr-2 text-orange-600"></i>
                                发展建议
                            </h4>
                            <p class="text-sm text-gray-700">${valueRanking.combination.advice}</p>
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- 综合建议 -->
            <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-100 mb-8">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">
                    <i class="fas fa-compass mr-2 text-green-600"></i>
                    职业发展建议
                </h3>
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="bg-white bg-opacity-70 rounded-lg p-4">
                        <h4 class="font-semibold text-gray-800 mb-2">
                            <i class="fas fa-thumbs-up mr-2 text-green-500"></i>
                            发挥优势
                        </h4>
                        <ul class="text-sm text-gray-700 space-y-1">
                            <li>• 寻找能体现"${topValue.info.name}"的工作机会</li>
                            <li>• 在"${secondValue.info.name}"方面寻求发展空间</li>
                            <li>• 选择与你价值观匹配的企业文化</li>
                        </ul>
                    </div>
                    <div class="bg-white bg-opacity-70 rounded-lg p-4">
                        <h4 class="font-semibold text-gray-800 mb-2">
                            <i class="fas fa-balance-scale mr-2 text-blue-500"></i>
                            平衡发展
                        </h4>
                        <ul class="text-sm text-gray-700 space-y-1">
                            <li>• 适当关注得分较低的价值观维度</li>
                            <li>• 在不同人生阶段调整价值观重点</li>
                            <li>• 寻求多元化的职业体验机会</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 行动按钮 -->
            <div class="text-center space-y-4">
                <div class="flex flex-col md:flex-row gap-4 justify-center">
                    <button onclick="valuesAssessment.generateComprehensiveReport()" 
                            class="values-bg text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
                        <i class="fas fa-file-alt mr-2"></i>
                        生成综合报告
                    </button>
                    
                    <button onclick="valuesAssessment.downloadReport()" 
                            class="border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-pink-50 transition-all">
                        <i class="fas fa-download mr-2"></i>
                        下载详细报告
                    </button>
                </div>
                
                <div class="flex justify-center space-x-6 text-sm text-gray-600">
                    <button onclick="valuesAssessment.shareResult()" class="hover:text-pink-600 transition-colors">
                        <i class="fas fa-share-alt mr-1"></i>
                        分享结果
                    </button>
                    <button onclick="valuesAssessment.retakeTest()" class="hover:text-pink-600 transition-colors">
                        <i class="fas fa-redo mr-1"></i>
                        重新测试
                    </button>
                    <a href="../index.html" class="hover:text-pink-600 transition-colors">
                        <i class="fas fa-home mr-1"></i>
                        返回首页
                    </a>
                </div>
            </div>
        `;
        
        resultContainer.classList.remove('hidden');
        
        // 保存结果
        this.saveResult(valueRanking);
    }

    // 生成综合报告
    generateComprehensiveReport() {
        // 检查是否完成了所有三项测评
        const mbtiResult = localStorage.getItem('mbti_result');
        const hollandResult = localStorage.getItem('holland_result');
        const valuesResult = localStorage.getItem('values_result');

        if (mbtiResult && hollandResult && valuesResult) {
            window.location.href = '../report.html';
        } else {
            this.showMessage('请完成所有三项测评后再生成综合报告！', 'warning');
        }
    }

    // 下载报告
    downloadReport() {
        this.showMessage('报告生成功能正在开发中，敬请期待！', 'info');
    }

    // 分享结果
    shareResult() {
        if (navigator.share) {
            navigator.share({
                title: '职业价值观测评结果',
                text: '我刚完成了职业价值观测评，发现了我的核心价值追求！',
                url: window.location.href
            });
        } else {
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
        this.scores = {
            achievement: 0,
            social: 0,
            self_actualization: 0,
            life_balance: 0,
            economic: 0,
            security: 0,
            power: 0,
            independence: 0
        };
        this.startTime = null;
        this.questionTimes = [];
        
        document.getElementById('resultScreen').style.display = 'none';
        document.getElementById('questionScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'block';
        
        localStorage.removeItem('values_progress');
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
        
        localStorage.setItem('values_progress', JSON.stringify(progressData));
    }

    // 加载保存的进度
    loadSavedProgress() {
        try {
            const savedData = localStorage.getItem('values_progress');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // 检查是否是今天的数据
                const today = new Date().toDateString();
                const savedDate = new Date(data.timestamp).toDateString();
                
                if (today === savedDate) {
                    this.currentQuestion = data.currentQuestion || 0;
                    this.answers = data.answers || [];
                    this.startTime = data.startTime;
                    this.questionTimes = data.questionTimes || [];
                    
                    if (this.answers.length > 0) {
                        if (confirm('检测到未完成的价值观测评，是否继续？')) {
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
    saveResult(valueRanking) {
        const resultData = {
            valueRanking: valueRanking,
            scores: this.scores,
            completedAt: Date.now(),
            duration: Date.now() - this.startTime,
            answers: this.answers,
            questionTimes: this.questionTimes
        };
        
        localStorage.setItem('values_result', JSON.stringify(resultData));
        localStorage.removeItem('values_progress');
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
        
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 3000);
    }

    // 事件追踪
    trackEvent(eventName, properties = {}) {
        console.log('Values Event:', eventName, properties);
    }
}

// 初始化价值观测评
const valuesAssessment = new ValuesAssessment();

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('💎 职业价值观测评系统已加载完成！');
    
    // 页面可见性变化监听
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            valuesAssessment.saveProgress();
        }
    });
});