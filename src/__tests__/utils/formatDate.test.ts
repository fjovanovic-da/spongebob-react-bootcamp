import { beforeEach, describe, expect, it } from "vitest";
import { clearDateFormatCache, formatDate } from "../../utils/formatDate";

describe("formatDate", () => {
    beforeEach(() => {
        clearDateFormatCache();
    });

    it("should format a Date object", () => {
        const date = new Date("2025-12-03");
        const result = formatDate(date);

        // Result should be a non-empty string
        expect(result).toBeTruthy();
        expect(typeof result).toBe("string");
    });

    it("should format a date string", () => {
        const dateString = "2025-12-03";
        const result = formatDate(dateString);

        expect(result).toBeTruthy();
        expect(typeof result).toBe("string");
    });

    it("should return cached result for same date", () => {
        const dateString = "2025-12-03";
        const result1 = formatDate(dateString);
        const result2 = formatDate(dateString);

        expect(result1).toBe(result2);
    });

    it("should handle different dates", () => {
        const date1 = formatDate("2025-01-01");
        const date2 = formatDate("2025-12-31");

        expect(date1).not.toBe(date2);
    });
});

describe("clearDateFormatCache", () => {
    it("should clear the cache without errors", () => {
        formatDate("2025-12-03");
        expect(() => clearDateFormatCache()).not.toThrow();
    });
});
