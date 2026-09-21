# LOVE AI

L’application utilise maintenant son **API IA interne** (`/api/ai/reply`) et son moteur serveur local. La clé Anthropic et le SDK Anthropic ont été retirés.

Ce moteur est fonctionnel sans clé externe et sert de provider par défaut. Il produit des réponses déterministes selon le message, le style et la longueur. Pour obtenir une génération réellement probabiliste à grande échelle, il faudra héberger un modèle open source (par exemple via vLLM/Ollama) et remplacer uniquement `src/lib/ai-provider.ts`, sans changer l’API publique ni le système de crédits.

## Lancer localement

```bash
cp .env.example .env
docker compose up -d
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Les routes de génération authentifient la session, valident les entrées côté serveur et débitent les crédits dans une transaction PostgreSQL.
