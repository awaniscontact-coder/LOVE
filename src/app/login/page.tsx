'use client';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
export default function LoginPage() {
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); setLoading(true); setError(''); const form = new FormData(e.currentTarget); const result = await signIn('credentials', { email: form.get('email'), password: form.get('password'), redirect: false }); if (result?.error) setError('Email ou mot de passe incorrect.'); else window.location.href = '/dashboard'; setLoading(false); }
  return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white"><div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8"><h1 className="text-3xl font-black">Connexion</h1><form onSubmit={submit} className="mt-6 space-y-4"><input required name="email" type="email" placeholder="Email" className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3" /><input required name="password" type="password" placeholder="Mot de passe" className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3" />{error && <p className="text-sm text-red-300">{error}</p>}<button disabled={loading} className="w-full rounded-full bg-pink-500 px-4 py-3 font-semibold disabled:opacity-50">{loading ? 'Connexion...' : 'Se connecter'}</button></form><p className="mt-6 text-center text-sm text-slate-400">Pas encore inscrit ? <Link href="/register" className="text-pink-300">Créer un compte</Link></p></div></main>;
}
