let openai;

async function initializeOpenAI() {
    const { OpenAI } = await import('openai');
    openai = new OpenAI({
        apiKey: "",
    });
}

initializeOpenAI();

exports.chatbot = async (req, res) => {
    const { text, history = [] } = req.body;
    
    if (!openai) {
        return res.status(500).json({ error: 'OpenAI client not initialized' });
    }
    const messages = [
        ...history,
        { role: "user", content: `${text} ตอบมาแบบสั้นๆ` },
    ];

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 100, // ย้ายมาอยู่นอก object message
        });

        res.status(200).json({
            reply_message: response.choices[0].message.content,
        });
    } catch (err) {
        console.error("OpenAI error:", err);
        res.status(500).json({ error: "Error generating response" });
    }
};
    
