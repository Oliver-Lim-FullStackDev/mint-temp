import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

function globToRegex(pattern: string): RegExp {
  // Escape regex, then turn '*' into '.*'
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('^' + escaped.replace(/\\\*/g, '.*') + '$');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  // ✅ Trust Caddy as reverse proxy so req.secure, req.ip, etc. are correct
  if (process.env.NODE_ENV === 'development') {
    (app.getHttpAdapter().getInstance() as any).set('trust proxy', true);
  }

  app.setGlobalPrefix('api');

  const corsEnv = (process.env.MINT_CORS_ORIGIN || '').trim();

  if (!corsEnv || corsEnv === '*') {
    // DEV: allow all by reflecting origin (works with credentials)
    app.enableCors({
      origin: true,
      credentials: true,
    });
    Logger.log('CORS: DEV allow all (reflect origin)', 'Bootstrap');
  } else {
    const rules = corsEnv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map(globToRegex);

    const corsOptions: CorsOptions = {
      origin: (origin, cb) => {
        if (!origin) return cb(null, true); // curl/Postman
        const ok = rules.some((re) => re.test(origin));
        return ok ? cb(null, true) : cb(new Error(`CORS blocked origin: ${origin}`));
      },
      credentials: true,
      // methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    };

    app.enableCors(corsOptions);
    Logger.log(`CORS: allowlist ${corsEnv}`, 'Bootstrap');
  }

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);
  Logger.log(`API on http://127.0.0.1:${port}/api`, 'Bootstrap');
}

bootstrap();
