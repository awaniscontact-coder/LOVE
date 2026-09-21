export type StyleOption =
  | 'Naturel'
  | 'Romantique'
  | 'Flirt'
  | 'Drôle'
  | 'Séduisant'
  | 'Amical'
  | 'Professionnel'
  | 'Court'
  | 'Direct';

export const STYLE_OPTIONS: StyleOption[] = [
  'Naturel',
  'Romantique',
  'Flirt',
  'Drôle',
  'Séduisant',
  'Amical',
  'Professionnel',
  'Court',
  'Direct',
];

export const LENGTH_OPTIONS = ['Court', 'Standard', 'Long'];

export function getGenerationCost(message: string): number {
  const length = message.length;
  if (length <= 300) return 1;
  if (length <= 600) return 2;
  if (length <= 1000) return 3;
  if (length <= 2000) return 5;
  if (length <= 3000) return 8;
  return 8;
}

export function getDefaultSettings() {
  return {
    signupBonusCredits: 10,
    freeDailyGenLimit: 5,
    freeMaxMessageLength: 1000,
    maxRewardedAdsPerDay: 3,
    rewardAdCredits: 5,
    premiumMonthlyCredits: {
      starter: 500,
      pro: 1500,
    },
    pricing: {
      creditPacks: [
        { credits: 100, price: 1.99 },
        { credits: 500, price: 6.99 },
        { credits: 1500, price: 14.99 },
      ],
      premium: { monthly: 4.99, name: 'Premium' },
      premiumPlus: { monthly: 9.99, name: 'Premium+' },
    },
  };
}
