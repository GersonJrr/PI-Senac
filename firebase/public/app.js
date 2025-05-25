
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    databaseURL: "https://SEU_PROJETO.firebaseio.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

let conversationContext = {
    currentEmotion: null,
    stage: 'initial', 
    lastTopic: null,
    userResponses: []
};

const emotionResponses = {
    feliz: {
        initial: [
            "Que maravilha! 😊 Estou muito feliz por você! Conta pra mim, o que aconteceu de bom?",
            "Que alegria contagiante! 🌟 O que está te deixando tão radiante hoje?",
            "Adoro quando alguém está feliz! ✨ Compartilha comigo essa felicidade - o que rolou?"
        ],
        advice: [
            "Que história incrível! 🎉 Momentos assim merecem ser celebrados. Já pensou em anotar em um diário da gratidão?",
            "Isso é fantástico! 🌈 Aproveite cada segundo dessa sensação boa. Que tal compartilhar essa alegria com alguém especial?",
            "Que experiência linda! 💫 Esses momentos felizes são combustível para os dias mais difíceis. Guarde bem essa lembrança!"
        ],
        follow_up: [
            "Como você está se sentindo agora depois de compartilhar isso? 😊",
            "Há algo mais que gostaria de celebrar ou compartilhar?",
            "O que mais tem te deixado feliz ultimamente?"
        ]
    },
    triste: {
        initial: [
            "Sinto muito que você esteja passando por isso... 😔 Quer me contar o que aconteceu?",
            "Percebo que você está sofrendo. 💙 Estou aqui para te ouvir. O que está te deixando triste?",
            "Todo mundo tem dias difíceis, e tudo bem sentir tristeza. 🤗 Pode me falar sobre o que está acontecendo?"
        ],
        advice: [
            "Entendo sua dor, e é completamente normal se sentir assim. 💙 Lembre-se: sentimentos difíceis são temporários. Você já passou por coisas difíceis antes e conseguiu superar.",
            "O que você está sentindo é válido e importante. 🫂 Às vezes, chorar e sentir a tristeza é necessário para processar. Você tem alguém próximo com quem pode conversar?",
            "Situações assim realmente doem. 💔 Mas você não está sozinho(a) nisso. Pequenos passos como uma caminhada, um banho quente ou conversar com alguém podem ajudar."
        ],
        follow_up: [
            "Como posso te apoiar melhor neste momento?",
            "Você tem feito algo para cuidar de si mesmo(a) durante esse período?",
            "Quer conversar mais sobre isso ou prefere falar de outra coisa?"
        ]
    },
    bravo: {
        initial: [
            "Vejo que você está com raiva... 😤 Respirar fundo pode ajudar. Quer me contar o que aconteceu?",
            "A raiva pode ser intensa, né? 🌪️ Estou aqui para te ouvir. O que te deixou tão bravo(a)?",
            "Percebo sua frustração. 😠 Às vezes precisamos desabafar. Conta pra mim o que rolou."
        ],
        advice: [
            "Entendo sua revolta com essa situação. 🔥 A raiva às vezes nos mostra que nossos limites foram ultrapassados. Que tal tentar algumas respirações profundas e pensar numa forma construtiva de lidar com isso?",
            "Realmente parece uma situação injusta! 😤 É natural sentir raiva. Já tentou escrever sobre isso ou fazer alguma atividade física para liberar essa energia?",
            "Sua indignação faz total sentido! 💢 Quando estamos bravos, às vezes ajuda conversar com alguém de confiança ou encontrar uma forma saudável de expressar esses sentimentos."
        ],
        follow_up: [
            "Você já conseguiu se acalmar um pouco?",
            "Como costuma lidar com a raiva normalmente?",
            "Existe algo prático que você pode fazer sobre essa situação?"
        ]
    },
    ansioso: {
        initial: [
            "A ansiedade pode ser muito difícil de lidar... 😰 Respira fundo comigo. Quer me contar o que está te preocupando?",
            "Percebo que você está ansioso(a). 🌊 Vamos focar no presente. O que está passando pela sua cabeça?",
            "Ansiedade pode ser avassaladora. 💭 Estou aqui contigo. Pode me falar sobre o que está te deixando preocupado(a)?"
        ],
        advice: [
            "Entendo essa preocupação. 🌿 Ansiedade sobre o futuro é muito comum. Que tal tentar a técnica 5-4-3-2-1? Identifique 5 coisas que você vê, 4 que pode tocar, 3 que escuta, 2 que cheira e 1 que pode saborear.",
            "Essa situação realmente pode gerar ansiedade. 🕊️ Lembre-se: você só pode controlar suas ações no presente. Respiração profunda e focar no 'agora' pode ajudar muito.",
            "É compreensível se sentir assim diante dessa situação. 🧘‍♀️ Já tentou exercícios de respiração ou meditação? Mesmo 5 minutos podem fazer diferença."
        ],
        follow_up: [
            "Como está sua respiração agora? Consegue sentir os pés no chão?",
            "Há algo específico que você pode fazer hoje para se sentir mais tranquilo(a)?",
            "Você tem alguma técnica que costuma usar para se acalmar?"
        ]
    },
    neutro: {
        initial: [
            "Entendo. Como posso te ajudar melhor? Quer me contar mais sobre o que está acontecendo?",
            "Obrigado por compartilhar isso comigo. Pode me falar mais detalhes sobre a situação?",
            "Estou aqui para te ouvir. O que mais você gostaria de compartilhar sobre isso?"
        ],
        advice: [
            "Entendo sua situação. É importante você ter alguém para conversar sobre essas coisas. Como você se sente depois de compartilhar isso?",
            "Obrigado por confiar em mim e me contar isso. Situações assim podem ser complexas. O que você acha que poderia te ajudar?",
            "Percebo que isso é importante para você. Ter espaço para falar sobre nossos sentimentos faz muita diferença. Como posso te apoiar?"
        ],
        follow_up: [
            "Como você está se sentindo agora?",
            "Há mais alguma coisa que gostaria de compartilhar?",
            "O que mais tem estado na sua mente ultimamente?"
        ]
    }
};

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const emotionBtns = document.querySelectorAll('.emotion-btn');

function loadChatHistory() {
    const history = JSON.parse(sessionStorage.getItem('chatHistory')) || [];
    history.forEach(msg => addMessageToChat(msg.text, msg.sender, msg.emotion));

    if (history.length > 0) {
        conversationContext = JSON.parse(sessionStorage.getItem('conversationContext')) || conversationContext;
    }
}

function saveToHistory(text, sender, emotion = null) {
    const history = JSON.parse(sessionStorage.getItem('chatHistory')) || [];
    history.push({
        text,
        sender,
        emotion,
        timestamp: Date.now()
    });
    sessionStorage.setItem('chatHistory', JSON.stringify(history));
    sessionStorage.setItem('conversationContext', JSON.stringify(conversationContext));
}

function addMessageToChat(text, sender, emotion = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`;

    const bubble = document.createElement('div');
    bubble.className = `max-w-xs px-4 py-3 rounded-2xl relative shadow-sm ${
        sender === 'user'
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white border border-gray-200 rounded-bl-none'
    }`;
    
    if (sender === 'bot' && emotion) {
        const emojiSpan = document.createElement('span');
        emojiSpan.textContent = {
            feliz: '😊',
            triste: '😔',
            bravo: '😠',
            ansioso: '😰'
        }[emotion] || '💭';
        emojiSpan.style.marginRight = '8px';
        emojiSpan.style.fontSize = '16px';
        bubble.appendChild(emojiSpan);
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    textSpan.style.lineHeight = '1.4';
    bubble.appendChild(textSpan);

    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    saveToHistory(text, sender, emotion);
}

function detectEmotion(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/\b(feliz|alegre|contente|radiante|animado|eufórico|empolgado|otimista|satisfeito)\b/)) return 'feliz';
    if (lowerText.match(/\b(triste|chateado|deprimido|melancólico|abatido|desanimado|desmotivado|decepcionado)\b/)) return 'triste';
    if (lowerText.match(/\b(bravo|raiva|irritado|nervoso|furioso|indignado|revoltado|estressado)\b/)) return 'bravo';
    if (lowerText.match(/\b(ansioso|preocupado|nervoso|tenso|apreensivo|inquieto|angustiado)\b/)) return 'ansioso';
    
    return 'neutro';
}

function generateBotResponse(emotion, userMessage = '') {
    const emotionData = emotionResponses[emotion] || emotionResponses.neutro;
    let responses;

    switch (conversationContext.stage) {
        case 'initial':
            responses = emotionData.initial;
            conversationContext.stage = 'asked_why';
            break;
        case 'asked_why':
            responses = emotionData.advice;
            conversationContext.stage = 'follow_up';
            conversationContext.userResponses.push(userMessage);
            break;
        case 'follow_up':
            responses = emotionData.follow_up;
            conversationContext.stage = 'giving_advice';
            break;
        default:
            responses = emotionData.advice;
            conversationContext.stage = 'follow_up';
    }

    return responses[Math.floor(Math.random() * responses.length)];
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex justify-start mb-3';
    typingDiv.id = 'typing-indicator';

    const bubble = document.createElement('div');
    bubble.className = 'max-w-xs px-4 py-3 rounded-2xl bg-gray-100 border border-gray-200 rounded-bl-none typing-animation';
    
    const dots = document.createElement('span');
    dots.textContent = '💭 Digitando...';
    dots.style.fontStyle = 'italic';
    dots.style.color = '#6b7280';
    bubble.appendChild(dots);
    typingDiv.appendChild(bubble);

    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) typingDiv.remove();
}

function disableInput(disabled) {
    userInput.disabled = disabled;
    sendBtn.disabled = disabled;
    emotionBtns.forEach(btn => btn.disabled = disabled);
    
    if (disabled) {
        userInput.classList.add('opacity-50');
        sendBtn.classList.add('opacity-50');
    } else {
        userInput.classList.remove('opacity-50');
        sendBtn.classList.remove('opacity-50');
    }
}

async function botReply(message, emotion) {
    disableInput(true);
    showTypingIndicator();

    const delay = 1200 + Math.random() * 800; 
    await new Promise(resolve => setTimeout(resolve, delay));

    removeTypingIndicator();
    addMessageToChat(message, 'bot', emotion);
    disableInput(false);
    
    setTimeout(() => userInput.focus(), 100);
}

function handleUserMessage(message, initialEmotion = null) {
    addMessageToChat(message, 'user');
    userInput.value = '';

    const detectedEmotion = initialEmotion || detectEmotion(message);
    
    if (conversationContext.stage === 'initial' || conversationContext.currentEmotion !== detectedEmotion) {
        conversationContext.currentEmotion = detectedEmotion;
        conversationContext.stage = 'initial';
    }

    const response = generateBotResponse(detectedEmotion, message);
    botReply(response, detectedEmotion);
}

sendBtn.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (!message) return;
    handleUserMessage(message);
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
    }
});

emotionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const emotion = btn.dataset.emotion;
        const text = `Estou me sentindo ${emotion}`;
        
        conversationContext = {
            currentEmotion: emotion,
            stage: 'initial',
            lastTopic: null,
            userResponses: []
        };
        
        handleUserMessage(text, emotion);
    });
});

window.addEventListener('load', () => {
    loadChatHistory();

    if (chatMessages.children.length === 0) {
        setTimeout(() => {
            addMessageToChat('Olá! 👋 Sou seu assistente emocional. Como você está se sentindo hoje? Pode me contar o que está acontecendo na sua vida.', 'bot');
        }, 1000);
    }
    
    setTimeout(() => userInput.focus(), 1500);
});