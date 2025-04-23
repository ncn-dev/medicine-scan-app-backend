let openai;

async function initializeOpenAI() {
    const { OpenAI } = await import('openai');
    openai = new OpenAI({
        apiKey: "",
    });
}

initializeOpenAI();

exports.chatbot = async (req, res) => {
    const { text } = req.body;
    if (!openai) {
        return res.status(500).json({ error: 'OpenAI client not initialized' });
    }
    const response = await openai.chat.completions.create({ 
        model: "gpt-3.5-turbo", 
        messages: [{
            role: 'user',
            content: String(text) + "ตอบมาแบบสั้นๆมากๆนะ",
            max_tokens: 50,
            
            
        }]
    })
    res.status(200).json({
        reply_message: response.choices[0].message.content
    })
    
}