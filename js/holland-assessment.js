// 霍兰德职业兴趣测评主逻辑
class HollandAssessment {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        this.startTime = null;
        this.questionTimes = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedProgress();
        this.animateRIASECCards();
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

    // 动画显示RIASEC卡片
    animateRIASECCards() {
        const cards = document.querySelectorAll('.riasec-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 150);
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
        this.trackEvent('holland_assessment_started');
    }

    // 显示问题
    showQuestion(index) {
        if (index < 0 || index >= HOLLAND_QUESTIONS.length) return;
        
        this.currentQuestion = index;
        const question = HOLLAND_QUESTIONS[index];
        const questionStartTime = Date.now();

        // 更新问题内容
        const questionTypes = {
            'activity': { icon: 'fas fa-running', title: '活动偏好' },
            'work': { icon: 'fas fa-briefcase', title: '工作角色' },
            'environment': { icon: 'fas fa-building', title: '工作环境' },
            'learning': { icon: 'fas fa-graduation-cap', title: '学习方式' },
            'interest': { icon: 'fas fa-heart', title: '兴趣领域' },
            'expression': { icon: 'fas fa-paint-brush', title: '表达方式' },
            'thinking': { icon: 'fas fa-brain', title: '思维方式' },
            'motivation': { icon: 'fas fa-rocket', title: '激励因素' },
            'interaction': { icon: 'fas fa-comments', title: '人际交往' },
            'values': { icon: 'fas fa-star', title: '价值观念' },
            'leadership': { icon: 'fas fa-crown', title: '领导风格' },
            'challenge': { icon: 'fas fa-mountain', title: '挑战偏好' },
            'goal': { icon: 'fas fa-bullseye', title: '职业目标' },
            'work_style': { icon: 'fas fa-cogs', title: '工作方式' },
            'organization': { icon: 'fas fa-sitemap', title: '组织观念' },
            'detail': { icon: 'fas fa-search', title: '细节关注' },
            'comparison': { icon: 'fas fa-balance-scale', title: '情境选择' },
            'future': { icon: 'fas fa-crystal-ball', title: '未来导向' },
            'skills': { icon: 'fas fa-tools', title: '能力特长' },
            'final': { icon: 'fas fa-flag-checkered', title: '最终印象' }
        };

        const questionType = questionTypes[question.type] || { icon: 'fas fa-lightbulb', title: '职业偏好' };
        
        document.getElementById('questionIcon').className = `${questionType.icon} text-2xl text-purple-600`;
        document.getElementById('questionTitle').textContent = `${questionType.title} - 第${index + 1}题`;
        document.getElementById('questionText').textContent = question.question;
        
        // 根据问题类型设置提示文本
        const hints = {
            'activity': '选择你最感兴趣的活动',
            'work': '选择你最愿意承担的角色',
            'environment': '选择你最喜欢的工作环境',
            'comparison': '选择你最倾向的选项',
            'final': '选择最符合你期望的评价'
        };
        document.getElementById('questionHint').textContent = hints[question.type] || '选择最符合你情况的选项';

        // 生成选项
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, optionIndex) => {
            const dimension = RIASEC_DIMENSIONS[option.dimension];
            const optionElement = document.createElement('div');
            optionElement.className = 'option-card p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-all bg-white';
            
            optionElement.innerHTML = `
                <div class="flex items-start">
                    <div class="flex-shrink-0 mr-4">
                        <div class="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 font-bold">
                            ${optionIndex + 1}
                        </div>
                    </div>
                    <div class="flex-1">
                        <p class="text-gray-800 font-medium mb-2">${option.text}</p>
                        <div class="flex items-center text-sm">
                            <div class="flex items-center mr-4">
                                <i class="${dimension.icon} mr-2" style="color: ${dimension.color}"></i>
                                <span class="text-gray-600">${dimension.name}</span>
                            </div>
                            <div class="text-gray-400">
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
        const options = document.querySelectorAll('.option-card');
        
        // 清除之前的选择
        options.forEach((opt, idx) => {
            opt.classList.remove('selected');
            const numberCircle = opt.querySelector('.w-12');
            numberCircle.innerHTML = `${idx + 1}`;
            numberCircle.className = 'w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 font-bold';
        });
        
        // 标记新选择
        const selectedOption = options[optionIndex];
        selectedOption.classList.add('selected');
        const selectedCircle = selectedOption.querySelector('.w-12');
        selectedCircle.innerHTML = '<i class="fas fa-check text-white"></i>';
        selectedCircle.className = 'w-12 h-12 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center text-white font-bold';
        
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
        
        // 自动跳转到下一题（延迟600ms）
        setTimeout(() => {
            if (this.currentQuestion < HOLLAND_QUESTIONS.length - 1) {
                this.nextQuestion();
            } else {
                // 最后一题，显示完成按钮
                const nextButton = document.getElementById('nextButton');
                nextButton.innerHTML = '<i class="fas fa-compass mr-2"></i>查看结果';
                nextButton.onclick = () => this.completeAssessment();
            }
        }, 600);
    }

    // 上一题
    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.showQuestion(this.currentQuestion - 1);
        }
    }

    // 下一题
    nextQuestion() {
        if (this.currentQuestion < HOLLAND_QUESTIONS.length - 1) {
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
        const progress = ((this.currentQuestion + 1) / HOLLAND_QUESTIONS.length) * 100;
        const circumference = 2 * Math.PI * 20;
        const offset = circumference - (progress / 100) * circumference;
        
        document.getElementById('progressRing').style.strokeDashoffset = offset;
        document.getElementById('questionCounter').textContent = `${this.currentQuestion + 1}/${HOLLAND_QUESTIONS.length}`;
        
        // 更新进度文本
        const progressTexts = [
            '探索你的实际操作兴趣...',
            '了解你的研究分析倾向...',
            '发现你的创意艺术天赋...',
            '揭示你的社会服务热情...',
            '分析你的企业领导潜力...',
            '评估你的事务管理能力...'
        ];
        
        const progressIndex = Math.floor((this.currentQuestion / HOLLAND_QUESTIONS.length) * progressTexts.length);
        document.getElementById('progressText').textContent = progressTexts[Math.min(progressIndex, progressTexts.length - 1)];
    }

    // 完成测评
    completeAssessment() {
        // 计算分数
        this.calculateScores();
        
        // 生成职业代码
        const careerCode = generateCareerCode(this.scores);
        
        // 显示结果界面
        document.getElementById('questionScreen').style.display = 'none';
        document.getElementById('resultScreen').classList.remove('hidden');
        
        // 延迟显示结果（营造分析效果）
        setTimeout(() => {
            this.showResults(careerCode);
        }, 2500);
        
        // 记录完成事件
        this.trackEvent('holland_assessment_completed', {
            result: careerCode.primary,
            code: careerCode.codes[1] || careerCode.codes[0],
            duration: Date.now() - this.startTime,
            questions_answered: this.answers.filter(a => a !== undefined).length
        });
    }

    // 计算分数
    calculateScores() {
        this.scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        
        this.answers.forEach((answerIndex, questionIndex) => {
            if (answerIndex === undefined) return;

            // --- 增加健壮性检查 ---
            if (!HOLLAND_QUESTIONS || !HOLLAND_QUESTIONS[questionIndex]) {
                console.error(`[CRITICAL] 无法找到问题数据！问题索引: ${questionIndex}`);
                return; 
            }
            const question = HOLLAND_QUESTIONS[questionIndex];

            if (!question.options || !question.options[answerIndex]) {
                console.error(`[CRITICAL] 无法找到选项数据！问题索引: ${questionIndex}, 答案索引: ${answerIndex}`);
                return;
            }
            const selectedOption = question.options[answerIndex];

            if (!selectedOption.dimension || selectedOption.score === undefined) {
                console.error(`[CRITICAL] 选项数据不完整！`, selectedOption);
                return;
            }
            // --- 检查结束 ---

            this.scores[selectedOption.dimension] += selectedOption.score;
        });
    }

    // 显示结果
    showResults(careerCode) {
        try {
            console.log('开始显示霍兰德测评结果:', careerCode);
            
            const primaryDimension = RIASEC_DIMENSIONS[careerCode.primary];
            const secondaryDimension = RIASEC_DIMENSIONS[careerCode.secondary];
            const resultContainer = document.getElementById('hollandResult');
            
            if (!primaryDimension || !secondaryDimension) {
                console.error('维度信息未找到:', { primary: careerCode.primary, secondary: careerCode.secondary });
                this.showErrorMessage('结果数据加载失败，请刷新页面重试');
                return;
            }
            
            if (!resultContainer) {
                console.error('结果容器未找到');
                this.showErrorMessage('页面元素加载失败，请刷新页面重试');
                return;
            }
            
            // 创建六边形雷达图数据
            const radarData = Object.entries(this.scores).map(([dim, score]) => ({
                dimension: dim,
                score: score,
                percentage: Math.round((score / Math.max(...Object.values(this.scores))) * 100),
                info: RIASEC_DIMENSIONS[dim]
            }));

            // 获取职业建议
            const primaryCareer = HOLLAND_CAREERS[careerCode.primary] || { careers: [], description: '' };
            const combinedCareer = HOLLAND_CAREERS[careerCode.codes[1]] || primaryCareer;

            resultContainer.innerHTML = `
                <div class="text-center mb-8">
                    <div class="flex justify-center items-center mb-6">
                        <div class="relative">
                            <div class="w-32 h-32 rounded-full border-8 flex items-center justify-center text-white text-4xl font-bold shadow-xl" 
                                 style="background: linear-gradient(135deg, ${primaryDimension.color} 0%, ${secondaryDimension.color} 100%); border-color: ${primaryDimension.color}">
                                ${careerCode.primary}${careerCode.secondary}
                            </div>
                            <div class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                <i class="fas fa-star text-white text-sm"></i>
                            </div>
                        </div>
                    </div>
                    
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">你的职业兴趣类型</h1>
                    <div class="flex justify-center items-center space-x-4 mb-4">
                        <div class="flex items-center">
                            <i class="${primaryDimension.icon} mr-2" style="color: ${primaryDimension.color}"></i>
                            <span class="font-semibold text-xl">${primaryDimension.name}</span>
                        </div>
                        <span class="text-gray-400">+</span>
                        <div class="flex items-center">
                            <i class="${secondaryDimension.icon} mr-2" style="color: ${secondaryDimension.color}"></i>
                            <span class="font-semibold text-xl">${secondaryDimension.name}</span>
                        </div>
                    </div>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">${primaryDimension.description}</p>
                </div>

                <div class="grid md:grid-cols-2 gap-8 mb-8">
                    <!-- RIASEC雷达图 -->
                    <div class="bg-gray-50 rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-gray-800 mb-6 text-center">
                            <i class="fas fa-chart-radar mr-2 text-purple-600"></i>
                            你的兴趣图谱
                        </h3>
                        <div class="relative">
                            <!-- 简化的六边形显示 -->
                            <div class="grid grid-cols-2 gap-4">
                                ${radarData.map(item => `
                                    <div class="flex items-center justify-between p-3 bg-white rounded-lg">
                                        <div class="flex items-center">
                                            <i class="${item.info.icon} mr-3" style="color: ${item.info.color}"></i>
                                            <div>
                                                <div class="font-medium text-gray-800">${item.info.name}</div>
                                                <div class="text-xs text-gray-500">${item.dimension}</div>
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
                    </div>

                    <!-- 核心特质 -->
                    <div class="bg-gray-50 rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">
                            <i class="fas fa-star mr-2 text-yellow-500"></i>
                            你的核心特质
                        </h3>
                        <div class="space-y-3">
                            ${primaryDimension.traits.map(trait => `
                                <div class="flex items-center p-3 bg-white rounded-lg">
                                    <i class="fas fa-check-circle text-green-500 mr-3"></i>
                                    <span class="text-gray-700">${trait}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-8 mb-8">
                    <!-- 适合的职业 -->
                    <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">
                            <i class="fas fa-briefcase mr-2 text-blue-600"></i>
                            推荐职业领域
                        </h3>
                        <div class="grid grid-cols-1 gap-3">
                            ${combinedCareer.careers.slice(0, 6).map(career => `
                                <div class="bg-white bg-opacity-70 rounded-lg p-3 hover:bg-opacity-90 transition-all">
                                    <div class="flex items-center">
                                        <i class="fas fa-arrow-right mr-3 text-blue-500"></i>
                                        <span class="font-medium text-gray-700">${career}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <p class="text-sm text-gray-600 mt-4 bg-white bg-opacity-50 rounded-lg p-3">
                            <i class="fas fa-lightbulb mr-2 text-yellow-500"></i>
                            ${combinedCareer.description}
                        </p>
                    </div>

                    <!-- 工作环境偏好 -->
                    <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">
                            <i class="fas fa-building mr-2 text-green-600"></i>
                            理想工作环境
                        </h3>
                        <div class="bg-white bg-opacity-70 rounded-lg p-4 mb-4">
                            <h4 class="font-semibold text-gray-800 mb-2">主要环境</h4>
                            <p class="text-gray-700">${primaryDimension.workEnvironment}</p>
                        </div>
                        <div class="bg-white bg-opacity-70 rounded-lg p-4">
                            <h4 class="font-semibold text-gray-800 mb-2">辅助环境</h4>
                            <p class="text-gray-700">${secondaryDimension.workEnvironment}</p>
                        </div>
                    </div>
                </div>

                <!-- 发展建议 -->
                <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100 mb-8">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">
                        <i class="fas fa-lightbulb mr-2 text-orange-600"></i>
                        个人发展建议
                    </h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-white bg-opacity-70 rounded-lg p-4">
                            <h4 class="font-semibold text-gray-800 mb-2">
                                <i class="fas fa-plus-circle mr-2 text-green-500"></i>
                                发挥优势
                            </h4>
                            <ul class="text-sm text-gray-700 space-y-1">
                                <li>• 充分利用你的${primaryDimension.name}特质</li>
                                <li>• 寻找能体现${secondaryDimension.name}能力的机会</li>
                                <li>• 在${primaryDimension.workEnvironment}中发展职业</li>
                            </ul>
                        </div>
                        <div class="bg-white bg-opacity-70 rounded-lg p-4">
                            <h4 class="font-semibold text-gray-800 mb-2">
                                <i class="fas fa-chart-line mr-2 text-blue-500"></i>
                                能力提升
                            </h4>
                            <ul class="text-sm text-gray-700 space-y-1">
                                <li>• 培养较弱维度的相关技能</li>
                                <li>• 寻求跨领域的学习机会</li>
                                <li>• 建立多元化的职业发展路径</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 行动按钮 -->
                <div class="text-center space-y-4">
                    <div class="flex flex-col md:flex-row gap-4 justify-center">
                        <button onclick="hollandAssessment.continueToValues()" 
                                class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
                            <i class="fas fa-heart mr-2"></i>
                            继续价值观测评
                        </button>
                        
                        <button onclick="hollandAssessment.downloadReport()" 
                                class="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all">
                            <i class="fas fa-download mr-2"></i>
                            下载详细报告
                        </button>
                    </div>
                    
                    <div class="flex justify-center space-x-6 text-sm text-gray-600">
                        <button onclick="hollandAssessment.shareResult()" class="hover:text-purple-600 transition-colors">
                            <i class="fas fa-share-alt mr-1"></i>
                            分享结果
                        </button>
                        <button onclick="hollandAssessment.retakeTest()" class="hover:text-purple-600 transition-colors">
                            <i class="fas fa-redo mr-1"></i>
                            重新测试
                        </button>
                        <a href="../index.html" class="hover:text-purple-600 transition-colors">
                            <i class="fas fa-home mr-1"></i>
                            返回首页
                        </a>
                    </div>
                </div>
            `;
            
            // 确保结果容器可见 - 使用多种方式确保显示
            resultContainer.classList.remove('hidden');
            resultContainer.style.display = 'block';
            resultContainer.style.visibility = 'visible';
            resultContainer.style.opacity = '1';
            resultContainer.style.position = 'relative';
            resultContainer.style.zIndex = '10';
            
            console.log('霍兰德测评结果显示完成');
            
            // 保存结果
            this.saveResult(careerCode);
            
        } catch (error) {
            console.error('显示霍兰德测评结果时出错:', error);
            this.showErrorMessage('结果显示失败，请刷新页面重试');
        }
    }

    // 显示错误消息
    showErrorMessage(message) {
        const resultContainer = document.getElementById('hollandResult');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="text-center py-8">
                    <div class="inline-block p-6 bg-red-100 rounded-full mb-6">
                        <i class="fas fa-exclamation-triangle text-3xl text-red-600"></i>
                    </div>
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">显示错误</h2>
                    <p class="text-gray-600 mb-6">${message}</p>
                    <button onclick="location.reload()" class="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-all">
                        <i class="fas fa-refresh mr-2"></i>
                        刷新页面
                    </button>
                </div>
            `;
            resultContainer.classList.remove('hidden');
        }
    }

    // 继续价值观测评
    continueToValues() {
        window.location.href = 'values.html';
    }

    // 下载报告
    downloadReport() {
        this.showMessage('报告生成功能正在开发中，敬请期待！', 'info');
    }

    // 分享结果
    shareResult() {
        if (navigator.share) {
            navigator.share({
                title: '霍兰德职业兴趣测评结果',
                text: '我刚完成了霍兰德职业兴趣测评，发现了我的职业方向！',
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
        this.scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        this.startTime = null;
        this.questionTimes = [];
        
        document.getElementById('resultScreen').style.display = 'none';
        document.getElementById('questionScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'block';
        
        localStorage.removeItem('holland_progress');
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
        
        localStorage.setItem('holland_progress', JSON.stringify(progressData));
    }

    // 加载保存的进度
    loadSavedProgress() {
        try {
            const savedData = localStorage.getItem('holland_progress');
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
                        if (confirm('检测到未完成的霍兰德测评，是否继续？')) {
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
    saveResult(careerCode) {
        const resultData = {
            careerCode: careerCode,
            scores: this.scores,
            completedAt: Date.now(),
            duration: Date.now() - this.startTime,
            answers: this.answers,
            questionTimes: this.questionTimes
        };
        
        localStorage.setItem('holland_result', JSON.stringify(resultData));
        localStorage.removeItem('holland_progress');
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
        console.log('Holland Event:', eventName, properties);
    }
}

// 定义全局变量，以便onclick可以访问
let hollandAssessment;

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧭 霍兰德职业兴趣测评系统已加载完成！');
    
    // 初始化霍兰德测评
    hollandAssessment = new HollandAssessment();

    // 页面可见性变化监听
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            hollandAssessment.saveProgress();
        }
    });
});