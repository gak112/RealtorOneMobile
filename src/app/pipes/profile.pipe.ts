import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formcheck',
  standalone: true
})
export class FromCheckPipe implements PipeTransform {

  transform(formValue: any, oldDetails: any): boolean {
    if (!formValue || !oldDetails) {
      return false;
    }

    // Check if form values are different from old details
    const keys = ['firstName', 'lastName', 'mobileNumber', 'email', 'gender', 'photo', 'dob'];

    for (const key of keys) {
      const formVal = formValue[key] || '';
      const oldVal = oldDetails[key] || '';

      if (formVal !== oldVal) {
        return false; // Form has changes, should not be disabled
      }
    }

    return true; // No changes, should be disabled
  }
}
