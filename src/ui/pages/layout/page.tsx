import s from './style.module.css'
import Header from '../../components/header/header';
import ProcessList from '../process_list/page';
import { useEffect, useState } from 'react';
import GeneratePDFs from '../generate/page';
import ProcessPreview from '../process/page';
import { useNavigate } from 'react-router-dom';

function Layout () {
    const [activeTab, setActiveTab] = useState<'list' | 'generate' | 'logout' | 'preview'>('list');
    const [openedProcess, setOpenedProcess] = useState<string>('0');
    const [openedProcessID, setOpenedProcessID] = useState<string>('0');
    const navigate = useNavigate();

    const openProcess = (list_id: string, processId: string) => {
        setOpenedProcess(list_id);
        setOpenedProcessID(processId);
        setActiveTab('preview');
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token === null) {
            navigate('/');
        }
    }, [activeTab])

    return (
        <div className={s.container}>   
            <Header activeTab={activeTab} onTabChange={(v) => setActiveTab(v)} ></Header>
            {activeTab === 'list' && <ProcessList openProcess={openProcess}></ProcessList>}
            {activeTab === 'preview' && <ProcessPreview closeView={() => setActiveTab('list')} list_id={openedProcess} process_id={openedProcessID}></ProcessPreview>}
            {activeTab === 'generate' && <GeneratePDFs></GeneratePDFs>}
        </div>
    )
}

export default Layout
