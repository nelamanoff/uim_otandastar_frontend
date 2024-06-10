import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import svgIcon from './marker-icon.svg'; 

Modal.setAppElement('#root');

const customIcon = new L.Icon({
  iconUrl: svgIcon,
  iconSize: [25, 41], 
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const MapView = ({ countries }) => {
  const [cities, setCities] = useState([]);
  const [uims, setUims] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleMarkerClick = async (country) => {
    try {
      const citiesResponse = await fetch(`http://localhost:3000/api/cities?country_id=${country.id}`);
      if (!citiesResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const citiesData = await citiesResponse.json();
      setCities(citiesData);

      const uimsData = await Promise.all(
        citiesData.map(async (city) => {
          const uimResponse = await fetch(`http://localhost:3000/api/uim?cities_id=${city.id}`);
          if (!uimResponse.ok) {
            throw new Error('Network response was not ok');
          }
          return uimResponse.json();
        })
      );
      setUims(uimsData.flat());

      setSelectedCountry(country);
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error fetching cities or uims data:', error);
    }
  };

  return (
    <>
      <MapContainer
        center={[37.0902, -5.7129]}
        zoom={3}
        style={{ height: '90vh', width: '100%' }}
        scrollWheelZoom={false}
        doubleClickZoom={false} 
        zoomControl={false}
        whenCreated={(map) => {
          map.setMinZoom(3); 
          map.setMaxZoom(3); 
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {countries.map((country, idx) => (
          <Marker
            key={idx}
            position={[country.lat, country.lng]}
            icon={customIcon} 
            eventHandlers={{
              click: () => {
                handleMarkerClick(country);
              },
            }}
          >
            <Popup>{country.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Cities Data"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxHeight: '80vh',
            width: '80vw',
            overflow: 'auto',
            maxWidth: '500px',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
        }}
      >
        <h2>Cities in {selectedCountry?.name}</h2>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
        <ul>
          {cities.map((city) => (
            <li key={city.id}>
              {city.name}
              <ul>
                {uims
                  .filter((uim) => uim.cities_id === city.id)
                  .map((uim) => (
                    <li key={uim.id}>
                      <Link to={`/uim/${uim.id}`} rel="noopener noreferrer">
                        {uim.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
};

export default MapView;
