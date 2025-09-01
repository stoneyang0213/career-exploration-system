// 职业价值观测评数据

// 八大职业价值观维度定义
const VALUE_DIMENSIONS = {
    'achievement': {
        name: '成就感',
        english: 'Achievement',
        description: '追求卓越表现，渴望在工作中取得成功和获得认可',
        traits: ['追求卓越', '重视成果', '竞争意识', '目标导向', '成功驱动'],
        workStyle: '喜欢有挑战性的工作，重视业绩和成果',
        icon: 'fas fa-trophy',
        color: '#EF4444'
    },
    'social': {
        name: '社会需要',
        english: 'Social Service',
        description: '希望通过工作为社会做贡献，帮助他人解决问题',
        traits: ['服务他人', '社会责任', '利他主义', '同理心强', '使命感'],
        workStyle: '偏好能够帮助他人、服务社会的工作',
        icon: 'fas fa-users',
        color: '#3B82F6'
    },
    'self_actualization': {
        name: '自我实现',
        english: 'Self-Actualization', 
        description: '追求个人潜能的充分发挥，实现自我价值和理想',
        traits: ['发挥潜能', '个人成长', '创造性', '自我超越', '理想追求'],
        workStyle: '寻求能够发挥个人才能和创造力的工作',
        icon: 'fas fa-star',
        color: '#10B981'
    },
    'life_balance': {
        name: '生活平衡',
        english: 'Work-Life Balance',
        description: '重视工作与生活的平衡，追求和谐的生活方式',
        traits: ['时间自由', '生活品质', '健康第一', '家庭重要', '休闲娱乐'],
        workStyle: '偏好工作时间灵活、压力适中的工作',
        icon: 'fas fa-home',
        color: '#8B5CF6'
    },
    'economic': {
        name: '经济收益',
        english: 'Economic Returns',
        description: '重视工作带来的经济回报和物质生活水平的提高',
        traits: ['高收入', '物质保障', '财富积累', '生活水准', '经济安全'],
        workStyle: '关注薪资水平和福利待遇',
        icon: 'fas fa-dollar-sign',
        color: '#F59E0B'
    },
    'security': {
        name: '安全稳定',
        english: 'Security & Stability',
        description: '寻求工作的稳定性和安全感，避免不确定性风险',
        traits: ['工作稳定', '风险规避', '长期保障', '可预测性', '安全感'],
        workStyle: '倾向于稳定、有保障的工作环境',
        icon: 'fas fa-shield-alt',
        color: '#6B7280'
    },
    'power': {
        name: '权力地位',
        english: 'Power & Prestige',
        description: '追求权力、地位和社会声望，希望获得他人尊重',
        traits: ['影响力', '权威性', '社会地位', '声望', '领导力'],
        workStyle: '渴望担任领导职位，拥有决策权',
        icon: 'fas fa-crown',
        color: '#DC2626'
    },
    'independence': {
        name: '独立自主',
        english: 'Independence',
        description: '重视工作的自主性和独立性，不喜欢被过多约束',
        traits: ['自主决策', '工作自由', '创新空间', '个人风格', '灵活性'],
        workStyle: '偏好自主性强、约束少的工作方式',
        icon: 'fas fa-rocket',
        color: '#F97316'
    }
};

// 职业价值观测评问题库
const VALUES_QUESTIONS = [
    // 成就感 vs 其他价值观
    {
        id: 1,
        scenario: '你刚完成一个重要项目，领导给你两种选择：',
        question: '你会选择哪一个？',
        options: [
            { 
                text: '获得公司最佳员工奖和奖金，在全公司大会上表彰',
                dimension: 'achievement',
                score: 3
            },
            { 
                text: '获得一个月的带薪假期，可以陪伴家人和朋友',
                dimension: 'life_balance',
                score: 3
            },
            {
                text: '获得更大的项目决策权和团队管理权限',
                dimension: 'power',
                score: 2
            }
        ]
    },
    {
        id: 2,
        scenario: '面临职业选择时，以下哪个因素对你最重要？',
        question: '请选择你最看重的：',
        options: [
            {
                text: '这份工作能让我充分展示能力，获得业界认可',
                dimension: 'achievement',
                score: 3
            },
            {
                text: '这份工作能帮助很多人，对社会有积极影响',
                dimension: 'social',
                score: 3
            },
            {
                text: '这份工作收入丰厚，能显著提升生活水平',
                dimension: 'economic',
                score: 2
            }
        ]
    },

    // 社会需要 vs 其他价值观
    {
        id: 3,
        scenario: '你有机会参与一个志愿项目，但会占用你的休息时间：',
        question: '你的选择是：',
        options: [
            {
                text: '积极参与，因为能够帮助需要帮助的人',
                dimension: 'social',
                score: 3
            },
            {
                text: '婉拒参与，优先照顾自己的休息和家庭时间',
                dimension: 'life_balance',
                score: 3
            },
            {
                text: '选择性参与，平衡个人时间和社会贡献',
                dimension: 'social',
                score: 1
            }
        ]
    },
    {
        id: 4,
        scenario: '公司要派你去偏远地区支援一个公益项目：',
        question: '你的态度是：',
        options: [
            {
                text: '欣然接受，这是为社会做贡献的好机会',
                dimension: 'social',
                score: 3
            },
            {
                text: '考虑个人安全和生活条件的稳定性',
                dimension: 'security',
                score: 3
            },
            {
                text: '关注这个经历对个人职业发展的价值',
                dimension: 'achievement',
                score: 2
            }
        ]
    },

    // 自我实现 vs 其他价值观
    {
        id: 5,
        scenario: '你发现当前工作虽然稳定但无法发挥你的创造力：',
        question: '你会怎么做？',
        options: [
            {
                text: '寻找新的工作机会，即使存在不确定性',
                dimension: 'self_actualization',
                score: 3
            },
            {
                text: '继续当前工作，毕竟稳定性很重要',
                dimension: 'security',
                score: 3
            },
            {
                text: '在业余时间发展个人兴趣和创意项目',
                dimension: 'life_balance',
                score: 2
            }
        ]
    },
    {
        id: 6,
        scenario: '你有一个创业想法，但需要放弃当前高薪工作：',
        question: '你的选择是：',
        options: [
            {
                text: '勇敢创业，追求梦想和自我实现',
                dimension: 'self_actualization',
                score: 3
            },
            {
                text: '保持现状，高薪工作提供了很好的生活保障',
                dimension: 'economic',
                score: 3
            },
            {
                text: '寻找投资人，降低创业的财务风险',
                dimension: 'security',
                score: 2
            }
        ]
    },

    // 生活平衡 vs 其他价值观
    {
        id: 7,
        scenario: '公司提供升职机会，但需要经常加班和出差：',
        question: '你会如何权衡？',
        options: [
            {
                text: '接受挑战，职业发展是第一位的',
                dimension: 'achievement',
                score: 3
            },
            {
                text: '婉拒升职，保持目前的工作生活平衡',
                dimension: 'life_balance',
                score: 3
            },
            {
                text: '与公司协商，寻求更灵活的工作安排',
                dimension: 'independence',
                score: 2
            }
        ]
    },
    {
        id: 8,
        scenario: '你的理想工作日程是：',
        question: '选择最符合你期望的：',
        options: [
            {
                text: '朝九晚五，周末双休，有充分的个人时间',
                dimension: 'life_balance',
                score: 3
            },
            {
                text: '工作时间灵活，可以自己安排，结果导向',
                dimension: 'independence',
                score: 3
            },
            {
                text: '工作强度大但回报高，能够快速积累财富',
                dimension: 'economic',
                score: 2
            }
        ]
    },

    // 经济收益 vs 其他价值观
    {
        id: 9,
        scenario: '你收到两个工作邀请：',
        question: '你会选择哪一个？',
        options: [
            {
                text: 'A公司：薪资高出30%，但工作压力大',
                dimension: 'economic',
                score: 3
            },
            {
                text: 'B公司：薪资一般，但工作有意义，能帮助他人',
                dimension: 'social',
                score: 3
            },
            {
                text: 'C公司：薪资中等，但有很好的晋升前景',
                dimension: 'achievement',
                score: 2
            }
        ]
    },
    {
        id: 10,
        scenario: '关于金钱和工作，你的观点是：',
        question: '选择最接近你想法的：',
        options: [
            {
                text: '金钱是实现生活目标的重要手段，越多越好',
                dimension: 'economic',
                score: 3
            },
            {
                text: '够用就好，更重要的是工作的意义和价值',
                dimension: 'self_actualization',
                score: 3
            },
            {
                text: '稳定的收入就足够，不需要太多风险',
                dimension: 'security',
                score: 2
            }
        ]
    },

    // 安全稳定 vs 其他价值观
    {
        id: 11,
        scenario: '你更倾向于选择什么样的工作环境？',
        question: '请选择你的偏好：',
        options: [
            {
                text: '大型国企或公务员，工作稳定有保障',
                dimension: 'security',
                score: 3
            },
            {
                text: '创新型企业，虽有风险但发展空间大',
                dimension: 'self_actualization',
                score: 3
            },
            {
                text: '自主创业，完全掌控自己的事业',
                dimension: 'independence',
                score: 2
            }
        ]
    },
    {
        id: 12,
        scenario: '面对工作中的不确定性，你通常：',
        question: '选择你的典型反应：',
        options: [
            {
                text: '感到不安，希望有明确的规划和保障',
                dimension: 'security',
                score: 3
            },
            {
                text: '兴奋期待，认为是新的挑战和机会',
                dimension: 'achievement',
                score: 3
            },
            {
                text: '冷静分析，寻找最佳的应对策略',
                dimension: 'independence',
                score: 2
            }
        ]
    },

    // 权力地位 vs 其他价值观
    {
        id: 13,
        scenario: '在团队中，你希望扮演什么角色？',
        question: '选择你最舒适的位置：',
        options: [
            {
                text: '团队领导者，负责决策和指导方向',
                dimension: 'power',
                score: 3
            },
            {
                text: '专业顾问，提供技术支持和建议',
                dimension: 'self_actualization',
                score: 3
            },
            {
                text: '团队成员，专注做好自己的本职工作',
                dimension: 'security',
                score: 2
            }
        ]
    },
    {
        id: 14,
        scenario: '你认为职场成功的标志是什么？',
        question: '选择最符合你观点的：',
        options: [
            {
                text: '拥有重要的职位和决策权，受人尊敬',
                dimension: 'power',
                score: 3
            },
            {
                text: '实现个人价值，在专业领域有所建树',
                dimension: 'self_actualization',
                score: 3
            },
            {
                text: '获得丰厚的回报，提升生活品质',
                dimension: 'economic',
                score: 2
            }
        ]
    },

    // 独立自主 vs 其他价值观
    {
        id: 15,
        scenario: '你更喜欢什么样的工作方式？',
        question: '选择你的偏好：',
        options: [
            {
                text: '自由安排工作时间和方式，自主决策',
                dimension: 'independence',
                score: 3
            },
            {
                text: '在团队中协作，共同完成目标',
                dimension: 'social',
                score: 3
            },
            {
                text: '按照明确的流程和标准执行任务',
                dimension: 'security',
                score: 2
            }
        ]
    },
    {
        id: 16,
        scenario: '最后一个问题，你最希望别人如何评价你的工作？',
        question: '选择对你最重要的评价：',
        options: [
            {
                text: '"这个人很有想法，工作方式很独特"',
                dimension: 'independence',
                score: 2
            },
            {
                text: '"这个人很成功，总是能出色完成任务"',
                dimension: 'achievement',
                score: 2
            },
            {
                text: '"这个人很有爱心，总是乐于帮助别人"',
                dimension: 'social',
                score: 2
            }
        ]
    }
];

// 价值观组合建议
const VALUE_COMBINATIONS = {
    'achievement_economic': {
        description: '成就导向+经济回报型',
        careerPath: '追求高成就和高回报的职业路径',
        suitableCareers: ['投资银行家', '企业高管', '销售总监', '创业者', '律师'],
        advice: '寻找能够体现个人价值并获得丰厚回报的工作机会'
    },
    'social_self_actualization': {
        description: '社会服务+自我实现型',
        careerPath: '通过服务他人实现自我价值的职业路径',
        suitableCareers: ['教师', '心理咨询师', '社会工作者', '医生', '非营利组织负责人'],
        advice: '选择能够帮助他人并发挥个人专长的工作'
    },
    'independence_self_actualization': {
        description: '独立自主+自我实现型',
        careerPath: '追求创造性和自主性的职业路径',
        suitableCareers: ['自由职业者', '艺术家', '咨询师', '技术专家', '创业者'],
        advice: '寻找能够充分发挥创造力和保持工作自主性的机会'
    },
    'security_life_balance': {
        description: '安全稳定+生活平衡型',
        careerPath: '追求稳定和生活质量的职业路径',
        suitableCareers: ['公务员', '教师', '银行职员', '会计师', '技术支持'],
        advice: '选择稳定性高、工作生活平衡的工作环境'
    },
    'power_achievement': {
        description: '权力地位+成就导向型',
        careerPath: '追求领导力和影响力的职业路径',
        suitableCareers: ['管理者', '政治家', '企业家', '项目经理', '团队领导'],
        advice: '寻求能够展现领导才能和获得成就感的管理岗位'
    }
};

// 根据分数生成价值观排序
function generateValueRanking(scores) {
    // 按分数排序
    const ranking = Object.entries(scores)
        .sort(([,a], [,b]) => b - a)
        .map(([value, score], index) => ({
            value: value,
            score: score,
            rank: index + 1,
            info: VALUE_DIMENSIONS[value],
            percentage: Math.round((score / Math.max(...Object.values(scores))) * 100)
        }));
    
    // 识别主要价值观组合
    const topTwo = ranking.slice(0, 2).map(item => item.value);
    const combinationKey = topTwo.sort().join('_');
    const combination = VALUE_COMBINATIONS[combinationKey] || null;
    
    return {
        ranking: ranking,
        topValues: topTwo,
        combination: combination,
        scores: scores
    };
}