import { OPENAI_API_KEY } from '$env/static/private';
import { Configuration, OpenAIApi } from 'openai-edge';
import { message } from 'sveltekit-superforms';

type ChatCompletion = {
  id: string;
  object: string;
  created: number;
  choices: [
    {
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }
  ];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

const isChatCompletion = (data: unknown): data is ChatCompletion =>
  typeof data === 'object' && !!(data as ChatCompletion).choices?.[0].message?.content;

export const createChatCompletion = async (name: string) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    }),
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'user',
          content: `who is nekomata okayu`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Could not ask OpenAI to greet ${name}!`);
  }

  const json = await response.json();

  if (!isChatCompletion(json)) {
    throw new Error(`Unexpected response from OpenAI when greeting ${name}!`);
  }

  return json.choices[0].message.content;
};
