import { CSSProperties } from 'react';
import s from './style.module.css'
import { FaSearch } from "react-icons/fa";

interface Props {
    style?: CSSProperties;
}

const SearchField = ({ style }: Props) => {
    return (
        <div className={s.container} style={style}>
            <FaSearch size={20} className={s.search_icon} />
            <input
                className={s.search_input}
                type='search'
                placeholder='Search...'
            />
        </div>
    )
}

export default SearchField
