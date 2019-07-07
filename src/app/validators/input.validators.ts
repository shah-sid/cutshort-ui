import { AbstractControl } from "@angular/forms";
import { ValidationErrors } from '@angular/forms/src/directives/validators';


export class InputValidators {
    static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
        if (control.value && (control.value as string).indexOf(' ') >= 0) {
            return { cannotContainSpace: true }
        }
        return null;
    }

    static cannotContainSpecialCharacters(control: AbstractControl): ValidationErrors | null {
        const regex = new RegExp(/[-!$%^*()+|~=`{}\[\]:";'<>?,.\/]/)
        if (control.value && regex.test(control.value)) {
            return { cannotContainSpecialCharacters: true }
        }
        return null;
    }

    static validateMobile(control: AbstractControl): ValidationErrors | null {
        if (control.value && !(/[789][0-9]{9}$/.test(control.value as string))) {
            return { mobileInvalid: true }
        }
        return null;
    }

    static positiveDataPrecision(control: AbstractControl): ValidationErrors | null {
        if (control.value && control.value < 0) {
            return { precisionInvalid: true }
        }
        return null;
    }
}
