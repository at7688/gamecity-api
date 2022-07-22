export const numArrToBooleanSearch = (nums: number[]) => {
  return nums.includes(1) && nums.includes(2)
    ? undefined
    : nums.includes(1)
    ? true
    : nums.includes(2)
    ? false
    : undefined;
};
