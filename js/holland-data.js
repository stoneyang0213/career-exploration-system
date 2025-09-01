// 霍兰德职业兴趣测评数据

// RIASEC六维度定义
const RIASEC_DIMENSIONS = {
    'R': {
        name: '现实型',
        english: 'Realistic',
        description: '喜欢具体的、实用的活动和解决实际问题',
        traits: ['动手能力强', '喜欢户外工作', '实用主义', '机械操作', '体力活动'],
        workEnvironment: '工厂、农场、建筑工地、机械车间',
        icon: 'fas fa-tools',
        color: '#3B82F6'
    },
    'I': {
        name: '研究型', 
        english: 'Investigative',
        description: '喜欢观察、学习、研究、分析、评估和解决问题',
        traits: ['分析思维', '求知欲强', '逻辑思维', '独立工作', '理论导向'],
        workEnvironment: '实验室、研究院、图书馆、医院、大学',
        icon: 'fas fa-flask',
        color: '#10B981'
    },
    'A': {
        name: '艺术型',
        english: 'Artistic', 
        description: '喜欢创造性的活动，富有想象力和创造力',
        traits: ['创造力强', '审美能力', '表达能力', '个性独特', '情感丰富'],
        workEnvironment: '工作室、剧院、美术馆、媒体公司、设计公司',
        icon: 'fas fa-palette',
        color: '#8B5CF6'
    },
    'S': {
        name: '社会型',
        english: 'Social',
        description: '喜欢与人合作，热心解决人类的问题',
        traits: ['人际交往', '同理心强', '服务意识', '沟通能力', '关怀他人'],
        workEnvironment: '学校、医院、社区中心、咨询机构、非营利组织',
        icon: 'fas fa-users',
        color: '#F59E0B'
    },
    'E': {
        name: '企业型',
        english: 'Enterprising',
        description: '喜欢竞争性的活动，热衷于影响别人和改变现状',
        traits: ['领导能力', '说服力强', '竞争意识', '目标导向', '冒险精神'],
        workEnvironment: '公司总部、销售部门、律师事务所、政府机关',
        icon: 'fas fa-chart-line',
        color: '#EF4444'
    },
    'C': {
        name: '事务型',
        english: 'Conventional',
        description: '喜欢有规则的活动，习惯按照一定程序和标准来完成任务',
        traits: ['组织能力', '细致认真', '责任心强', '遵守规则', '稳定可靠'],
        workEnvironment: '办公室、银行、会计事务所、政府部门、档案馆',
        icon: 'fas fa-clipboard-list',
        color: '#6B7280'
    }
};

// 霍兰德职业兴趣测评问题库
const HOLLAND_QUESTIONS = [
    // 现实型 (R) 相关问题
    {
        id: 1,
        type: 'activity',
        question: '你更愿意参与以下哪种活动？',
        options: [
            { text: '修理机械设备或电子产品', dimension: 'R', score: 3 },
            { text: '分析市场数据和制定营销策略', dimension: 'E', score: 2 },
            { text: '整理和归档重要文件资料', dimension: 'C', score: 1 }
        ]
    },
    {
        id: 2,
        type: 'work',
        question: '在团队项目中，你更喜欢承担什么角色？',
        options: [
            { text: '负责具体的执行和操作工作', dimension: 'R', score: 3 },
            { text: '协调团队成员关系和沟通', dimension: 'S', score: 2 },
            { text: '进行创意设计和方案构思', dimension: 'A', score: 1 }
        ]
    },
    {
        id: 3,
        type: 'environment',
        question: '你更喜欢在什么样的环境中工作？',
        options: [
            { text: '户外或工厂车间等实际操作场所', dimension: 'R', score: 3 },
            { text: '安静的实验室或研究室', dimension: 'I', score: 2 },
            { text: '整洁有序的办公室环境', dimension: 'C', score: 1 }
        ]
    },
    
    // 研究型 (I) 相关问题
    {
        id: 4,
        type: 'activity',
        question: '面对未知问题时，你的第一反应是什么？',
        options: [
            { text: '查阅资料，深入研究问题的本质', dimension: 'I', score: 3 },
            { text: '寻找创新的解决方案和方法', dimension: 'A', score: 2 },
            { text: '按照既定流程和标准处理', dimension: 'C', score: 1 }
        ]
    },
    {
        id: 5,
        type: 'learning',
        question: '你最享受哪种学习方式？',
        options: [
            { text: '独立思考，深入理解理论概念', dimension: 'I', score: 3 },
            { text: '动手实践，在操作中学习', dimension: 'R', score: 2 },
            { text: '小组讨论，与他人交流想法', dimension: 'S', score: 1 }
        ]
    },
    {
        id: 6,
        type: 'interest',
        question: '你对以下哪个话题最感兴趣？',
        options: [
            { text: '科学发现和技术创新', dimension: 'I', score: 3 },
            { text: '社会问题和人文关怀', dimension: 'S', score: 2 },
            { text: '商业趋势和市场机会', dimension: 'E', score: 1 }
        ]
    },

    // 艺术型 (A) 相关问题
    {
        id: 7,
        type: 'expression',
        question: '你更倾向于通过什么方式表达自己？',
        options: [
            { text: '绘画、音乐、写作等艺术创作', dimension: 'A', score: 3 },
            { text: '逻辑清晰的报告和分析', dimension: 'I', score: 2 },
            { text: '有说服力的演讲和展示', dimension: 'E', score: 1 }
        ]
    },
    {
        id: 8,
        type: 'work',
        question: '在工作中，你最重视什么？',
        options: [
            { text: '创意自由和个人风格的体现', dimension: 'A', score: 3 },
            { text: '工作的稳定性和明确的规范', dimension: 'C', score: 2 },
            { text: '能够帮助和影响他人', dimension: 'S', score: 1 }
        ]
    },
    {
        id: 9,
        type: 'thinking',
        question: '你的思维方式更偏向于？',
        options: [
            { text: '形象思维，善于联想和想象', dimension: 'A', score: 3 },
            { text: '抽象思维，喜欢理论推导', dimension: 'I', score: 2 },
            { text: '实用思维，关注现实应用', dimension: 'R', score: 1 }
        ]
    },

    // 社会型 (S) 相关问题
    {
        id: 10,
        type: 'motivation',
        question: '什么最能激励你努力工作？',
        options: [
            { text: '能够帮助他人解决问题', dimension: 'S', score: 3 },
            { text: '获得权力和影响力', dimension: 'E', score: 2 },
            { text: '追求知识和真理', dimension: 'I', score: 1 }
        ]
    },
    {
        id: 11,
        type: 'interaction',
        question: '在人际交往中，你更擅长什么？',
        options: [
            { text: '倾听他人，提供情感支持', dimension: 'S', score: 3 },
            { text: '说服他人接受自己的观点', dimension: 'E', score: 2 },
            { text: '与少数人进行深度交流', dimension: 'I', score: 1 }
        ]
    },
    {
        id: 12,
        type: 'values',
        question: '你认为工作最重要的价值是什么？',
        options: [
            { text: '为社会做贡献，帮助他人成长', dimension: 'S', score: 3 },
            { text: '追求卓越，创造美好的作品', dimension: 'A', score: 2 },
            { text: '维护秩序，保证工作质量', dimension: 'C', score: 1 }
        ]
    },

    // 企业型 (E) 相关问题
    {
        id: 13,
        type: 'leadership',
        question: '在团队中，你更愿意扮演什么角色？',
        options: [
            { text: '团队领导者，制定决策和方向', dimension: 'E', score: 3 },
            { text: '专业顾问，提供技术支持', dimension: 'I', score: 2 },
            { text: '团队协调者，维护和谐关系', dimension: 'S', score: 1 }
        ]
    },
    {
        id: 14,
        type: 'challenge',
        question: '你更喜欢什么类型的挑战？',
        options: [
            { text: '竞争性的商业项目和谈判', dimension: 'E', score: 3 },
            { text: '复杂的技术问题和研究', dimension: 'I', score: 2 },
            { text: '精密的工艺制作和操作', dimension: 'R', score: 1 }
        ]
    },
    {
        id: 15,
        type: 'goal',
        question: '你的职业目标更偏向于？',
        options: [
            { text: '成为行业领袖，拥有影响力', dimension: 'E', score: 3 },
            { text: '成为专业权威，获得认可', dimension: 'I', score: 2 },
            { text: '拥有稳定工作，生活平衡', dimension: 'C', score: 1 }
        ]
    },

    // 事务型 (C) 相关问题
    {
        id: 16,
        type: 'work_style',
        question: '你更喜欢什么样的工作方式？',
        options: [
            { text: '按照既定流程，有条不紊地完成', dimension: 'C', score: 3 },
            { text: '灵活应变，根据情况调整方法', dimension: 'E', score: 2 },
            { text: '自由创作，不受规则束缚', dimension: 'A', score: 1 }
        ]
    },
    {
        id: 17,
        type: 'organization',
        question: '你如何看待工作中的规则和制度？',
        options: [
            { text: '规则很重要，应该严格遵守', dimension: 'C', score: 3 },
            { text: '规则可以灵活处理，重在结果', dimension: 'E', score: 2 },
            { text: '规则应该因人而异，注重情理', dimension: 'S', score: 1 }
        ]
    },
    {
        id: 18,
        type: 'detail',
        question: '处理工作任务时，你更注重什么？',
        options: [
            { text: '准确性和完整性，不出错误', dimension: 'C', score: 3 },
            { text: '效率和结果，快速完成', dimension: 'E', score: 2 },
            { text: '创新性和独特性，与众不同', dimension: 'A', score: 1 }
        ]
    },

    // 综合比较题
    {
        id: 19,
        type: 'comparison',
        question: '如果要选择一个周末活动，你会选择？',
        options: [
            { text: '参加户外运动或DIY制作', dimension: 'R', score: 2 },
            { text: '阅读学术文章或看纪录片', dimension: 'I', score: 2 },
            { text: '参观艺术展览或音乐会', dimension: 'A', score: 2 }
        ]
    },
    {
        id: 20,
        type: 'comparison',
        question: '面对压力时，你更倾向于？',
        options: [
            { text: '寻求朋友和家人的支持', dimension: 'S', score: 2 },
            { text: '制定详细计划，一步步解决', dimension: 'C', score: 2 },
            { text: '迎接挑战，主动寻求突破', dimension: 'E', score: 2 }
        ]
    },
    {
        id: 21,
        type: 'future',
        question: '你理想中的工作应该是？',
        options: [
            { text: '能够看到实际成果的技术工作', dimension: 'R', score: 2 },
            { text: '充满创意和想象力的设计工作', dimension: 'A', score: 2 },
            { text: '能够帮助他人成长的教育工作', dimension: 'S', score: 2 }
        ]
    },
    {
        id: 22,
        type: 'skills',
        question: '你认为自己最突出的能力是？',
        options: [
            { text: '逻辑分析和问题解决能力', dimension: 'I', score: 2 },
            { text: '组织管理和协调统筹能力', dimension: 'C', score: 2 },
            { text: '说服沟通和领导影响能力', dimension: 'E', score: 2 }
        ]
    },
    {
        id: 23,
        type: 'values',
        question: '在职业选择中，你最看重什么？',
        options: [
            { text: '工作的创造性和自由度', dimension: 'A', score: 2 },
            { text: '工作的稳定性和安全感', dimension: 'C', score: 2 },
            { text: '工作的社会价值和意义', dimension: 'S', score: 2 }
        ]
    },
    {
        id: 24,
        type: 'final',
        question: '最后，你最希望别人如何评价你？',
        options: [
            { text: '"这个人很可靠，做事踏实"', dimension: 'R', score: 1 },
            { text: '"这个人很聪明，见解独到"', dimension: 'I', score: 1 },
            { text: '"这个人很有才华，富有创意"', dimension: 'A', score: 1 }
        ]
    }
];

// 霍兰德职业代码组合及对应职业
const HOLLAND_CAREERS = {
    // 现实型为主导
    'R': {
        careers: ['机械工程师', '建筑工人', '电工', '汽车修理工', '农民', '厨师'],
        description: '适合需要动手能力和实际操作的职业'
    },
    'RI': {
        careers: ['工程技术员', '实验室技师', '质量检测员', '医疗设备技师', '地质勘探员'],
        description: '结合动手能力和分析思维的技术性职业'
    },
    'RC': {
        careers: ['生产管理员', '仓库管理员', '设备维护员', '质量控制员', '工艺技术员'],
        description: '需要实际操作和规范管理的职业'
    },
    'RE': {
        careers: ['施工项目经理', '销售工程师', '技术顾问', '设备销售员', '承包商'],
        description: '结合技术能力和商业头脑的职业'
    },

    // 研究型为主导
    'I': {
        careers: ['科研人员', '大学教授', '医生', '心理学家', '数学家', '程序员'],
        description: '需要深入思考和理论研究的职业'
    },
    'IR': {
        careers: ['工程师', '技术研发员', '实验员', '系统分析师', '技术专家'],
        description: '理论与实践相结合的技术职业'
    },
    'IA': {
        careers: ['建筑师', '工业设计师', '作家', '编剧', '艺术评论家', '策展人'],
        description: '需要创新思维和美学判断的职业'
    },
    'IS': {
        careers: ['心理咨询师', '社会学研究员', '教育研究员', '医生', '治疗师'],
        description: '研究人类行为和提供帮助的职业'
    },

    // 艺术型为主导
    'A': {
        careers: ['画家', '音乐家', '作家', '演员', '设计师', '摄影师'],
        description: '需要创造力和艺术天赋的职业'
    },
    'AS': {
        careers: ['艺术治疗师', '音乐治疗师', '戏剧教师', '艺术教师', '文化活动策划'],
        description: '通过艺术帮助和影响他人的职业'
    },
    'AE': {
        careers: ['广告创意总监', '品牌经理', '媒体制作人', '艺术经纪人', '活动策划师'],
        description: '将创意与商业结合的职业'
    },
    'AI': {
        careers: ['建筑师', '工业设计师', '游戏设计师', '用户体验设计师', '研究型艺术家'],
        description: '需要系统思维的创意职业'
    },

    // 社会型为主导
    'S': {
        careers: ['教师', '社会工作者', '护士', '心理咨询师', '人力资源专员'],
        description: '专注于帮助和服务他人的职业'
    },
    'SE': {
        careers: ['销售代表', '培训师', '客户经理', '公关专员', '团队领导'],
        description: '在帮助他人的同时具有商业导向的职业'
    },
    'SA': {
        careers: ['艺术教师', '音乐治疗师', '戏剧导演', '文化工作者', '媒体编辑'],
        description: '通过艺术和创意服务他人的职业'
    },
    'SI': {
        careers: ['研究型心理学家', '教育研究员', '医生', '社会学家', '政策分析师'],
        description: '通过研究更好地服务社会的职业'
    },

    // 企业型为主导
    'E': {
        careers: ['企业家', '销售经理', '律师', '政治家', '管理顾问', '投资顾问'],
        description: '需要领导力和商业头脑的职业'
    },
    'EC': {
        careers: ['项目经理', '运营经理', '行政主管', '财务经理', '人事经理'],
        description: '需要管理和组织能力的职业'
    },
    'ES': {
        careers: ['人力资源总监', '培训经理', '客户关系经理', '公关经理', '团队建设师'],
        description: '通过人际影响达成商业目标的职业'
    },
    'EA': {
        careers: ['创意总监', '品牌经理', '媒体制作人', '活动策划总监', '艺术经纪人'],
        description: '将创意转化为商业价值的职业'
    },

    // 事务型为主导
    'C': {
        careers: ['会计师', '审计师', '银行职员', '文秘', '档案管理员', '统计员'],
        description: '需要细致和规范操作的职业'
    },
    'CE': {
        careers: ['财务经理', '行政经理', '运营专员', '项目协调员', '业务分析师'],
        description: '在规范框架下进行管理的职业'
    },
    'CR': {
        careers: ['生产计划员', '质量管理员', '仓储管理员', '成本会计', '工艺管理员'],
        description: '结合实际操作和精确管理的职业'
    },
    'CS': {
        careers: ['人事专员', '客服代表', '医务管理员', '教务管理员', '社会保障专员'],
        description: '在服务他人的同时保持规范的职业'
    }
};

// 根据得分生成职业代码
function generateCareerCode(scores) {
    // 按分数排序
    const sortedDimensions = Object.entries(scores)
        .sort(([,a], [,b]) => b - a)
        .map(([dim]) => dim);
    
    // 取前2-3个最高分的维度
    const topDimensions = sortedDimensions.slice(0, 3);
    
    // 生成可能的组合
    const possibleCodes = [
        topDimensions[0], // 单一维度
        topDimensions[0] + topDimensions[1], // 两维度组合
        topDimensions[0] + topDimensions[1] + topDimensions[2] // 三维度组合
    ];
    
    return {
        primary: topDimensions[0],
        secondary: topDimensions[1],
        codes: possibleCodes,
        scores: scores,
        sortedDimensions: topDimensions
    };
}