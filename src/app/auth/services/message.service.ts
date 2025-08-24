import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { getOTPMessage } from 'src/app/utils/otp.util';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  #http = inject(HttpClient);
  readonly #sendMessageUrl =
    'https://asia-south1-arhaapps.cloudfunctions.net/sendFXSMS';

  sendOTPMessage(otp: string, phone: string) {
    const body = getOTPMessage(otp, phone);
    const headers = {
      'Content-Type': 'application/json',
    };
    return firstValueFrom(
      this.#http.post(this.#sendMessageUrl, body, { headers }).pipe(
        map(() => true),
        catchError(() => of(false))
      )
    );
  }
}
