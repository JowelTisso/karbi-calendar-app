// Mock holiday data for development
// This simulates the API response until the backend is ready

import type { Holiday } from '@/types';

// Helper to create date string
const makeDate = (year: number, month: number, day: number): string => {
  const m = month.toString().padStart(2, '0');
  const d = day.toString().padStart(2, '0');
  return `${year}-${m}-${d}`;
};

// Generate holidays for a given year
export const getMockHolidays = (year: number): Holiday[] => {
  const holidays: Holiday[] = [
    // January
    {
      id: `${year}-new-year`,
      name: 'New Year\'s Day',
      date: makeDate(year, 1, 1),
      type: 'national',
      description: 'First day of the new year',
    },
    {
      id: `${year}-republic-day`,
      name: 'Republic Day',
      date: makeDate(year, 1, 26),
      type: 'national',
      description: 'Celebrates the adoption of the Constitution of India',
    },

    // March
    {
      id: `${year}-holi`,
      name: 'Holi',
      date: makeDate(year, 3, 14),
      type: 'national',
      description: 'Festival of Colors',
    },

    // April
    {
      id: `${year}-good-friday`,
      name: 'Good Friday',
      date: makeDate(year, 4, 7),
      type: 'national',
      description: 'Christian observance commemorating the crucifixion of Jesus',
    },
    {
      id: `${year}-ambedkar-jayanti`,
      name: 'Ambedkar Jayanti',
      date: makeDate(year, 4, 14),
      type: 'national',
      description: 'Birth anniversary of Dr. B.R. Ambedkar',
    },

    // May
    {
      id: `${year}-buddha-purnima`,
      name: 'Buddha Purnima',
      date: makeDate(year, 5, 5),
      type: 'national',
      description: 'Celebrates the birth of Gautama Buddha',
    },

    // August
    {
      id: `${year}-independence-day`,
      name: 'Independence Day',
      date: makeDate(year, 8, 15),
      type: 'national',
      description: 'Celebrates India\'s independence from British rule',
    },
    {
      id: `${year}-raksha-bandhan`,
      name: 'Raksha Bandhan',
      date: makeDate(year, 8, 19),
      type: 'regional',
      description: 'Festival celebrating the bond between brothers and sisters',
    },
    {
      id: `${year}-janmashtami`,
      name: 'Janmashtami',
      date: makeDate(year, 8, 26),
      type: 'national',
      description: 'Celebrates the birth of Lord Krishna',
    },

    // September
    {
      id: `${year}-ganesh-chaturthi`,
      name: 'Ganesh Chaturthi',
      date: makeDate(year, 9, 7),
      type: 'regional',
      description: 'Festival celebrating the birth of Lord Ganesha',
    },

    // October
    {
      id: `${year}-gandhi-jayanti`,
      name: 'Gandhi Jayanti',
      date: makeDate(year, 10, 2),
      type: 'national',
      description: 'Birth anniversary of Mahatma Gandhi',
    },
    {
      id: `${year}-dussehra`,
      name: 'Dussehra',
      date: makeDate(year, 10, 12),
      type: 'national',
      description: 'Victory of good over evil, celebrates Lord Rama\'s victory',
    },

    // November
    {
      id: `${year}-diwali`,
      name: 'Diwali',
      date: makeDate(year, 11, 1),
      type: 'national',
      description: 'Festival of Lights',
    },
    {
      id: `${year}-guru-nanak-jayanti`,
      name: 'Guru Nanak Jayanti',
      date: makeDate(year, 11, 15),
      type: 'national',
      description: 'Birth anniversary of Guru Nanak Dev',
    },

    // December
    {
      id: `${year}-christmas`,
      name: 'Christmas',
      date: makeDate(year, 12, 25),
      type: 'national',
      description: 'Celebrates the birth of Jesus Christ',
    },
  ];

  return holidays;
};

// Get holidays for a specific date range
export const getMockHolidaysInRange = (
  startDate: string,
  endDate: string
): Holiday[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const years = new Set<number>();

  // Get all years in the range
  for (let d = new Date(start); d <= end; d.setFullYear(d.getFullYear() + 1)) {
    years.add(d.getFullYear());
  }

  // Get holidays for all years and filter by date range
  const allHolidays: Holiday[] = [];
  years.forEach((year) => {
    allHolidays.push(...getMockHolidays(year));
  });

  return allHolidays.filter((holiday) => {
    const holidayDate = new Date(holiday.date);
    return holidayDate >= start && holidayDate <= end;
  });
};

// Get holiday by date
export const getMockHolidayByDate = (date: string): Holiday | undefined => {
  const year = new Date(date).getFullYear();
  const holidays = getMockHolidays(year);
  return holidays.find((h) => h.date === date);
};

export default getMockHolidays;
