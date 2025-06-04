/**
 * Format a date to show time passed in a human-readable format
 */
export const formatDistanceToNow = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Define time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  // For future dates (like expiration dates), calculate time until
  if (diffInSeconds < 0) {
    const positiveSeconds = Math.abs(diffInSeconds);
    
    if (positiveSeconds >= intervals.month) {
      const count = Math.floor(positiveSeconds / intervals.month);
      return `${count} ${count === 1 ? 'month' : 'months'}`;
    }
    if (positiveSeconds >= intervals.week) {
      const count = Math.floor(positiveSeconds / intervals.week);
      return `${count} ${count === 1 ? 'week' : 'weeks'}`;
    }
    if (positiveSeconds >= intervals.day) {
      const count = Math.floor(positiveSeconds / intervals.day);
      return `${count} ${count === 1 ? 'day' : 'days'}`;
    }
    if (positiveSeconds >= intervals.hour) {
      const count = Math.floor(positiveSeconds / intervals.hour);
      return `${count} ${count === 1 ? 'hour' : 'hours'}`;
    }
    if (positiveSeconds >= intervals.minute) {
      const count = Math.floor(positiveSeconds / intervals.minute);
      return `${count} ${count === 1 ? 'minute' : 'minutes'}`;
    }
    return 'less than a minute';
  }
  
  // For past dates, show time since
  if (diffInSeconds >= intervals.year) {
    const count = Math.floor(diffInSeconds / intervals.year);
    return `${count} ${count === 1 ? 'year' : 'years'}`;
  }
  if (diffInSeconds >= intervals.month) {
    const count = Math.floor(diffInSeconds / intervals.month);
    return `${count} ${count === 1 ? 'month' : 'months'}`;
  }
  if (diffInSeconds >= intervals.week) {
    const count = Math.floor(diffInSeconds / intervals.week);
    return `${count} ${count === 1 ? 'week' : 'weeks'}`;
  }
  if (diffInSeconds >= intervals.day) {
    const count = Math.floor(diffInSeconds / intervals.day);
    return `${count} ${count === 1 ? 'day' : 'days'}`;
  }
  if (diffInSeconds >= intervals.hour) {
    const count = Math.floor(diffInSeconds / intervals.hour);
    return `${count} ${count === 1 ? 'hour' : 'hours'}`;
  }
  if (diffInSeconds >= intervals.minute) {
    const count = Math.floor(diffInSeconds / intervals.minute);
    return `${count} ${count === 1 ? 'minute' : 'minutes'}`;
  }
  return 'just now';
};