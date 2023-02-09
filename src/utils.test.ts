import { calculateTimeToWait, delay, getMilliSecondsBetween } from "./utils";

describe("utils", () => {
  describe("delay", () => {
    it("Case 1", async () => {
      const before = new Date();
      await delay(100);
      const after = new Date();

      const timeBetween = getMilliSecondsBetween(before, after);

      expect(timeBetween).toBeGreaterThanOrEqual(98);
      expect(timeBetween).toBeLessThanOrEqual(102);
    });

    it("Case 2", async () => {
      const before = new Date();
      await delay(1000);
      const after = new Date();

      const timeBetween = getMilliSecondsBetween(before, after);

      expect(timeBetween).toBeGreaterThanOrEqual(998);
      expect(timeBetween).toBeLessThanOrEqual(1002);
    });
  });

  describe("getMillisecondsBetween", () => {
    it("Case 1", () => {
      const before = new Date(2022, 12, 1, 10, 0, 0);
      const after = new Date(2022, 12, 1, 10, 1, 12);

      const result = getMilliSecondsBetween(before, after);

      const oneMinuteAndTwelveSecondsInMilliseconds = 12 * 1000 + 1 * 60 * 1000;
      expect(result).toStrictEqual(oneMinuteAndTwelveSecondsInMilliseconds);
    });

    it("Case 2", () => {
      const before = new Date(2022, 11, 31, 10, 1, 12);
      const after = new Date(2022, 12, 1, 10, 1, 12);

      const result = getMilliSecondsBetween(before, after);

      const oneDayInMilliseconds = 1000 * 60 * 60 * 24;
      expect(result).toStrictEqual(oneDayInMilliseconds);
    });
  });

  describe("calculateTimeToWait", () => {
    it("Case 1", () => {
      const minTime = 72000;
      const before = new Date(2022, 12, 1, 10, 0, 0);
      const after = new Date(2022, 12, 1, 10, 1, 12);

      const result = calculateTimeToWait(minTime, before, after);

      expect(result).toStrictEqual(0);
    });

    it("Case 2", () => {
      const minTime = 100000;
      const before = new Date(2022, 12, 1, 10, 0, 0);
      const after = new Date(2022, 12, 1, 10, 1, 12);

      const result = calculateTimeToWait(minTime, before, after);

      expect(result).toStrictEqual(28000);
    });

    it("Case 3", () => {
      const minTime = 0;
      const before = new Date(2022, 12, 1, 10, 0, 0);
      const after = new Date(2022, 12, 1, 10, 1, 12);

      const result = calculateTimeToWait(minTime, before, after);

      expect(result).toStrictEqual(-72000);
    });
  });
});
