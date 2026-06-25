type NotificationFrequency = 'daily' | 'weekly' | 'monthly';

const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

const addDays = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

const formatPeriodDate = (date: Date) =>
  date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const getReportDateRange = (
  frequency: NotificationFrequency,
  now = new Date(),
) => {
  if (frequency === 'daily') {
    const day = addDays(now, -1);
    return {
      start: startOfDay(day),
      end: endOfDay(day),
      startDate: startOfDay(day).toISOString().slice(0, 10),
      endDate: endOfDay(day).toISOString().slice(0, 10),
      periodLabel: formatPeriodDate(day),
    };
  }

  if (frequency === 'weekly') {
    const current = startOfDay(now);
    const day = current.getDay();
    const diffToMonday = (day + 6) % 7;
    const thisWeekStart = addDays(current, -diffToMonday);
    const start = addDays(thisWeekStart, -7);
    const end = endOfDay(addDays(start, 6));

    return {
      start,
      end,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      periodLabel: `${formatPeriodDate(start)} – ${formatPeriodDate(end)}`,
    };
  }

  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0));

  return {
    start,
    end,
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    periodLabel: start.toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
    }),
  };
};

export const getFrequencyLabel = (frequency: NotificationFrequency) => {
  if (frequency === 'daily') return 'Daily';
  if (frequency === 'weekly') return 'Weekly';
  return 'Monthly';
};

export const getReportTypeLabel = (type: 'overview' | 'sales' | 'form') => {
  if (type === 'sales') return 'Sales';
  if (type === 'form') return 'Form';
  return 'Overview';
};

export const shouldSendForFrequency = (
  frequency: NotificationFrequency,
  lastSentAt: Date | null | undefined,
  now = new Date(),
) => {
  const { start } = getReportDateRange(frequency, now);

  if (!lastSentAt) {
    return true;
  }

  return lastSentAt < start;
};

export const isScheduledRunDay = (
  frequency: NotificationFrequency,
  now = new Date(),
) => {
  if (frequency === 'daily') {
    return true;
  }

  if (frequency === 'weekly') {
    return now.getDay() === 1;
  }

  return now.getDate() === 1;
};
