// utility/dateUtils.js

export const getMaxEndDate = (startDate) => {
  if (!startDate) return null;

  // clone date so original state is never mutated
  const start = new Date(startDate.getTime());

  const maxEnd = new Date(start.getTime());
  maxEnd.setMonth(maxEnd.getMonth() + 3);

  // handle month-end overflow (Jan 31 -> Apr 30)
  if (maxEnd.getDate() !== start.getDate()) {
    maxEnd.setDate(0);
  }

  return maxEnd;
};

export const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
