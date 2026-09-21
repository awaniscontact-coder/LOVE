import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(80).optional(),
  referralCode: z.string().optional(),
});

export const generationSchema = z.object({
  message: z.string().min(10).max(3000),
  style: z.string().min(1),
  length: z.string().min(1),
});

export const rewardedAdSchema = z.object({
  provider: z.string().min(2),
  verificationId: z.string().min(6),
  rewardAmount: z.number().int().min(1).max(50).optional(),
});
