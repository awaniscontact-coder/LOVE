'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { STYLE_OPTIONS, LENGTH_OPTIONS, getGenerationCost } from '@/lib/pricing';

const initialMessage = 'Elle m\'a dit : Tu me manques beaucoup ❤️';

export default function GeneratorPage() {
  const { data: session } = useSession();
  const [message, setMessage] = useState(initialMessage);
  const [style, setStyle] = useState('Romantique');
  const [length, setLength] = useState('Standard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<string[]>([]);

  const credits = getGenerationCost(message);

  async function handleGenerate() {
    if (!session) {
      setError('Veuillez vous connecter pour générer une réponse.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, style, length }),
      });

      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload.error || 'Erreur de génération');
      }

      setResult(payload.responses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-pink-300">Générateur</p>
            <h1 className="mt-2 text-3xl font-black">Trouve la réponse parfaite</h1>
          </div>
          <div className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-sm text-green-300">
            {session ? 'Connecté' : 'Déconnecté'}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <label className="block text-sm font-medium text-slate-300">Votre message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-slate-100 outline-none ring-0 transition focus:border-pink-400"
              placeholder="Collez le message reçu..."
            />
            <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
              <span>{message.length} caractères</span>
              <span>Max 3 000</span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-slate-300">Style</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100">
                  {STYLE_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-300">Longueur</label>
                <select value={length} onChange={(e) => setLength(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100">
                  {LENGTH_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !session}
                className="flex-1 rounded-full bg-pink-500 px-6 py-3 font-bold text-white transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Génération...' : 'Générer ma réponse'}
              </button>
              <button className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-slate-100">Régénérer</button>
            </div>

            {error && <div className="mt-5 rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
          </section>

          <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Coût estimé</p>
            <div className="mt-3 text-4xl font-black text-pink-300">{credits}</div>
            <p className="mt-2 text-sm text-slate-300">Cette génération coûtera {credits} crédits.</p>
            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Solde actuel</p>
              <p className="mt-2 text-2xl font-black text-white">38 crédits</p>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
              <p>Il vous reste 38 crédits.</p>
            </div>
          </aside>
        </div>

        {result.length > 0 && (
          <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="mb-6 text-xl font-bold">Propositions de réponses</p>
            <div className="space-y-4">
              {result.map((answer, index) => (
                <div key={`${answer}-${index}`} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.2em] text-pink-300">Réponse {index + 1}</span>
                    <div className="flex gap-2 text-xs">
                      <button className="rounded-full border border-slate-700 px-3 py-1">Copier</button>
                      <button className="rounded-full border border-slate-700 px-3 py-1">Modifier</button>
                      <button className="rounded-full border border-slate-700 px-3 py-1">Partager</button>
                    </div>
                  </div>
                  <p className="text-lg text-slate-100">{answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
