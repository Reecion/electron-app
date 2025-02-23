import { IoMdClose } from "react-icons/io";
import s from './style.module.css'
import photo from '../../assets/photo_1.png'
import logo from '../../assets/logo.png'
import InputField from "../../components/login_input/input_field";
import Button from "../../components/button/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../../components/error_popup/error_popup";

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const [niMsg, setNiMsg] = useState({isError: true, message: ''});

  const closeApp = () => {
    window.electron.closeApp();
  }

  const submitForm = async () => {
    if (username == '' || password == '') {
      setErrorMsg('Username and password cannot be empty');
      return
    }

    await window.electron.login({
      username: username,
      password: password
    })
    .then((token) => {
      localStorage.setItem('token', token);
      navigate("/app");
    })
    .catch((err) => {
      setErrorMsg(err.message ?? '');
      console.log("Login page: received error: ")
      console.log(err)
      return 
    })
  }

  const forgotPassword = () => {
    setNiMsg({
      isError: true,
      message: 'Not implemented'
    })
  }

  return (
    <div className={s.login_container}>
      <ErrorPopup errorMsg={niMsg} onClose={() => setNiMsg({isError: true, message: ''}) }  />

      <div className={s.titleBar}></div>

      <IoMdClose className={s.closeIcon} onClick={closeApp} />

        <form className={s.login_form} onSubmit={(e) => {e.preventDefault(); submitForm();}}>

          <img src={logo} alt={'logo-img'} className={`${s.form_logo}`} />

          <div className={s.block_img}></div>
          <h1>Welcome back!</h1>
          <p>Please enter your details</p>
          <span className={s.errorMsg}>{errorMsg}</span>

          <InputField value={username} onChange={(v) => setUsername(v)} name={'Email'} required />
          <InputField value={password} onChange={(v) => setPassword(v)} name={'Password'} type={'password'} required />

          <button type={'button'} onClick={forgotPassword} className={s.f_pwd_btn}>Forgot password?</button>
          <Button type={'submit'} >Log In</Button>

        </form>

        <img src={photo} alt={'login-image'} className={s.login_image} width={780} />
    </div>
  )
}

export default LoginPage
