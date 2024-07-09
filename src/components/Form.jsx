import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button"; 
import BackButton from "./BackButton"
import Spinner from "./Spinner";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client"

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const {lat,lng} = useUrlPosition();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [emoji,setEmoji] = useState('');
  const [geocodingError, setGeocodingError] = useState("");
  const { createCity, isLoading } = useCities(); 
  const navigate = useNavigate();

  useEffect(() => {
    if(!lat || !lng) return;
    async function fetchCityData(){
      try{
        setIsLoadingGeocoding(true);
        setGeocodingError("");
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json()
        console.log(data)
        console.log(isLoadingGeocoding)
        if(!data.countryCode){setGeocodingError("Click Somewhere Else")}
        setCityName(data.city || data.locality || '')
        setCountry(data.countryName || '')
        setEmoji(data.countryCode.toLowerCase() || '')
      }catch{
        setGeocodingError(Error.Message);
      }finally{
        setIsLoadingGeocoding(false);
      }
    }
    fetchCityData()
  }, [lat,lng]);

  async function handleSubmit(e){
    e.preventDefault()
    if(!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position:{lat,lng},
      id:Math.round(Math.random()*10000000)
    }
    await createCity(newCity);
    navigate('/app/cities');
  }

  if(isLoadingGeocoding) return <Spinner />
  if(!lat && !lng) return <Message message="Start by clicking somewhere on the map" />
  if(geocodingError) return <Message message={geocodingError} />

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <img
              src={`https://flagcdn.com/20x15/${emoji}.png`}
              width={20}
              height={15}
              className={styles.flag}
              alt={emoji} />
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}-{country}?</label>
        <DatePicker id="date" selected={date} dateFormat="dd/MM/yyyy" onChange={(date)=>setDate(date)} />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
