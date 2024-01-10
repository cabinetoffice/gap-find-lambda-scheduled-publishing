import * as crypto from 'crypto';
export const delay = (milliseconds: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

export const getMilliSecondsBetween = (before: Date, after: Date) => {
  return after.getTime() - before.getTime();
};

export const calculateTimeToWait = (minTime: number, before: Date, after: Date) => {
  const differenceInMilliseconds = getMilliSecondsBetween(after, before);
  return minTime + differenceInMilliseconds;
};

export const encrypt = (secret: string, publicKey: string): string => {
  const publicKeyWithBeginAndEnd = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;

  const publicKeyBuffer = Buffer.from(publicKeyWithBeginAndEnd, 'utf-8');

  const encryptedBuffer = crypto.publicEncrypt(
    {
      key: publicKeyBuffer,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(secret, 'utf-8')
  );

  return encryptedBuffer.toString('base64');
};
