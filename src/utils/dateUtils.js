// Date and time utility functions
import { format, addMinutes, subMinutes, isToday, isTomorrow, parseISO, isValid } from 'date-fns';

export const formatDisplayTime = (date) => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return '';
  return format(parsedDate, 'h:mm a');
};

export const formatDisplayDate = (date) => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return '';
  
  if (isToday(parsedDate)) return 'Today';
  if (isTomorrow(parsedDate)) return 'Tomorrow';
  return format(parsedDate, 'MMM d, yyyy');
};

export const formatDisplayDateTime = (date) => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return '';
  
  const dateStr = formatDisplayDate(parsedDate);
  const timeStr = formatDisplayTime(parsedDate);
  return `${dateStr} at ${timeStr}`;
};

export const getCurrentTimeSlot = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  
  if (roundedMinutes >= 60) {
    return addMinutes(now, roundedMinutes - minutes);
  }
  
  now.setMinutes(roundedMinutes, 0, 0);
  return now;
};

export const generateTimeSlots = (startTime, endTime, intervalMinutes = 30) => {
  const slots = [];
  let current = new Date(startTime);
  const end = new Date(endTime);
  
  while (current < end) {
    slots.push(new Date(current));
    current = addMinutes(current, intervalMinutes);
  }
  
  return slots;
};

export const isTimeSlotAvailable = (timeSlot, bookedSlots, serviceDuration = 30) => {
  const slotStart = new Date(timeSlot);
  const slotEnd = addMinutes(slotStart, serviceDuration);
  
  return !bookedSlots.some(bookedSlot => {
    const bookedStart = new Date(bookedSlot.start);
    const bookedEnd = new Date(bookedSlot.end);
    
    return (
      (slotStart >= bookedStart && slotStart < bookedEnd) ||
      (slotEnd > bookedStart && slotEnd <= bookedEnd) ||
      (slotStart <= bookedStart && slotEnd >= bookedEnd)
    );
  });
};

export const calculateEstimatedTime = (position, averageServiceTime = 30) => {
  if (position <= 1) return 'Now';
  
  const minutes = (position - 1) * averageServiceTime;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
};

export const getBusinessDaySlots = (date, businessHours = { open: '09:00', close: '20:00' }) => {
  const [openHour, openMinute] = businessHours.open.split(':').map(Number);
  const [closeHour, closeMinute] = businessHours.close.split(':').map(Number);
  
  const startTime = new Date(date);
  startTime.setHours(openHour, openMinute, 0, 0);
  
  const endTime = new Date(date);
  endTime.setHours(closeHour, closeMinute, 0, 0);
  
  return generateTimeSlots(startTime, endTime);
};

export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

export const isWithinBusinessHours = (time, businessHours = { open: '09:00', close: '20:00' }) => {
  const date = typeof time === 'string' ? parseISO(time) : time;
  const hour = date.getHours();
  const minute = date.getMinutes();
  const currentMinutes = hour * 60 + minute;
  
  const [openHour, openMinute] = businessHours.open.split(':').map(Number);
  const [closeHour, closeMinute] = businessHours.close.split(':').map(Number);
  
  const openMinutes = openHour * 60 + openMinute;
  const closeMinutes = closeHour * 60 + closeMinute;
  
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};

export const getNextAvailableSlot = (bookedSlots, serviceDuration = 30, businessHours = { open: '09:00', close: '20:00' }) => {
  const now = new Date();
  const today = getCurrentTimeSlot();
  
  // If it's past business hours, start from tomorrow
  if (!isWithinBusinessHours(now, businessHours)) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const slots = getBusinessDaySlots(tomorrow, businessHours);
    return slots.find(slot => isTimeSlotAvailable(slot, bookedSlots, serviceDuration));
  }
  
  // Try today first
  const todaySlots = getBusinessDaySlots(today, businessHours).filter(slot => slot >= today);
  const availableToday = todaySlots.find(slot => isTimeSlotAvailable(slot, bookedSlots, serviceDuration));
  
  if (availableToday) {
    return availableToday;
  }
  
  // Try tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowSlots = getBusinessDaySlots(tomorrow, businessHours);
  return tomorrowSlots.find(slot => isTimeSlotAvailable(slot, bookedSlots, serviceDuration));
};