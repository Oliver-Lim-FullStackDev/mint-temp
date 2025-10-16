import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Payments API (e2e) - Simple', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Set global prefix like in main.ts
    app.setGlobalPrefix('api');

    // Add validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should have API running', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200);
  });

  it('should access provider routing endpoint', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/payments/on-ramp/crypto/provider/TON');

    console.log('Status:', response.status);
    console.log('Body:', JSON.stringify(response.body, null, 2));

    expect(response.status).toBeLessThan(500); // Should not be server error
  });
});
