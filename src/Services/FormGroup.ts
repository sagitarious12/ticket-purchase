import { BehaviorSubject } from './BehaviorSubject';
import { FormControl } from './FormControl';

export interface FormGroupProps {
  [key: string]: FormControl | FormGroup;
}

interface IFormGroup {
  subscription: BehaviorSubject<FormGroupValue>;
  controls: FormGroupProps;
}

export interface FormGroupValue {
  [key: string]: string | FormGroupValue;
}

export type FormValueSubscription = (value: { [key: string]: string }) => void;

export class FormGroup implements IFormGroup {
  controls: FormGroupProps = {};
  subscription: BehaviorSubject<FormGroupValue> = new BehaviorSubject({});

  constructor(formGroup: FormGroupProps) {
    this.controls = formGroup;

    setTimeout(() => {
      this.subscribeToEachFormControl(formGroup);
      this.subscribeToOwnSubscription();
    }, 100);
  }

  /**
   *
   * @param formGroup
   * @returns a compiled object of the entire formGroup and nested FormGroups and their controls.
   */
  private getFormGroupValues = (
    formGroup: FormGroupProps | FormGroup
  ): FormGroupValue => {
    const result: FormGroupValue = {};
    if (this.instanceOfFormGroup(formGroup)) {
      Object.keys(formGroup.controls).forEach((value: string) => {
        if (this.instanceOfFormControl(formGroup.controls[value])) {
          result[value] = (
            formGroup.controls[value] as FormControl
          ).currentValue;
        } else {
          result[value] = this.getFormGroupValues(
            formGroup.controls[value] as FormGroup
          );
        }
      });
    } else {
      Object.keys(formGroup).forEach((value: string) => {
        if (this.instanceOfFormControl(formGroup[value])) {
          result[value] = (formGroup[value] as FormControl).currentValue;
        } else {
          result[value] = this.getFormGroupValues(
            formGroup[value] as FormGroup
          );
        }
      });
    }
    return result;
  };

  /**
   *
   * @param formGroup
   * @description This will update the subscription to this form group including the values
   * of all nested formGroups. Uses recursion in order to accomplish setting up the subscriptions to
   * all nested FormGroup FormControls.
   */
  private subscribeToEachFormControl = (
    formGroup: FormGroupProps | FormGroup
  ): void => {
    // is an instance of FormGroup
    if (this.instanceOfFormGroup(formGroup)) {
      // loop each of the formGroupProps in the FormGroup.controls
      Object.keys(formGroup.controls).forEach((value: string) => {
        // control is of type FormControl
        if (this.instanceOfFormControl(formGroup.controls[value])) {
          // subscribe to formControl
          (formGroup.controls[value] as FormControl).subscription.subscribe(
            value,
            () => {
              // on subscription callback post current value to subscription
              // we want "this.controls" here because we still want all values
              // not just the values of the controls of the nested formGroup
              this.subscription.next(this.getFormGroupValues(this.controls));
            }
          );
        }
        // control is of type FormGroup
        else {
          // recurse to continue subscribing to internal FormControls
          this.subscribeToEachFormControl(
            formGroup.controls[value] as FormGroup
          );
        }
      });
    }
    // is an isntance of FormGroupProps
    else {
      // loop each of the formGroupProps
      Object.keys(formGroup).forEach((value: string) => {
        // control is of type FormControl
        if (this.instanceOfFormControl(formGroup[value])) {
          // subscribe to formControl
          (formGroup[value] as FormControl).subscription.subscribe(
            value,
            () => {
              // on subscription callback generate callbackresult
              this.subscription.next(this.getFormGroupValues(this.controls));
            }
          );
        }
        // control is of type FormGroup
        else {
          // recurse to continue subscribing to internal FormControls
          this.subscribeToEachFormControl(formGroup[value] as FormGroup);
        }
      });
    }
  };

  private unsubscribeFromEachFormControl = (
    formGroup: FormGroupProps | FormGroup
  ): void => {
    // is of type FormGroup
    if (this.instanceOfFormGroup(formGroup)) {
      Object.keys(formGroup.controls).forEach((value: string) => {
        // if of type FormControl
        if (this.instanceOfFormControl(formGroup.controls[value])) {
          (formGroup.controls[value] as FormControl).subscription.unsubscribe(
            value
          );
        }
        // is of type FormGroup, recurse
        else {
          this.unsubscribeFromEachFormControl(
            formGroup.controls[value] as FormGroup
          );
        }
      });
    }
    // is of type FormGroupProps
    else {
      Object.keys(formGroup).forEach((value: string) => {
        // is of type FormControl
        if (this.instanceOfFormControl(formGroup[value])) {
          (formGroup[value] as FormControl).subscription.unsubscribe(value);
        }
        // is of type FormGroup, recurse
        else {
          this.unsubscribeFromEachFormControl(formGroup[value] as FormGroup);
        }
      });
    }
  };

  // used to validate if the object is a FormControl
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private instanceOfFormControl = (object: any): object is FormControl => {
    // currentValue is a property unique to the FormControl Class
    return object && typeof object === 'object' && 'currentValue' in object;
  };

  // used to validate if the object is a FormGroup
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private instanceOfFormGroup = (object: any): object is FormGroup => {
    // controls is a property unique to the FormGroup Class
    return object && typeof object === 'object' && 'controls' in object;
  };

  private subscribeToOwnSubscription = () => {
    // setup own subscription to create an onUnsub callback
    // to unsub from all of the formControls and nested FormControls.
    this.subscription
      .subscribe('OwnFormGroup', () => {
        return;
      })
      .onUnsubscribe('OwnFormGroup', () => {
        this.unsubscribeFromEachFormControl(this.controls);
      });
  };

  private getIsValid = (formGroup: FormGroupProps | FormGroup): boolean => {
    if (this.instanceOfFormGroup(formGroup)) {
      Object.keys(formGroup.controls).forEach((value) => {
        if (
          this.instanceOfFormControl(formGroup.controls[value]) &&
          (formGroup.controls[value] as FormControl).errorMessage
        ) {
          return false;
        } else if (!this.getIsValid(formGroup.controls[value] as FormGroup)) {
          return false;
        }
      });
    } else {
      Object.keys(formGroup).forEach((value) => {
        if (
          this.instanceOfFormControl(formGroup[value]) &&
          (formGroup[value] as FormControl).errorMessage
        ) {
          return false;
        }
      });
    }
    return true;
  };

  get isValid(): boolean {
    return this.getIsValid(this.controls);
  }

  destroy(): void {
    this.subscription.unsubscribe('OwnFormGroup');
  }
}
