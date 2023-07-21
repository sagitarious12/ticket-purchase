import React from "react";
import { debounce, FormControl } from './../../Services';
import "./Input.scss";

export interface InputProps {
  type: React.HTMLInputTypeAttribute;
  placeholder: string;
  disabled?: boolean;
  defaultValue?: string | null;
  formControl: FormControl;
  focused?: boolean;
}

const alwaysFocusedInputTypes = [
  "file",
  "color",
  "date",
  "week",
  "datetime-local",
  "month",
  "time",
  "range",
];

export const Input = ({
  type,
  placeholder,
  disabled = false,
  formControl,
  defaultValue = "",
  focused = false
}: InputProps) => {
  const inputRef: React.RefObject<HTMLInputElement> =
    React.useRef<HTMLInputElement>(null);
  const [inputFocused, setInputFocused] = React.useState<boolean>(
    alwaysFocusedInputTypes.includes(type)
  );
  const [currentValue, setCurrentValue] = React.useState<string | null>("");
  const [touched, setTouched] = React.useState<boolean>(false);

  const offClickHandler = () => {
    if (
      (currentValue === "" || !currentValue) &&
      !alwaysFocusedInputTypes.includes(type)
    )
      setInputFocused(false);
  };

  React.useEffect(() => {
    if (focused) {
      setTimeout(() => {
        (inputRef.current as HTMLInputElement).focus();
      }, 100);
    }
  }, [focused]);

  React.useEffect(() => {
    if (inputRef.current && defaultValue) {
      inputRef.current.value = defaultValue;
    }
  }, [defaultValue]);

  React.useEffect(() => {
    window.addEventListener("click", offClickHandler);
    return () => {
      window.removeEventListener("click", offClickHandler);
    };
  }, [currentValue]);

  React.useEffect(() => {
    formControl.subscription.subscribe(placeholder, (value: string) => {
      if (value !== "") {
        setCurrentValue(value);
        setInputFocused(true);
      }
    });
    return () => {
      formControl.subscription.unsubscribe(placeholder);
    };
  }, []);

  const onInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setInputFocused(true);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTouched(true);
    formControl.onChange({
      target: { value: e.target.value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="InputWrapper">
      <div className={`Placeholder ${inputFocused ? "InputFocused" : ""}`}>
        {placeholder}
      </div>
      <input
        className="MainInput"
        data-testid="MainInput"
        type={type}
        disabled={disabled}
        placeholder=""
        aria-label={placeholder}
        ref={inputRef}
        onClick={(e: React.MouseEvent<HTMLInputElement>) => onInputClick(e)}
        onChange={debounce(
          (e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e),
          250
        )}
        defaultValue={currentValue || ""}
      />
    </div>
  );
};
