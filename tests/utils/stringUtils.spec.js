import { test, expect } from '@playwright/test';
import { normalizeString, levenshteinDistance, fuzzyMatch } from '../../src/utils/stringUtils.js';

test.describe('stringUtils', () => {
  test('normalizeString handles falsy values', () => {
    expect(normalizeString(null)).toBe('');
    expect(normalizeString('')).toBe('');
  });

  test('normalizeString removes accents and lowercases', () => {
    expect(normalizeString('Atenção')).toBe('atencao');
  });

  test('levenshteinDistance computes correctly', () => {
    expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
    expect(levenshteinDistance('', 'abc')).toBe(3);
    expect(levenshteinDistance('abc', '')).toBe(3);
  });

  test('fuzzyMatch handles falsy query', () => {
    expect(fuzzyMatch('', 'target')).toBe(true);
    expect(fuzzyMatch(null, 'target')).toBe(true);
  });

  test('fuzzyMatch handles falsy target', () => {
    expect(fuzzyMatch('query', '')).toBe(false);
  });

  test('fuzzyMatch matches exact string', () => {
    expect(fuzzyMatch('test', 'this is a test')).toBe(true);
  });

  test('fuzzyMatch matches with distance on full word (lines 60-61)', () => {
    // "camiseto" to "camiseta", length of target word is 8. allowedDistance = Math.floor(8/3) = 2.
    // levenshtein('camiseto', 'camiseta') = 1, which is <= 2.
    expect(fuzzyMatch('camiseto', 'camiseta manga longa')).toBe(true);
  });

  test('fuzzyMatch matches prefix with typo (lines 67-68)', () => {
    // query = "camu", target = "camiseta".
    // tWord.includes("camu") = false.
    // full word levenshtein: "camu" vs "camiseta" = 4 > 2.
    // prefix check: prefix of length 4 is "cami".
    // levenshtein("camu", "cami") = 1 <= 2.
    expect(fuzzyMatch('camu', 'camiseta')).toBe(true);
  });

  test('fuzzyMatch fails when word not matched', () => {
    expect(fuzzyMatch('xyz', 'camiseta')).toBe(false);
  });
  
  test('fuzzyMatch matches multiple words (line 76)', () => {
    expect(fuzzyMatch('camo lnga', 'camiseta manga longa')).toBe(true);
  });
});
