import Link from 'next/link';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-3xl font-black">Créer un compte</h1>
        <p className="mt-2 text-slate-400">Recevez 10 crédits gratuits à l’inscription.</p>
        <form className="mt-6 space-y-4">
          <input type="text" placeholder="Nom" className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
          <input type="email" placeholder="Email" className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
          <input type="password" placeholder="Mot de passe" className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
          <button type="submit" className="w-full rounded-full bg-pink-500 px-4 py-3 font-semibold text-white">S’inscrire</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Déjà inscrit ? <Link href="/login" className="text-pink-300">Se connecter</Link>
        </p>
      </div>
    </main>
  );
}
