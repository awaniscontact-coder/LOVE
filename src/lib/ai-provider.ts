export type ReplyRequest = {
  message: string;
  style: string;
  length: string;
};

const clean = (value: string) => value.replace(/\s+/g, ' ').trim();

/**
 * Internal reply provider. It runs on the server and does not require a third-party
 * AI key. Replace this implementation later with a self-hosted model without
 * changing the API route or credit logic.
 */
export async function generateAiReply({ message, style, length }: ReplyRequest): Promise<string[]> {
  const source = clean(message);
  const short = length === 'Court' || style === 'Court';
  const direct = style === 'Direct';
  const romantic = ['Romantique', 'Séduisant'].includes(style);
  const playful = ['Flirt', 'Drôle'].includes(style);
  const professional = style === 'Professionnel';
  const subject = source.length > 80 ? `${source.slice(0, 77)}…` : source;

  if (professional) {
    return [
      `Merci pour ton message. Je reviens vers toi rapidement.`,
      `Bien reçu, merci pour ces précisions.`,
      `Merci, je prends note et je te réponds dès que possible.`,
    ];
  }

  if (romantic) {
    return [
      short ? 'Toi aussi tu me manques ❤️' : `Toi aussi tu me manques beaucoup ❤️ ${subject ? 'Je pensais justement à toi.' : ''}`,
      'Ton message me fait vraiment sourire… J’aimerais être près de toi.',
      direct ? 'Alors viens me voir, tu me manques 😏' : 'On se retrouve bientôt ? J’ai envie de passer du temps avec toi.',
    ];
  }

  if (playful) {
    return [
      'Tu dis ça parce que tu veux me revoir, avoue 😏',
      'C’est mignon… mais un message ne remplacera pas un vrai rendez-vous 😉',
      'Défi accepté. Quand est-ce qu’on se voit ?',
    ];
  }

  return [
    short ? 'Oui, carrément 😊' : 'Merci pour ton message, ça me fait plaisir 😊',
    direct ? 'Avec plaisir. On fait ça quand ?' : 'Je serais content(e) d’en parler avec toi.',
    'Je te réponds avec plaisir, raconte-moi un peu plus.',
  ];
}
