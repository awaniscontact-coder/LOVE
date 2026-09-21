import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getAuthSession();

  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black">Administration</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Crédits gratuits</p>
            <p className="mt-2 text-2xl font-black">10</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Limite journalière</p>
            <p className="mt-2 text-2xl font-black">5 génér.</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Publicité récompensée</p>
            <p className="mt-2 text-2xl font-black">3 max/jour</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Message max gratuit</p>
            <p className="mt-2 text-2xl font-black">1 000 caractères</p>
          </div>
        </div>
      </div>
    </main>
  );
}
