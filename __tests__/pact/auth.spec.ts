import { expect, it, describe } from 'vitest';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { login } from '@/app/login/page';
import { resolve } from 'node:path';
import { axiosInstance } from '@/axios';

const { like } = MatchersV3;

const provider = new PactV3({
  dir: resolve(process.cwd(), 'pacts'),
  consumer: 'webshop-fronend',
  provider: 'auth-service',
});

const expectedRequest = like({
  email: like('foobar@gmail.com'),
  password: like('test1234$$A'),
});

const expectedResponse = like({
  access_token: like(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvb2JhckBnbWFpbC5jb20iLCJpYXQiOjE3MTk2NTk0MDMsImV4cCI6MTcxOTY2MzAwM30.DCj-b_pfChGwgCf2erEKOdLWeDoMeKfc_3CFLVJTx8k'
  ),
});

describe('GET /auth/login', () => {
  it('returns an HTTP 200 and returns an auth token', () => {
    provider
      .given('a user is not logged in')
      .uponReceiving('a request to log in')
      .withRequest({
        method: 'POST',
        path: '/api/auth/login',
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
      const accessToken = await login({
        email: 'foobar@gmail.com',
        password: 'test1234$$A',
      });

      expect(accessToken).toBeTypeOf('string')
    });
  });
});
