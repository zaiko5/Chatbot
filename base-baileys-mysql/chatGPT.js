const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function chat(promptBase, userInput) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: promptBase },
                { role: "user", content: userInput }
            ],
        });

        return response.choices[0].message;
    } catch (error) {
        console.error("Error al conectar con OpenAI:", error);
        return { content: "Lo siento, hubo un error al procesar tu consulta." };
    }
};