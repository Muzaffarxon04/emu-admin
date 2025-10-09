export function formatPhoneNumber(phoneNumber: string) {

  const formattedNumber = `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(
    4,
    6
  )} ${phoneNumber.slice(6, 9)} ${phoneNumber.slice(9, 11)} ${phoneNumber.slice(11)}`;
  return formattedNumber;
}
