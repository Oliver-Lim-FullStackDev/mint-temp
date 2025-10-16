import { Injectable, Scope, Inject, ForbiddenException, HttpException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import * as qs from 'qs';

@Injectable({ scope: Scope.REQUEST })
export class PayloadClient {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(@Inject(REQUEST) private readonly request: Request) {
    this.baseUrl = process.env.PAYLOAD_API_URL!;
    this.token = process.env.PAYLOAD_API_TOKEN!;
  }

  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...customHeaders,
    };
  }

  async get<T>(path: string, customHeaders?: Record<string, string>): Promise<T> {
    const url = `${this.baseUrl}/${path}`;
    const headers = this.buildHeaders(customHeaders);

    try {
      const response = await fetch(url, { method: 'GET', headers });

      if (!response.ok) {
        const errorText = await response.text();

        // Handle other HTTP errors
        throw new HttpException(
          `Payload API request failed: ${response.status} ${response.statusText} - ${errorText}`,
          response.status,
        );
      }

      // If no content (204)
      if (response.status === 204) return undefined as T;

      // Return JSON response
      return (await response.json()) as T;
    } catch (err: any) {
      // Log error for debugging
      console.error('PayloadClient GET error:', err.message || err);
      // Re-throw the error so NestJS can handle it properly
      throw err;
    }
  }
}
