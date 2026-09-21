import Link from 'next/link';

const plans = [
  { name: 'Crédits', price: '1,99 €', description: '100 crédits' },
  { name: 'Crédits', price: '6,99 €', description: '500 crédits' },
  { name: 'Crédits', price: '14,99 €', description: '1 500 crédits' },
  { name: 'Premium', price: '4,99 €/mois', description: '500 crédits + sans pub + réponses améliorées' },
  { name: 'Premium+', price: '9,99 €/mois', description: '1 500 crédits + sans pub + réponses plus longues' },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-pink-300">Tarifs</p>
          <h1 className="mt-3 text-4xl font-black">Choisissez votre plan</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name + plan.price} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{plan.name}</p>
              <p className="mt-4 text-4xl font-black">{plan.price}</p>
              <p className="mt-3 text-slate-300">{plan.description}</p>
              <Link href="/register" className="mt-6 inline-flex rounded-full bg-pink-500 px-4 py-2 font-semibold text-white">Choisir</Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
