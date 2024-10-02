export function calculateNumberOfDays(
  checkInDate: string,
  checkOutDate: string,
): number {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  const diffInMs = checkOut.getTime() - checkIn.getTime();

  // Convert the difference from milliseconds to days
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays;
}
