import { useState } from 'react';
import s from './style.module.css'
import d from '../../defaults.module.css'
import photo from '../../assets/photo_2.png'
import Checkbox from '../../components/checkbox/checkbox';
import Button from '../../components/button/button';
import SelectField from '../../components/select_field/select_field';
import ErrorPopup from '../../components/error_popup/error_popup';
import { useNavigate } from 'react-router-dom';

const GeneratePDFs = () => {
  const navigate = useNavigate();
  const [ingredienceNumberFrom, setIngredienceNumberFrom] = useState<number | undefined>(undefined);
  const [ingredienceNumberTo, setIngredienceNumberTo] = useState<number | undefined>(undefined);
  const [skipNumber, setSkipNumber] = useState<number | undefined>(undefined);
  const [limitNumber, setLimitNumber] = useState<number | undefined>(undefined);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [month, setMonth] = useState('Any');
  const [year, setYear] = useState<number | undefined>(undefined);
  const [weekday, setWeekday] = useState('Any');

  const [openDateSettings, setOpenDateSetting] = useState(false);

  const [errorMsg, setErrorMsg] = useState({ isError: false, message: '' });

  const weekdays = ['Any', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const months = ['Any', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const resetFields = () => {
    setIngredienceNumberFrom(undefined)
    setIngredienceNumberTo(undefined)
    setSkipNumber(undefined)
    setLimitNumber(undefined)
    setStartDate('')
    setEndDate('')
    setMonth('Any')
    setYear(undefined)
    setWeekday('Any')
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    const req: GeneratePDFsParams = {
      token: token !== null ? token : 'x',
      startDate: startDate,
      endDate: endDate,
      month: month,
      year: year ?? 0,
      weekday: weekday,
      ingredienceNumberFrom: ingredienceNumberFrom ?? 0,
      ingredienceNumberTo: ingredienceNumberTo ?? 0,
      skipNumber: skipNumber ?? 0,
      limitNumber: limitNumber ?? 1000
    };
    await window.electron.generate(req)
    .then((_) => {
      setErrorMsg({ isError: false, message: 'Success' });
      resetFields()
      return
    })
    .catch((err) => {
      console.log(err)
      if (err.status_code == 401) {
        localStorage.removeItem('token')
        navigate("/");
      } else {
        setErrorMsg({ isError: true, message: "[" + err.status_code + "]: " + err.message });
        console.log("An error occured [" + err.status_code + "]: " + err.message)
        resetFields()
        return
      }
    })
  }

  return (
    <div className={s.container}>
      <div className={s.form}>
        <ErrorPopup errorMsg={errorMsg} onClose={() => setErrorMsg({ isError: false, message: '' })} />
        <h1 className={d.title}>Generate PDFs</h1>
        <p className={d.paragraph}>Select the period from which to generate PDFs.</p>
        <div className={s.section}>
          <span className={s.section_title}>Date</span>

          {!openDateSettings && <><div className={s.flex}>
            Start date
            <input
              className={s.input}
              style={{ width: '200px' }}
              type={'date'}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

            <div className={s.flex}>
              End date
              <input
                className={s.input}
                style={{ width: '200px' }}
                type={'date'}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div></>}

          <div className={s.flex}>
            Specific date
            <Checkbox style={{ marginRight: '130px' }} value={openDateSettings} onChecked={() => setOpenDateSetting(prev => !prev)} />
          </div>

          {openDateSettings && <>
            <div className={s.flex}>
              Year (default: Any)
              <input
                className={s.input}
                value={year}
                onChange={(e) => setYear(e.target.value != undefined ? parseInt(e.target.value): undefined)}
                min={2003}
                max={2019}
                type={'number'}
                placeholder={'YYYY'}
              />
            </div>

            <div className={s.flex}>
              Month
              <SelectField value={month} onChange={(v) => setMonth(v)} list={months} />
            </div>

            <div className={s.flex}>
              Weekday
              <SelectField value={weekday} onChange={(v) => setWeekday(v)} list={weekdays} />
            </div>
          </>}

          <span className={s.section_title}>Advanced</span>

          <div className={s.flex}>
            Ingredience number
            <input
              className={s.input}
              style={{ width: `80px`, marginLeft: `10px` }}
              type={'number'}
              min={0}
              max={100}
              placeholder={'form'}
              value={ingredienceNumberFrom}
              onChange={(e) => setIngredienceNumberFrom(e.target.value != undefined ? parseInt(e.target.value): undefined)}
            />
            <input
              className={s.input}
              style={{ width: `80px` }}
              type={'number'}
              min={0}
              max={100}
              placeholder={'to'}
              value={ingredienceNumberTo}
              onChange={(e) => setIngredienceNumberTo(e.target.value != undefined ? parseInt(e.target.value): undefined)}
            />
          </div>

          <div className={s.flex}>
            Limit records
            <input
              className={s.input}
              value={limitNumber}
              onChange={(e) => setLimitNumber(e.target.value != undefined ? parseInt(e.target.value): undefined)}
              type={'number'}
              min={1}
              max={1000}
              placeholder={'default: 1000'}
            />
          </div>

          <div className={s.flex}>
            Skip records
            <input
              className={s.input}
              value={skipNumber}
              onChange={(e) => setSkipNumber(e.target.value != undefined ? parseInt(e.target.value): undefined)}
              type={'number'}
              min={0}
              max={100}
              placeholder={'default: 0'}
            />
          </div>

        </div>

        <Button onClick={() => handleSubmit()}>Generate PDFs</Button>
      </div>
      <img src={photo} alt={'photo'} className={s.photo} />
    </div>
  )
}

export default GeneratePDFs
