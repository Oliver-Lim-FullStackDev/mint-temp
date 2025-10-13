import { Injectable } from '@nestjs/common';
import type { StoreItem } from '@mint/types/store';
import { CreateStoreItemDto } from './store.dto';
import { STATIC_STORE_ITEMS } from './store.data';

@Injectable()
export class StoreService {
  private items: StoreItem[] = [...STATIC_STORE_ITEMS];

  findAll(): Promise<StoreItem[]> {
    return Promise.resolve(this.items.filter((item) => item.available));
  }

  findOne(id: string): Promise<StoreItem | null> {
    const item = this.items.find((item) => item.id === id && item.available);
    return Promise.resolve(item || null);
  }

  create(itemData: CreateStoreItemDto & { available?: boolean }): Promise<StoreItem> {
    const newItem: StoreItem = {
      id: this.generateId(),
      ...itemData,
      available: !!itemData.available,
    };

    this.items.push(newItem);
    return Promise.resolve(newItem);
  }

  update(id: string, itemData: Partial<StoreItem>): Promise<StoreItem | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      return Promise.resolve(null);
    }

    this.items[index] = { ...this.items[index], ...itemData };
    return Promise.resolve(this.items[index]);
  }

  delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      return Promise.resolve(false);
    }

    this.items.splice(index, 1);
    return Promise.resolve(true);
  }

  private generateId(): string {
    return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
