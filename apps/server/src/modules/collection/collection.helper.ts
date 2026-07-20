export const slugGenerator = (name: string) => {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
};
