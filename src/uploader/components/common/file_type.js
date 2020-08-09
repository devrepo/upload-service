export const fileType = (mimetype) => {
  const startIndex = mimetype.indexOf("/");
  if (startIndex === -1) {
    return mimetype;
  }
  return mimetype.substring(startIndex + 1, mimetype.length);
};
