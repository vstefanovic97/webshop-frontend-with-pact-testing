import { expect, it, describe } from 'vitest';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { login } from '@/app/login/page';
import { resolve } from 'node:path';
import { axiosInstance } from '@/axios';

const { like } = MatchersV3;

const provider = new PactV3({
  dir: resolve(process.cwd(), 'pacts'),
  consumer: 'webshop-frontend',
  provider: 'auth-service',
});

const expectedRequest = like({
  email: like('foobar@gmail.com'),
  password: like('test1234$$A'),
});

const expectedSuccessResponse = like({
  access_token: like(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvb2JhckBnbWFpbC5jb20iLCJpYXQiOjE3MTk2NTk0MDMsImV4cCI6MTcxOTY2MzAwM30.DCj-b_pfChGwgCf2erEKOdLWeDoMeKfc_3CFLVJTx8k'
  ),
});

const expectedUnauthorizedResponse = {
  "message": "Unauthorized",
  "statusCode": 401
};

describe('GET /auth/login', () => {
  it('returns an HTTP 200 and returns an auth token', () => {
    provider
      .given('a user with foobar@gmail.com:test1234$$A exists')
      .uponReceiving('a request to log in user foobar@gmail.com:test1234$$A')
      .withRequest({
        method: 'POST',
        path: '/api/auth/login',
        headers: { Accept: 'application/json' },
        body: expectedRequest,
      })
      .willRespondWith({
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: expectedSuccessResponse,
      });

    return provider.executeTest(async (mockserver) => {
      axiosInstance.defaults.baseURL = mockserver.url;
      const accessToken = await login({
        email: 'foobar@gmail.com',
        password: 'test1234$$A',
      });

      expect(accessToken).toBeTypeOf('string')
    });
  });

  it('returns an HTTP 401 Unathorized error', () => {
    provider
      .given('a user with foobar@gmail.com:test1234$$A does not exist')
      .uponReceiving('a request to log in user foobar@gmail.com:test1234$$A')
      .withRequest({
        method: 'POST',
        path: '/api/auth/login',
        headers: { Accept: 'application/json' },
        body: expectedRequest,
      })
      .willRespondWith({
        status: 401,
        headers: { 'Content-Type': 'application/json' },
        body: expectedUnauthorizedResponse,
      });

    return provider.executeTest(async (mockserver) => {
      axiosInstance.defaults.baseURL = mockserver.url;

      await expect(login({
        email: 'foobar@gmail.com',
        password: 'test1234$$A',
      })).rejects.toThrowError();
    });
  });
});
