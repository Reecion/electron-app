import s from './style.module.css'
import d from '../../defaults.module.css'
import { useEffect, useState } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import Status from '../../components/status_field/status';
import { useNavigate } from 'react-router-dom';

interface Props {
  process_id: string;
  list_id: string;
  closeView: () => void;
}

const ProcessPreview = ({ list_id, process_id, closeView }: Props) => {
  const default_polling_interval = 3;
  const max_polling_interval = 10;
  
  const [pollingInterval, setPollingInterval] = useState(default_polling_interval);
  const [progressbarLevel, setProgressbarLevel] = useState<number>(0.0);
  const [status, setStatus] = useState(2);
  const [logs, setLogs] = useState<Log[]>([]);
  const navigate = useNavigate();


  const udpatePage = async () => {
    console.log('[' + new Date(Date.now()).toLocaleTimeString() + '] - Polling with interval: ' + pollingInterval);

    const token = localStorage.getItem('token')

    return await window.electron.getProcessProgress({token: token !== null ? token : 'x', id: process_id})
    .then((res) => {
      setProgressbarLevel(res.progress);
      setLogs(res.logs)
      setStatus(res.status_code)
      return false;
    })
    .catch((err) => {
      console.log(err)
      if (err.status_code == 401) {
        localStorage.removeItem('token')
        navigate("/");
        return true;
      } else {
        console.log("An error occured [" + err.status_code + "]: " + err.message)
        return true;
      }
    })
  }

  const startPolling = async () => {
    const old_progress = progressbarLevel.toString();
    // Fetch data
    const err = await udpatePage();

    // Stop polling if any condition is met
    if (err || progressbarLevel == 1 || status == 0 || status == 1 || pollingInterval >= max_polling_interval) {
      console.log('Returning with status: ' + status);
      return
    }

    // If there were no changes in the interval -> increase the interval
    if (old_progress == progressbarLevel.toString() && pollingInterval < max_polling_interval) {
      // Sleep before rerender
      await new Promise(r => setTimeout(r, (pollingInterval + 1) * 1000));

      setPollingInterval(prev => prev += 1);
    
    // There was a change -> go back to default interval
    } else {
      // Sleep before rerender
      await new Promise(r => setTimeout(r, default_polling_interval * 1000));

      // Only need to recursive call if there was no change to interval
      if (pollingInterval != default_polling_interval) {
        setPollingInterval(default_polling_interval);
      } else {
        startPolling()
      }
    }
  }

  useEffect(() => {
    startPolling();

  }, [pollingInterval]);

  return (
    <div className={s.container}>
      <div className={s.back_btn} onClick={closeView}><FaArrowLeft size={16} /> Back to Process List</div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Status style={{ marginTop: '5px' }} status={status} />
        <h1 className={d.title}>Process Preview <span className={s.title_id}>- ID {list_id} - {process_id}</span></h1>
      </div>

      {false && <input type='range' min={0} max={1} step={0.05} value={progressbarLevel} onChange={(e) => setProgressbarLevel(parseFloat(e.target.value))} />}

      <p className={d.paragraph}>Total processed files: <b>110/140</b></p>
      <div className={s.progress_container}>
        <span><b>Progress</b></span>
        <div className={s.progressbar_bg}>
          <div className={s.progressbar_fill} style={{ width: `${progressbarLevel * 100}%` }}></div>
        </div>
        <span><b>{(progressbarLevel * 100).toFixed(0)}%</b> - Running</span>
      </div>
      <table className={s.table}><tbody>
        <tr>
          <th>Timestamp</th>
          <th>Status</th>
          <th>Message</th>
        </tr>
        {logs.length == 0 && <tr><td colSpan={3}>The list is empty</td></tr>}
        {logs.map((log) =>
          <tr>
            <td>{new Date(parseFloat(log.timestamp) * 1000).toLocaleDateString()}</td>
            <td><Status status={log.status_code} /></td>
            <td>{log.message}</td>
          </tr>
        )}
      </tbody></table>
    </div>
  )
}

export default ProcessPreview
