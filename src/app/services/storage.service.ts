import { inject, Injectable } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  #storage = inject(Storage);

  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(this.#storage, path);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file to Firebase Storage:', error);
      throw new Error('Failed to upload file');
    }
  }

  generateFilePath(
    fileName: string,
    fileType: 'image' | 'pdf',
    userId: string
  ): string {
    const timestamp = Date.now();
    const fileExtension = fileType === 'image' ? 'jpg' : 'pdf';
    return `brochures/${userId}/${timestamp}-${fileName}.${fileExtension}`;
  }
}