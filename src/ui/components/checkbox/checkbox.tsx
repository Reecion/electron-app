import { CSSProperties } from 'react';
import s from './style.module.css'
import { IoMdCheckmark } from "react-icons/io";

interface Props {
    size?: number;
    value?: boolean;
    style?: CSSProperties;
    onChecked?: () => void
}

const Checkbox = ({ value = false, size = 20, onChecked, style }: Props) => {
  return (
    <div 
    tabIndex={0}
    onKeyDown={(e) => { if (onChecked != null && e.key === 'Enter') onChecked() }}
    className={s.checkbox} 
    data-state={value} 
    style={{width: `${size}px`, height: `${size}px`, ...style}} 
    onClick={() => { if (onChecked != null) onChecked() }}>
        {value && <IoMdCheckmark style={{color: 'white'}} size={size} />}
    </div>
  )
}

export default Checkbox
