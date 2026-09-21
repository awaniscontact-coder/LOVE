# LOVE AI

## Lancer localement

```bash
cp .env.example .env
# définir au minimum NEXTAUTH_SECRET et ANTHROPIC_API_KEY
# démarrer PostgreSQL :
docker compose up -d
npm install
npx prisma generate
npx prisma db push
npm run dev
```

L’application ne crédite jamais le navigateur. Les crédits sont inscrits dans `CreditTransaction` et les opérations sont effectuées dans des transactions PostgreSQL.

### Paiements

Créer un Checkout via `POST /api/checkout/create` avec `{ "productKey": "credits_100" }`, `credits_500`, `credits_1500`, `premium` ou `premium_plus`. Les prix et le nombre de crédits sont définis côté serveur. Configurer Stripe pour appeler `/api/webhooks/stripe`; les crédits ne sont ajoutés qu’après vérification de la signature et d’un événement `checkout.session.completed` payé. Le traitement est idempotent via `StripeEvent`.

### Publicités récompensées

Le fournisseur doit appeler `/api/webhooks/rewarded-ad` avec `x-reward-signature`, une signature HMAC-SHA256 du corps brut, et `{ userId, provider, verificationId, rewardAmount }`. Le endpoint refuse les appels du navigateur, les doublons et la quatrième récompense de la journée.

En production, utilisez une URL HTTPS, une base PostgreSQL managée, un secret aléatoire, des clés Stripe live uniquement côté serveur, et configurez les limites/rate limiting au niveau du fournisseur d’infrastructure.
