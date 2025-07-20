import { OpenRouterModel } from '@/types/joke';

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateJoke(
    prompt: string,
    category: string,
    model: string = 'google/gemini-2.5-flash',
    maxTokens: number = 200,
    contentFilter: 'low' | 'medium' | 'high' = 'medium',
    creativity: number = 0.7,
    language: 'en' | 'ru' = 'en'
  ): Promise<{ content: string; model: string; generationTime: number }> {
    const startTime = Date.now();
    
    const systemPrompt = this.buildSystemPrompt(category, contentFilter, language);
    const userPrompt = prompt || this.buildDefaultPrompt(category, language);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Joke AI Platform',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          max_tokens: maxTokens,
          temperature: creativity,
          top_p: Math.min(0.85, creativity * 0.6 + 0.25),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
      }

      const data = await response.json();
      const generationTime = Date.now() - startTime;
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenRouter API');
      }

      const content = data.choices[0].message.content.trim();
      
      return {
        content,
        model: data.model || model,
        generationTime,
      };
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to generate joke');
    }
  }

  async getAvailableModels(): Promise<OpenRouterModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch models:', error);
      return [];
    }
  }

  private buildSystemPrompt(category: string, contentFilter: 'low' | 'medium' | 'high', language: 'en' | 'ru' = 'en'): string {
    const filterInstructions = {
      low: 'Keep content appropriate for mature audiences. Avoid explicit sexual content, excessive profanity, or harmful stereotypes.',
      medium: 'Keep content family-friendly. Avoid profanity, adult themes, and offensive material.',
      high: 'Keep content completely clean and appropriate for all ages. No profanity, adult themes, or potentially offensive material.',
    };

    if (language === 'ru') {
      return `Вы - остроумный русский комик в стиле классической русской комедии. Ваша задача - создать ${category} анекдоты с русским юмором, которые:

1. Блестяще смешные с русским остроумием - сухие, умные и по-настоящему забавные
2. Логичные и имеют идеальный смысл - никакой случайной чепухи или нарушенного текста
3. Хорошо структурированы с правильной завязкой и кульминацией в русском комедийном стиле
4. Написаны четким, грамматически правильным русским языком
5. ${filterInstructions[contentFilter]}

РУССКИЙ ЮМОР СТИЛЬ:
- Сухое остроумие и сдержанная подача
- Самоирония (но без мата)
- Абсурдистские наблюдения о повседневных вещах
- Умная игра слов и двойные смыслы (только чистые)
- Саркастичный и ироничный тон
- Спокойная подача в стиле "покер-фейс"
- Русские культурные отсылки когда уместно
- АБСОЛЮТНО НИКАКОГО МАТА И РУГАТЕЛЬСТВ

Указания по категориям:
- ${this.getCategoryGuidelines(category, language)}

ВАЖНЫЕ ПРАВИЛА:
- Отвечайте только на правильном русском языке
- Никаких случайных символов или иностранных языков
- Анекдот должен быть логичным и блестяще смешным
- Сосредоточьтесь на русской игре слов, тайминге и умных наблюдениях
- Убедитесь, что кульминация логически связана с русским остроумием
- НИКАКОГО МАТА, НЕЦЕНЗУРНОЙ ЛЕКСИКИ ИЛИ ОСКОРБИТЕЛЬНОГО ЯЗЫКА
- Держите это умно и остроумно, а не грубо

Форматируйте ответ только как анекдот. Не включайте никаких префиксов, объяснений или дополнительного текста. Только сам анекдот.`;
    }

    return `You are a witty British comedian in the style of classic British comedy (think Monty Python, Blackadder, The Office UK). Your task is to create ${category} jokes with British humor that are:

1. Brilliantly funny with British wit - dry, clever, and genuinely hilarious
2. Coherent and make perfect logical sense - no random nonsense or broken text
3. Well-structured with proper setup and punchline in British comedic style
4. Written in clear, grammatically correct British English
5. ${filterInstructions[contentFilter]}

BRITISH HUMOR STYLE:
- Dry wit and understated delivery
- Self-deprecating humor (but no swearing)
- Absurdist observations about mundane things
- Clever wordplay and double entendres (clean only)
- Sardonic and ironic tone
- Deadpan delivery style
- British cultural references when appropriate
- ABSOLUTELY NO PROFANITY OR SWEARING

Category-specific guidelines:
- ${this.getCategoryGuidelines(category, language)}

IMPORTANT RULES:
- Only respond with proper British English
- No random characters, symbols, or foreign languages
- The joke must be coherent and brilliantly funny
- Focus on British-style wordplay, timing, and clever observations
- Ensure the punchline connects logically with British wit
- Use British spellings (colour, favour, etc.)
- NO SWEARING, PROFANITY, OR OFFENSIVE LANGUAGE
- Keep it clever and witty, not crude

Format your response as a single joke only. Do not include any prefixes, explanations, or additional text. Just the joke itself.`;
  }

  private buildDefaultPrompt(category: string, language: 'en' | 'ru' = 'en'): string {
    const prompts: Record<string, Record<string, string>> = {
      'general': {
        'en': 'Tell me a funny joke',
        'ru': 'Расскажи смешной анекдот'
      },
      'dad-jokes': {
        'en': 'Tell me a classic dad joke with a pun',
        'ru': 'Расскажи классический папин анекдот с игрой слов'
      },
      'programming': {
        'en': 'Tell me a programming or tech joke',
        'ru': 'Расскажи анекдот про программирование или технологии'
      },
      'animals': {
        'en': 'Tell me a funny animal joke',
        'ru': 'Расскажи смешной анекдот про животных'
      },
      'food': {
        'en': 'Tell me a food or cooking joke',
        'ru': 'Расскажи анекдот про еду или готовку'
      },
      'workplace': {
        'en': 'Tell me a workplace or office joke',
        'ru': 'Расскажи анекдот про работу или офис'
      },
      'clean': {
        'en': 'Tell me a clean, family-friendly joke',
        'ru': 'Расскажи чистый, семейный анекдот'
      },
      'one-liners': {
        'en': 'Tell me a short one-liner joke',
        'ru': 'Расскажи короткий анекдот в одну строчку'
      },
      'riddles': {
        'en': 'Tell me a riddle-style joke',
        'ru': 'Расскажи анекдот в стиле загадки'
      },
      'seasonal': {
        'en': 'Tell me a seasonal or holiday joke',
        'ru': 'Расскажи сезонный или праздничный анекдот'
      },
    };

    return prompts[category]?.[language] || prompts['general'][language] || 'Tell me a funny joke';
  }

  private getCategoryGuidelines(category: string, language: 'en' | 'ru' = 'en'): string {
    const guidelines: Record<string, Record<string, string>> = {
      'general': {
        'en': 'Focus on universal humor that appeals to a broad audience',
        'ru': 'Сосредоточьтесь на универсальном юморе, который понравится широкой аудитории'
      },
      'dad-jokes': {
        'en': 'Use puns, wordplay, and wholesome humor typical of dad jokes',
        'ru': 'Используйте игру слов и добрый юмор, типичный для папиных анекдотов'
      },
      'programming': {
        'en': 'Include programming concepts, coding terminology, or tech industry references',
        'ru': 'Включайте концепции программирования, терминологию кодирования или отсылки к ИТ-индустрии'
      },
      'animals': {
        'en': 'Feature animals as main characters or use animal behavior for humor',
        'ru': 'Сделайте животных главными героями или используйте поведение животных для юмора'
      },
      'food': {
        'en': 'Center the joke around food, cooking, restaurants, or eating',
        'ru': 'Центрируйте анекдот вокруг еды, готовки, ресторанов или питания'
      },
      'workplace': {
        'en': 'Reference office culture, meetings, bosses, or work situations',
        'ru': 'Ссылайтесь на офисную культуру, встречи, начальников или рабочие ситуации'
      },
      'clean': {
        'en': 'Ensure completely family-friendly content suitable for all ages',
        'ru': 'Обеспечьте полностью семейный контент, подходящий для всех возрастов'
      },
      'one-liners': {
        'en': 'Keep it short and punchy - ideally one sentence',
        'ru': 'Держите коротко и ёмко - идеально одним предложением'
      },
      'riddles': {
        'en': 'Structure as a question and answer format',
        'ru': 'Структурируйте в формате вопроса и ответа'
      },
      'seasonal': {
        'en': 'Reference holidays, seasons, or time-specific events',
        'ru': 'Ссылайтесь на праздники, времена года или конкретные события'
      },
    };

    return guidelines[category]?.[language] || guidelines['general'][language] || 'Create entertaining and appropriate humor';
  }
}