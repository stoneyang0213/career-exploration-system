// 职业探索星图 - 主要JavaScript功能
class CareerAssessment {
    constructor() {
        this.currentAssessment = null;
        this.userAnswers = {};
        this.assessmentResults = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadUserData();
    }

    bindEvents() {
        // 主要开始按钮事件
        document.getElementById('startAssessment')?.addEventListener('click', () => {
            this.showAssessmentSelection();
        });

        document.getElementById('startFullAssessment')?.addEventListener('click', () => {
            this.startFullAssessment();
        });

        // 监听键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.showAssessmentSelection();
            }
        });
    }

    // 显示测评选择界面
    showAssessmentSelection() {
        const modal = this.createModal(`
            <div class="text-center">
                <h2 class="text-2xl font-bold mb-6 text-gray-800">选择你的探索路径</h2>
                <div class="grid gap-4">
                    <button onclick="careerAssessment.startSingleAssessment('mbti')" 
                            class="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-left">
                        <div class="flex items-center">
                            <i class="fas fa-user-friends text-2xl text-purple-600 mr-4"></i>
                            <div>
                                <h3 class="font-semibold">单项测评：MBTI性格测试</h3>
                                <p class="text-sm text-gray-600">了解你的性格类型和认知偏好</p>
                            </div>
                        </div>
                    </button>

                    <button onclick="careerAssessment.startSingleAssessment('holland')" 
                            class="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left">
                        <div class="flex items-center">
                            <i class="fas fa-briefcase text-2xl text-blue-600 mr-4"></i>
                            <div>
                                <h3 class="font-semibold">单项测评：霍兰德职业兴趣</h3>
                                <p class="text-sm text-gray-600">发现你的职业兴趣倾向</p>
                            </div>
                        </div>
                    </button>

                    <button onclick="careerAssessment.startSingleAssessment('values')" 
                            class="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-left">
                        <div class="flex items-center">
                            <i class="fas fa-heart text-2xl text-green-600 mr-4"></i>
                            <div>
                                <h3 class="font-semibold">单项测评：职业价值观</h3>
                                <p class="text-sm text-gray-600">明确你的核心价值追求</p>
                            </div>
                        </div>
                    </button>

                    <button onclick="careerAssessment.startFullAssessment()" 
                            class="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all">
                        <div class="text-center">
                            <i class="fas fa-compass text-3xl mb-2"></i>
                            <h3 class="font-bold text-lg">完整职业探索（推荐）</h3>
                            <p class="text-sm opacity-90">三项测评 + AI个性化报告</p>
                        </div>
                    </button>
                </div>
            </div>
        `);
    }

    // 开始单项测评
    startSingleAssessment(type) {
        this.closeModal();
        this.currentAssessment = type;
        
        switch(type) {
            case 'mbti':
                this.startMBTI();
                break;
            case 'holland':
                this.startHolland();
                break;
            case 'values':
                this.startValues();
                break;
        }
    }

    // 开始完整测评
    startFullAssessment() {
        this.closeModal();
        this.showProgress();
        
        // 记录开始时间
        this.assessmentStartTime = Date.now();
        
        // 显示欢迎引导
        this.showWelcomeGuide();
    }

    // 显示欢迎引导
    showWelcomeGuide() {
        const modal = this.createModal(`
            <div class="text-center max-w-2xl mx-auto">
                <div class="mb-6">
                    <i class="fas fa-map text-4xl text-indigo-600 mb-4"></i>
                    <h2 class="text-3xl font-bold mb-4 text-gray-800">欢迎开始你的职业探索之旅</h2>
                </div>
                
                <div class="text-left space-y-4 mb-8">
                    <div class="flex items-start">
                        <i class="fas fa-clock text-indigo-600 mt-1 mr-3"></i>
                        <div>
                            <h3 class="font-semibold">时间安排</h3>
                            <p class="text-gray-600 text-sm">整个测评大约需要20分钟，请确保有足够时间完成</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <i class="fas fa-heart text-indigo-600 mt-1 mr-3"></i>
                        <div>
                            <h3 class="font-semibold">真诚作答</h3>
                            <p class="text-gray-600 text-sm">请根据你的真实想法回答，没有标准答案，诚实是最好的选择</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <i class="fas fa-lightbulb text-indigo-600 mt-1 mr-3"></i>
                        <div>
                            <h3 class="font-semibold">直觉回答</h3>
                            <p class="text-gray-600 text-sm">相信你的第一直觉，不要过度纠结每个选项</p>
                        </div>
                    </div>
                </div>

                <button onclick="careerAssessment.startMBTI()" 
                        class="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all">
                    <i class="fas fa-rocket mr-2"></i>
                    开始第一项：MBTI性格测评
                </button>
                
                <p class="text-sm text-gray-500 mt-4">
                    数据安全保护 · 可随时暂停 · 免费使用
                </p>
            </div>
        `, 'large');
    }

    // 开始MBTI测评
    startMBTI() {
        this.closeModal();
        window.location.href = 'assessments/mbti.html';
    }

    // 开始霍兰德测评
    startHolland() {
        this.closeModal();
        window.location.href = 'assessments/holland.html';
    }

    // 开始价值观测评
    startValues() {
        this.closeModal();
        window.location.href = 'assessments/values.html';
    }

    // 显示进度条
    showProgress() {
        const progressHtml = `
            <div id="assessmentProgress" class="fixed top-0 left-0 w-full bg-white shadow-lg z-50 py-3">
                <div class="max-w-4xl mx-auto px-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-600">职业探索进度</span>
                        <span class="text-sm text-gray-500" id="progressText">准备开始...</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                             id="progressBar" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        `;
        
        if (!document.getElementById('assessmentProgress')) {
            document.body.insertAdjacentHTML('afterbegin', progressHtml);
            document.body.style.paddingTop = '80px';
        }
    }

    // 更新进度
    updateProgress(percent, text) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${percent}%`;
            progressText.textContent = text;
        }
    }

    // 创建模态框
    createModal(content, size = 'medium') {
        // 移除已存在的模态框
        this.closeModal();
        
        const sizeClasses = {
            small: 'max-w-md',
            medium: 'max-w-2xl',
            large: 'max-w-4xl'
        };
        
        const modalHtml = `
            <div id="assessmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-auto">
                    <div class="p-6 relative">
                        <button onclick="careerAssessment.closeModal()" 
                                class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">
                            <i class="fas fa-times"></i>
                        </button>
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // 添加ESC键关闭功能
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        return document.getElementById('assessmentModal');
    }

    // 关闭模态框
    closeModal() {
        const modal = document.getElementById('assessmentModal');
        if (modal) {
            modal.remove();
        }
    }

    // 加载用户数据
    loadUserData() {
        try {
            const savedData = localStorage.getItem('careerAssessmentData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.userAnswers = data.answers || {};
                this.assessmentResults = data.results || {};
            }
        } catch (error) {
            console.log('加载用户数据失败:', error);
        }
    }

    // 保存用户数据
    saveUserData() {
        try {
            const dataToSave = {
                answers: this.userAnswers,
                results: this.assessmentResults,
                lastUpdated: Date.now()
            };
            localStorage.setItem('careerAssessmentData', JSON.stringify(dataToSave));
        } catch (error) {
            console.error('保存用户数据失败:', error);
        }
    }

    // 显示错误提示
    showError(message) {
        const errorHtml = `
            <div class="text-center">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">出现了一些问题</h3>
                <p class="text-gray-600 mb-6">${message}</p>
                <button onclick="careerAssessment.closeModal()" 
                        class="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all">
                    我知道了
                </button>
            </div>
        `;
        this.createModal(errorHtml, 'small');
    }

    // 显示成功提示
    showSuccess(message, callback = null) {
        const successHtml = `
            <div class="text-center">
                <i class="fas fa-check-circle text-4xl text-green-500 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">太棒了！</h3>
                <p class="text-gray-600 mb-6">${message}</p>
                <button onclick="careerAssessment.closeModal(); ${callback ? callback + '()' : ''}" 
                        class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all">
                    继续
                </button>
            </div>
        `;
        this.createModal(successHtml, 'small');
    }
}

// 全局函数，供HTML调用
function startMBTI() {
    careerAssessment.startSingleAssessment('mbti');
}

function startHolland() {
    careerAssessment.startSingleAssessment('holland');
}

function startValues() {
    careerAssessment.startSingleAssessment('values');
}

// 初始化应用
const careerAssessment = new CareerAssessment();

// 页面加载完成后的额外初始化
document.addEventListener('DOMContentLoaded', () => {
    // 添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 添加滚动动画效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察所有卡片元素
    document.querySelectorAll('.card-hover, .assessment-card, .assessment-card-2, .assessment-card-3').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

console.log('🎯 职业探索星图已加载完成！开始你的职业发现之旅吧！');