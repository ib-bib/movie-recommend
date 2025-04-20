export const normalizeTitle = (title: string): string => {
  // Move trailing article to the front
  const re = /^(.*),\s(The|A|An|Les|La|L')$/i;
  const match = re.exec(title);
  if (match) {
    return `${match[2]} ${match[1]}`;
  }
  return title;
};
