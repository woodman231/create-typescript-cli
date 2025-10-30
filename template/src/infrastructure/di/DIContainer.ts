export type ServiceKey = string | symbol;
export type ServiceFactory<T = any> = (container: DIContainer) => T;
export type ServiceConstructor<T = any> = new (...args: any[]) => T;

export interface ServiceDescriptor<T = any> {
  key: ServiceKey;
  factory?: ServiceFactory<T>;
  constructor?: ServiceConstructor<T>;
  instance?: T;
  singleton?: boolean;
  dependencies?: ServiceKey[];
}

export class DIContainer {
  private services = new Map<ServiceKey, ServiceDescriptor>();
  private instances = new Map<ServiceKey, any>();

  register<T>(descriptor: ServiceDescriptor<T>): void {
    this.services.set(descriptor.key, descriptor);
  }

  registerSingleton<T>(key: ServiceKey, factory: ServiceFactory<T>): void {
    this.services.set(key, { 
      key, 
      factory, 
      singleton: true
    } as ServiceDescriptor<T>);
  }

  registerTransient<T>(key: ServiceKey, factory: ServiceFactory<T>): void {
    this.services.set(key, { 
      key, 
      factory, 
      singleton: false
    } as ServiceDescriptor<T>);
  }

  registerInstance<T>(key: ServiceKey, instance: T): void {
    this.services.set(key, { 
      key, 
      instance, 
      singleton: true
    } as ServiceDescriptor<T>);
    this.instances.set(key, instance);
  }

  resolve<T>(key: ServiceKey): T {
    const descriptor = this.services.get(key);
    if (!descriptor) {
      throw new Error(`Service not found: ${String(key)}`);
    }

    // Return existing instance if singleton
    if (descriptor.singleton && this.instances.has(key)) {
      return this.instances.get(key);
    }

    // Create new instance
    let instance: T;
    
    if (descriptor.instance) {
      instance = descriptor.instance;
    } else if (descriptor.factory) {
      instance = descriptor.factory(this);
    } else if (descriptor.constructor) {
      const deps = descriptor.dependencies?.map(dep => this.resolve(dep)) || [];
      instance = new descriptor.constructor(...deps);
    } else {
      throw new Error(`No factory, constructor, or instance provided for service: ${String(key)}`);
    }

    // Cache singleton instances
    if (descriptor.singleton) {
      this.instances.set(key, instance);
    }

    return instance;
  }

  has(key: ServiceKey): boolean {
    return this.services.has(key);
  }
}