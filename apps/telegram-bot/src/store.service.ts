import type { StoreItem } from '@mint/types/store';

export class StoreService {
  private static instance: StoreService;
  private items: StoreItem[] = [];
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): StoreService {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance;
  }

  public async getItems(): Promise<StoreItem[]> {
    const now = Date.now();

    // Return cached items if they're still fresh
    if (this.items.length > 0 && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.items;
    }

    try {
      const apiUrl = process.env.MINT_API_URL;
      if (!apiUrl) {
        throw new Error('MINT_API_URL environment variable is not set');
      }

      const response = await fetch(`${apiUrl}/store/items`);

      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as StoreItem[];
      this.items = data;
      this.lastFetch = now;

      console.log(`✅ Fetched ${this.items.length} store items from API`);
      return this.items;
    } catch (error) {
      console.error('❌ Error fetching store items from API:', error);

      // If we have cached items, return them even if expired
      if (this.items.length > 0) {
        console.log('⚠️ Using cached store items due to API error');
        return this.items;
      }

      // If no cached items, throw the error
      throw error;
    }
  }

  public async getItemById(id: string): Promise<StoreItem | null> {
    const items = await this.getItems();
    return items.find(item => item.id === id) || null;
  }

  public async hasItem(id: string): Promise<boolean> {
    const items = await this.getItems();
    return items.some(item => item.id === id);
  }

  public clearCache(): void {
    this.items = [];
    this.lastFetch = 0;
    console.log('🗑️ Items cache cleared');
  }
}