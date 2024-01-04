import { describe, expect } from '@jest/globals';
import { type Callback, type Context, type SQSBatchResponse, type SQSEvent } from 'aws-lambda';
import axios from 'axios';
import { handler } from '.';
import { getProps, type Optional } from './types';
import { encrypt, getMilliSecondsBetween } from './utils';

jest.mock('axios');
jest.mock('./utils');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Lambda handler', () => {
  beforeEach(() => {
    process.env.ADMIN_API_SECRET = 'testSecret';
    process.env.BACKEND_URL = 'http://localhost:8080';
    process.env.MIN_TIME_TO_WAIT_MILLISECONDS = '100';
    process.env.ADMIN_API_PUBLIC_KEY = 'testPublicKey';
  });

  const getDefaultHandlerProps = (): Parameters<typeof handler> => [
    {
      Records: [
        {
          messageAttributes: {
            grantAdvertId: { stringValue: 'testGrantAdvertId' },
            action: { stringValue: 'PUBLISH' },
          },
        },
      ],
    } as Optional<SQSEvent> as SQSEvent,
    null as unknown as Context,
    null as unknown as Callback<void | SQSBatchResponse>,
  ];

  it('Should send a publish request to the backend when the action is PUBLISH', async () => {
    (encrypt as jest.Mock).mockReturnValueOnce('testEncryptedToken');

    await handler(...getProps(getDefaultHandlerProps));

    expect(mockedAxios.post).toHaveBeenNthCalledWith(
      1,
      'http://localhost:8080/grant-advert/lambda/testGrantAdvertId/publish',
      {},
      {
        headers: { Authorization: 'testEncryptedToken' },
      }
    );
  });

  it('Should send an unpublish request to the backend when the action is UNPUBLISH', async () => {
    (encrypt as jest.Mock).mockReturnValueOnce('testEncryptedToken');

    await handler(
      ...getProps(getDefaultHandlerProps, [
        {
          Records: [{ messageAttributes: { action: { stringValue: 'UNPUBLISH' } } }],
        },
      ])
    );

    expect(mockedAxios.delete).toHaveBeenNthCalledWith(
      1,
      'http://localhost:8080/application-forms/lambda/testGrantAdvertId/application',
      {
        headers: { Authorization: 'testEncryptedToken' },
      }
    );

    expect(mockedAxios.post).toHaveBeenNthCalledWith(
      1,
      'http://localhost:8080/grant-advert/lambda/testGrantAdvertId/unpublish',
      {},
      {
        headers: { Authorization: 'testEncryptedToken' },
      }
    );
  });

  it('Should throw an error when the action is unrecognised', async () => {
    await expect(
      handler(
        ...getProps(getDefaultHandlerProps, [
          {
            Records: [
              {
                messageAttributes: {
                  action: { stringValue: 'Unrecognised value' },
                },
              },
            ],
          },
        ])
      )
    ).rejects.toThrowError('Failed to process advert: "Unrecognised value" is not a recognised action');
  });

  it('Should take at least 100ms', async () => {
    const before = new Date();

    await handler(...getProps(getDefaultHandlerProps));

    const after = new Date();
    const difference = getMilliSecondsBetween(before, after);
    console.log('difference', difference);
    expect(difference).toBeGreaterThanOrEqual(99);
  });

  it('Should throw an error when the backend request fails', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Error'));

    await expect(handler(...getProps(getDefaultHandlerProps))).rejects.toThrowError('Error');
  });

  it('Should throw an error when the grantAdvertId is not provided', async () => {
    await expect(
      handler(
        ...getProps(getDefaultHandlerProps, [
          {
            Records: [
              {
                messageAttributes: {
                  // Lodash's merge doesn't override when passing in undefined, so we have to use null here and tell typescript to be happy
                  grantAdvertId: { stringValue: null as unknown as undefined },
                },
              },
            ],
          },
        ])
      )
    ).rejects.toThrowError('Failed to process advert: No grantAdvertId found');
  });

  it('Should throw an error when the action is not provided', async () => {
    await expect(
      handler(
        ...getProps(getDefaultHandlerProps, [
          {
            Records: [
              {
                messageAttributes: {
                  // Lodash's merge doesn't override when passing in undefined, so we have to use null here and tell typescript to be happy
                  action: { stringValue: null as unknown as undefined },
                },
              },
            ],
          },
        ])
      )
    ).rejects.toThrowError('Failed to process advert: No action found');
  });
});
