import { expect, it, describe } from 'vitest';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { createAccount } from '@/app/register/page';
import { resolve } from 'node:path';
import { axiosInstance } from '@/axios';

const { eachLike, integer, like } = MatchersV3;

const provider = new PactV3({
  dir: resolve(process.cwd(), 'pacts'),
  consumer: 'webshop-fronend',
  provider: 'account-service',
});

const expectedRequest = like({
  email: like('foobar@gmail.com'),
  password: like('test1234$$A'),
  firstName: like('Vuk'),
  lastName: like('Stefanovic'),
  phoneNumber: like(123456780),
});

const expectedResponse = like({
  id: like(1),
  email: like('foobar@gmail.com'),
  firstName: like('Vuk'),
  lastName: like('Stefanovic'),
  phoneNumber: like(123456780),
});

describe('GET /account/register', () => {
  it('returns an HTTP 200 and creates a new account', () => {
    provider
      .given("I don't have an account")
      .uponReceiving('a request for creating a new account')
      .withRequest({
        method: 'POST',
        path: '/api/account/register',
        headers: { Accept: 'application/json' },
        body: expectedRequest,
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: expectedResponse,
      });

    return provider.executeTest(async (mockserver) => {
      axiosInstance.defaults.baseURL = mockserver.url;
      await createAccount({
        email: 'foobar@gmail.com',
        password: 'test1234$$A',
        confirmPassword: 'test1234$$A',
        firstName: 'Vuk',
        lastName: 'Stefanovic',
        phoneNumber: 123456780,
      });
    });
  });
});
