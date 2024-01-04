import { calculateTimeToWait, delay, encrypt, getMilliSecondsBetween } from './utils';

describe('utils', () => {
  describe('delay', () => {
    it('Case 1', async () => {
      const before = new Date();
      await delay(100);
      const after = new Date();

      const timeBetween = getMilliSecondsBetween(before, after);

      expect(timeBetween).toBeGreaterThanOrEqual(98);
      expect(timeBetween).toBeLessThanOrEqual(102);
    });

    it('Case 2', async () => {
      const before = new Date();
      await delay(1000);
      const after = new Date();

      const timeBetween = getMilliSecondsBetween(before, after);

      expect(timeBetween).toBeGreaterThanOrEqual(998);
      expect(timeBetween).toBeLessThanOrEqual(1002);
    });
  });

  describe('getMillisecondsBetween', () => {
    it('Case 1', () => {
      const before = new Date(2022, 12, 1, 10, 0, 0);
      const after = new Date(2022, 12, 1, 10, 1, 12);

      const result = getMilliSecondsBetween(before, after);

      const oneMinuteAndTwelveSecondsInMilliseconds = 12 * 1000 + 1 * 60 * 1000;
      expect(result).toStrictEqual(oneMinuteAndTwelveSecondsInMilliseconds);
    });

    it('Case 2', () => {
      const before = new Date(2022, 11, 31, 10, 1, 12);
      const after = new Date(2022, 12, 1, 10, 1, 12);

      const result = getMilliSecondsBetween(before, after);

      const oneDayInMilliseconds = 1000 * 60 * 60 * 24;
      expect(result).toStrictEqual(oneDayInMilliseconds);
    });
  });

  describe('calculateTimeToWait', () => {
    it('Case 1', () => {
      const minTime = 72000;
      const before = new Date(2022, 12, 1, 10, 0, 0);
      const after = new Date(2022, 12, 1, 10, 1, 12);

      const result = calculateTimeToWait(minTime, before, after);

      expect(result).toStrictEqual(0);
    });

    it('Case 2', () => {
      const minTime = 100000;
      const before = new Date(2022, 12, 1, 10, 0, 0);
      const after = new Date(2022, 12, 1, 10, 1, 12);

      const result = calculateTimeToWait(minTime, before, after);

      expect(result).toStrictEqual(28000);
    });

    it('Case 3', () => {
      const minTime = 0;
      const before = new Date(2022, 12, 1, 10, 0, 0);
      const after = new Date(2022, 12, 1, 10, 1, 12);

      const result = calculateTimeToWait(minTime, before, after);

      expect(result).toStrictEqual(-72000);
    });
  });

  describe('encrypt function', () => {
    it('should encrypt data using the provided public key', () => {
      const mockPublicKey = `
        -----BEGIN PUBLIC KEY-----
        MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7e7oyeyA5S6v9SgFIoDi
        6kuzsFuk4U2DZUVjjRjwjX7OS/Wdxhb66HODm0J4lgvj2jb3wxjkgLyRlxdnKLUe
        DkOpZ37HgUzbdNc83aQwt6ZpBB/xskc+L5d/JAQTmI3eWRld+edkGROeTk9t9AMO
        I8Xan9dI7XpA5D+eZAxLCX2s0eOqRLD1YB4D+lcj+R0aFj8aFFxf6bLOVpNt9/Sy
        4I74sDkxDh19WmZwM1tQADK93yXHTeDKE0jqKmbT6Do0A7m+/68UDsbImQuZ0wZB
        Nnl2Bb5qOWeWvOLoFJwMio+Go1ScyZwrtQyl2A9pw+fUGd5BuK2UGkxGOUgH+H0W
        xwIDAQAB
        -----END PUBLIC KEY-----
      `;

      const testData = 'Hello, World!';
      const encryptedData = encrypt(testData, mockPublicKey);

      expect(encryptedData).toBeDefined();
      expect(encryptedData.length).toBeGreaterThan(0);
    });
  });
});
