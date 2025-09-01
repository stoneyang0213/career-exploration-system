// 综合报告生成器
class ReportGenerator {
    constructor() {
        this.mbtiResult = null;
        this.hollandResult = null;
        this.valuesResult = null;
        this.userRating = 0;
        // 新增AI和PDF服务
        this.aiService = new AIService();
        this.pdfService = new PDFService();
        this.aiReport = null;
        this.init();
    }

    init() {
        this.loadResults();
        this.setupFeedbackStars();
        this.setCurrentDate();
        
        // 延迟生成报告，营造分析效果
        setTimeout(() => {
            this.generateReport();
        }, 2000);
    }

    // 设置当前日期
    setCurrentDate() {
        const now = new Date();
        const dateString = now.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('currentDate').textContent = dateString;
    }

    // 加载测评结果
    loadResults() {
        try {
            const mbtiData = localStorage.getItem('mbti_result');
            const hollandData = localStorage.getItem('holland_result');
            const valuesData = localStorage.getItem('values_result');

            if (mbtiData) this.mbtiResult = JSON.parse(mbtiData);
            if (hollandData) this.hollandResult = JSON.parse(hollandData);
            if (valuesData) this.valuesResult = JSON.parse(valuesData);

            // 检查是否有足够的数据生成报告
            if (!this.mbtiResult || !this.hollandResult || !this.valuesResult) {
                this.showIncompleteMessage();
                return false;
            }

            return true;
        } catch (error) {
            console.error('加载测评结果失败:', error);
            this.showErrorMessage();
            return false;
        }
    }

    // 显示数据不完整消息
    showIncompleteMessage() {
        document.getElementById('loadingScreen').innerHTML = `
            <div class="text-center py-16">
                <div class="inline-block p-6 bg-yellow-100 rounded-full mb-6">
                    <i class="fas fa-exclamation-triangle text-3xl text-yellow-600"></i>
                </div>
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">测评数据不完整</h2>
                <p class="text-gray-600 mb-6">请完成所有三项测评后再查看综合报告</p>
                <div class="space-y-3 max-w-md mx-auto">
                    <div class="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                        <span>MBTI性格测评</span>
                        <i class="fas fa-${this.mbtiResult ? 'check text-green-500' : 'times text-red-500'}"></i>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                        <span>霍兰德职业兴趣</span>
                        <i class="fas fa-${this.hollandResult ? 'check text-green-500' : 'times text-red-500'}"></i>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                        <span>职业价值观测评</span>
                        <i class="fas fa-${this.valuesResult ? 'check text-green-500' : 'times text-red-500'}"></i>
                    </div>
                </div>
                <a href="index.html" class="inline-block mt-6 bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all">
                    <i class="fas fa-home mr-2"></i>
                    返回首页继续测评
                </a>
            </div>
        `;
    }

    // 显示错误消息
    showErrorMessage() {
        document.getElementById('loadingScreen').innerHTML = `
            <div class="text-center py-16">
                <div class="inline-block p-6 bg-red-100 rounded-full mb-6">
                    <i class="fas fa-times-circle text-3xl text-red-600"></i>
                </div>
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">报告生成失败</h2>
                <p class="text-gray-600 mb-6">加载测评数据时出现问题，请重试</p>
                <a href="index.html" class="inline-block bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-all">
                    <i class="fas fa-redo mr-2"></i>
                    重新开始
                </a>
            </div>
        `;
    }

    // 生成报告
    generateReport() {
        if (!this.loadResults()) return;

        // 隐藏加载界面，显示报告内容
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('reportContent').classList.remove('hidden');

        // 生成各个部分
        this.generatePersonalOverview();
        this.generateCompatibilityChart();
        this.generateTraitsRadarChart();
        this.generateCareerRecommendations();
        this.generateDevelopmentPlan();
        this.generateActionPlan();
        
        // 延迟生成AI洞察
        setTimeout(() => {
            this.generateAIInsights();
        }, 1000);

        // 生成AI报告
        setTimeout(() => {
            this.generateAIReport();
        }, 2000);

        // 动画显示各个卡片
        this.animateCards();
    }

    // 生成个人概览
    generatePersonalOverview() {
        const mbtiType = this.mbtiResult.type;
        const hollandCode = this.hollandResult.careerCode.primary + (this.hollandResult.careerCode.secondary || '');
        const topValue = this.valuesResult.valueRanking.ranking[0].info.name;

        const overviewHTML = `
            <div class="insight-card text-center p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                <div class="inline-block p-4 bg-purple-500 rounded-full mb-4">
                    <i class="fas fa-user text-2xl text-white"></i>
                </div>
                <h3 class="font-bold text-lg text-gray-800 mb-2">性格类型</h3>
                <div class="text-2xl font-bold text-purple-600 mb-2">${mbtiType}</div>
                <p class="text-sm text-gray-600">${this.mbtiResult.typeInfo.name}</p>
            </div>

            <div class="insight-card text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <div class="inline-block p-4 bg-blue-500 rounded-full mb-4">
                    <i class="fas fa-compass text-2xl text-white"></i>
                </div>
                <h3 class="font-bold text-lg text-gray-800 mb-2">兴趣代码</h3>
                <div class="text-2xl font-bold text-blue-600 mb-2">${hollandCode}</div>
                <p class="text-sm text-gray-600">霍兰德职业兴趣</p>
            </div>

            <div class="insight-card text-center p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100">
                <div class="inline-block p-4 bg-pink-500 rounded-full mb-4">
                    <i class="fas fa-heart text-2xl text-white"></i>
                </div>
                <h3 class="font-bold text-lg text-gray-800 mb-2">核心价值</h3>
                <div class="text-lg font-bold text-pink-600 mb-2">${topValue}</div>
                <p class="text-sm text-gray-600">最重要的价值追求</p>
            </div>
        `;

        document.getElementById('personalOverview').innerHTML = overviewHTML;
    }

    // 生成兼容性图表
    generateCompatibilityChart() {
        const ctx = document.getElementById('compatibilityChart').getContext('2d');
        
        // 计算性格-兴趣匹配度
        const compatibility = this.calculateCompatibility();
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['匹配度', '待提升'],
                datasets: [{
                    data: [compatibility.score, 100 - compatibility.score],
                    backgroundColor: ['#10B981', '#E5E7EB'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutout: '70%'
            }
        });

        // 在图表中央显示分数
        setTimeout(() => {
            const canvas = document.getElementById('compatibilityChart');
            const container = canvas.parentElement;
            
            const scoreDisplay = document.createElement('div');
            scoreDisplay.className = 'absolute inset-0 flex items-center justify-center pointer-events-none';
            scoreDisplay.innerHTML = `
                <div class="text-center">
                    <div class="text-3xl font-bold text-green-600">${compatibility.score}%</div>
                    <div class="text-sm text-gray-600">匹配度</div>
                </div>
            `;
            
            container.style.position = 'relative';
            container.appendChild(scoreDisplay);
        }, 100);
    }

    // 生成特质雷达图
    generateTraitsRadarChart() {
        const ctx = document.getElementById('traitsRadarChart').getContext('2d');
        
        // 整合各维度数据
        const traitsData = this.getTraitsData();
        
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: traitsData.labels,
                datasets: [{
                    label: '你的特质分布',
                    data: traitsData.values,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderColor: 'rgb(99, 102, 241)',
                    pointBackgroundColor: 'rgb(99, 102, 241)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(99, 102, 241)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // 计算兼容性
    calculateCompatibility() {
        // 基于MBTI和Holland的兼容性算法
        let totalScore = 0;
        let factors = 0;

        // MBTI-Holland兼容性映射
        const mbtiHollandMap = {
            'INTJ': ['I', 'A'],
            'INTP': ['I', 'A'],
            'ENTJ': ['E', 'I'],
            'ENTP': ['E', 'A'],
            'INFJ': ['S', 'A'],
            'INFP': ['A', 'S'],
            'ENFJ': ['S', 'E'],
            'ENFP': ['A', 'E'],
            'ISTJ': ['C', 'R'],
            'ISFJ': ['S', 'C'],
            'ESTJ': ['E', 'C'],
            'ESFJ': ['S', 'E'],
            'ISTP': ['R', 'I'],
            'ISFP': ['A', 'R'],
            'ESTP': ['E', 'R'],
            'ESFP': ['S', 'A']
        };

        const mbtiType = this.mbtiResult.type;
        const hollandPrimary = this.hollandResult.careerCode.primary;
        const preferredTypes = mbtiHollandMap[mbtiType] || [];

        if (preferredTypes.includes(hollandPrimary)) {
            totalScore += 80;
        } else {
            totalScore += 40;
        }
        factors++;

        // 价值观一致性
        const topValue = this.valuesResult.valueRanking.ranking[0].value;
        const valueCompatibility = this.getValueCompatibility(mbtiType, topValue);
        totalScore += valueCompatibility;
        factors++;

        const averageScore = Math.round(totalScore / factors);
        
        return {
            score: Math.min(95, Math.max(60, averageScore)), // 限制在60-95之间
            factors: factors
        };
    }

    // 获取价值观兼容性
    getValueCompatibility(mbtiType, topValue) {
        const compatibilityMap = {
            'achievement': ['ENTJ', 'ESTJ', 'ENTP'],
            'social': ['ENFJ', 'ESFJ', 'INFJ', 'ISFJ'],
            'self_actualization': ['INFP', 'ENFP', 'INTJ', 'INFJ'],
            'independence': ['INTP', 'INTJ', 'ISFP', 'INFP'],
            'security': ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
            'economic': ['ENTJ', 'ESTJ', 'ESTP'],
            'power': ['ENTJ', 'ENTP', 'ESTJ'],
            'life_balance': ['ISFP', 'INFP', 'ISFJ', 'INFJ']
        };

        const compatibleTypes = compatibilityMap[topValue] || [];
        return compatibleTypes.includes(mbtiType) ? 85 : 65;
    }

    // 获取特质数据
    getTraitsData() {
        return {
            labels: ['逻辑思维', '人际交往', '创造力', '稳定性', '领导力', '执行力'],
            values: [
                this.mbtiResult.scores.T / (this.mbtiResult.scores.T + this.mbtiResult.scores.F) * 100,
                this.mbtiResult.scores.E / (this.mbtiResult.scores.E + this.mbtiResult.scores.I) * 100,
                this.hollandResult.scores.A / Math.max(...Object.values(this.hollandResult.scores)) * 100,
                this.mbtiResult.scores.J / (this.mbtiResult.scores.J + this.mbtiResult.scores.P) * 100,
                this.hollandResult.scores.E / Math.max(...Object.values(this.hollandResult.scores)) * 100,
                this.valuesResult.scores.achievement / Math.max(...Object.values(this.valuesResult.scores)) * 100
            ]
        };
    }

    // 生成职业推荐
    generateCareerRecommendations() {
        const recommendations = this.getCareerRecommendations();
        
        const recommendationsHTML = recommendations.map((career, index) => `
            <div class="career-card p-6 bg-gradient-to-r ${career.gradient} rounded-xl border ${career.border}">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <h3 class="font-bold text-lg text-gray-800 mb-2">${career.title}</h3>
                        <p class="text-sm text-gray-600 mb-3">${career.description}</p>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold ${career.scoreColor}">${career.matchScore}%</div>
                        <div class="text-xs text-gray-500">匹配度</div>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="${career.icon} mr-2"></i>
                        <span>${career.field}</span>
                    </div>
                    <div class="flex items-center">
                        ${career.tags.map(tag => `<span class="bg-white bg-opacity-60 text-xs px-2 py-1 rounded-full mr-1">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        document.getElementById('careerRecommendations').innerHTML = recommendationsHTML;
    }

    // 获取职业推荐
    getCareerRecommendations() {
        const mbtiType = this.mbtiResult.type;
        const hollandPrimary = this.hollandResult.careerCode.primary;
        const topValue = this.valuesResult.valueRanking.ranking[0].value;

        // 综合推荐算法
        const careers = [
            {
                title: '数据科学家',
                description: '运用统计学和机器学习分析大数据，为商业决策提供支持',
                field: '技术/分析',
                matchScore: 92,
                icon: 'fas fa-chart-bar',
                gradient: 'from-blue-50 to-indigo-50',
                border: 'border-blue-100',
                scoreColor: 'text-blue-600',
                tags: ['分析', '技术', '创新']
            },
            {
                title: '产品经理',
                description: '负责产品规划、设计和市场推广，协调多部门合作',
                field: '管理/策略',
                matchScore: 88,
                icon: 'fas fa-lightbulb',
                gradient: 'from-green-50 to-emerald-50',
                border: 'border-green-100',
                scoreColor: 'text-green-600',
                tags: ['管理', '创新', '沟通']
            },
            {
                title: '用户体验设计师',
                description: '研究用户需求，设计直观易用的产品界面和交互体验',
                field: '设计/用户体验',
                matchScore: 85,
                icon: 'fas fa-palette',
                gradient: 'from-purple-50 to-pink-50',
                border: 'border-purple-100',
                scoreColor: 'text-purple-600',
                tags: ['创意', '用户', '设计']
            },
            {
                title: '管理咨询顾问',
                description: '为企业提供战略规划和运营改进建议，解决复杂商业问题',
                field: '咨询/策略',
                matchScore: 82,
                icon: 'fas fa-briefcase',
                gradient: 'from-orange-50 to-red-50',
                border: 'border-orange-100',
                scoreColor: 'text-orange-600',
                tags: ['策略', '分析', '沟通']
            },
            {
                title: '心理咨询师',
                description: '帮助个人解决心理困扰，提供专业的心理支持和治疗',
                field: '心理/健康',
                matchScore: 79,
                icon: 'fas fa-heart',
                gradient: 'from-pink-50 to-rose-50',
                border: 'border-pink-100',
                scoreColor: 'text-pink-600',
                tags: ['助人', '倾听', '专业']
            },
            {
                title: '创业者',
                description: '创立和经营自己的企业，将创新想法转化为商业价值',
                field: '创业/商业',
                matchScore: 76,
                icon: 'fas fa-rocket',
                gradient: 'from-yellow-50 to-amber-50',
                border: 'border-yellow-100',
                scoreColor: 'text-yellow-600',
                tags: ['创新', '领导', '风险']
            }
        ];

        return careers;
    }

    // 生成发展计划
    generateDevelopmentPlan() {
        const planHTML = `
            <div class="grid md:grid-cols-2 gap-6">
                <div class="insight-card bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
                    <h3 class="font-bold text-lg text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-check-circle text-green-600 mr-2"></i>
                        发挥优势
                    </h3>
                    <div class="space-y-3">
                        <div class="flex items-start">
                            <i class="fas fa-star text-yellow-500 mr-3 mt-1"></i>
                            <div>
                                <h4 class="font-medium text-gray-800">强化${this.mbtiResult.typeInfo.name}特质</h4>
                                <p class="text-sm text-gray-600">在工作中充分运用你的性格优势</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <i class="fas fa-compass text-blue-500 mr-3 mt-1"></i>
                            <div>
                                <h4 class="font-medium text-gray-800">深耕兴趣领域</h4>
                                <p class="text-sm text-gray-600">在${this.hollandResult.careerCode.primary}型工作中寻求突破</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <i class="fas fa-heart text-pink-500 mr-3 mt-1"></i>
                            <div>
                                <h4 class="font-medium text-gray-800">坚持价值追求</h4>
                                <p class="text-sm text-gray-600">选择符合"${this.valuesResult.valueRanking.ranking[0].info.name}"的工作机会</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="insight-card bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                    <h3 class="font-bold text-lg text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-chart-line text-orange-600 mr-2"></i>
                        提升空间
                    </h3>
                    <div class="space-y-3">
                        <div class="flex items-start">
                            <i class="fas fa-users text-purple-500 mr-3 mt-1"></i>
                            <div>
                                <h4 class="font-medium text-gray-800">人际沟通能力</h4>
                                <p class="text-sm text-gray-600">加强团队协作和跨部门沟通</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <i class="fas fa-cogs text-indigo-500 mr-3 mt-1"></i>
                            <div>
                                <h4 class="font-medium text-gray-800">技术技能更新</h4>
                                <p class="text-sm text-gray-600">保持对新技术和工具的学习</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <i class="fas fa-balance-scale text-teal-500 mr-3 mt-1"></i>
                            <div>
                                <h4 class="font-medium text-gray-800">多元化视角</h4>
                                <p class="text-sm text-gray-600">培养不同价值观的理解和包容</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="insight-card bg-white rounded-xl p-6 border border-gray-200 mt-6">
                <h3 class="font-bold text-lg text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-road text-gray-600 mr-2"></i>
                    发展路径建议
                </h3>
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="text-center p-4 bg-blue-50 rounded-lg">
                        <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span class="text-white font-bold">1</span>
                        </div>
                        <h4 class="font-medium text-gray-800 mb-2">短期 (1年内)</h4>
                        <p class="text-sm text-gray-600">技能提升与项目经验积累</p>
                    </div>
                    <div class="text-center p-4 bg-green-50 rounded-lg">
                        <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span class="text-white font-bold">2</span>
                        </div>
                        <h4 class="font-medium text-gray-800 mb-2">中期 (3-5年)</h4>
                        <p class="text-sm text-gray-600">专业深度发展与团队领导</p>
                    </div>
                    <div class="text-center p-4 bg-purple-50 rounded-lg">
                        <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span class="text-white font-bold">3</span>
                        </div>
                        <h4 class="font-medium text-gray-800 mb-2">长期 (5-10年)</h4>
                        <p class="text-sm text-gray-600">行业专家与战略决策者</p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('developmentPlan').innerHTML = planHTML;
    }

    // 生成行动计划
    generateActionPlan() {
        const actions = [
            {
                week: '第1-2周',
                icon: 'fas fa-search',
                color: 'blue',
                title: '自我深度了解',
                tasks: ['重新审视测评结果', '寻找相关职业信息', '与行业专家交流']
            },
            {
                week: '第3-4周',
                icon: 'fas fa-network-wired',
                color: 'green',
                title: '建立专业网络',
                tasks: ['更新LinkedIn资料', '参加行业活动', '寻找职业导师']
            },
            {
                week: '第5-6周',
                icon: 'fas fa-graduation-cap',
                color: 'purple',
                title: '技能提升计划',
                tasks: ['制定学习计划', '选择在线课程', '开始技能练习']
            },
            {
                week: '第7-8周',
                icon: 'fas fa-rocket',
                color: 'orange',
                title: '行动落地',
                tasks: ['投递目标职位', '准备面试材料', '跟踪进展情况']
            }
        ];

        const actionHTML = actions.map(action => `
            <div class="insight-card flex items-start p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                <div class="flex-shrink-0 mr-6">
                    <div class="w-12 h-12 bg-${action.color}-500 rounded-full flex items-center justify-center">
                        <i class="${action.icon} text-white"></i>
                    </div>
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="font-bold text-lg text-gray-800">${action.title}</h3>
                        <span class="text-sm font-medium text-${action.color}-600 bg-${action.color}-50 px-3 py-1 rounded-full">${action.week}</span>
                    </div>
                    <ul class="space-y-2">
                        ${action.tasks.map(task => `
                            <li class="flex items-center text-sm text-gray-600">
                                <i class="fas fa-check text-${action.color}-500 mr-2"></i>
                                ${task}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `).join('');

        document.getElementById('actionPlan').innerHTML = actionHTML;
    }

    // 生成AI洞察
    generateAIInsights() {
        // 模拟AI生成过程
        const insights = this.generatePersonalizedInsights();
        
        const insightsHTML = `
            <div class="space-y-6">
                <div class="flex items-start">
                    <div class="flex-shrink-0 mr-4">
                        <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-lightbulb text-white"></i>
                        </div>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-800 mb-2">个性化洞察</h3>
                        <p class="text-gray-700 leading-relaxed">${insights.personalInsight}</p>
                    </div>
                </div>

                <div class="flex items-start">
                    <div class="flex-shrink-0 mr-4">
                        <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-compass text-white"></i>
                        </div>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-800 mb-2">职业方向建议</h3>
                        <p class="text-gray-700 leading-relaxed">${insights.careerGuidance}</p>
                    </div>
                </div>

                <div class="flex items-start">
                    <div class="flex-shrink-0 mr-4">
                        <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-chart-line text-white"></i>
                        </div>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-800 mb-2">成长建议</h3>
                        <p class="text-gray-700 leading-relaxed">${insights.growthAdvice}</p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('aiInsights').innerHTML = insightsHTML;
    }

    // 生成个性化洞察
    generatePersonalizedInsights() {
        const mbtiType = this.mbtiResult.type;
        const hollandCode = this.hollandResult.careerCode.primary;
        const topValue = this.valuesResult.valueRanking.ranking[0].value;

        return {
            personalInsight: `作为${this.mbtiResult.typeInfo.name}(${mbtiType})，你天生具备${this.mbtiResult.typeInfo.description.toLowerCase()}的特质。结合你的${this.hollandResult.careerCode.primary}型职业兴趣和对"${this.valuesResult.valueRanking.ranking[0].info.name}"的价值追求，你最适合在需要${this.getMbtiTraits(mbtiType)}的环境中发展。`,
            
            careerGuidance: `基于你的综合特质分析，建议你关注${this.getCareerFields()}等领域。这些领域不仅与你的性格特点高度匹配，也能满足你对"${this.valuesResult.valueRanking.ranking[0].info.name}"的核心需求。特别推荐考虑数据科学、产品管理或用户体验设计等新兴职业。`,
            
            growthAdvice: `为了实现职业目标，建议你重点发展${this.getGrowthAreas()}等能力。同时，保持对${this.getSecondaryValue()}的关注，这将帮助你建立更全面的职业竞争力。记住，你的独特组合是${this.getUniqueStrength()}，这正是你在职场中的核心竞争优势。`
        };
    }

    // 获取MBTI特质描述
    getMbtiTraits(type) {
        const traits = {
            'I': '深度思考和独立工作',
            'E': '团队协作和人际互动',
            'S': '实际操作和细节关注',
            'N': '创新思维和前瞻规划',
            'T': '逻辑分析和客观决策',
            'F': '价值判断和人文关怀',
            'J': '结构化管理和目标达成',
            'P': '灵活适应和创意发挥'
        };
        
        return Array.from(type).map(letter => traits[letter]).join('、');
    }

    // 获取职业领域
    getCareerFields() {
        const hollandFields = {
            'R': '工程技术、制造业、建筑',
            'I': '科研、数据分析、咨询',
            'A': '创意设计、媒体、艺术',
            'S': '教育、医疗、人力资源',
            'E': '销售、管理、创业',
            'C': '金融、行政、质量管理'
        };
        
        return hollandFields[this.hollandResult.careerCode.primary] || '多元化';
    }

    // 获取成长领域
    getGrowthAreas() {
        const areas = ['沟通表达', '数据分析', '项目管理', '创新思维', '团队协作'];
        return areas.slice(0, 3).join('、');
    }

    // 获取次要价值观
    getSecondaryValue() {
        return this.valuesResult.valueRanking.ranking[1].info.name;
    }

    // 获取独特优势
    getUniqueStrength() {
        return `${this.mbtiResult.type}性格 + ${this.hollandResult.careerCode.primary}型兴趣 + ${this.valuesResult.valueRanking.ranking[0].info.name}价值观`;
    }

    // 动画显示卡片
    animateCards() {
        const cards = document.querySelectorAll('.insight-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 200);
        });
    }

    // 设置反馈星级
    setupFeedbackStars() {
        const stars = document.querySelectorAll('#ratingStars i');
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                this.userRating = index + 1;
                
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.className = 'fas fa-star text-yellow-400 cursor-pointer text-2xl';
                    } else {
                        s.className = 'fas fa-star text-gray-300 cursor-pointer text-2xl';
                    }
                });
            });
            
            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.className = 'fas fa-star text-yellow-300 cursor-pointer text-2xl';
                    } else {
                        s.className = 'fas fa-star text-gray-300 cursor-pointer text-2xl';
                    }
                });
            });
        });

        const container = document.getElementById('ratingStars');
        container.addEventListener('mouseleave', () => {
            stars.forEach((s, i) => {
                if (i < this.userRating) {
                    s.className = 'fas fa-star text-yellow-400 cursor-pointer text-2xl';
                } else {
                    s.className = 'fas fa-star text-gray-300 cursor-pointer text-2xl';
                }
            });
        });
    }

    // 提交反馈
    submitFeedback() {
        const feedbackText = document.getElementById('feedbackText').value;
        
        if (this.userRating === 0) {
            alert('请先给出星级评价');
            return;
        }

        const feedback = {
            rating: this.userRating,
            content: feedbackText,
            timestamp: Date.now(),
            userSession: this.generateSessionId(),
            assessmentResults: {
                mbti: this.mbtiResult?.type,
                holland: this.hollandResult?.careerCode.primary,
                values: this.valuesResult?.valueRanking.ranking[0].value
            }
        };

        // 保存反馈数据
        this.saveFeedback(feedback);
        
        // 显示感谢消息
        alert('感谢您的反馈！您的意见对我们很重要。');
        
        // 清空表单
        document.getElementById('feedbackText').value = '';
        this.userRating = 0;
        this.setupFeedbackStars();
    }

    // 保存反馈
    saveFeedback(feedback) {
        try {
            // 保存到localStorage
            const existingFeedback = JSON.parse(localStorage.getItem('user_feedback') || '[]');
            existingFeedback.push(feedback);
            localStorage.setItem('user_feedback', JSON.stringify(existingFeedback));
            
            console.log('反馈已保存:', feedback);
        } catch (error) {
            console.error('保存反馈失败:', error);
        }
    }

    // 生成会话ID
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 打印报告
    printReport() {
        window.print();
    }

    // 分享报告
    shareReport() {
        if (navigator.share) {
            navigator.share({
                title: '我的职业探索报告',
                text: '我刚完成了综合职业测评，获得了个性化的职业指导报告！',
                url: window.location.href
            });
        } else {
            // 复制链接
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('报告链接已复制到剪贴板！');
            });
        }
    }

    // 生成AI报告
    async generateAIReport() {
        try {
            // 显示AI报告生成状态
            this.showAIReportStatus('正在生成AI专业报告...');
            
            // 检查API密钥
            const apiKey = localStorage.getItem('openai_api_key');
            if (!apiKey) {
                this.showAPIKeyModal();
                return;
            }

            // 设置API密钥
            this.aiService.setApiKey(apiKey);
            
            // 生成AI报告
            this.aiReport = await this.aiService.generateCareerReport(
                this.mbtiResult,
                this.hollandResult,
                this.valuesResult
            );
            
            // 保存AI报告到本地存储
            localStorage.setItem('ai_report', JSON.stringify(this.aiReport));
            
            // 显示AI报告生成成功
            this.showAIReportStatus('AI专业报告生成完成！', 'success');
            
            // 显示PDF导出按钮
            this.showPDFExportButton();
            
        } catch (error) {
            console.error('AI报告生成失败:', error);
            this.showAIReportStatus('AI报告生成失败，请重试', 'error');
        }
    }

    // 显示AI报告状态
    showAIReportStatus(message, type = 'loading') {
        const aiReportSection = document.getElementById('aiReportSection');
        if (!aiReportSection) return;

        const statusHTML = `
            <div class="text-center py-8">
                <div class="inline-block p-4 rounded-full mb-4 ${
                    type === 'success' ? 'bg-green-100' : 
                    type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                }">
                    <i class="fas fa-${
                        type === 'success' ? 'check-circle text-green-600' : 
                        type === 'error' ? 'times-circle text-red-600' : 'sync fa-spin text-blue-600'
                    } text-2xl"></i>
                </div>
                <p class="text-gray-700 font-medium">${message}</p>
            </div>
        `;
        
        aiReportSection.innerHTML = statusHTML;
    }

    // 显示API密钥输入模态框
    showAPIKeyModal() {
        const modalHTML = `
            <div id="apiKeyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">设置OpenAI API密钥</h3>
                    <p class="text-gray-600 mb-4">为了生成AI专业报告，需要设置OpenAI API密钥。</p>
                    <input 
                        type="password" 
                        id="apiKeyInput" 
                        placeholder="请输入您的OpenAI API密钥"
                        class="w-full p-3 border border-gray-300 rounded-lg mb-4"
                    >
                    <div class="flex space-x-3">
                        <button onclick="report.saveAPIKey()" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                            保存并生成报告
                        </button>
                        <button onclick="report.closeAPIKeyModal()" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
                            取消
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // 保存API密钥
    saveAPIKey() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        if (!apiKey) {
            alert('请输入API密钥');
            return;
        }
        
        localStorage.setItem('openai_api_key', apiKey);
        this.closeAPIKeyModal();
        
        // 重新生成AI报告
        this.generateAIReport();
    }

    // 关闭API密钥模态框
    closeAPIKeyModal() {
        const modal = document.getElementById('apiKeyModal');
        if (modal) {
            modal.remove();
        }
    }

    // 显示PDF导出按钮
    showPDFExportButton() {
        const aiReportSection = document.getElementById('aiReportSection');
        if (!aiReportSection) return;

        const buttonHTML = `
            <div class="text-center py-6">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <i class="fas fa-check-circle text-green-600 text-2xl mb-2"></i>
                    <p class="text-green-800 font-medium">AI专业报告已生成完成</p>
                </div>
                <div class="space-y-3">
                    <button onclick="report.exportPDF()" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all">
                        <i class="fas fa-file-pdf mr-2"></i>
                        导出PDF专业报告
                    </button>
                    <button onclick="report.viewAIReport()" class="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all">
                        <i class="fas fa-eye mr-2"></i>
                        查看AI报告详情
                    </button>
                </div>
            </div>
        `;
        
        aiReportSection.innerHTML = buttonHTML;
    }

    // 导出PDF报告
    async exportPDF() {
        try {
            if (!this.aiReport) {
                alert('请先生成AI报告');
                return;
            }

            // 显示PDF生成状态
            this.showPDFStatus('正在生成PDF报告...');
            
            // 准备用户数据
            const userData = {
                name: '用户',
                date: new Date().toLocaleDateString('zh-CN'),
                mbtiType: this.mbtiResult.type,
                hollandType: this.hollandResult.careerCode.primary
            };
            
            // 生成PDF
            const pdfDoc = await this.pdfService.generatePDFReport(this.aiReport, userData);
            
            // 下载PDF
            const filename = `职业测评报告_${userData.mbtiType}_${userData.hollandType}_${new Date().toISOString().split('T')[0]}.pdf`;
            this.pdfService.downloadPDF(pdfDoc, filename);
            
            // 显示成功状态
            this.showPDFStatus('PDF报告导出成功！', 'success');
            
        } catch (error) {
            console.error('PDF导出失败:', error);
            this.showPDFStatus('PDF导出失败，请重试', 'error');
        }
    }

    // 显示PDF状态
    showPDFStatus(message, type = 'loading') {
        const pdfStatus = document.getElementById('pdfStatus');
        if (!pdfStatus) return;

        const statusHTML = `
            <div class="text-center py-4">
                <div class="inline-block p-3 rounded-full mb-2 ${
                    type === 'success' ? 'bg-green-100' : 
                    type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                }">
                    <i class="fas fa-${
                        type === 'success' ? 'check-circle text-green-600' : 
                        type === 'error' ? 'times-circle text-red-600' : 'sync fa-spin text-blue-600'
                    } text-xl"></i>
                </div>
                <p class="text-sm text-gray-600">${message}</p>
            </div>
        `;
        
        pdfStatus.innerHTML = statusHTML;
    }

    // 查看AI报告详情
    viewAIReport() {
        if (!this.aiReport) {
            alert('请先生成AI报告');
            return;
        }

        const modalHTML = `
            <div id="aiReportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                <div class="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-gray-800">AI专业报告详情</h3>
                        <button onclick="report.closeAIReportModal()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="space-y-6">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="font-bold text-blue-800 mb-2">执行摘要</h4>
                            <p class="text-blue-700">${this.aiReport.summary}</p>
                        </div>
                        
                        <div class="bg-green-50 p-4 rounded-lg">
                            <h4 class="font-bold text-green-800 mb-2">性格特质分析</h4>
                            <p class="text-green-700">${this.aiReport.personalityAnalysis}</p>
                        </div>
                        
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <h4 class="font-bold text-purple-800 mb-2">职业兴趣匹配</h4>
                            <p class="text-purple-700">${this.aiReport.careerInterest}</p>
                        </div>
                        
                        <div class="bg-orange-50 p-4 rounded-lg">
                            <h4 class="font-bold text-orange-800 mb-2">价值观驱动分析</h4>
                            <p class="text-orange-700">${this.aiReport.valuesAnalysis}</p>
                        </div>
                        
                        <div class="bg-indigo-50 p-4 rounded-lg">
                            <h4 class="font-bold text-indigo-800 mb-2">综合职业推荐</h4>
                            <p class="text-indigo-700">${this.aiReport.recommendations}</p>
                        </div>
                        
                        <div class="bg-teal-50 p-4 rounded-lg">
                            <h4 class="font-bold text-teal-800 mb-2">发展建议</h4>
                            <p class="text-teal-700">${this.aiReport.developmentPlan}</p>
                        </div>
                        
                        <div class="bg-red-50 p-4 rounded-lg">
                            <h4 class="font-bold text-red-800 mb-2">风险提示</h4>
                            <p class="text-red-700">${this.aiReport.riskWarnings}</p>
                        </div>
                        
                        <div class="bg-yellow-50 p-4 rounded-lg">
                            <h4 class="font-bold text-yellow-800 mb-2">行业趋势分析</h4>
                            <p class="text-yellow-700">${this.aiReport.industryTrends}</p>
                        </div>
                    </div>
                    
                    <div class="mt-6 text-center">
                        <button onclick="report.exportPDF()" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                            <i class="fas fa-file-pdf mr-2"></i>
                            导出PDF报告
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // 关闭AI报告模态框
    closeAIReportModal() {
        const modal = document.getElementById('aiReportModal');
        if (modal) {
            modal.remove();
        }
    }
}

// 初始化报告生成器
const report = new ReportGenerator();

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 综合职业评估报告系统已加载完成！');
});