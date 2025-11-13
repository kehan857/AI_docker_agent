// 全局状态
let flowState = {
    userId: '',
    isNewUser: false,
    isMember: false,
    currentNode: '',
    currentPath: '', // 'new_user' or 'old_user'
    waitingForReply: false,
    timeoutTimer: null,
    hasAnswered: false
};

// 初始化
function init() {
    // 页面加载完成后的初始化
}

// 开始流程
function startFlow() {
    // 获取用户配置
    flowState.userId = document.getElementById('userId').value || 'user_001';
    flowState.isNewUser = document.getElementById('userType').value === 'new';
    flowState.isMember = document.getElementById('isMember').value === 'true';
    
    // 隐藏配置面板，显示聊天面板
    document.getElementById('configPanel').style.display = 'none';
    document.getElementById('chatPanel').style.display = 'flex';
    
    // 清空消息（保留欢迎消息）
    const messagesDiv = document.getElementById('messages');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const suggestedQuestions = document.getElementById('suggestedQuestions');
    
    // 移除所有消息，但保留欢迎区域
    Array.from(messagesDiv.children).forEach(child => {
        if (child !== welcomeMessage && child !== suggestedQuestions && !child.classList.contains('message')) {
            // 保留欢迎消息和建议问题
        } else if (child.classList.contains('message')) {
            child.remove();
        }
    });
    
    // 显示欢迎消息和建议问题
    if (welcomeMessage) welcomeMessage.style.display = 'flex';
    if (suggestedQuestions) suggestedQuestions.style.display = 'block';
    
    // 开始流程
    if (flowState.isNewUser) {
        startNewUserFlow();
    } else {
        startOldUserFlow();
    }
}

// 新用户流程
async function startNewUserFlow() {
    flowState.currentPath = 'new_user';
    flowState.currentNode = 'greeting';
    updateStatusPanel();
    
    // 显示输入框
    showInputArea();
    
    // 隐藏欢迎消息，显示新的打招呼
    const welcomeSection = document.getElementById('welcomeMessage');
    if (welcomeSection) {
        welcomeSection.style.display = 'none';
    }
    
    // 1. 打招呼
    await showMessage('ai', '您好！欢迎使用AI医生智能体服务！我是您的专属健康顾问，很高兴为您服务。');
    await delay(1200);
    
    // 2. 介绍30天权益
    await showBenefitsMessage();
    await delay(1500);
    
    // 3. 触发后端接口（后台处理，不显示）
    await triggerBackendAPI('send_benefits_link');
    
    // 4. 提示用户可以开始对话
    await showMessage('ai', '您可以随时告诉我您想了解的服务或问题，我会为您详细介绍。');
    
    // 5. 等待15秒，如果没回复则介绍所有功能
    startTimeout(15);
}

// 老用户流程
async function startOldUserFlow() {
    flowState.currentPath = 'old_user';
    flowState.currentNode = 'introduce';
    updateStatusPanel();
    
    // 显示输入框
    showInputArea();
    
    // 隐藏欢迎消息
    const welcomeSection = document.getElementById('welcomeMessage');
    if (welcomeSection) {
        welcomeSection.style.display = 'none';
    }
    
    // 1. 介绍AI医生功能
    await showMessage('ai', '欢迎回来！我是您的AI医生助手，可以为您提供以下服务：');
    await delay(1200);
    
    await showAIDoctorFeatures();
    await delay(1000);
}

// 显示权益消息
async function showBenefitsMessage() {
    const benefitsHTML = `
        <div class="benefits-card">
            <h4>🎁 免费30天AI医生权益</h4>
            <p style="margin-bottom: 15px;">恭喜您获得免费30天AI医生服务体验！</p>
            <ul class="benefits-list">
                <li>✓ 健康咨询</li>
                <li>✓ 症状初步分析</li>
                <li>✓ 养生建议</li>
                <li>✓ 科技养生无烟艾灸（需联系酒店前台）</li>
                <li>✓ 其他基础健康服务</li>
            </ul>
            <a href="#" class="card-link" style="color: #fff; margin-top: 15px; display: inline-block;">点击查看权益详情 →</a>
        </div>
    `;
    await showMessage('ai', benefitsHTML, true);
}

// 显示服务选项（已废弃，改为系统自动识别）

// 显示AI医生功能（统一列出所有功能，不区分免费/付费）
async function showAIDoctorFeatures() {
    const featuresHTML = `
        <div class="message-card">
            <h4>AI医生完整版功能</h4>
            <div class="service-options" style="margin-top: 10px;">
                <div class="service-option" onclick="selectFeature('health_consultation')">
                    <div class="service-option-title">健康咨询</div>
                    <div class="service-option-desc">专业的健康咨询服务</div>
                </div>
                <div class="service-option" onclick="selectFeature('symptom_analysis')">
                    <div class="service-option-title">症状分析</div>
                    <div class="service-option-desc">智能症状分析和建议</div>
                </div>
                <div class="service-option" onclick="selectFeature('wellness_advice')">
                    <div class="service-option-title">养生建议</div>
                    <div class="service-option-desc">个性化养生方案推荐</div>
                </div>
                <div class="service-option" onclick="selectFeature('moxibustion')">
                    <div class="service-option-title">科技养生无烟艾灸</div>
                    <div class="service-option-desc">需联系酒店前台预约</div>
                </div>
                <div class="service-option" onclick="selectFeature('deep_checkup')">
                    <div class="service-option-title">深度体检</div>
                    <div class="service-option-desc">全面的健康体检服务</div>
                </div>
                <div class="service-option" onclick="selectFeature('expert_consultation')">
                    <div class="service-option-title">专家会诊</div>
                    <div class="service-option-desc">专业医生会诊服务</div>
                </div>
                <div class="service-option" onclick="selectFeature('personalized_health')">
                    <div class="service-option-title">个性化健康方案</div>
                    <div class="service-option-desc">定制专属健康方案</div>
                </div>
            </div>
            <p style="margin-top: 10px; font-size: 11px; color: #666;">请选择您感兴趣的功能，系统会自动为您判断服务类型并提供相应入口。</p>
        </div>
    `;
    await showMessage('ai', featuresHTML, true);
}

// 选择功能（系统自动判断免费/付费）
async function selectFeature(serviceType) {
    flowState.hasAnswered = true;
    clearTimeout(flowState.timeoutTimer);
    
    const serviceNames = {
        'health_consultation': '健康咨询',
        'symptom_analysis': '症状分析',
        'wellness_advice': '养生建议',
        'moxibustion': '科技养生无烟艾灸',
        'deep_checkup': '深度体检',
        'expert_consultation': '专家会诊',
        'personalized_health': '个性化健康方案'
    };
    
    await showMessage('user', serviceNames[serviceType] || '未知功能');
    showWaiting();
    
    // 系统自动识别功能类型
    await delay(1500);
    flowState.currentNode = 'intent_recognition';
    updateStatusPanel();
    
    hideWaiting();
    
    // 查询知识库判断功能类型（系统自动判断）
    const functionInfo = await queryKnowledgeBaseForFunction(serviceType);
    
    // 根据系统判断的结果走相应流程
    if (functionInfo.type === 'free' || functionInfo.type === 'front_desk') {
        // 免费功能或前台服务 - 直接告知入口
        await showMessage('ai', `好的，${functionInfo.name}是免费功能，您可以直接使用。`);
        await delay(800);
        await showMessage('ai', `请点击以下链接进入：\n${functionInfo.entryUrl}`, false, true);
        await notifyTeam('function_selected', `用户选择免费功能：${functionInfo.name}`);
        showInputArea();
    } else {
        // 付费功能 - 判断会员
        if (flowState.isMember) {
            // 是会员 - 介绍功能入口
            await showMessage('ai', `太好了！您是我们的会员用户，可以享受${functionInfo.name}服务！`);
            await delay(800);
            await showMessage('ai', `请点击以下链接进入：\n${functionInfo.entryUrl}`, false, true);
            await notifyTeam('function_selected', `会员用户选择功能：${functionInfo.name}`);
            showInputArea();
        } else {
            // 非会员 - 推送权益链接
            await showMemberBenefits(functionInfo);
        }
    }
}

// 选择服务（已废弃，改为通过用户输入自动识别）

// 处理服务选择（已废弃，改为通过handleUserInput统一处理）

// 显示会员权益
async function showMemberBenefits(functionInfo) {
    flowState.currentNode = 'member_promotion';
    updateStatusPanel();
    
    // 确保输入框可见
    hideWaiting();
    showInputArea();
    
    // HTTP告知后台推送权益链接（后台处理，不显示）
    await triggerBackendAPI('push_member_benefits', {
        user_id: flowState.userId,
        function_name: functionInfo.name
    });
    
    await delay(800);
    
    const benefitsHTML = `
        <div class="benefits-card">
            <h4>💎 百岁会员权益</h4>
            <p style="margin-bottom: 15px;">${functionInfo.name}是会员专享功能，升级为百岁会员即可享受！</p>
            <ul class="benefits-list">
                <li>✓ 无限次AI医生咨询</li>
                <li>✓ 深度体检服务</li>
                <li>✓ 专家会诊服务</li>
                <li>✓ 个性化健康方案定制</li>
                <li>✓ 优先预约权</li>
                <li>✓ 专属健康顾问</li>
                <li>✓ 会员专享折扣</li>
            </ul>
            <p style="margin-top: 15px; font-size: 16px; font-weight: 500;">会员价格：XXX元/年</p>
            <a href="#" class="card-link" style="color: #fff; margin-top: 15px; display: inline-block; text-decoration: none;">立即购买会员 →</a>
        </div>
    `;
    await showMessage('ai', benefitsHTML, true);
    
    await delay(500);
    
    // 显示快速回复
    showQuickReplies(['我想购买', '暂时不需要', '了解更多']);
    
    // 确保输入框在显示快速回复后仍然可见（延迟一点确保DOM更新完成）
    setTimeout(() => {
        showInputArea();
    }, 100);
}

// 处理用户输入 - 系统自动识别功能类型
async function handleUserInput(input) {
    if (!input.trim()) return;
    
    // 标记已回复，清除超时
    flowState.hasAnswered = true;
    clearTimeout(flowState.timeoutTimer);
    
    // 隐藏建议问题
    const suggestedSection = document.getElementById('suggestedQuestions');
    if (suggestedSection) {
        suggestedSection.style.display = 'none';
    }
    
    await showMessage('user', input);
    showWaiting();
    
    // 系统自动识别用户意图
    await delay(1500);
    flowState.currentNode = 'intent_recognition';
    updateStatusPanel();
    
    hideWaiting();
    
    // 判断用户意图
    if (input.includes('购买') || input.includes('买') || input.includes('开通') || input.includes('想买')) {
        // 用户想购买
        await showMessage('ai', '好的，我来为您查询购买路径。');
        await delay(1000);
        const purchasePath = await queryKnowledgeBase('购买路径');
        await showMessage('ai', purchasePath);
        await notifyTeam('purchase_intent', '用户有购买意向');
    } else {
        // 系统自动识别功能类型
        const detectedService = detectServiceFromInput(input);
        
        if (detectedService) {
            // 识别到具体功能
            const functionInfo = await queryKnowledgeBaseForFunction(detectedService);
            
            // 系统自动判断是免费还是付费
            if (functionInfo.type === 'free') {
                // 免费功能 - 直接告知入口
                await showMessage('ai', `好的，${functionInfo.name}是免费功能，您可以直接使用。`);
                await delay(800);
                await showMessage('ai', `请点击以下链接进入：\n${functionInfo.entryUrl}`, false, true);
                await notifyTeam('function_selected', `用户选择免费功能：${functionInfo.name}`);
            } else {
                // 付费功能 - 判断会员
                if (flowState.isMember) {
                    await showMessage('ai', `太好了！您是我们的会员用户，可以享受${functionInfo.name}服务！`);
                    await delay(800);
                    await showMessage('ai', `请点击以下链接进入：\n${functionInfo.entryUrl}`, false, true);
                    await notifyTeam('function_selected', `会员用户选择功能：${functionInfo.name}`);
                } else {
                    // 非会员 - 推送权益
                    await showMemberBenefits(functionInfo);
                }
            }
        } else {
            // 未识别到具体功能 - 调用知识库回答
            const response = await queryKnowledgeBase(input);
            await showMessage('ai', response);
            await notifyTeam('question_answered', `用户问题：${input}`);
        }
    }
    
    showInputArea();
}

// 从用户输入中自动识别服务类型
function detectServiceFromInput(input) {
    const lowerInput = input.toLowerCase();
    
    // 所有功能识别（不区分免费/付费，系统会自动判断）
    if (lowerInput.includes('健康咨询') || (lowerInput.includes('咨询') && lowerInput.includes('健康'))) {
        return 'health_consultation';
    }
    if (lowerInput.includes('症状分析') || (lowerInput.includes('症状') && lowerInput.includes('分析'))) {
        return 'symptom_analysis';
    }
    if (lowerInput.includes('养生建议') || (lowerInput.includes('养生') && lowerInput.includes('建议'))) {
        return 'wellness_advice';
    }
    if (lowerInput.includes('艾灸') || lowerInput.includes('无烟艾灸')) {
        return 'moxibustion';
    }
    if (lowerInput.includes('深度体检') || (lowerInput.includes('体检') && lowerInput.includes('深度'))) {
        return 'deep_checkup';
    }
    if (lowerInput.includes('专家会诊') || (lowerInput.includes('会诊') && lowerInput.includes('专家'))) {
        return 'expert_consultation';
    }
    if (lowerInput.includes('个性化健康') || lowerInput.includes('健康方案') || lowerInput.includes('个性化方案')) {
        return 'personalized_health';
    }
    
    // 模糊匹配
    if (lowerInput.includes('体检') && !lowerInput.includes('免费')) {
        return 'deep_checkup';
    }
    if (lowerInput.includes('会诊') && !lowerInput.includes('免费')) {
        return 'expert_consultation';
    }
    
    return null; // 未识别到具体功能
}

// 发送消息
function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (message) {
        handleUserInput(message);
        input.value = '';
    }
}

// 处理键盘事件
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// 显示消息
function showMessage(type, content, isHTML = false, isLink = false) {
    return new Promise((resolve) => {
        const messagesDiv = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        if (isHTML) {
            bubble.innerHTML = content;
        } else if (isLink) {
            // 如果是链接，添加可点击样式
            const linkDiv = document.createElement('div');
            linkDiv.style.marginTop = '8px';
            linkDiv.style.padding = '10px';
            linkDiv.style.background = '#f0f7ff';
            linkDiv.style.borderRadius = '6px';
            linkDiv.style.border = '1px solid #07c160';
            const link = document.createElement('a');
            link.href = content.split('\n')[1] || '#';
            link.textContent = content.split('\n')[1] || content;
            link.style.color = '#07c160';
            link.style.textDecoration = 'none';
            link.style.wordBreak = 'break-all';
            link.target = '_blank';
            linkDiv.appendChild(link);
            bubble.textContent = content.split('\n')[0];
            bubble.appendChild(linkDiv);
        } else {
            bubble.textContent = content;
        }
        
        messageDiv.appendChild(bubble);
        messagesDiv.appendChild(messageDiv);
        
        // 滚动到底部
        setTimeout(() => {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 100);
        
        setTimeout(resolve, 300);
    });
}

// 显示快速回复
function showQuickReplies(replies) {
    let quickRepliesDiv = document.getElementById('quickReplies');
    
    // 如果元素不存在，创建一个
    if (!quickRepliesDiv) {
        quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.id = 'quickReplies';
        quickRepliesDiv.className = 'quick-replies';
        const inputArea = document.getElementById('inputArea');
        if (inputArea && inputArea.parentNode) {
            inputArea.parentNode.insertBefore(quickRepliesDiv, inputArea);
        }
    }
    
    quickRepliesDiv.innerHTML = '';
    
    replies.forEach(reply => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply-btn';
        btn.textContent = reply;
        btn.onclick = () => {
            handleUserInput(reply);
            quickRepliesDiv.innerHTML = '';
        };
        quickRepliesDiv.appendChild(btn);
    });
}

// 显示输入区域
function showInputArea() {
    const inputArea = document.getElementById('inputArea');
    const waiting = document.getElementById('waiting');
    if (inputArea) inputArea.style.display = 'block';
    if (waiting) waiting.style.display = 'none';
}

// 隐藏输入区域
function hideInputArea() {
    const inputArea = document.getElementById('inputArea');
    if (inputArea) inputArea.style.display = 'none';
}

// 显示等待状态（不隐藏输入框）
function showWaiting() {
    const waiting = document.getElementById('waiting');
    if (waiting) waiting.style.display = 'block';
    // 不再隐藏输入框，让用户可以继续输入
}

// 隐藏等待状态
function hideWaiting() {
    const waiting = document.getElementById('waiting');
    if (waiting) waiting.style.display = 'none';
}

// 开始超时
function startTimeout(seconds) {
    flowState.waitingForReply = true;
    flowState.hasAnswered = false;
    
    flowState.timeoutTimer = setTimeout(async () => {
        if (!flowState.hasAnswered) {
            // 15秒内未回答 - 介绍完整版功能
            flowState.currentNode = 'introduce_full_features';
            updateStatusPanel();
            
            await delay(500);
            await showMessage('ai', '让我为您介绍一下AI医生的完整功能：');
            await delay(800);
            await showAIDoctorFeatures();
            showInputArea();
        }
    }, seconds * 1000);
}

// 查询知识库（模拟）
async function queryKnowledgeBase(query) {
    // 模拟知识库查询
    await delay(1000);
    
    const knowledgeBase = {
        '其他服务': '我们提供多种健康服务，包括健康咨询、症状分析、养生建议等。您想了解哪个方面呢？',
        '购买路径': '您可以通过以下方式购买百岁会员：\n1. 点击上方权益卡片中的"立即购买会员"链接\n2. 联系客服：400-XXX-XXXX\n3. 在APP中进入"我的-会员中心"进行购买',
        '默认': '感谢您的咨询！我是AI医生助手，可以为您提供健康咨询、症状分析、养生建议等服务。请告诉我您想了解什么？'
    };
    
    return knowledgeBase[query] || knowledgeBase['默认'];
}

// 查询知识库判断功能类型（模拟）- 系统自动识别
async function queryKnowledgeBaseForFunction(serviceType) {
    await delay(800);
    
    const functionMap = {
        'health_consultation': {
            name: '健康咨询',
            type: 'free',
            entryUrl: 'https://example.com/health-consultation?user_id=' + flowState.userId
        },
        'symptom_analysis': {
            name: '症状分析',
            type: 'free',
            entryUrl: 'https://example.com/symptom-analysis?user_id=' + flowState.userId
        },
        'wellness_advice': {
            name: '养生建议',
            type: 'free',
            entryUrl: 'https://example.com/wellness-advice?user_id=' + flowState.userId
        },
        'moxibustion': {
            name: '科技养生无烟艾灸',
            type: 'front_desk',
            entryUrl: 'https://example.com/moxibustion?user_id=' + flowState.userId
        },
        'deep_checkup': {
            name: '深度体检',
            type: 'paid',
            entryUrl: 'https://example.com/deep-checkup?user_id=' + flowState.userId
        },
        'expert_consultation': {
            name: '专家会诊',
            type: 'paid',
            entryUrl: 'https://example.com/expert-consultation?user_id=' + flowState.userId
        },
        'personalized_health': {
            name: '个性化健康方案',
            type: 'paid',
            entryUrl: 'https://example.com/personalized-health?user_id=' + flowState.userId
        }
    };
    
    return functionMap[serviceType] || {
        name: '未知服务',
        type: 'free',
        entryUrl: 'https://example.com/services?user_id=' + flowState.userId
    };
}

// 触发后端接口（模拟）- 不显示给用户
async function triggerBackendAPI(action, data = {}) {
    // 不显示系统消息，只在控制台记录
    console.log('HTTP Request:', {
        action: action,
        data: data,
        timestamp: new Date().toISOString()
    });
    await delay(300); // 模拟接口调用时间
}

// 通知团队（模拟）- 不显示给用户
async function notifyTeam(actionType, message) {
    const notification = {
        user_id: flowState.userId,
        action_type: actionType,
        timestamp: new Date().toISOString(),
        message: message
    };
    
    // 只在控制台记录，不显示给用户
    console.log('通知承接团队:', notification);
    await delay(200); // 模拟通知时间
}

// 更新状态面板（已隐藏，仅用于调试）
function updateStatusPanel() {
    // 状态面板已隐藏，用户不需要看到
    // 仅在控制台记录
    console.log('流程状态:', {
        currentNode: flowState.currentNode,
        userType: flowState.isNewUser ? '新用户' : '老用户',
        memberStatus: flowState.isMember ? '会员' : '非会员'
    });
}

// 延迟函数
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 返回按钮
function goBack() {
    if (confirm('确定要返回吗？')) {
        document.getElementById('configPanel').style.display = 'block';
        document.getElementById('chatPanel').style.display = 'none';
        document.getElementById('messages').innerHTML = '';
        flowState.hasAnswered = false;
        clearTimeout(flowState.timeoutTimer);
    }
}

// 处理建议问题点击
function handleSuggestedQuestion(question) {
    handleUserInput(question);
    // 隐藏建议问题
    const suggestedSection = document.getElementById('suggestedQuestions');
    if (suggestedSection) {
        suggestedSection.style.display = 'none';
    }
}

// 处理底部快捷按钮
function handleAction(actionType) {
    const actions = {
        'health_manager': '健康管家',
        'online_service': '在线客服',
        'phone_service': '电话客服'
    };
    
    const message = `我想了解${actions[actionType]}的相关信息`;
    handleUserInput(message);
}

// 显示更多功能
function showMoreFunctions() {
    alert('更多功能开发中...');
}

// 语音输入
function startVoiceInput() {
    alert('语音输入功能开发中...');
}

// 页面加载完成后初始化
window.addEventListener('load', init);

