export default function dateTimeToMilliseconds(date, time) {
    const combinedDateTimeString = date + " " + time;
    const dateTime = new Date(combinedDateTimeString);
    return dateTime.getTime();
}