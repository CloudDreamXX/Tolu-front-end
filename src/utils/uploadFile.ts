export const uploadFile = (file) => {
    const randomId = Math.floor(Math.random() * 1000000);
    const fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
  
    const mimeMap = {
      "application/pdf": "PDF",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
      "application/msword": "DOC",
    };
  
    const fileType = mimeMap[file.type] || file.type.split("/")[1]?.toUpperCase() || "UNKNOWN";
  
    const currentDate = new Date();
    const formattedDate = currentDate
      .toLocaleDateString("en-GB")
      .split("/")
      .join("/");
  
    return {
      id: randomId,
      name: file.name,
      size: fileSize,
      type: fileType,
      date: formattedDate,
    };
  };
  