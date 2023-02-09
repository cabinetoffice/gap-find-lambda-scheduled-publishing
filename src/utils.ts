export const delay = (milliseconds: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

export const getMilliSecondsBetween = (before: Date, after: Date) => {
  return after.getTime() - before.getTime();
};

export const calculateTimeToWait = (
  minTime: number,
  before: Date,
  after: Date
) => {
  const differenceInMilliseconds = getMilliSecondsBetween(after, before);
  return minTime + differenceInMilliseconds;
};
