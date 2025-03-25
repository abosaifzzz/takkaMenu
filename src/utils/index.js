export const createFormData = (requestBody, file, fileClass) => {
  // fileClass = column name that will hold file, file (output from file field ), requestBody = body to be sent to backend
  const jsonFormData = JSON.stringify(requestBody);
  const finalData = new FormData();
  const ext = file.name?.split(".").pop();
  finalData.append("file", file, fileClass + "." + (ext || "jpg")); //cover_image.jpg / png /

  finalData.append("data", jsonFormData);

  return finalData;
};
