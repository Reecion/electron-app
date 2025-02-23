import { useState } from 'react';
import s from './style.module.css'
import { IoIosArrowDown } from "react-icons/io";

interface Props {
    value: string;
    list: string[];
    onChange: (new_value: string) => void;
    width?: number;
    height?: number;
}

const SelectField = ({ value, list, onChange, width = 200, height = 30 }: Props) => {
    const [isOpen, setOpen] = useState(false)

    return (
        <div tabIndex={0} onBlur={() => setOpen(false)} className={s.container} style={{ width: `${width}px`, height: `${height}px` }}>
            <div className={s.header} onClick={() => setOpen(prev => !prev)}>
                {value}
                <IoIosArrowDown size={20} />
            </div>
            {isOpen && <ol className={s.dropdown_menu}>
                {list.map((element, index) =>
                    <li key={`op-${index}`} className={s.list_item} onClick={() => {setOpen(false);onChange(element)}}>{element}</li>
                )}
            </ol>}
        </div>
    )
}

export default SelectField
