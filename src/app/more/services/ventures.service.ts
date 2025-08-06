import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VentureService {

    stepOneState: Subject<boolean> = new Subject<boolean>();
}