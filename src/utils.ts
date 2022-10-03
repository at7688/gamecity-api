import { format } from 'date-fns';

export const numArrToBooleanSearch = (nums: number[]) => {
  return nums.includes(1) && nums.includes(2)
    ? undefined
    : nums.includes(1)
    ? true
    : nums.includes(2)
    ? false
    : undefined;
};

export const numToBooleanSearch = (num: number) => {
  return { 0: undefined, 1: true, 2: false }[num];
};

export const dateToCron = (date: Date) => {
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const day = date.getDay();
  return `${minutes} ${hours} * * ${day}`;
};

export const dateToScheduleTips = (date: Date) => {
  return format(date, '(EEE)HH:mm');
};
