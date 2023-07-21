// This code comes from one of my personal projects.
import { BehaviorSubject } from './BehaviorSubject';

export type ValidationCB = (currentValue: string) => string | null;

export class FormControl {
  initialValue: string;
  validationCallback: ValidationCB;
  currentValue: string;
  subscription: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    initialValue: string,
    validationCb: ValidationCB = () => {
      return null;
    }
  ) {
    this.initialValue = initialValue;
    this.validationCallback = validationCb;
    this.currentValue = this.initialValue;
    this.subscription.next(this.currentValue);
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.currentValue = e.target.value;
    this.subscription.next(this.currentValue);
  };

  get errorMessage(): string | null {
    return this.validationCallback(this.currentValue);
  }
}
