export default function useThousandSeparator(date) {
  if (date === null || date === undefined) {
    return '';
  }
  const month = date.month < 9
    ? `0${date.month + 1}` 
    : date.month + 1
  return { date: `${date.year}-${month}` }
}