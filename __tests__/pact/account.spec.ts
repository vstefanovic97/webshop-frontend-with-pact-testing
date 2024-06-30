import { expect, it, describe } from 'vitest';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { createAccount } from '@/app/register/page';
import { resolve } from 'node:path';
import { axiosInstance } from '@/axios';

const { like } = MatchersV3;

const provider = new PactV3({
  dir: resolve(process.cwd(), 'pacts'),
  consumer: 'webshop-frontend',
  provider: 'account-service',
});

const expectedRequest = like({
  email: like('foobar@gmail.com'),
  password: like('test1234$$A'),
  firstName: like('Vuk'),
  lastName: like('Stefanovic'),
  phoneNumber: like(123456780),
});

const expectedSuccessResponse = like({
  id: like(1),
  email: like('foobar@gmail.com'),
  firstName: like('Vuk'),
  lastName: like('Stefanovic'),
  phoneNumber: like(123456780),
});

const expectedUserAlreadyExistsResponse = {
  message: 'User already exists',
  error: 'Bad Request',
  statusCode: 400,
};

describe('GET /account/register', () => {
  it('returns an HTTP 200 and creates a new account', () => {
    provider
      .given("an account with email foobar@gmail.com doesn't exist")
      .uponReceiving(
        'a request for creating an account with foobar@gmail.com email'
      )
      .withRequest({
        method: 'POST',
        path: '/api/account/register',
        headers: { Accept: 'application/json' },
        body: expectedRequest,
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: expectedSuccessResponse,
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

  it('returns an HTTP 400 user already exists error', () => {
    provider
      .given('an account with email foobar@gmail.com already exists')
      .uponReceiving(
        'a request for creating an account with foobar@gmail.com email'
      )
      .withRequest({
        method: 'POST',
        path: '/api/account/register',
        headers: { Accept: 'application/json' },
        body: expectedRequest,
      })
      .willRespondWith({
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        body: expectedUserAlreadyExistsResponse,
      });

    return provider.executeTest(async (mockserver) => {
      axiosInstance.defaults.baseURL = mockserver.url;
      await expect(
        createAccount({
          email: 'foobar@gmail.com',
          password: 'test1234$$A',
          confirmPassword: 'test1234$$A',
          firstName: 'Vuk',
          lastName: 'Stefanovic',
          phoneNumber: 123456780,
        })
      ).rejects.toThrowError();
    });
  });
});
