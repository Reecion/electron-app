import { useEffect, useState } from 'react'
import s from './style.module.css'
import d from '../../defaults.module.css'
import { IoMdRefresh } from "react-icons/io";
import SearchField from '../../components/search_field/search_field'
import Status from '../../components/status_field/status';
import { useNavigate } from 'react-router-dom';

interface Props {
  openProcess: (list_id: string, processId: string) => void;
}

const ProcessList = ({ openProcess }: Props) => {
  const [processes, setProcesses] = useState<ProcessListItem[]>([]);
  const navigate = useNavigate();

  const updateList = async () => {
    const token = localStorage.getItem('token')

    await window.electron.getProcessList(token !== null ? token : 'x')
      .then((p_list) => {
        setProcesses(p_list)
      })
      .catch((err) => {
        console.log(err)
        if (err.status_code == 401) {
          localStorage.removeItem('token')
          navigate("/");
        } else {
          console.log("An error occured [" + err.status_code + "]: " + err.message)
        }
      })
  }

  useEffect(() => {
    updateList();
  }, [])

  return (
    <div className={s.container}>
      <h1 className={d.title}>
        <IoMdRefresh size={36} className={s.refresh_icon} onClick={updateList} />
        Process List
      </h1>
      <p className={d.paragraph}>Here you can view here all previously generated PDFs logs.</p>
      <SearchField style={{ marginTop: '20px', marginLeft: 'auto' }} />
      <table className={s.table}><tbody>
        <tr>
          <th className={s.th}>ID</th>
          <th className={s.th}>Date</th>
          <th className={s.th}>Status</th>
          <th className={s.th}>Processed Files</th>
        </tr>
        {processes.length == 0 && <tr><td colSpan={4}>The list is empty</td></tr>}
        {processes.length != 0 && processes.map((process, index) =>
          <tr key={`p-${index}`} onClick={() => openProcess(process.id.toString(), process._id.toString())}>
            <td>{process.id}</td>
            <td>{new Date(parseFloat(process.timestamp)  * 1000).toLocaleString()}</td>
            <td><Status status={process.status_code} /></td>
            <td>{process.files}</td>
          </tr>
        )}
      </tbody></table>
    </div>
  )
}

export default ProcessList
