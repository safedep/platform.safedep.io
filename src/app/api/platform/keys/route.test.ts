import 'cross-fetch/polyfill';
import { NextRequest, NextResponse } from "next/server";
import { GET } from './route';

describe('JSDOM Environment', () => {
  it('should define TextEncoder', () => {
    expect(TextEncoder).toBeDefined();
  })

  it('should define TextDecoder', () => {
    expect(TextDecoder).toBeDefined();
  })
})

describe('List API keys', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should return a list of keys', async () => {
    const getAccessTokenMock = jest.fn();
    getAccessTokenMock.mockResolvedValue({ accessToken: 'accessToken' });

    const sessionMustGetTenantMock = jest.fn();
    sessionMustGetTenantMock.mockResolvedValue('tenant');

    const createApiKeyServiceClientMock = jest.fn();
    createApiKeyServiceClientMock.mockReturnValue({
      listApiKeys: jest.fn().mockResolvedValue({
        keys: [
          {
            keyId: 'keyId',
            name: 'name',
            description: 'description',
            expiresAt: new Date(),
          },
        ],
      }),
    });

    jest.mock('@auth0/nextjs-auth0', () => ({ getAccessToken: getAccessTokenMock }));
    jest.mock('../../../../lib/session/session', () => ({ sessionMustGetTenant: sessionMustGetTenantMock }));
    jest.mock('../../../../lib/rpc/client', () => ({ createApiKeyServiceClient: createApiKeyServiceClientMock }));

    const response = (await GET(new NextRequest(new Request('http://localhost/api/keys')))) as NextResponse

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      keys: [
        {
          id: 'keyId',
          name: 'name',
          description: 'description',
          expiry: expect.any(Date),
        },
      ],
      total: 1,
    });
  })
})

