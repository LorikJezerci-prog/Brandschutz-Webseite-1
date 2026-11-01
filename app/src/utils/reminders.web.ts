import { Appointment } from '@/store/types';

/** Im Browser gibt es keine Erinnerungen; auf dem Handy übernimmt reminders.ts. */
export const appointmentDate = (a: Pick<Appointment, 'date' | 'time'>) =>
  new Date(`${a.date}T${a.time || '08:00'}:00`);

export async function scheduleReminder(_a: Appointment): Promise<string | undefined> {
  return undefined;
}

export async function cancelReminder(_id?: string) {}

export const remindersSupported = false;
