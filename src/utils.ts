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
  key.importKey(publicKey, 'pkcs8-public-pem');

  return key.encrypt(data, 'base64');
};
