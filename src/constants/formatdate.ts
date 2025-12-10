import { parse, format } from "date-fns";
const formatDate = (dateString: string) => {
  // Parse the date string into a Date object
  const parsedDate = parse(dateString, "yyyy-MM-dd HH:mm:ss", new Date());
  // Format the date into the desired format
  return format(parsedDate, "dd/MM/yyyy");
};

export default formatDate;

export const formatDateForDocuments = (dateString: string): string => {
  const date = new Date(dateString);

  // Format day with ordinal suffix
  const day = date.getDate();
  const dayWithSuffix =
    day +
    ["th", "st", "nd", "rd"][
      day % 10 > 3 || Math.floor(day / 10) === 1 ? 0 : day % 10
    ];

  // Format month
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];

  // Format year
  const year = date.getFullYear();

  // Return formatted string
  return `Verified on ${dayWithSuffix} ${month} ${year}`;
};

