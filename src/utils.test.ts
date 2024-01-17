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
      const mockPublicKey =
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwA9Z7o0z3DYfB+NiqnXCzCoPwDMARvL6gmbELeW9pmVIT1ZJY4u7PL9CGP2HTpKVVHlULRFEYWt1KZnMt0p+7zjmVwxYSVkrZNLOV0hWO6ej9EfLyIKduiNL1lmSN94yTgt0NbU8nIaUzkOWxf321ER/Ru/QMlmX+nLJfF0z1s4oarfY7mIdgPSrPcwgaHsyvuiYjZFKoph23CAu3335ZudZ//HEiWxo2+nRjltCelBLHCVpsCk+Rbfp38RNEfDvjFC4wzzosH65cQ2KyFKdyOOiqUO447zmHNh15CD/+g0kxgjyZSIWMkPFrEf+x66ruTRisYOObKdUezLpos+jXQIDAQAB';

      const testData = 'Hello, World!';

      const encryptedData = encrypt(testData, mockPublicKey);

      expect(encryptedData).toBeDefined();
      expect(encryptedData.length).toBeGreaterThan(0);
    });
  });
});
