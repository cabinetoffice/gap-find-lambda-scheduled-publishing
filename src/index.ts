import { type SQSHandler } from "aws-lambda";
import axios from "axios";
import { calculateTimeToWait, delay } from "./utils";

const genericErrorMessage = "Failed to process advert: ";

export const handler: SQSHandler = async (event) => {
  const timeBeforePost = new Date();
  const messageAttributes = event.Records[0].messageAttributes;
  const grantAdvertId = messageAttributes.grantAdvertId.stringValue;
  const action = messageAttributes.action.stringValue;

  if (!grantAdvertId)
    throw new Error(genericErrorMessage + "No grantAdvertId found");
  if (!action) throw new Error(genericErrorMessage + "No action found");

  if (action === "PUBLISH") {
    await publishGrantAdvert(grantAdvertId);
  } else if (action === "UNPUBLISH") {
    await removeApplications(grantAdvertId);
    await unpublishGrantAdvert(grantAdvertId);
  } else {
    throw new Error(
      genericErrorMessage + '"' + action + '" is not a recognised action'
    );
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

const removeApplications = async (grantAdvertId: string) =>
  axios.post(
    `${process.env.BACKEND_URL}/application-forms/lambda/${grantAdvertId}`,
    {},
    {
      headers: {
        Authorization: process.env.ADMIN_API_SECRET,
      },
    }
  );

const publishGrantAdvert = async (grantAdvertId: string) => {
  await axios.post(
    `${process.env.BACKEND_URL}/grant-advert/lambda/${grantAdvertId}/publish`,
    {},
    {
      headers: {
        Authorization: process.env.ADMIN_API_SECRET,
      },
    }
  );
};

const unpublishGrantAdvert = async (grantAdvertId: string) => {
  await axios.post(
    `${process.env.BACKEND_URL}/grant-advert/lambda/${grantAdvertId}/unpublish`,
    {},
    {
      headers: {
        Authorization: process.env.ADMIN_API_SECRET,
      },
    }
  );
};
