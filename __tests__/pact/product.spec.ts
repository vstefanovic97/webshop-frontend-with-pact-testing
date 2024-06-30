import { expect, it, describe } from 'vitest';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { getProduct } from '@/app/product/[id]/page';
import { resolve } from 'node:path';
import { axiosInstance } from '@/axios';

const { eachLike, integer, like } = MatchersV3;

const provider = new PactV3({
  dir: resolve(process.cwd(), 'pacts'),
  consumer: 'webshop-frontend',
  provider: 'product-service',
});

const expectedSuccessResponse = like({
  id: integer(1),
  name: like('Refined Rubber Hat'),
  color: like('indigo'),
  description: like(
    'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design'
  ),
  imageUrls: like([
    'https://s7d2.scene7.com/is/image/aeo/1305_9826_001_of?$pdp-md-opt$',
  ]),
  price: like('399.00'),
  inventory: like(true),
});

const expectedNotFoundResponse = like({
  message: 'No Product found for the given id',
  error: 'Not Found',
  statusCode: 404,
});

describe('GET /products/id', () => {
  it('returns an HTTP 200 and a products details', () => {
    provider
      .given('a product with id 1 exists')
      .uponReceiving('a request for product with id 1')
      .withRequest({
        method: 'GET',
        path: '/api/browse/products/1',
        headers: { Accept: 'application/json' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: expectedSuccessResponse,
      });

    return provider.executeTest(async (mockserver) => {
      axiosInstance.defaults.baseURL = mockserver.url;
      const product = await getProduct(1);

      expect(product.id).toBeTypeOf('number');
      expect(product.name).toBeTypeOf('string');
      expect(product.color).toBeTypeOf('string');
      expect(product.price).toBeTypeOf('string');
      expect(product.description).toBeTypeOf('string');
      expect(product.inventory).toBeTypeOf('boolean');

      product.imageUrls.forEach((imageUrl) => {
        expect(imageUrl).toBeTypeOf('string');
      });
    });
  });

  it('returns an HTTP 404 with product not found error', () => {
    provider
      .given('a product with id 1 does not exist')
      .uponReceiving('a request for product with id 1')
      .withRequest({
        method: 'GET',
        path: '/api/browse/products/1',
        headers: { Accept: 'application/json' },
      })
      .willRespondWith({
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: expectedNotFoundResponse,
      });

    return provider.executeTest(async (mockserver) => {
      axiosInstance.defaults.baseURL = mockserver.url;

      await expect(getProduct(1)).rejects.toThrowError();
    });
  });
});
