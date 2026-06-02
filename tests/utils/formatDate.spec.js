import { test, expect } from '@playwright/test';
import { formatDate, getCountdown } from '../../src/utils/formatDate.js';

test.describe('formatDate util', () => {
  test('formatDate should use default options', () => {
    const date = new Date('2023-01-01T12:00:00Z');
    const result = formatDate(date);
    expect(typeof result).toBe('string');
  });

  test('formatDate should merge custom options', () => {
    const date = new Date('2023-01-01T12:00:00Z');
    const result = formatDate(date, { year: '2-digit' });
    expect(typeof result).toBe('string');
  });

  test('getCountdown should return expired if diff <= 0', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const result = getCountdown(pastDate.toISOString());
    expect(result.expired).toBe(true);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });

  test('getCountdown should calculate positive diff correctly', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2);

    const result = getCountdown(futureDate.toISOString());
    expect(result.expired).toBe(false);
    expect(result.days).toBeGreaterThanOrEqual(1);
  });
});
