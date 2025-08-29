import { inject, Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  ImageOptions,
} from '@capacitor/camera';
import { AlertController } from '@ionic/angular/standalone';
import { UploadClient } from '@uploadcare/upload-client';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import {
  AndroidSettings,
  IOSSettings,
  NativeSettings,
} from 'capacitor-native-settings';
import { StorageService } from './storage.service';

const client = new UploadClient({
  publicKey: 'af593dad582ebef4ed5f',
});

@Injectable({ providedIn: 'root' })
export class CameraService {
  #alertCtrl = inject(AlertController);
  #storageService = inject(StorageService);
  #auth = inject(AuthService);
  private readonly permissionMessage =
    "It looks like you haven't granted permission to use the camera. Please go to your device settings and enable it.";

  async setupPermissions() {
    const { camera } = await Camera.checkPermissions();
    if (camera === 'denied') {
      await this.showPermissionAlert();
    } else if (camera !== 'granted') {
      await Camera.requestPermissions();
    }
  }

  openAppSettings() {
    return NativeSettings.open({
      optionAndroid: AndroidSettings.ApplicationDetails,
      optionIOS: IOSSettings.App,
    });
  }

  private async showPermissionAlert() {
    const alert = await this.#alertCtrl.create({
      message: this.permissionMessage,
      buttons: [
        {
          text: 'Go To Settings',
          role: 'confirm',
        },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role === 'confirm') {
      await this.openAppSettings();
    }
  }

  async takePhoto(
    sourceType: CameraSource,
    type: 'property-image'
  ): Promise<string> {
    try {
      const options: ImageOptions = {
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: sourceType,
      };
      const image = await Camera.getPhoto(options);
      if (!image?.dataUrl) {
        throw new Error('Photo was not taken successfully.');
      }
      const fileName = `${type}-${Date.now()}.jpg`;
      const file = this.dataUrlToFile(image.dataUrl, fileName);
      // const compressedFile = await this.compressImage(file);
      const UcResponse = await client.uploadFile(file);
      return UcResponse.cdnUrl;
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(errorMessage);
    }
  }

  async uploadFile(
    file: File,
    type: 'property-image'
  ): Promise<string> {
    try {
      // For images, use UploadCare
      if (file.type.startsWith('image/')) {
        const UcResponse = await client.uploadFile(file);
        return UcResponse.cdnUrl;
      }

      // For PDFs, use Firebase Storage
      if (file.type === 'application/pdf') {
        const user = await firstValueFrom(this.#auth.user$);
        if (!user) throw new Error('User not found');

        const filePath = this.#storageService.generateFilePath(
          file.name,
          'pdf',
          user.uid
        );
        return this.#storageService.uploadFile(file, filePath);
      }

      throw new Error('Unsupported file type');
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(errorMessage);
    }
  }

  private dataUrlToFile(dataUrl: string, fileName: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }

  /**
   * Take a photo for property listing
   * @param sourceType Camera source (Camera or Gallery)
   * @returns Promise<string> CDN URL of uploaded image
   */
  async takePropertyPhoto(sourceType: CameraSource): Promise<string> {
    return this.takePhoto(sourceType, 'property-image');
  }

  /**
   * Upload a file for property listing
   * @param file File to upload
   * @returns Promise<string> CDN URL of uploaded file
   */
  async uploadPropertyFile(file: File): Promise<string> {
    return this.uploadFile(file, 'property-image');
  }
}
