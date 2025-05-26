import dayjs from 'dayjs';

const getTwoRandomDates = () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 365));

  startDate.setHours(Math.floor(Math.random() * 24));
  startDate.setMinutes(Math.floor(Math.random() * 60));
  startDate.setSeconds(0);

  const endDate = new Date(startDate);
  const daysDifference = Math.floor(Math.random() * 4);

  endDate.setDate(startDate.getDate() + daysDifference);

  endDate.setHours(Math.floor(Math.random() * 24));
  endDate.setMinutes(Math.floor(Math.random() * 60));

  return [startDate, endDate];
};

const getDateDifference = (date1, date2) => {
  const start = dayjs(date1);
  const end = dayjs(date2);
  let difference = Math.abs(end.diff(start, 'minute'));

  const days = Math.floor(difference / (24 * 60));
  difference -= days * 24 * 60;
  const hours = Math.floor(difference / 60);
  const minutes = difference % 60;

  if (days > 0) {
    return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  } else if (hours > 0) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  } else {
    return `${String(minutes).padStart(2, '0')}M`;
  }
};

const updatePoint = (points, updatedPoint) => points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);

const getTime = (date) => dayjs(date).format('HH:mm');

const getMonthAndDate = (date) => dayjs(date).format('MMM DD');

const getFullDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const isPastEvent = (date) => dayjs(date).isBefore(dayjs());

const isPresentEvent = (dateFrom, dateTo) => dayjs(dateFrom).isBefore(dayjs()) && dayjs(dateTo).isAfter(dayjs());

const isFutureEvent = (date) => dayjs(date).isAfter(dayjs());

export {getTwoRandomDates, getDateDifference, getTime, getMonthAndDate, getFullDate, isPastEvent, isPresentEvent, isFutureEvent, updatePoint};
