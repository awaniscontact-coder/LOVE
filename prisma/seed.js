const { execSync } = require('child_process');

function runPrismaGenerate() {
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
  } catch {
    // ignore during initial setup if DB env is missing
  }
}

runPrismaGenerate();
