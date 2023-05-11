const unitTestingTask = require("./unitTestingTask");

//------------------ npm test -- --coverage
// new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)

let testingDate;
let testingDate2;

describe("unitTestingTask", () => {
  it("creates a present date when it is not passed as a 2nd parameter", () => {
    const noDateGiven = unitTestingTask("d");
    expect(noDateGiven).toBe(new Date().getDate().toString());
  });

  it("returns NaN if non-existent date provided", () => {
    const wrongDateProvided = unitTestingTask("d", new Date("2023-13-42"));
    expect(wrongDateProvided).toEqual(NaN.toString());
  });

  describe("formatters", () => {
    beforeAll(() => {
      unitTestingTask.register("customFormatter", "dd-MM-YYYY");
      testingDate = new Date(1999, 1, 19, 16, 10, 9);
    });

    it("are registered and added to the _formatters object", () => {
      expect(unitTestingTask._formatters.customFormatter).toBeDefined();
    });

    it("are registered and can be returned by calling formatters function", () => {
      const allFormatters = unitTestingTask.formatters();
      expect(allFormatters.length).toBe(5);
      expect(allFormatters[allFormatters.length - 1]).toBe("customFormatter");
    });

    it("can be provided to the main function and return correct output", () => {
      const customFormat = unitTestingTask("customFormatter", testingDate);
      expect(customFormat).toBe("19-02-1999");
    });
  });

  describe("applies predefined tokens and", () => {
    beforeAll(() => {
      testingDate = new Date(1999, 1, 19, 16, 10, 9);
      testingDate2 = new Date(1993, 1, 2, 3, 4, 5, 6);
    });

    it("returns only year with 4-digits", () => {
      const fullYear = unitTestingTask("YYYY", testingDate);
      expect(fullYear).toBe("1999");
    });

    it("returns only year with 2-digits", () => {
      const shortYear = unitTestingTask("YY", testingDate);
      expect(shortYear).toBe("99");
    });

    it("returns only a month full name", () => {
      const monthFullName = unitTestingTask("MMMM", testingDate);
      expect(monthFullName).toBe("February");
    });

    it("returns only a month short name", () => {
      const monthShortName = unitTestingTask("MMM", testingDate);
      expect(monthShortName).toBe("Feb");
    });

    it("returns which month is it with leading zeros", () => {
      const monthWithZeros = unitTestingTask("MM", testingDate);
      expect(monthWithZeros).toBe("02");
    });

    it("returns which month is it without leading zeros", () => {
      const monthWithoutZeros = unitTestingTask("M", testingDate);
      expect(monthWithoutZeros).toBe("2");
    });

    it("returns what day it is in full", () => {
      const dayFullName = unitTestingTask("DDD", testingDate);
      expect(dayFullName).toBe("Friday");
    });

    it("returns what day it is in a short form (3 letters)", () => {
      const dayShortName = unitTestingTask("DD", testingDate);
      expect(dayShortName).toBe("Fri");
    });

    it("returns what day it is in a short form (2 letters)", () => {
      const dayShortName = unitTestingTask("D", testingDate);
      expect(dayShortName).toBe("Fr");
    });

    it("returns which day of the month is it with leading zeros", () => {
      const dayOfMonthWithZeros = unitTestingTask("dd", testingDate2);
      expect(dayOfMonthWithZeros).toBe("02");
    });

    it("returns which day of the month is it without leading zeros", () => {
      const dayOfMonthWithoutZeros = unitTestingTask("d", testingDate2);
      expect(dayOfMonthWithoutZeros).toBe("2");
    });

    it("returns the hour with leading zeros", () => {
      const hourWithZeros = unitTestingTask("HH", testingDate2);
      expect(hourWithZeros).toBe("03");
    });

    it("returns the hour without leading zeros", () => {
      const hourWithoutZeros = unitTestingTask("H", testingDate2);
      expect(hourWithoutZeros).toBe("3");
    });

    it("returns the hour in 12-h format with leading zeros", () => {
      const hourWithtZeros = unitTestingTask("hh", testingDate);
      expect(hourWithtZeros).toBe("04");
    });

    it("returns the hour in 12-h format without leading zeros", () => {
      const hourWithoutZeros = unitTestingTask("h", testingDate);
      expect(hourWithoutZeros).toBe("4");
    });

    it("returns minutes with leading zeros", () => {
      const minutesWithZeros = unitTestingTask("mm", testingDate2);
      expect(minutesWithZeros).toBe("04");
    });

    it("returns minutes without leading zeros", () => {
      const minutesWithoutZeros = unitTestingTask("m", testingDate2);
      expect(minutesWithoutZeros).toBe("4");
    });

    it("returns seconds with leading zeros", () => {
      const secondsWithZeros = unitTestingTask("ss", testingDate2);
      expect(secondsWithZeros).toBe("05");
    });

    it("returns seconds without leading zeros", () => {
      const secondsWithoutZeros = unitTestingTask("s", testingDate2);
      expect(secondsWithoutZeros).toBe("5");
    });

    it("returns miliseconds with leading zeros", () => {
      const milisecondsWithZeros = unitTestingTask("ff", testingDate2);
      expect(milisecondsWithZeros).toBe("006");
    });

    it("returns miliseconds without leading zeros", () => {
      const milisecondsWithoutZeros = unitTestingTask("f", testingDate2);
      expect(milisecondsWithoutZeros).toBe("6");
    });

    it("returns AM capitalized for hours before noon", () => {
      const am_pm = unitTestingTask("A", testingDate2);
      expect(am_pm).toBe("AM");
    });

    it("returns pm for hours afternoon", () => {
      const am_pm = unitTestingTask("a", testingDate);
      expect(am_pm).toBe("pm");
    });

    it("returns correct time-zone in a basic format", () => {
      const timezone = unitTestingTask("ZZ", testingDate);
      expect(timezone).toBe("-0800");
    });

    it("returns correct time-zone in an extended format", () => {
      const timezone = unitTestingTask("Z", testingDate);
      expect(timezone).toBe("-08:00");
    });
  });

  describe("throws an exception", () => {
    it("when format is not defined", () => {
      expect(() => {
        unitTestingTask();
      }).toThrow("Argument `format` must be a string");
    });

    it("when format is not a string", () => {
      expect(() => {
        const date = new Date();
        unitTestingTask(3, date);
      }).toThrow("Argument `format` must be a string");
    });

    it("when date is an array", () => {
      expect(() => {
        unitTestingTask("d", []);
      }).toThrow(
        "Argument `date` must be instance of Date or Unix Timestamp or ISODate String"
      );
    });
  });
});
