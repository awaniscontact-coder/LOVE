import Link from 'next/link';

const steps = [
  { title: '1. Colle ton message', text: 'Copie le texte que tu as reçu et colle-le dans la zone de saisie.' },
  { title: '2. Choisis un style', text: 'Naturel, romantique, flirt, drôle, professionnel, etc.' },
  { title: '3. Génère ta réponse', text: 'L’IA te propose plusieurs options, prêtes à copier ou ajuster.' },
];

const examples = [
  '"Tu me manques tellement ❤️"',
  '"On se voit ce soir ?"',
  '"Je pensais à toi toute la journée"',
];

const advantages = [
  'Rapide et naturel',
  'Plusieurs réponses en 1 clic',
  'Crédits et récompenses publicitaires',
  'Améliorable en fonction de votre style',
];

const faqs = [
  { q: 'Est-ce que c’est gratuit ?', a: 'Oui, un bonus de 10 crédits est offert à l’inscription et des publicités récompensées sont disponibles.' },
  { q: 'Que se passe-t-il si je n’ai plus de crédits ?', a: 'Vous pouvez acheter un pack, passer en premium ou regarder une publicité récompensée.' },
  { q: 'Les réponses sont-elles personnalisées ?', a: 'Oui, selon votre message et le style choisi, plusieurs options sont générées.' },
];

export default function HomePage() {
  return (
    <main className="bg-slate-950 text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
        <div className="flex items-center gap-2 font-black tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500 font-bold text-white">L</div>
          LOVE AI
        </div>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <Link href="#fonctionnement">Fonctionnement</Link>
          <Link href="#reponses">Exemples</Link>
          <Link href="#prix">Tarifs</Link>
          <Link href="#faq">FAQ</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-100">Connexion</Link>
          <Link href="/register" className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white">Essayer gratuitement</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-12 md:grid-cols-2 md:px-8 md:pt-20">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-pink-500/40 bg-pink-500/10 px-3 py-1 text-sm text-pink-200">
            IA pour répondre à vos messages
          </div>
          <h1 className="max-w-xl text-4xl font-black tracking-tight md:text-6xl">Trouve la réponse parfaite.</h1>
          <p className="mt-5 max-w-lg text-lg text-slate-300">
            Colle un message, choisis ton style et laisse l’IA te proposer une réponse.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/register" className="rounded-full bg-pink-500 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:bg-pink-400">Essayer gratuitement</Link>
            <Link href="/generator" className="rounded-full border border-slate-700 px-6 py-3 text-center font-semibold text-slate-100">Tester le générateur</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
            <span>3 000+ réponses générées</span>
            <span>•</span>
            <span>4.9/5 satisfaction</span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/50">
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Message</p>
            <p className="mt-3 text-base text-slate-100">"Elle m’a dit : Tu me manques beaucoup ❤️"</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Romantique', 'Court', 'Direct'].map((pill) => (
                <span key={pill} className="rounded-full border border-pink-500/30 bg-pink-500/10 px-2 py-1 text-xs text-pink-200">
                  {pill}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-slate-800 p-3 text-sm text-slate-200">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">Suggestions</p>
              <p>Toi aussi tu me manques ❤️</p>
              <p className="mt-2">Je pensais justement à toi...</p>
              <p className="mt-2">Alors viens me voir 😏</p>
            </div>
          </div>
        </div>
      </section>

      <section id="fonctionnement" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-300">Fonctionnement</p>
          <h2 className="mt-4 text-3xl font-black">3 étapes simples</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500 text-lg font-bold text-white">{step.title.split('.')[0]}</div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-slate-300">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="reponses" className="bg-slate-900/70 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-300">Exemples</p>
            <h2 className="mt-4 text-3xl font-black">Des réponses prêtes à envoyer</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {examples.map((example) => (
              <div key={example} className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-slate-200">
                <p className="text-lg">{example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-300">Avantages</p>
          <h2 className="mt-4 text-3xl font-black">Conçu pour une conversion forte</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {advantages.map((item) => (
            <div key={item} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-center font-medium text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="prix" className="bg-slate-900/70 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-300">Monétisation</p>
            <h2 className="mt-4 text-3xl font-black">Credits et abonnement</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-700 bg-slate-950 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Credits</p>
              <div className="mt-5"><span className="text-4xl font-black">100</span><span className="text-slate-400"> crédits</span></div>
              <p className="mt-4 text-slate-300">1,99 €</p>
            </div>
            <div className="rounded-3xl border border-pink-500 bg-pink-500/10 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-pink-200">Premium</p>
              <div className="mt-5"><span className="text-4xl font-black">4,99€</span><span className="text-slate-300"> / mois</span></div>
              <p className="mt-4 text-slate-200">500 crédits/mois, sans pub, réponses améliorées.</p>
            </div>
            <div className="rounded-3xl border border-slate-700 bg-slate-950 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Premium+</p>
              <div className="mt-5"><span className="text-4xl font-black">9,99€</span><span className="text-slate-300"> / mois</span></div>
              <p className="mt-4 text-slate-200">1 500 crédits/mois, plus de limites et réponses longues.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-5xl px-4 py-16 md:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-300">FAQ</p>
          <h2 className="mt-4 text-3xl font-black">Questions fréquentes</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="font-semibold text-slate-100">{faq.q}</h3>
              <p className="mt-2 text-slate-300">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-800 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="font-black text-white">LOVE AI</div>
          <div className="flex gap-6">
            <Link href="/privacy">Confidentialité</Link>
            <Link href="/terms">CGU</Link>
            <Link href="/pricing">Tarifs</Link>
          </div>
          <div>© 2026 LOVE AI</div>
        </div>
      </footer>
    </main>
  );
}
