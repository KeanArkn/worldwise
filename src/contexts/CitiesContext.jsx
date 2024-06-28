import { createContext, useState, useEffect, useContext } from 'react';
import localData from "../data/cities.json";


const CitiesContext = createContext();
//const BASE_URL = "http://localhost:9000";

function CitiesProvider({ children }) {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity,setCurrentCity] = useState({});

    useEffect(() => {
      async function fetchCities() {
        try{
          setIsLoading(true);
          // const res = await fetch(`${BASE_URL}/cities`);
          // const data  = await res.json();
          // setCities(data);
          setCities(localData.cities);
        }catch{
          alert("Error fetching data");
        }finally{
          setIsLoading(false);
        }
      }
      fetchCities();
    }, []);

    async function getCity(id){
        try{
            setIsLoading(true);
            // const res = await fetch(`${BASE_URL}/cities/${id}`);
            // const data  = await res.json();
            // setCurrentCity(data);
            setCurrentCity(cities.find(city => city.id == id));
        }catch{
            alert("Error fetching data");
        }finally{
            setIsLoading(false);
        }
    }

    return (
      <CitiesContext.Provider value={{ cities, isLoading,currentCity,getCity }}>
        {children}
      </CitiesContext.Provider>
    );
}

function useCities(){
    const context = useContext(CitiesContext);
    if(context === undefined){
      throw new Error("useCities used outside of CitiesProvider");
    }
    return context
}

export { CitiesProvider, useCities}