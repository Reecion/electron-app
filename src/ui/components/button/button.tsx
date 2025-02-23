import { ReactNode } from 'react';
import s from './style.module.css'

interface Props {
    width?: number;
    height?: number;
    children?: ReactNode | ReactNode[];
    type?: 'button' | 'submit';
    onClick?: () => void;
}

const Button = ({ width = 300, height = 45, type = 'button', children, onClick }: Props) => {
  return (
    <button type={type} className={s.button} style={{width: width+'px', height: height+'px'}} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
