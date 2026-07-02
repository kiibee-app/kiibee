import { Controller, Get, RequestMethod } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';

@Controller()
export class AppController {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  @Get()
  getHello() {
    return {
      message: 'Welcome to the kiibee Server',
      status: 'running',
      health: '/api/v1/health',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('api/v1')
  getRoutes() {
    if (process.env.NODE_ENV !== 'development') {
      return {
        status: 'success',
        routes: [],
        message: 'Route listing is only available in development mode.',
      };
    }
    const controllers = this.discoveryService.getControllers();
    const routes: Array<{ path: string; method: string }> = [];

    controllers.forEach((wrapper) => {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) return;

      const controllerPath = Reflect.getMetadata(PATH_METADATA, metatype);
      if (controllerPath === undefined) return;

      const prototype = Object.getPrototypeOf(instance);
      const methodNames = this.metadataScanner.scanFromPrototype(
        instance,
        prototype,
        (name) => name,
      );

      methodNames.forEach((methodName) => {
        const methodRef = prototype[methodName];
        const path = Reflect.getMetadata(PATH_METADATA, methodRef);
        const method = Reflect.getMetadata(METHOD_METADATA, methodRef);

        if (path !== undefined && method !== undefined) {
          const methodString = RequestMethod[method] || 'UNKNOWN';
          const subPath = path.startsWith('/') ? path : `/${path}`;
          let controllerPrefix = controllerPath.startsWith('/')
            ? controllerPath
            : `/${controllerPath}`;
          if (controllerPrefix === '/') controllerPrefix = '';

          let fullPath = `${controllerPrefix}${subPath}`.replace(/\/+/g, '/');
          if (fullPath === '') fullPath = '/';

          // Prepend global prefix if not excluded
          const isExcluded = fullPath === '/' || fullPath === '/api/v1';
          if (!isExcluded) {
            fullPath = `/api/v1${fullPath}`;
          }

          routes.push({ path: fullPath, method: methodString });
        }
      });
    });

    return {
      status: 'success',
      routes: routes.sort((a, b) => a.path.localeCompare(b.path)),
    };
  }
}
