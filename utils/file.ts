
import { type Part } from '@google/genai';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // result is a data URL like "data:image/jpeg;base64,LzlqLzRBQ...""
      // We only need the base64 part
      const encoded = (reader.result as string).split(';base64,')[1];
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
};

export const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64Data = await fileToBase64(file);
    return {
        inlineData: {
            mimeType: file.type,
            data: base64Data,
        }
    };
}
