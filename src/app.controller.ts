import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getInfo() {
    return {
      project: 'api-velock-webhook',
      description: '',
      owner: 'Miguel Romaniw',
      builder: 'https://github.com/DDR23',
      statusCode: 200,
    };
  }
}
