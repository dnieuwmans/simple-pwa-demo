import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AppService, OrderDto, ProductDto } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('is-online')
  getIsOnline(): boolean {
    return true;
  }

  @Get('products')
  getProducts(): Record<string, ProductDto> {
    return this.appService.getProducts();
  }

  @Get('products/:id')
  getSingleProduct(@Param() params): ProductDto {
    return this.appService.getSingleProduct(params.id);
  }

  @Get('orders')
  getOrders(): Record<string, OrderDto> {
    return this.appService.getOrders();
  }

  @Post('orders')
  @HttpCode(HttpStatus.CREATED)
  postOrder(@Body() orderDto: OrderDto) {
    return this.appService.addOrder(orderDto);
  }
}
