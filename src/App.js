import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Forcast from "./components/Forcast";
import Inputs from "./components/Inputs";
import TemperatureAndDetails from "./components/TemperatureAndDetails";
import TimeAndLocations from "./components/TimeAndLocations";
import getFormattedWeatherData from "./services/weatherService";
import {  useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import MapDisplay from "./components/MapDisplay";

function App() {
  const [query, setQuery] = useState({ q: "howrah" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      await getFormattedWeatherData({ ...query, units }).then((data) => {
        toast.success(`Successfully fetched weather for ${data.name}, ${data.country}`);
        setWeather(data);
        console.log("Weather Data:", data);
      });
    };
    fetchWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";

    const threshold = units === "metric" ? 20 : 60;

    if (weather.temp <= threshold) return "from-cyan-700 to-blue-700";

    return "from-yellow-700 to-orange-700";
  };

  const setLatLon = async ({ lat, lon }) => {
    await getFormattedWeatherData({ lat, lon, units }).then((data) => {
      toast.success(`Successfully fetched weather for ${data.name}, ${data.country}`);
      setWeather(data);
    });
  };

  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        if (e.originalEvent.shiftKey) {
          const { lat, lng } = e.latlng;
          console.log("Map Clicked at:", lat, lng);
          setLatLon({ lat, lon: lng });
        }
      }
    });
    return null;
  };

  const UpdateMapView = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
      if (coords) {
        map.setView(coords, map.getZoom());
      }
    }, [coords, map]);
    return null;
  };

  const defaultCoords = [22.5958, 88.2636]; // Default coordinates for initial map view
  const position = weather ? [weather.lat, weather.lon] : defaultCoords;

  const defaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow
  });


  return (
    <div
      className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br h-fit shadow-xl shadow-grey-400 ${formatBackground()}`}
      id="main_content"
    >
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />
      {weather && (
        <div>
          <TimeAndLocations weather={weather} />
          <TemperatureAndDetails weather={weather} />
          <Forcast title="Hourly Forecast" items={weather.hourly} />
          <Forcast title="Daily Forecast" items={weather.daily} />
            <MapDisplay position={position} weather={weather} setLatLon={setLatLon} />
        </div>
      )}

      <ToastContainer autoClose={5000} theme="colored" newestOnTop={true} />
    </div>
  );
}

export default App;
