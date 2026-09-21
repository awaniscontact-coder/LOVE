import Link from 'next/link';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-pink-300">Dashboard</p>
            <h1 className="mt-2 text-3xl font-black">Bienvenue, {session.user.name || session.user.email}</h1>
          </div>
          <Link href="/generator" className="rounded-full bg-pink-500 px-4 py-2 font-semibold text-white">Nouveau message</Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Solde</p>
            <p className="mt-3 text-3xl font-black">38</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Historique</p>
            <p className="mt-3 text-3xl font-black">12</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Récompenses</p>
            <p className="mt-3 text-3xl font-black">3/3</p>
          </div>
        </div>
      </div>
    </main>
  );
}
