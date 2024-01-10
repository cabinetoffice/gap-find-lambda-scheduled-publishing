import NodeRSA from 'node-rsa';
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

export const encrypt = (data: string, publicKey: string): string => {
  const key = new NodeRSA();
  const publicKeyWithBeginAndEnd = `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`;
  key.importKey(publicKeyWithBeginAndEnd, 'pkcs8-public-pem', { encryptionScheme: 'pkcs1', signingScheme: 'pkcs1' });

  return key.encrypt(data, 'base64');
};
