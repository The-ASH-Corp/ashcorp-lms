export const getUploadPath = (filePath: string): string => {
  return filePath.split("/backend/")[1];
};