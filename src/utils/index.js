export const createFormData = (requestBody, file, fileClass) => {
  const jsonFormData = JSON.stringify(requestBody);
  const finalData = new FormData();
  const ext = file.name?.split(".").pop();
  finalData.append("file", file, fileClass + "." + (ext || "jpg"));

  finalData.append("data", jsonFormData);

  return finalData;
};
