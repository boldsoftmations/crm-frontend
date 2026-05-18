export const getMaxEndDate = (startDate) => {
  if (!startDate) return null;

  const start = new Date(startDate);
  const end = new Date(start);

  end.setMonth(end.getMonth() + 12);

  return end;
};
