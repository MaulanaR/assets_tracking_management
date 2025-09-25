import Api from './axios/api';
import { showSuccessNotification } from './globalNotification';

// Helper function to extract file object
const extractFile = (fileObj) => {
  if (!fileObj) return null;

  // Check different possible file object structures
  const candidates = [fileObj.originFileObj, fileObj.file, fileObj];

  return candidates.find((candidate) => candidate instanceof File) || null;
};

// Extract file upload logic to separate function
const uploadAttachment = async (fileObj) => {
  const actualFile = extractFile(fileObj);

  if (!actualFile) {
    const error = new Error(
      'Invalid file object. Please try uploading the file again.',
    );
    notification.error({
      message: 'File Upload Error',
      description: error.message,
      duration: 3,
    });
    throw error;
  }

  const formData = new FormData();
  formData.append('file', actualFile);

  try {
    const response = await Api().request({
      url: '/api/v1/attachments',
      method: 'POST',
      data: formData,
    });

    showSuccessNotification({
      message: 'Attachment Uploaded',
      description: 'File has been successfully uploaded.',
      duration: 3,
    });

    return response.data.id;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

export { extractFile, uploadAttachment };
