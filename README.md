# ngx-liquid-cache

> LiquidCache: a powerful, automatic and optimized Angular2/6+ cache system that fits everywhere!

## Main features

1. Works **everywhere**, guaranteed. It's decorator system let you cache every existing (or new) method in your project without change a single comma.
2. Optimized under every aspect: observables will be cached before the result to be automatically shared between observers (with `share` operator from `rxjs`) and then converted to store the real result. Not-observable responses will be cached instantly;
3. An *active* cache expiration check system ensure that your methods return fresh data after a specific time frame.
4. High possibility of configuration, from global settings to single-cache object.
5. Decorators and main service: you can use one or both of them together to have max control over your cache system.
6. The library loads before the application thanks to Angular's `APP_INITIALIZER` injection token, ensuring that cache service is already operative at the application's startup.

## Getting started

Install the library in your Angular project:
```
npm install ngx-liquid-cache
```

## Fast Setup (zero configuration)

1 - Import `NgxLiquidCacheModule` in `app.module.ts`:

```typescript
//...
import { NgxLiquidCacheModule } from 'ngx-liquid-cache';

@NgModule({
  //...
  imports: [
    //...
    NgxLiquidCacheModule.forRoot()
  ],
  //...
})
export class AppModule { }

```
2 - Use the `@LiquidCache` decorator in any method that return a result. Don't worry about the type of the returned value or about making adaptations to your code: LiquidCache is perfectly integrable with every existing method withouth change anything.

```typescript
import { LiquidCache } from 'ngx-liquid-cache';

// Observable Example
export class ApiService {

  constructor(
      private http: HttpClient,
  ) { }

  @LiquidCache('users')
  getUsers() {
      console.log('getUsers Call');
      return this.http.get('users');
  }
}

// Sync Example
export class UtilsService {

  @LiquidCache('calcResult')
  longCalc() {
      console.log('longCalc Call');
      let a  = 0;
      for (let i = 0; i < 100000000; i++) {
          a += i;
      }
      return a;
  }
}
```

3 - Call your methods and see the magic: original methods will be executed only the first time you invoke them. After the first call you will receive the cached result, speeding up your application. 

```typescript
// Automatic Example (cache by decorators)
export class ExampleComponent {

  constructor(
      private apiService: ApiService,
      private utilsService: UtilsService,
  ) { }

  testObservable() {
      this.apiService.getUsers.subscribe(result => console.log('First call', result));
      this.apiService.getUsers.subscribe(result => console.log('Second call', result));
      
      // Console output:
      // getUsers Call
      // First call (...)
      // Second call (...)
  }
  
  testSync() {
      console.log('First call', this.utilsService.longCalc());
      console.log('Second call', this.utilsService.longCalc());
      
      // Console output:
      // longCalc Call
      // First call (...)
      // Second call (...)
  }
}
```

4 - You can also use `LiquidCacheService` to interact directly with your cache:

```typescript
import { LiquidCacheService } from 'ngx-liquid-cache';

// Manual Example
export class ExampleComponent {

  constructor(
      private cache: LiquidCacheService,
  ) { }

  testManual() {
      this.cache.set('testKey', 10);
      console.log('Data from cache', this.cache.get('testKey'));
      this.cache.remove('testKey'); // Remove element from cache
      
      // You can of course interact also with cache data generated by decorators
      console.log('Data from decorator', this.cache.get('users')); // 'users' is the key used in the apiService's decorator
  }
}
```

## Configuration

The configuration for LiquidCache is divided in three parts: Global, Decorator and Object.

Here's the full configuration parameters list:

Parameter			| Type				| Default		| Description
---						| ---					| ---				| ---
`duration`		| *number*		| `null`		| The duration for cached elements (in seconds). A trigger will remove expired objects from the cache system.


### Global configuration

You can pass a `LiquidCacheConfig` object to the `NgxLiquidCacheModule.forRoot()` method to specify the global configuration for your cache system.

```typescript
//...
import { NgxLiquidCacheModule, LiquidCacheConfig } from 'ngx-liquid-cache';

const liquidCacheConfig: LiquidCacheConfig = {
  //...
};

@NgModule({
  //...
  imports: [
    //...
    NgxLiquidCacheModule.forRoot(liquidCacheConfig)
  ],
  //...
})
export class AppModule { }

```

### Decorator configuration

The `@LiquidCache` decorator accepts two arguments: `key` (`string`, required) and `configuration` (`LiquidCacheConfig`, optional).

1 - The `key` argument could be static (ex. `'myKey'`) or "dynamic", using special placeholders (`{placeholder name}`) that will collect data from the original method arguments (ex. `mySingleKey{id}`):

```typescript
export class ApiService {
  
  //...
  
  // Supposing to invoke getSingleUser(1), the result 
  // will be stored in the cache system with key 'user1'
  @LiquidCache('user{id}')
  getSingleUser(id) {
      return this.http.get('users/' + id);
  }
}
```

2 - The `configuration` argument accepts a `LiquidCacheConfig` object, so you can pass a specific configuration for this single decorator:

```typescript
export class ApiService {
  
  // Uses a specific configuration
  @LiquidCache('user{id}', { duration: 60 })
  getSingleUser(id) { ... }
  
  // Will use the global configuration
  @LiquidCache('users')
  getUsers() { ... }
}
```

### Object configuration

You can set a specific configuration for every cache key that you will create:

```typescript
import { LiquidCacheService, LiquidCacheConfig } from 'ngx-liquid-cache';

export class TestComponent {

  constructor(
      private cache: LiquidCacheService,
  ) { }

  test() {
      const specificConf: LiquidCacheConfig = { duration: 60 };
      this.cache.set('myKey', 'cached value', specificConf);
  }
}
```

## Example

Clone the demo project from [GitHub](https://github.com/luckyseven/ngx-liquid-cache) and run it with `ng serve`. Check the browser console to see the demo in action.

## Coming soon

1. Use **localStorage** for advanced (and durable) caching.
2. Specify *group name* for decorators that uses placeholders to simplify the removal of them.
3. Use custom callbacks and hooks during the cache lifecycle.

## Suggestions, improvements, issues and more

**Have you used this plugin in your project?**

Say hello with a [tweet](https://twitter.com/luckysevenrox)!

**Wanna improve this library?**

The library source code lives inside the demo project on [GitHub](https://github.com/luckyseven/ngx-liquid-cache). Fork it and work! ;)

**Need support?**

Feel free to contact me at [alberto.fecchi@gmail.com](alberto.fecchi@gmail.com) or just open an issue on the official repository on [GitHub](https://github.com/luckyseven/ngx-liquid-cache).

## License

> MIT License - Copyright (c) Alberto Fecchi

Full license [here](LICENSE)