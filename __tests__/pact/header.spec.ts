import { expect, it, describe } from 'vitest';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { getHeader } from '@/app/components/header';
import { resolve } from 'node:path';
import { axiosInstance } from '@/axios';

const { eachLike, integer, like } = MatchersV3;

const provider = new PactV3({
  dir: resolve(process.cwd(), 'pacts'),
  consumer: 'webshop-fronend',
  provider: 'product-service',
});

const expectedResponse = eachLike(
  {
    id: integer(17),
    name: like('new'),
    path: like('new'),
    subCategories: eachLike({
      id: integer(1),
      name: like('jeans'),
      path: like('new/jeans'),
    }),
  },
  4
);

describe('GET /category/header', (mockserver) => {
  it('returns an HTTP 200 and a list of categories', () => {
    provider
      .given('I have a list of categories')
      .uponReceiving('a request for header categories')
      .withRequest({
        method: 'GET',
        path: '/api/browse/category/header',
        headers: { Accept: 'application/json' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: expectedResponse,
      });

    return provider.executeTest(async (mockserver) => {
      axiosInstance.defaults.baseURL = mockserver.url;
      const header = await getHeader();

      header.forEach((category) => {
        expect(category.id).toBeTypeOf('number');
        expect(category.name).toBeTypeOf('string');
        expect(category.path).toBeTypeOf('string');

        category.subCategories.forEach((subCategory) => {
          expect(subCategory.id).toBeTypeOf('number');
          expect(subCategory.name).toBeTypeOf('string');
          expect(subCategory.path).toBeTypeOf('string');
        });
      });
    });
  });
});
