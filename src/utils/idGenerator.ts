export const generateTransactionId = (): string => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `LS-${year}-${randomSuffix}`;
};
