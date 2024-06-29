import { expect, it, describe } from 'vitest';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { getProduct } from '@/app/product/[id]/page';
import { resolve } from 'node:path';
import { axiosInstance } from '@/axios';

const { eachLike, integer, like } = MatchersV3;

const provider = new PactV3({
  dir: resolve(process.cwd(), 'pacts'),
  consumer: 'webshop-fronend',
  provider: 'product-service',
});

const expectedResponse = like({
  id: integer(1),
  name: like('Refined Rubber Hat'),
  color: like('indigo'),
  description: like(
    'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design'
  ),
  imageUrls: eachLike(
    'https://s7d2.scene7.com/is/image/aeo/1305_9826_001_of?$pdp-md-opt$'
  ),
  price: like('399.00'),
  inventory: like(true),
});

describe('GET /products/id', () => {
  it('returns an HTTP 200 and a products details', () => {
    provider
      .given('I have a product')
      .uponReceiving('a request for that particular product')
      .withRequest({
        method: 'GET',
        path: '/api/browse/products/1',
        headers: { Accept: 'application/json' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: expectedResponse,
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
});
