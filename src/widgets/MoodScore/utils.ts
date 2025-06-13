export const willModalOpen = (registeredDate: string): boolean => {
  if (!registeredDate) return true;
  const currentDate = new Date();
  const registeredDateObj = new Date(registeredDate);
  const diffTime = Math.abs(
    currentDate.getTime() - registeredDateObj.getTime()
  );
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 1;
};
