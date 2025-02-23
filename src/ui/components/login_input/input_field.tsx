import { useEffect, useState } from 'react';
import s from './style.module.css'
import { LuEye } from "react-icons/lu";

interface Props {
    value: string;
    type?: string;
    size?: number,
    name?: string;
    placeholder?: string;
    className?: string;
    required?: boolean;
    onChange?: (newtext: string) => void;
}

const InputField = ({ value = '', type = 'text', size = 300, name, required, className, placeholder, onChange }: Props) => {
    const [inputType, setInputType] = useState(type);
    const [isFocussed, setFocussed] = useState(false);
    const [labelStyle, setLabelStyle] = useState('noText');


    const showPassword = (show: boolean) => {
        if (show) {
            setInputType('type');
        } else {
            setInputType('password');
        }
    }

    useEffect(() => {
        if (isFocussed) {
            setLabelStyle('active');
            return;
        } else {
            if (value != '' || placeholder != null) {
                setLabelStyle('smallText');
                return;
            }
            setLabelStyle('bigText');
            return;
        }
    }, [value, isFocussed]);

    return (
        <div className={`${s.container} ${className}`} style={{ width: size + 'px' }}>
            <span className={s.label} data-focused={labelStyle}>{name}</span>
            <input
                type={inputType}
                value={value}
                placeholder={placeholder}
                required={required ?? false}
                className={s.input_t}
                data-focused={isFocussed}
                onFocus={() => setFocussed(true)}
                onChange={(e) => {if (onChange != null) onChange(e.target.value)}}
                onBlur={() => setFocussed(false)}
            />
            {type === 'password' &&
                <LuEye
                    size={20}
                    className={s.input_icon}
                    onMouseDown={(e) => {e.preventDefault(); showPassword(true)}}
                    onMouseUp={(e) => {e.preventDefault(); showPassword(false)}}
                />
            }
        </div>
    )
}

export default InputField
