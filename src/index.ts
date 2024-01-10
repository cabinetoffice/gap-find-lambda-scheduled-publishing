import { type SQSHandler } from 'aws-lambda';
import axios from 'axios';
import { calculateTimeToWait, delay, encrypt } from './utils';

const genericErrorMessage = 'Failed to process advert: ';

export const handler: SQSHandler = async (event) => {
  const timeBeforePost = new Date();
  const messageAttributes = event.Records[0].messageAttributes;
  const grantAdvertId = messageAttributes.grantAdvertId.stringValue;
  const action = messageAttributes.action.stringValue;

  if (!grantAdvertId) throw new Error(genericErrorMessage + 'No grantAdvertId found');
  if (!action) throw new Error(genericErrorMessage + 'No action found');
  const encryptedToken = encrypt(process.env.ADMIN_API_SECRET, process.env.ADMIN_API_PUBLIC_KEY);

  if (action === 'PUBLISH') {
    await publishGrantAdvert(grantAdvertId, encryptedToken);
  } else if (action === 'UNPUBLISH') {
    await removeApplications(grantAdvertId, encryptedToken);
    await unpublishGrantAdvert(grantAdvertId, encryptedToken);
  } else {
    throw new Error(genericErrorMessage + '"' + action + '" is not a recognised action');
  }

  const timeAfterPost = new Date();
  const timeToWait = calculateTimeToWait(
    parseInt(process.env.MIN_TIME_TO_WAIT_MILLISECONDS!),
    timeBeforePost,
    timeAfterPost
  );

  if (timeToWait > 0) {
    await delay(timeToWait);
  }
};

const removeApplications = async (grantAdvertId: string, encryptedToken: string) =>
  axios.delete(`${process.env.BACKEND_URL}/application-forms/lambda/${grantAdvertId}/application`, {
    headers: {
      Authorization: encryptedToken,
    },
  });

const publishGrantAdvert = async (grantAdvertId: string, encryptedToken: string) => {
  await axios.post(
    `${process.env.BACKEND_URL}/grant-advert/lambda/${grantAdvertId}/publish`,
    {},
    {
      headers: {
        Authorization: encryptedToken,
      },
    }
  );
};

const unpublishGrantAdvert = async (grantAdvertId: string, encryptedToken: string) => {
  await axios.post(
    `${process.env.BACKEND_URL}/grant-advert/lambda/${grantAdvertId}/unpublish`,
    {},
    {
      headers: {
        Authorization: encryptedToken,
      },
    }
  );
};
