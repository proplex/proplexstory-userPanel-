export const getPeriodRange = (value: string) => {
  const today = new Date();
  let from = new Date();
  const to = today;

  switch (value) {
    case "last-month":
      from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      break;
    case "last-3-months":
      from = new Date(today.getFullYear(), today.getMonth() - 3, 1);
      break;
    case "last-year":
      from = new Date(today.getFullYear() - 1, today.getMonth(), 1);
      break;
    case "custom":
      return { from, to };
  }

  return { from, to };
};
