import imageCompression from "browser-image-compression";

export const createFormData = (requestBody, file, fileClass) => {
  // fileClass = column name that will hold file, file (output from file field ), requestBody = body to be sent to backend
  const jsonFormData = JSON.stringify(requestBody);
  const finalData = new FormData();
  const ext = file.name?.split(".").pop();
  finalData.append("file", file, fileClass + "." + (ext || "jpg")); //cover_image.jpg / png /

  finalData.append("data", jsonFormData);

  return finalData;
};

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1, // Maximum file size in MB (default: 2MB)
    maxWidthOrHeight: 1920, // Maximum width/height in pixels
    useWebWorker: true, // Use web worker for faster compression
    fileType: "image/jpeg", // Output file type
  };

  try {
    console.log("Original file:", file.size / 1024 / 1024, "MB");
    const compressedFile = await imageCompression(file, options);
    console.log("Compressed file:", compressedFile.size / 1024 / 1024, "MB");
    return compressedFile;
  } catch (error) {
    console.error("Compression error:", error);
    return file; // Fallback to original if compression fails
  }
};
