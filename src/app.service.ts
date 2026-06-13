import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Welcome to Boilerplate Api Server 🚀',
      status: 'OK',
      version: '1.0.0',
      docs: '/api/docs',
    };
  }
}
