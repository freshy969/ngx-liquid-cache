export enum LiquidCacheObjectTypes {
    Observable = 0,
    Static = 1
}

export enum LiquidCacheStorageTypes {
    inMemory = 'inMemory',
    localStorage  = 'localStorage'
}

export interface LiquidCacheConfig {
    localStoragePrefix?: string;
    duration?: number;
    objectType?: LiquidCacheObjectTypes;
    storageType?: LiquidCacheStorageTypes;
    shareBetweenTabs?: boolean;
}
