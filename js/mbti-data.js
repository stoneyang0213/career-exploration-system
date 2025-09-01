// MBTI测评数据 - 问题库和评分逻辑

// MBTI问题库 - 每个问题对应四个维度之一
const MBTI_QUESTIONS = [
    // 外向(E) vs 内向(I) 维度
    {
        id: 1,
        dimension: 'EI',
        category: '社交能量',
        icon: 'fas fa-users',
        question: '在聚会或社交活动中，你通常会：',
        options: [
            { text: '主动与多个人交谈，享受热闹的氛围', score: { E: 3, I: 0 } },
            { text: '更愿意与少数几个人深入交流', score: { E: 1, I: 2 } },
            { text: '倾听他人对话，偶尔参与讨论', score: { E: 0, I: 3 } }
        ]
    },
    {
        id: 2,
        dimension: 'EI',
        category: '思考方式',
        icon: 'fas fa-brain',
        question: '当面临重要决定时，你倾向于：',
        options: [
            { text: '先和朋友或同事讨论，听取多方意见', score: { E: 3, I: 0 } },
            { text: '先独自思考，再适当征询他人建议', score: { E: 0, I: 3 } },
            { text: '在讨论和独立思考间寻求平衡', score: { E: 1, I: 1 } }
        ]
    },
    {
        id: 3,
        dimension: 'EI',
        category: '工作环境',
        icon: 'fas fa-briefcase',
        question: '在工作中，你更喜欢：',
        options: [
            { text: '开放式办公环境，与同事频繁互动', score: { E: 3, I: 0 } },
            { text: '相对安静的环境，可以专注工作', score: { E: 0, I: 3 } },
            { text: '可以根据需要调整的灵活环境', score: { E: 1, I: 1 } }
        ]
    },
    {
        id: 4,
        dimension: 'EI',
        category: '休息方式',
        icon: 'fas fa-leaf',
        question: '感到疲惫时，你更喜欢：',
        options: [
            { text: '和朋友出去活动，在社交中恢复能量', score: { E: 3, I: 0 } },
            { text: '独自待着，通过安静活动恢复能量', score: { E: 0, I: 3 } },
            { text: '看情况，有时社交有时独处', score: { E: 1, I: 1 } }
        ]
    },
    {
        id: 5,
        dimension: 'EI',
        category: '表达方式',
        icon: 'fas fa-comment',
        question: '在表达想法时，你通常：',
        options: [
            { text: '边说边想，通过交流来整理思路', score: { E: 3, I: 0 } },
            { text: '先在心中整理好，再清晰地表达', score: { E: 0, I: 3 } },
            { text: '根据话题和场合调整表达方式', score: { E: 1, I: 1 } }
        ]
    },
    {
        id: 6,
        dimension: 'EI',
        category: '学习方式',
        icon: 'fas fa-book',
        question: '学习新知识时，你更倾向于：',
        options: [
            { text: '参加小组讨论，通过交流学习', score: { E: 3, I: 0 } },
            { text: '独立阅读和思考，深入理解', score: { E: 0, I: 3 } },
            { text: '结合个人学习和小组讨论', score: { E: 1, I: 1 } }
        ]
    },
    {
        id: 7,
        dimension: 'EI',
        category: '人际关系',
        icon: 'fas fa-handshake',
        question: '在人际交往中，你认为：',
        options: [
            { text: '朋友多多益善，喜欢结识新朋友', score: { E: 3, I: 0 } },
            { text: '宁缺毋滥，更珍视深度的友谊', score: { E: 0, I: 3 } },
            { text: '既有广泛的社交，也有深交的朋友', score: { E: 1, I: 1 } }
        ]
    },

    // 感觉(S) vs 直觉(N) 维度
    {
        id: 8,
        dimension: 'SN',
        category: '信息处理',
        icon: 'fas fa-eye',
        question: '处理信息时，你更关注：',
        options: [
            { text: '具体的事实、数据和细节', score: { S: 3, N: 0 } },
            { text: '整体的模式、趋势和可能性', score: { S: 0, N: 3 } },
            { text: '既重视细节，也关注大局', score: { S: 1, N: 1 } }
        ]
    },
    {
        id: 9,
        dimension: 'SN',
        category: '学习偏好',
        icon: 'fas fa-graduation-cap',
        question: '在学习中，你更喜欢：',
        options: [
            { text: '通过实际操作和具体例子学习', score: { S: 3, N: 0 } },
            { text: '理解理论框架和抽象概念', score: { S: 0, N: 3 } },
            { text: '理论与实践相结合的方式', score: { S: 1, N: 1 } }
        ]
    },
    {
        id: 10,
        dimension: 'SN',
        category: '问题解决',
        icon: 'fas fa-puzzle-piece',
        question: '解决问题时，你倾向于：',
        options: [
            { text: '运用已有经验和成熟的方法', score: { S: 3, N: 0 } },
            { text: '尝试创新的思路和新的方法', score: { S: 0, N: 3 } },
            { text: '在传统方法基础上适度创新', score: { S: 1, N: 1 } }
        ]
    },
    {
        id: 11,
        dimension: 'SN',
        category: '时间观念',
        icon: 'fas fa-clock',
        question: '对于时间，你更关注：',
        options: [
            { text: '当前的情况和眼前的任务', score: { S: 3, N: 0 } },
            { text: '未来的可能性和长远规划', score: { S: 0, N: 3 } },
            { text: '现在与未来的平衡发展', score: { S: 1, N: 1 } }
        ]
    },
    {
        id: 12,
        dimension: 'SN',
        category: '工作方式',
        icon: 'fas fa-tasks',
        question: '在工作中，你更擅长：',
        options: [
            { text: '执行具体任务，注重准确性', score: { S: 3, N: 0 } },
            { text: '构思创意方案，关注创新性', score: { S: 0, N: 3 } },
            { text: '既能执行又能创新的工作', score: { S: 1, N: 1 } }
        ]
    },
    {
        id: 13,
        dimension: 'SN',
        category: '信息偏好',
        icon: 'fas fa-search',
        question: '获取信息时，你更信任：',
        options: [
            { text: '亲身体验和可观察的事实', score: { S: 3, N: 0 } },
            { text: '直觉感受和潜在含义', score: { S: 0, N: 3 } },
            { text: '经验与直觉的综合判断', score: { S: 1, N: 1 } }
        ]
    },
    {
        id: 14,
        dimension: 'SN',
        category: '沟通风格',
        icon: 'fas fa-comments',
        question: '在描述事物时，你更倾向于：',
        options: [
            { text: '使用具体、准确的描述', score: { S: 3, N: 0 } },
            { text: '使用比喻、类比的表达', score: { S: 0, N: 3 } },
            { text: '根据听众选择合适的方式', score: { S: 1, N: 1 } }
        ]
    },

    // 思维(T) vs 情感(F) 维度
    {
        id: 15,
        dimension: 'TF',
        category: '决策方式',
        icon: 'fas fa-balance-scale',
        question: '做重要决定时，你主要考虑：',
        options: [
            { text: '逻辑分析和客观标准', score: { T: 3, F: 0 } },
            { text: '个人价值观和对他人的影响', score: { T: 0, F: 3 } },
            { text: '理性分析与价值判断并重', score: { T: 1, F: 1 } }
        ]
    },
    {
        id: 16,
        dimension: 'TF',
        category: '批评处理',
        icon: 'fas fa-comment-dots',
        question: '面对批评时，你通常：',
        options: [
            { text: '客观分析批评的合理性', score: { T: 3, F: 0 } },
            { text: '关注批评者的动机和感受', score: { T: 0, F: 3 } },
            { text: '既考虑内容又关注关系', score: { T: 1, F: 1 } }
        ]
    },
    {
        id: 17,
        dimension: 'TF',
        category: '冲突处理',
        icon: 'fas fa-handshake',
        question: '处理人际冲突时，你更关注：',
        options: [
            { text: '事实真相和公平原则', score: { T: 3, F: 0 } },
            { text: '维护关系和照顾感受', score: { T: 0, F: 3 } },
            { text: '寻求既公平又和谐的解决方案', score: { T: 1, F: 1 } }
        ]
    },
    {
        id: 18,
        dimension: 'TF',
        category: '价值观念',
        icon: 'fas fa-heart',
        question: '你认为更重要的是：',
        options: [
            { text: '坚持原则和标准', score: { T: 3, F: 0 } },
            { text: '理解他人和维护和谐', score: { T: 0, F: 3 } },
            { text: '在原则与和谐间找平衡', score: { T: 1, F: 1 } }
        ]
    },
    {
        id: 19,
        dimension: 'TF',
        category: '评价标准',
        icon: 'fas fa-star',
        question: '评价一个方案时，你首先看：',
        options: [
            { text: '效率、成本和逻辑合理性', score: { T: 3, F: 0 } },
            { text: '对人的影响和价值意义', score: { T: 0, F: 3 } },
            { text: '综合考虑效果与人文关怀', score: { T: 1, F: 1 } }
        ]
    },
    {
        id: 20,
        dimension: 'TF',
        category: '沟通风格',
        icon: 'fas fa-microphone',
        question: '在沟通中，你更注重：',
        options: [
            { text: '准确传达信息和观点', score: { T: 3, F: 0 } },
            { text: '照顾对方感受和关系', score: { T: 0, F: 3 } },
            { text: '既要表达清楚又要维护关系', score: { T: 1, F: 1 } }
        ]
    },
    {
        id: 21,
        dimension: 'TF',
        category: '激励因素',
        icon: 'fas fa-trophy',
        question: '最能激励你的是：',
        options: [
            { text: '成就感和个人能力的提升', score: { T: 3, F: 0 } },
            { text: '帮助他人和获得认同', score: { T: 0, F: 3 } },
            { text: '个人成长与贡献他人的结合', score: { T: 1, F: 1 } }
        ]
    },

    // 判断(J) vs 知觉(P) 维度
    {
        id: 22,
        dimension: 'JP',
        category: '生活方式',
        icon: 'fas fa-calendar',
        question: '对于日常生活，你更喜欢：',
        options: [
            { text: '有明确的计划和时间安排', score: { J: 3, P: 0 } },
            { text: '保持灵活性，随机应变', score: { J: 0, P: 3 } },
            { text: '有基本安排但保留调整空间', score: { J: 1, P: 1 } }
        ]
    },
    {
        id: 23,
        dimension: 'JP',
        category: '工作习惯',
        icon: 'fas fa-clipboard-list',
        question: '处理任务时，你倾向于：',
        options: [
            { text: '提前规划，按计划执行', score: { J: 3, P: 0 } },
            { text: '根据灵感和情况灵活调整', score: { J: 0, P: 3 } },
            { text: '制定框架但保持执行灵活性', score: { J: 1, P: 1 } }
        ]
    },
    {
        id: 24,
        dimension: 'JP',
        category: '决策速度',
        icon: 'fas fa-tachometer-alt',
        question: '面对选择时，你通常：',
        options: [
            { text: '尽快做出决定并付诸行动', score: { J: 3, P: 0 } },
            { text: '保持开放态度，继续收集信息', score: { J: 0, P: 3 } },
            { text: '在合理时间内做出决定', score: { J: 1, P: 1 } }
        ]
    },
    {
        id: 25,
        dimension: 'JP',
        category: '截止日期',
        icon: 'fas fa-hourglass',
        question: '对于截止时间，你的态度是：',
        options: [
            { text: '提前完成，避免最后时刻的压力', score: { J: 3, P: 0 } },
            { text: '在压力下工作效率更高', score: { J: 0, P: 3 } },
            { text: '合理安排时间，按时完成', score: { J: 1, P: 1 } }
        ]
    },
    {
        id: 26,
        dimension: 'JP',
        category: '环境偏好',
        icon: 'fas fa-home',
        question: '你的理想工作/生活环境是：',
        options: [
            { text: '整洁有序，物品摆放规范', score: { J: 3, P: 0 } },
            { text: '随性自然，物品随手可得', score: { J: 0, P: 3 } },
            { text: '基本整洁但不拘泥于细节', score: { J: 1, P: 1 } }
        ]
    },
    {
        id: 27,
        dimension: 'JP',
        category: '变化适应',
        icon: 'fas fa-exchange-alt',
        question: '面对计划变更时，你会：',
        options: [
            { text: '感到不适，尽量恢复原计划', score: { J: 3, P: 0 } },
            { text: '欣然接受，享受新的可能性', score: { J: 0, P: 3 } },
            { text: '适应变化但希望有合理理由', score: { J: 1, P: 1 } }
        ]
    },
    {
        id: 28,
        dimension: 'JP',
        category: '项目管理',
        icon: 'fas fa-project-diagram',
        question: '在项目推进中，你更重视：',
        options: [
            { text: '里程碑控制和进度管理', score: { J: 3, P: 0 } },
            { text: '过程探索和创意发挥', score: { J: 0, P: 3 } },
            { text: '结果导向但保持过程灵活', score: { J: 1, P: 1 } }
        ]
    }
];

// MBTI 16种人格类型详细描述
const MBTI_TYPES = {
    'INTJ': {
        name: '建筑师',
        nickname: '策略家',
        description: '独立、创新、有战略眼光的理想主义者',
        strengths: ['战略思维', '独立性强', '创新能力', '目标导向', '系统思维'],
        challenges: ['可能显得冷漠', '过于完美主义', '不善表达情感', '对批评敏感'],
        careers: ['战略规划师', '系统架构师', '科学家', '投资分析师', '管理咨询顾问', '研发工程师'],
        famous: ['埃隆·马斯克', '史蒂芬·霍金', '马克·扎克伯格'],
        percentage: 2.1,
        color: '#6B46C1'
    },
    'INTP': {
        name: '逻辑学家',
        nickname: '思想家',
        description: '热衷理论和抽象概念的创新思考者',
        strengths: ['逻辑思维', '理论创新', '独立思考', '适应性强', '求知欲强'],
        challenges: ['不善处理情感', '容易拖延', '难以做决定', '不重视细节'],
        careers: ['软件工程师', '研究科学家', '哲学家', '数学家', '理论物理学家', '系统分析师'],
        famous: ['爱因斯坦', '比尔·盖茨', '艾萨克·牛顿'],
        percentage: 3.3,
        color: '#7C3AED'
    },
    'ENTJ': {
        name: '指挥官',
        nickname: '领导者',
        description: '天生的领导者，善于组织和指挥',
        strengths: ['领导能力', '战略规划', '决策果断', '目标导向', '沟通能力'],
        challenges: ['可能过于强势', '不够耐心', '忽视他人感受', '工作狂倾向'],
        careers: ['企业高管', '创业者', '项目经理', '管理咨询师', '律师', '投资银行家'],
        famous: ['史蒂夫·乔布斯', '玛格丽特·撒切尔', '富兰克林·罗斯福'],
        percentage: 2.7,
        color: '#DC2626'
    },
    'ENTP': {
        name: '辩论家',
        nickname: '发明家',
        description: '聪明好奇，能够激发他人的创新思维者',
        strengths: ['创新思维', '适应能力', '沟通技巧', '学习能力', '领导潜力'],
        challenges: ['难以专注', '不喜例行工作', '可能不切实际', '容易分心'],
        careers: ['创业者', '营销总监', '产品经理', '咨询顾问', '律师', '记者'],
        famous: ['沃伦·巴菲特', '马克·吐温', '本杰明·富兰克林'],
        percentage: 3.2,
        color: '#F59E0B'
    },
    'INFJ': {
        name: '提倡者',
        nickname: '咨询师',
        description: '有原则、理想主义，致力于帮助他人实现潜能',
        strengths: ['洞察力强', '富有同情心', '原则性强', '创造性', '善于激励他人'],
        challenges: ['过于理想化', '容易疲惫', '难以应对冲突', '过度自我批评'],
        careers: ['心理咨询师', '人力资源', '作家', '教师', '社会工作者', '艺术家'],
        famous: ['甘地', '奥普拉·温弗里', '马丁·路德·金'],
        percentage: 1.5,
        color: '#059669'
    },
    'INFP': {
        name: '调停者',
        nickname: '理想主义者',
        description: '忠于自己的价值观，致力寻求人生意义',
        strengths: ['创造力', '适应性', '价值观坚定', '善于理解他人', '灵活性'],
        challenges: ['过于理想化', '难以处理批评', '可能过于情绪化', '拖延倾向'],
        careers: ['作家', '艺术家', '心理学家', '社会工作者', '教师', '记者'],
        famous: ['J.K.罗琳', '莎士比亚', '约翰·列侬'],
        percentage: 4.4,
        color: '#10B981'
    },
    'ENFJ': {
        name: '主人公',
        nickname: '教导者',
        description: '富有魅力和感召力的天生领导者',
        strengths: ['领导魅力', '善于激励', '沟通能力', '同理心强', '组织能力'],
        challenges: ['可能忽视自身需求', '过度理想化', '难以做艰难决定', '容易疲惫'],
        careers: ['教师', '培训师', '人力资源经理', '心理咨询师', '公关经理', '销售经理'],
        famous: ['奥普拉·温弗里', '奥巴马', '马丁·路德·金'],
        percentage: 2.5,
        color: '#3B82F6'
    },
    'ENFP': {
        name: '竞选者',
        nickname: '激励者',
        description: '热情洋溢、富有创造力和社交能力的自由精神',
        strengths: ['创造性', '热情洋溢', '沟通能力', '适应性强', '善于激励他人'],
        challenges: ['难以专注', '不善处理细节', '可能过于情绪化', '不喜欢规则'],
        careers: ['市场营销', '公关', '记者', '演员', '心理咨询师', '创意总监'],
        famous: ['罗宾·威廉姆斯', '威尔·史密斯', '埃伦·德杰尼勒斯'],
        percentage: 8.1,
        color: '#8B5CF6'
    },
    'ISTJ': {
        name: '物流师',
        nickname: '检查员',
        description: '可靠务实，擅长组织和管理',
        strengths: ['可靠性', '组织能力', '责任心强', '务实', '持久力'],
        challenges: ['抗拒变化', '可能过于严格', '不善创新', '难以表达情感'],
        careers: ['会计师', '审计师', '项目经理', '行政管理', '银行家', '法官'],
        famous: ['沃伦·巴菲特', '乔治·华盛顿', '安吉拉·默克尔'],
        percentage: 11.6,
        color: '#4B5563'
    },
    'ISFJ': {
        name: '守卫者',
        nickname: '保护者',
        description: '温暖善良，总是乐于帮助他人',
        strengths: ['善良体贴', '可靠性', '细心', '支持性强', '忠诚'],
        challenges: ['难以说不', '过度自我牺牲', '避免冲突', '不善自我推销'],
        careers: ['护士', '教师', '人力资源', '社会工作者', '咨询师', '图书馆员'],
        famous: ['特蕾莎修女', '罗莎·帕克斯', '凯特·米德尔顿'],
        percentage: 13.8,
        color: '#065F46'
    },
    'ESTJ': {
        name: '总经理',
        nickname: '管理者',
        description: '优秀的管理者，善于组织和指导',
        strengths: ['组织能力', '责任心', '决策力', '效率高', '目标明确'],
        challenges: ['可能过于严格', '不够灵活', '忽视他人情感', '抗拒变化'],
        careers: ['管理者', '项目经理', '银行家', '法官', '军官', '行政主管'],
        famous: ['亨利·福特', '维多利亚女王', '约翰·D·洛克菲勒'],
        percentage: 8.7,
        color: '#B91C1C'
    },
    'ESFJ': {
        name: '执政官',
        nickname: '供给者',
        description: '善于照顾他人，注重和谐与合作',
        strengths: ['善于合作', '可靠', '善解人意', '组织能力', '忠诚'],
        challenges: ['过分在意他人看法', '难以应对批评', '可能忽视自身需求', '抗拒变化'],
        careers: ['人力资源', '教师', '护士', '销售代表', '客户服务', '活动策划'],
        famous: ['泰勒·斯威夫特', '休·杰克曼', '惠特妮·休斯顿'],
        percentage: 12.3,
        color: '#7C2D12'
    },
    'ISTP': {
        name: '鉴赏家',
        nickname: '工匠',
        description: '大胆而实际的实验家，擅长使用各种工具',
        strengths: ['动手能力', '逻辑思维', '适应性', '冷静', '独立性'],
        challenges: ['不善表达情感', '可能显得冷漠', '不喜欢承诺', '难以长期规划'],
        careers: ['机械工程师', '飞行员', '消防员', '程序员', '外科医生', '侦探'],
        famous: ['克林特·伊斯特伍德', '布鲁斯·李', '迈克尔·乔丹'],
        percentage: 5.4,
        color: '#374151'
    },
    'ISFP': {
        name: '探险家',
        nickname: '艺术家',
        description: '灵活随和的艺术家，时刻准备探索新的可能性',
        strengths: ['艺术天赋', '善良', '灵活性', '热情', '务实'],
        challenges: ['过于敏感', '不善竞争', '难以长期规划', '容易压抑'],
        careers: ['艺术家', '设计师', '音乐家', '心理咨询师', '兽医', '按摩师'],
        famous: ['迈克尔·杰克逊', '鲍勃·迪伦', '奥黛丽·赫本'],
        percentage: 8.8,
        color: '#16A34A'
    },
    'ESTP': {
        name: '企业家',
        nickname: '表演者',
        description: '聪明、精力充沛、善于感知的真正享受者',
        strengths: ['适应性强', '现实感', '社交能力', '实用性', '灵活'],
        challenges: ['缺乏长远规划', '容易冲动', '不耐烦', '可能忽视他人感受'],
        careers: ['销售', '市场营销', '企业家', '体育教练', '警察', '急救人员'],
        famous: ['唐纳德·特朗普', '欧内斯特·海明威', '温斯顿·丘吉尔'],
        percentage: 4.3,
        color: '#DC2626'
    },
    'ESFP': {
        name: '娱乐家',
        nickname: '表演者',
        description: '自发的、精力充沛的、热情的娱乐者',
        strengths: ['热情', '灵活性', '人际技能', '实用性', '善于激励'],
        challenges: ['不善长期规划', '容易分心', '过于敏感', '避免冲突'],
        careers: ['演员', '音乐家', '销售', '公关', '导游', '社会工作者'],
        famous: ['玛丽莲·梦露', '埃尔顿·约翰', '威尔·史密斯'],
        percentage: 8.5,
        color: '#F59E0B'
    }
};

// 维度描述
const DIMENSION_DESCRIPTIONS = {
    'E': {
        name: '外向型',
        description: '从外部世界获得能量，喜欢与人互动',
        traits: ['善于社交', '表达直接', '思维外向', '行动导向']
    },
    'I': {
        name: '内向型', 
        description: '从内心世界获得能量，需要独处时间',
        traits: ['深度思考', '谨慎行事', '独立工作', '观察力强']
    },
    'S': {
        name: '感觉型',
        description: '关注具体信息和实际经验',
        traits: ['注重细节', '务实可靠', '经验导向', '循序渐进']
    },
    'N': {
        name: '直觉型',
        description: '关注模式、可能性和潜在含义',
        traits: ['创新思维', '前瞻性强', '理论导向', '善于联想']
    },
    'T': {
        name: '思维型',
        description: '基于逻辑和客观分析做决定',
        traits: ['逻辑性强', '客观公正', '重视效率', '原则导向']
    },
    'F': {
        name: '情感型',
        description: '基于价值观和对他人的影响做决定',
        traits: ['重视和谐', '善解人意', '价值导向', '关怀他人']
    },
    'J': {
        name: '判断型',
        description: '喜欢有序、结构化的生活方式',
        traits: ['组织性强', '计划性好', '目标明确', '按时完成']
    },
    'P': {
        name: '知觉型',
        description: '喜欢灵活、开放的生活方式',
        traits: ['适应性强', '灵活变通', '保持开放', '即兴发挥']
    }
};