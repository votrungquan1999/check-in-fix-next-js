export function convertFromISOTo12Hour(ISOFormatTime?: string) {
  if (!ISOFormatTime || !/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}.*Z/.test(ISOFormatTime)) {
    return;
  }

  const date = new Date(ISOFormatTime);

  // console.log(date.getUTCHours(), date.toISOString());
  let hour = date.getHours();
  let period = 'AM';
  if (hour > 12) {
    hour = hour - 12;
    period = 'PM';
  }

  const formatedHour = hour.toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString().padStart(2, '0');

  const convertedTime = `${month}/${day}/${year} ${formatedHour}:${minute}:${second} ${period}`;

  // console.log(convertedTime, ISOFormatTime);
  return convertedTime;

  // console.log(date.toJSON());
}
