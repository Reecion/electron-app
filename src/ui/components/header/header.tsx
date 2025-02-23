import s from './style.module.css'
import logo from '../../assets/logo.png'
import { LuListChecks } from "react-icons/lu";
import { FaCogs } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";


interface Props {
    activeTab: 'list' | 'generate' | 'logout' | 'preview';
    onTabChange: (newTab: 'list' | 'generate' | 'logout') => void;
}

function Header ({ activeTab, onTabChange }: Props) {

    const navigate = useNavigate();

    const closeApp = () => {
        window.electron.closeApp();
    }

    const logout = () => {
        localStorage.removeItem('token')
        navigate("/");
    }

    return (
        <div className={s.header_container}>
            <div className={s.drab_bar}></div>
            <IoMdClose tabIndex={0} className={s.closeIcon} size={32} onClick={closeApp} onKeyDown={(e) => { if (e.key === 'Enter') closeApp() }} ></IoMdClose>
            <div className={s.items_container}>
                <div className={s.selector} data-selected={activeTab === 'preview' ? 'list' : activeTab}></div>
                <img src={logo} alt={'logo'} className={s.logo_img} />
                <button className={s.btn} style={{minWidth: `180px`}} onClick={() => { if (activeTab !== 'preview') onTabChange('list') }}>
                    <LuListChecks size={26} />
                    <span>Process List</span>
                </button>
                <button className={s.btn} style={{minWidth: `190px`}} onClick={() => onTabChange('generate')}>
                    <FaCogs size={26} />
                    <span>Generate PDFs</span>
                </button>
                <button className={`${s.btn} ${s.logout_btn}`} style={{minWidth: `120px`}} onClick={logout}>
                    <MdLogout size={26} />
                    <span>Logout</span>
                </button>
                <div className={s.drab_spacer}>

                </div>
            </div>
        </div>
    )
}

export default Header
