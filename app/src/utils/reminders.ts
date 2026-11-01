import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { Appointment } from '@/store/types';
import { formatDate } from './format';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let channelReady = false;
async function ensurePermission() {
  if (Platform.OS === 'android' && !channelReady) {
    await Notifications.setNotificationChannelAsync('termine', {
      name: 'Termine',
      importance: Notifications.AndroidImportance.HIGH,
    });
    channelReady = true;
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

export const appointmentDate = (a: Pick<Appointment, 'date' | 'time'>) =>
  new Date(`${a.date}T${a.time || '08:00'}:00`);

/** Plant die Erinnerung neu. Liefert die neue ID oder undefined, wenn keine geplant wurde. */
export async function scheduleReminder(a: Appointment): Promise<string | undefined> {
  await cancelReminder(a.notificationId);
  if (!a.remindBefore || a.done) return undefined;
  const when = new Date(appointmentDate(a).getTime() - a.remindBefore * 60_000);
  if (when.getTime() <= Date.now()) return undefined;
  try {
    if (!(await ensurePermission())) return undefined;
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: a.title,
        body: `${formatDate(a.date)}, ${a.time} Uhr${a.location ? ' · ' + a.location : ''}`,
        data: { appointmentId: a.id },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when, channelId: 'termine' },
    });
  } catch {
    return undefined;
  }
}

export async function cancelReminder(id?: string) {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {}
}

export const remindersSupported = true;
