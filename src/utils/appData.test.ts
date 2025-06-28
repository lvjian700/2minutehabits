import { describe, it, expect, vi, beforeEach, afterEach, SpyInstance } from 'vitest';
import { exportHabitsToFile, importHabitsFromFile, APP_VERSION } from './appData';
import type { HabitStore } from '../types/Habit';

// A minimal stub habit store for testing
const sampleHabits: HabitStore = {
  active: [
    {
      id: 1,
      name: 'Test',
      icon: '🔥',
      priority: 1,
      logs: {},
    },
  ],
};

describe('exportHabitsToFile', () => {
  let createObjectURLSpy: SpyInstance;
  let revokeObjectURLSpy: SpyInstance;
  let appendChildSpy: SpyInstance;
  let removeChildSpy: SpyInstance;

  beforeEach(() => {
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob://dummy');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    appendChildSpy = vi.spyOn(document.body, 'appendChild');
    removeChildSpy = vi.spyOn(document.body, 'removeChild');
  });

  afterEach(() => {
    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it('creates a download link and revokes URL', () => {
    exportHabitsToFile(sampleHabits, APP_VERSION);
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });

});

describe('importHabitsFromFile', () => {
  it('returns HabitStore for valid backup', async () => {
    const data = JSON.stringify({ version: APP_VERSION, habits: sampleHabits });
    // Minimal File mock with required text() method
    const fileMock = { text: () => Promise.resolve(data) } as unknown as File;

    const imported = await importHabitsFromFile(fileMock, APP_VERSION);
    expect(imported).toEqual(sampleHabits);
  });

  it('throws on invalid data', async () => {
    const badData = JSON.stringify({ foo: 'bar' });
    const badFileMock = { text: () => Promise.resolve(badData) } as unknown as File;

    await expect(importHabitsFromFile(badFileMock, APP_VERSION)).rejects.toThrow();
  });
});
