import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateAiReply({
  message,
  style,
  length,
}: {
  message: string;
  style: string;
  length: string;
}) {
  const fallback = [
    'Toi aussi tu me manques ❤️',
    'Je pensais justement à toi…',
    'Alors viens me voir au lieu de simplement me le dire 😏',
  ];

  if (!process.env.ANTHROPIC_API_KEY) {
    return fallback;
  }

  const prompt = `Tu es un assistant qui aide à rédiger des réponses à des messages amoureux/textes. 
  - Contexte du message: "${message}"
  - Style: ${style}
  - Longueur: ${length}
  - Donne exactement 3 propositions de réponse, sans devoir de liste numérotée. Une seule réponse par ligne. Reviens sur le message original, reste naturel, émotionnel et sans vulgarité. 
  - Réponds uniquement avec les réponses, sans introduction ni commentaires.`;

  try {
    const res = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = res.content
      .map((part) => ('text' in part ? part.text : ''))
      .join('\n')
      .trim();

    if (!text) return fallback;

    return text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 3);
  } catch {
    return fallback;
  }
}
