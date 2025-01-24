import dayjs from 'dayjs';

const formatDate = (date: string | Date): string => {
  if (!date) {
    return '-';
  }
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

const formatHistoricalDate = (day: number): string => {
  return dayjs().subtract(day, 'day').format('MMM DD, YYYY');
};

const formatHistoricalTime = (timestamp: number): string => {
  // Check if the timestamp is in milliseconds, convert to seconds if so
  const isMilliseconds = timestamp.toString().length === 13;
  const date = new Date(isMilliseconds ? timestamp : timestamp * 1000);

  // Extract hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format minutes to always show two digits
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Return formatted time
  return `${hours}:${formattedMinutes} ${ampm}`;
};

export { formatDate, formatHistoricalDate, formatHistoricalTime };
