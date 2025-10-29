export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);

  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};
