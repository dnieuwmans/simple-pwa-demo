import { Injectable } from '@nestjs/common';

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export interface OrderDto {
  id: string;
  products: {
    name: string;
    price: number;
    image: string;
    quantity: number;
  }[];
  shippingCosts: number;
  orderedAt: string;
  status: 'synced' | 'draft';
  sendNotification?: boolean;
}

// Note: this simulates how Firebase works with the realtime database
const dummyProducts: Record<string, ProductDto> = {
  'product-1': {
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, ex!',
    id: 'product-1',
    image: 'http://localhost:8081/public/dracaena.jpg',
    name: 'Dracaena',
    price: 24.99,
    stock: 100,
  },
  'product-2': {
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, ex!',
    id: 'product-2',
    image: 'http://localhost:8081/public/strelitzia.jpg',
    name: 'Strelitzia nicolai',
    price: 34.99,
    stock: 100,
  },
};

let dummyOrders: Record<string, OrderDto> = {
  'order-1': {
    id: 'order-1669383739849',
    orderedAt: '2022-11-25T13:42:19.849Z',
    products: [
      {
        image: 'http://localhost:8081/public/strelitzia.jpg',
        name: 'Strelitzia nicolai',
        price: 34.99,
        quantity: 1,
      },
    ],
    sendNotification: false,
    shippingCosts: 4.95,
    status: 'synced',
  },
  'order-2': {
    id: 'order-1669384267525',
    orderedAt: '2022-11-25T13:51:07.525Z',
    products: [
      {
        image: 'http://localhost:8081/public/strelitzia.jpg',
        name: 'Strelitzia nicolai',
        price: 34.99,
        quantity: 1,
      },
    ],
    sendNotification: false,
    shippingCosts: 4.95,
    status: 'synced',
  },
};

@Injectable()
export class AppService {
  getProducts(): Record<string, any> {
    return dummyProducts;
  }

  getSingleProduct(id: string): ProductDto {
    return dummyProducts[id];
  }

  getOrders(): Record<string, OrderDto> {
    return dummyOrders;
  }

  addOrder(createOrderDto: OrderDto) {
    dummyOrders = { ...dummyOrders, [createOrderDto.id]: createOrderDto };
    return createOrderDto;
  }
}
