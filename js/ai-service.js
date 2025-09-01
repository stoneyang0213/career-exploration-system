// AI服务模块 - 处理AI大模型调用和PDF生成
class AIService {
    constructor() {
        this.apiEndpoint = 'https://api.siliconflow.cn/v1/chat/completions'; // 改为SiliconFlow API
        this.apiKey = null;
        this.model = 'qwen-plus'; // 改为SiliconFlow的默认模型
        this.maxTokens = 2000;
        this.temperature = 0.7;
    }

    // 设置API密钥
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    // 生成职业测评报告
    async generateCareerReport(mbtiResult, hollandResult, valuesResult) {
        try {
            const prompt = this.buildCareerReportPrompt(mbtiResult, hollandResult, valuesResult);
            const response = await this.callAI(prompt);
            return this.parseReportResponse(response);
        } catch (error) {
            console.error('AI报告生成失败:', error);
            return this.getFallbackReport(mbtiResult, hollandResult, valuesResult);
        }
    }

    // 构建职业报告提示词
    buildCareerReportPrompt(mbtiResult, hollandResult, valuesResult) {
        return `
你是一位资深的职业发展顾问和心理学家，拥有20年的职业咨询经验。请基于以下测评结果，为用户生成一份专业、详细、个性化的职业测评报告。

## 用户测评数据

### MBTI性格类型：${mbtiResult.type} (${mbtiResult.typeInfo.name})
- 外向性(E)/内向性(I)：${mbtiResult.scores.E}% / ${mbtiResult.scores.I}%
- 感觉(S)/直觉(N)：${mbtiResult.scores.S}% / ${mbtiResult.scores.N}%
- 思维(T)/情感(F)：${mbtiResult.scores.T}% / ${mbtiResult.scores.F}%
- 判断(J)/知觉(P)：${mbtiResult.scores.J}% / ${mbtiResult.scores.P}%

### 霍兰德职业兴趣：${hollandResult.careerCode.primary}型
- 现实型(R)：${hollandResult.scores.R}%
- 研究型(I)：${hollandResult.scores.I}%
- 艺术型(A)：${hollandResult.scores.A}%
- 社会型(S)：${hollandResult.scores.S}%
- 企业型(E)：${hollandResult.scores.E}%
- 事务型(C)：${hollandResult.scores.C}%

### 职业价值观排序：
${valuesResult.valueRanking.ranking.map((value, index) => 
    `${index + 1}. ${value.info.name}：${value.info.description}`
).join('\n')}

## 报告要求

请生成一份结构化的职业测评报告，包含以下部分：

### 1. 执行摘要
- 简要概述用户的性格特质、职业兴趣和价值观
- 指出最突出的特点和潜在发展方向

### 2. 性格特质分析
- 深入分析MBTI性格类型的优势和挑战
- 在职场中的表现特点
- 适合的工作环境和团队角色

### 3. 职业兴趣匹配
- 分析霍兰德职业兴趣类型
- 推荐最适合的职业领域
- 新兴行业中的机会

### 4. 价值观驱动分析
- 分析核心价值观对职业选择的影响
- 工作满意度预测
- 长期职业发展动力

### 5. 综合职业推荐
- 基于三个维度的综合推荐
- 具体职位建议（至少5个）
- 每个职位的匹配度分析

### 6. 发展建议
- 短期发展目标（1年内）
- 中期发展规划（3-5年）
- 长期职业愿景（5-10年）
- 具体行动建议

### 7. 风险提示
- 可能面临的挑战
- 需要提升的能力
- 职业转型建议

### 8. 行业趋势分析
- 相关行业的发展前景
- AI时代的影响
- 未来职业机会

请确保报告：
- 语言专业、易懂
- 内容具体、可操作
- 建议实用、个性化
- 结构清晰、逻辑性强
- 字数控制在1500-2000字之间

请以JSON格式返回，包含以下字段：
{
    "title": "报告标题",
    "summary": "执行摘要",
    "personalityAnalysis": "性格特质分析",
    "careerInterest": "职业兴趣匹配",
    "valuesAnalysis": "价值观驱动分析",
    "recommendations": "综合职业推荐",
    "developmentPlan": "发展建议",
    "riskWarnings": "风险提示",
    "industryTrends": "行业趋势分析",
    "generatedAt": "生成时间"
}
        `;
    }

    // 调用AI模型
    async callAI(prompt) {
        if (!this.apiKey) {
            throw new Error('API密钥未设置，请先设置API密钥');
        }

        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: '你是一位资深的职业发展顾问和心理学家，专门从事职业测评和职业规划咨询。请以专业、客观、实用的态度为用户提供职业发展建议。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: this.maxTokens,
                temperature: this.temperature
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`AI服务调用失败: ${errorData.error?.message || response.statusText}`);
        }

        return await response.json();
    }

    // 解析AI响应
    parseReportResponse(response) {
        try {
            const content = response.choices[0].message.content;
            
            // 尝试解析JSON格式的响应
            if (content.includes('{') && content.includes('}')) {
                const jsonStart = content.indexOf('{');
                const jsonEnd = content.lastIndexOf('}') + 1;
                const jsonContent = content.substring(jsonStart, jsonEnd);
                
                const reportData = JSON.parse(jsonContent);
                reportData.generatedAt = new Date().toISOString();
                return reportData;
            }
            
            // 如果不是JSON格式，返回格式化的文本
            return {
                title: '职业测评报告',
                summary: content,
                personalityAnalysis: '请查看完整报告内容',
                careerInterest: '请查看完整报告内容',
                valuesAnalysis: '请查看完整报告内容',
                recommendations: '请查看完整报告内容',
                developmentPlan: '请查看完整报告内容',
                riskWarnings: '请查看完整报告内容',
                industryTrends: '请查看完整报告内容',
                generatedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('解析AI响应失败:', error);
            throw new Error('AI响应格式错误');
        }
    }

    // 获取备用报告
    getFallbackReport(mbtiResult, hollandResult, valuesResult) {
        return {
            title: '职业测评报告',
            summary: `基于您的测评结果，您是一个${mbtiResult.typeInfo.name}性格类型的人，在${hollandResult.careerCode.primary}型职业领域有较强的兴趣。`,
            personalityAnalysis: `您的${mbtiResult.typeInfo.name}性格特质表明您${mbtiResult.typeInfo.description}`,
            careerInterest: `您的霍兰德职业兴趣显示您最适合${hollandResult.careerCode.primary}型工作。`,
            valuesAnalysis: `您最重视${valuesResult.valueRanking.ranking[0].info.name}，这会影响您的职业选择。`,
            recommendations: '建议您关注与个人特质匹配的职业领域。',
            developmentPlan: '制定具体的学习和发展计划。',
            riskWarnings: '注意平衡个人特质与职业要求。',
            industryTrends: '关注行业发展趋势和新兴机会。',
            generatedAt: new Date().toISOString()
        };
    }
}

// PDF生成服务
class PDFService {
    constructor() {
        this.pdfDoc = null;
    }

    // 生成PDF报告
    async generatePDFReport(reportData, userData) {
        try {
            // 使用jsPDF库生成PDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // 设置中文字体
            doc.addFont('https://cdn.jsdelivr.net/npm/noto-sans-sc@1.0.1/NotoSansSC-Regular.otf', 'NotoSansSC', 'normal');
            doc.setFont('NotoSansSC');
            
            // 生成PDF内容
            this.generatePDFContent(doc, reportData, userData);
            
            return doc;
        } catch (error) {
            console.error('PDF生成失败:', error);
            throw new Error('PDF生成失败');
        }
    }

    // 生成PDF内容
    generatePDFContent(doc, reportData, userData) {
        let yPosition = 20;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;
        
        // 标题
        doc.setFontSize(24);
        doc.setTextColor(75, 85, 99);
        doc.text(reportData.title, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 20;
        
        // 生成时间
        doc.setFontSize(10);
        doc.setTextColor(156, 163, 175);
        const generatedDate = new Date(reportData.generatedAt).toLocaleDateString('zh-CN');
        doc.text(`生成时间：${generatedDate}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 30;
        
        // 执行摘要
        yPosition = this.addSection(doc, '执行摘要', reportData.summary, yPosition, contentWidth, margin);
        
        // 性格特质分析
        yPosition = this.addSection(doc, '性格特质分析', reportData.personalityAnalysis, yPosition, contentWidth, margin);
        
        // 职业兴趣匹配
        yPosition = this.addSection(doc, '职业兴趣匹配', reportData.careerInterest, yPosition, contentWidth, margin);
        
        // 价值观驱动分析
        yPosition = this.addSection(doc, '价值观驱动分析', reportData.valuesAnalysis, yPosition, contentWidth, margin);
        
        // 综合职业推荐
        yPosition = this.addSection(doc, '综合职业推荐', reportData.recommendations, yPosition, contentWidth, margin);
        
        // 发展建议
        yPosition = this.addSection(doc, '发展建议', reportData.developmentPlan, yPosition, contentWidth, margin);
        
        // 风险提示
        yPosition = this.addSection(doc, '风险提示', reportData.riskWarnings, yPosition, contentWidth, margin);
        
        // 行业趋势分析
        yPosition = this.addSection(doc, '行业趋势分析', reportData.industryTrends, yPosition, contentWidth, margin);
        
        // 页脚
        this.addFooter(doc, pageWidth);
    }

    // 添加章节
    addSection(doc, title, content, yPosition, contentWidth, margin) {
        // 检查是否需要新页面
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }
        
        // 章节标题
        doc.setFontSize(16);
        doc.setTextColor(55, 65, 81);
        doc.text(title, margin, yPosition);
        yPosition += 10;
        
        // 章节内容
        doc.setFontSize(12);
        doc.setTextColor(75, 85, 99);
        
        const lines = doc.splitTextToSize(content, contentWidth);
        for (let line of lines) {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, margin, yPosition);
            yPosition += 7;
        }
        
        yPosition += 15;
        return yPosition;
    }

    // 添加页脚
    addFooter(doc, pageWidth) {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(156, 163, 175);
            doc.text(`第 ${i} 页，共 ${pageCount} 页`, pageWidth / 2, 290, { align: 'center' });
            doc.text('职业探索星图 - 专业职业测评系统', pageWidth / 2, 295, { align: 'center' });
        }
    }

    // 下载PDF
    downloadPDF(doc, filename = '职业测评报告.pdf') {
        doc.save(filename);
    }
}

// 导出服务类
window.AIService = AIService;
window.PDFService = PDFService;
