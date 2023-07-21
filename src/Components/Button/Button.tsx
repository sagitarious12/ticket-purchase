import React, { RefObject } from "react";
import "./Button.scss";

export interface ButtonProps {
  onClick: () => void;
  text?: string;
  disabled?: boolean;
  background? : string;
}

export const Button = (props: ButtonProps) => {

  return (
    <button
      onClick={(value: React.MouseEvent<HTMLButtonElement>) => {
        props.onClick();
      }}
      className="button"
      disabled={props.disabled || false}
      style={{background: props.background ? props.background : 'inherit'}}
    >
      <span className="button-text">
        {props.text || ""}
      </span>
    </button>
  );
};