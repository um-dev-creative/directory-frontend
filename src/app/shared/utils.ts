export function isValidDate(day: number, month: number, year: number): Date | false {
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
    return false;
  }
  const date: Date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) {
    return false;
  }
  const currentDate: Date = new Date();
  let age: number = currentDate.getFullYear() - date.getFullYear();

  const currentMonth: number = currentDate.getMonth();
  const birthMonth: number = month - 1;

  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDate.getDate() < day)
  ) {
    age--;
  }

  if (age < 15 || age > 110) {
    return false;
  }
  return date;
}
