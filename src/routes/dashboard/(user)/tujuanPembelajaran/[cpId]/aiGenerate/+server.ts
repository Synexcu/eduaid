import type { RequestHandler } from './$types';
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge';
import { OPENAI_API_KEY } from '$env/static/private';

const config = new Configuration({
    apiKey : OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export const POST: RequestHandler = async ( {request} ) => {

    let { messages } = await request.json(); 

    let prompt = [
        {
            role: 'system',
            content: "Anda adalah Edu Ai, asisten ai yang membantu pengguna dalam membuat 'Tujuan Pembelajaran' berdasarkan 'Capaian Pembelajaran' yang mereka berikan. Hanya Berikan jawaban dalam list dan maksimal 5 tujuan pembelajaran",
        },
    ]

    messages = [...prompt, ...messages];

    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo-0125',
        stream: true,
        messages,
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
};