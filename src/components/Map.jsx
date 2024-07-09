import {  useNavigate } from 'react-router-dom';
import { useCities } from '../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { useUrlPosition } from '../hooks/useUrlPosition';
import styles from './Map.module.css';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap, 
  useMapEvents 
} from 'react-leaflet';
import { useEffect, useState } from 'react';
import Button from './Button';


export default function Map() {
  const {cities} = useCities();
  const [mapPosition,setMapPosition] = useState([48,2]);
  const {isLoading:isLoadingPosition,position:geolocationPosition,getPosition} = useGeolocation();
  const {mapLat,mapLng} = useUrlPosition();

  useEffect(() => {
    if(mapLat && mapLng){
      setMapPosition([mapLat, mapLng])
    }
  }, [mapLat, mapLng]);

  useEffect(() => {
    if(geolocationPosition){
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng])}
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && <Button type='position' onClick={getPosition}>
        {isLoadingPosition ? 'Loading...' : 'Use My Position'}
      </Button>}
      <MapContainer 
        center={mapPosition}
        zoom={4} 
        scrollWheelZoom={true} 
        className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) =>(
          <Marker position={[city.position.lat,city.position.lng]} key={city.id}>
            <Popup>
              <img
              src={`https://flagcdn.com/20x15/${city.emoji}.png`}
              width="20"
              height="15"
              alt={city.emoji} />
             <span>{city.cityName}</span>
            </Popup>
          </Marker>
          ))}

          <ChangeCenter position={mapPosition} />   
          <DetectClick />     
        
      </MapContainer>
    </div>
  )
}


function ChangeCenter({position}){
  const map = useMap()
  map.setView(position)
  console.log(position)
  return null
}

function DetectClick(){
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      console.log(e.latlng)
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  }})
}