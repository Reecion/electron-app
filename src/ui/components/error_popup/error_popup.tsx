import s from './style.module.css'

interface Msg {
    isError: boolean;
    message: string;
}

interface Props {
    errorMsg: Msg;
    onClose: () => void;
}

const ErrorPopup = ({ errorMsg, onClose}: Props) => {
    return (
        <div className={s.popup} data-show={errorMsg.message != ''} onClick={onClose} >
            <div className={errorMsg.isError ? s.popup_error_side : s.popup_success_side}></div>
            <div className={errorMsg.isError ? s.popup_error_content : s.popup_success_content}>{errorMsg.message}</div>
        </div>
    )
}

export default ErrorPopup
