import {LiquidCacheService} from '../services/liquid-cache.service';
import {LiquidCacheConfig, LiquidCacheObjectTypes} from '../configuration';
import {LiquidCacheObjectSnapshot} from '../services/private';

export class LiquidCacheObject {
    cacheService: LiquidCacheService;
    key: string;
    value: any;
    configuration: LiquidCacheConfig;
    expiresAt: number = null;
    lastUpdate: number = null;

    private _timeout: any = null;

    constructor(key: string, value: any, configuration: LiquidCacheConfig, cacheService: LiquidCacheService) {
        this.key = key;
        this.cacheService = cacheService;
        this.update(value, configuration);
    }

    is(type: LiquidCacheObjectTypes): boolean {
        return this.configuration.objectType === type;
    }

    update(value: any, configuration: LiquidCacheConfig): void {
        this.value = value;
        this.configuration = configuration;
        this.lastUpdate = new Date().getTime();
        this.calculateExpirationTime();
    }

    remove(): void {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        if (this.cacheService.cachedElements[this.key]) {
            delete this.cacheService.cachedElements[this.key];
        }
        try {
            if (localStorage.getItem(this.cacheService.defaultObjectParameters.localStoragePrefix + this.key)) {
                localStorage.removeItem(this.cacheService.defaultObjectParameters.localStoragePrefix + this.key);
            }
        } catch (e) {
            console.error(e);
        }

    }

    calculateExpirationTime() {
        if (this.configuration.duration && this.expiresAt === null) {
            this.expiresAt = new Date().getTime() + (this.configuration.duration * 1000);
            this.expiresIn(this.configuration.duration);
        }
    }

    expiresIn(seconds: number): void {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        if (this.cacheService) {
            this._timeout = setTimeout(() => {
                this.remove();
            }, seconds * 1000);
        }
    }

    expirationCheck(newExpiresAt = null): void {
        const currentTime = new Date().getTime();

        if (newExpiresAt) {
            this.expiresAt = newExpiresAt;
        }

        if (this.expiresAt) {
            if (this.expiresAt < currentTime) {
                this.remove();
            } else {
                this.expiresIn(Math.round((this.expiresAt - currentTime) / 1000));
            }
        }
    }

    snapshot(): LiquidCacheObjectSnapshot {
        return {
            key: this.key,
            value: this.value,
            configuration: this.configuration,
            expiresAt: this.expiresAt,
            lastUpdate: this.lastUpdate
        };
    }

}
