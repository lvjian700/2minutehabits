import { getLocalDateString } from './date';

// Current app version constant can be re-exported for reuse
export const APP_VERSION = '0.2.0';

/**
 * Trigger download of the user's habit data as a JSON backup file.
 */
export function exportHabitsToFile(habits, version = APP_VERSION) {
  const exportData = {
    version,
    habits: {
      active: habits.active,
    },
  };
  const data = JSON.stringify(exportData, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `2-minutes-habits-backup-${getLocalDateString()}-${version}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parse a JSON backup file selected by the user and return the HabitStore data.
 * Throws an error if the format is invalid or the version mismatches.
 */
export async function importHabitsFromFile(
  file,
  expectedVersion = APP_VERSION
) {
  const text = await file.text();
  const importedData = JSON.parse(text);

  if (
    importedData.version === expectedVersion &&
    importedData.habits?.active
  ) {
    return importedData.habits;
  }
  throw new Error('Invalid data format');
}
