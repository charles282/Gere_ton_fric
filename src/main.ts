import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// Les montants sont stockés en bigint (centimes, jamais de flottant) mais
// JSON.stringify ne sait pas sérialiser un BigInt nativement — on le rend
// explicite en chaîne plutôt que de perdre silencieusement en précision
// en le repassant par `number`.
(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
