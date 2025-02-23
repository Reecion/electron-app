import { CSSProperties } from 'react';
import s from './style.module.css'

const enum StatusCode {
    OK = 0,
    FAILED = 1,
    RUNNING = 2,
    STOPPED = 3
}

interface Props {
    status: StatusCode;
    style?: CSSProperties;
}

const Status = ({ status, style }: Props) => {
    if (status == StatusCode.OK) {
        return (
            <div style={style} className={s.success_container}>
                Success
            </div>
        )
    }
    if (status == StatusCode.RUNNING) {
        return (
            <div style={style} className={s.running_container}>
                Running
            </div>
        )
    }
    return (
        <div style={style} className={s.error_container}>
            Failed
        </div>
    )
}

export default Status
