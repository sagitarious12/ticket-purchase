import React, { PropsWithChildren } from 'react';
import './Card.scss';

export const Card = (props: PropsWithChildren<{ background?: string }>) => {
  return (
    <div 
      className="CardWrapper"
      style={{background: props.background ? props.background : 'inherit'}}
    >
      {props.children}
    </div>
  )
}