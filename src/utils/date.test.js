import { describe, it, expect } from 'vitest';
import { getLocalDateString } from './date';

describe('getLocalDateString', () => {
  it('formats January 5 as 2023-01-05', () => {
    const date = new Date(2023, 0, 5);
    expect(getLocalDateString(date)).toBe('2023-01-05');
  });
});
