import type { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Inject, Injectable, Scope } from '@nestjs/common';
import * as qs from 'qs';

/**
 * API version type
 */
type ApiVersion = 'vx' | 'v1' | 'v2' | 'v3';

/**
 * Client for making versioned API requests
 */
class VersionedClient {
  constructor(
    private readonly baseUrl: string,
    private token: string,
    private readonly version: ApiVersion,
    private readonly heroGamingClient: HeroGamingClient,
  ) {}

  /**
   * Build headers for API requests
   */
  buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'frontend-country-code': process.env.HEROGAMING_FRONTEND_COUNTRY_CODE || 'GB', // Configurable country code, defaults to GB
    };
    if (this.version && this.version !== 'vx') {
      defaultHeaders['Accept'] = `application/vnd.casinosaga.${this.version}`;
    }
    if (this.token) {
      defaultHeaders['Authorization'] = `${this.token}`;
    }

    // Override with custom headers if provided
    return { ...defaultHeaders, ...customHeaders };
  }

  /**
   * Make a GET request to the API
   */
  async get<T>(path: string, query?: Record<string, any>, customHeaders?: Record<string, any>): Promise<T> {
    const queryString = query ? `?${qs.stringify(query, { arrayFormat: 'brackets' })}` : '';
    const url = `${this.baseUrl}${path}${queryString}`;
    return this.request<T>('GET', url, undefined, customHeaders);
  }

  /**
   * Make a POST request to the API
   */
  async post<T>(path: string, body: unknown, customHeaders?: Record<string, any>): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    return this.request<T>('POST', url, body, customHeaders);
  }

  /**
   * Make a PATCH request to the API
   */
  async patch<T>(path: string, body: unknown, customHeaders?: Record<string, any>): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    return this.request<T>('PATCH', url, body, customHeaders);
  }

  /**
   * Make a DELETE request to the API
   */
  async delete<T>(path: string, customHeaders?: Record<string, any>): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    return this.request<T>('DELETE', url, undefined, customHeaders);
  }

  /**
   * Core request method handling common fetch logic
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    url: string,
    body?: unknown,
    customHeaders: Record<string, any> = {},
  ): Promise<T> {
    // Check if the Token is still valid and refresh it if needed
    if (!customHeaders.authorization && !customHeaders?.basicAuth) {
      const sessionToken = this.heroGamingClient.getSessionIdFromHeaders();
      if (sessionToken) {
        this.token = sessionToken;
      }
    }
    const headers = this.buildHeaders(customHeaders);

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    // // If we get a 401 or 403, the token is expired/invalid
    // if (response.status === 401 || response.status === 403) {
    //   await this.heroGamingClient.ensureValidToken();
    // }

    if (!response.ok) {
      throw new Error(`${method} ${url} → ${response.status} ${await response.text()}`);
    }
    if (response.status === 204) {
      return undefined as T;
    }
    return (await response.json()) as T;
  }
}

/**
 * Injectable Hero Gaming API client with version support
 * Scoped to the request to access headers
 */
@Injectable({ scope: Scope.REQUEST })
export class HeroGamingClient {
  private readonly baseUrl: string;
  private token: string;

  // Versioned clients
  vx: VersionedClient; // no version
  v1: VersionedClient;
  v2: VersionedClient;
  v3: VersionedClient;

  constructor(@Inject(REQUEST) public readonly request: Request) {
    this.baseUrl = process.env.HEROGAMING_API_URL!;
    this.token = process.env.HEROGAMING_API_TOKEN!; // not in use as not all endpoints use the same token

    // Initialize versioned clients
    this.initializeClients();
  }

  /**
   * Initialize versioned clients with current token
   */
  public initializeClients(): void {
    this.vx = new VersionedClient(this.baseUrl, this.token, 'vx', this);
    this.v1 = new VersionedClient(this.baseUrl, this.token, 'v1', this);
    this.v2 = new VersionedClient(this.baseUrl, this.token, 'v2', this);
    this.v3 = new VersionedClient(this.baseUrl, this.token, 'v3', this);
  }

  getSessionIdFromHeaders(): string | null {
    return this.request.headers.authorization || this.request.cookies['mint-session'];
  }

  private getHeaderValue(name: string): string {
    const headers = this.request.headers as Record<string, string | string[] | undefined>;
    const headerValue = headers[name.toLowerCase()];
    if (typeof headerValue === 'string') return headerValue;
    if (Array.isArray(headerValue)) return headerValue[0] || '';
    return '';
  }

  /**
   * Get the appropriate client based on the Accept header in the current request
   * Falls back to v1 if no version is specified
   */
  private getClientForRequest(): VersionedClient {
    const acceptValue = this.getHeaderValue('accept');

    // Check for version identifiers in the accept header
    if (acceptValue.includes('application/vnd.casinosaga.v3')) {
      return this.v3;
    } else if (acceptValue.includes('application/vnd.casinosaga.v2')) {
      return this.v2;
    } else if (acceptValue.includes('application/vnd.casinosaga.v1')) {
      return this.v1; // Default to v1 for any other value
    }

    return this.vx;
  }

  /**
   * Dynamic GET implementation that selects the appropriate version based on request headers
   */
  async get<T>(path: string, query?: Record<string, any>, customHeaders?: Record<string, any>): Promise<T> {
    return this.getClientForRequest().get<T>(path, query, customHeaders);
  }

  /**
   * Dynamic POST implementation that selects the appropriate version based on request headers
   */
  async post<T>(path: string, body: unknown, customHeaders?: Record<string, any>): Promise<T> {
    return this.getClientForRequest().post<T>(path, body, customHeaders);
  }

  /**
   * Dynamic PATCH implementation that selects the appropriate version based on request headers
   */
  async patch<T>(path: string, body: unknown, customHeaders?: Record<string, any>): Promise<T> {
    return this.getClientForRequest().patch<T>(path, body, customHeaders);
  }

  /**
   * Dynamic DELETE implementation that selects the appropriate version based on request headers
   */
  async delete<T>(path: string, customHeaders?: Record<string, any>): Promise<T> {
    return this.getClientForRequest().delete<T>(path, customHeaders);
  }

  /**
   * Build headers for API requests (for backward compatibility)
   * Uses the appropriate version based on the current request
   */
  buildHeaders(): Record<string, any> {
    return this.getClientForRequest().buildHeaders();
  }
}
