import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { authOptions } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LOVE AI',
  description: 'Génération d réponses IA pour messages amoureux et bien plus',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="fr">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
