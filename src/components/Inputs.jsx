import React, { useState } from "react";
import { UilSearch, UilLocationPoint } from "@iconscout/react-unicons";
import { toast } from "react-toastify";
import "../App.css";

function Inputs({ setQuery, units, setUnits }) {
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleSearchClick = (e) => {
    e.preventDefault();
    if (city !== "") {
      setQuery({ q: city });
      setCity("");
    } else if (latitude && longitude) {
      setQuery({
        lat: parseFloat(latitude),
        lon: parseFloat(longitude),
      });
      setLatitude("");
      setLongitude("");
    } else {
      toast.error("Please provide a city or both latitude and longitude.");
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        toast.success("Location fetched!");
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);
        setQuery({
          lat,
          lon,
        });
      });
    }
  };

  const handleunitChange = (e) => {
    const selectedUnit = e.currentTarget.name;
    if (units !== selectedUnit) setUnits(selectedUnit);
  };

  return (
    <div id="input_field" className="flex flex-col items-center my-6">
      <div className=" customize_city_buttons flex flex-row w-full items-center justify-center  space-x-4 mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.currentTarget.value)}
          placeholder="Search for city..."
          className=" city_input text-xl font-light p-2 w-full shadow-xl focus:outline-none capitalize placeholder:lowercase rounded"
        />
        <div className="buttom_search">
        <UilSearch
          onClick={handleSearchClick}
          size={25}
          className="text-white cursor-pointer transition ease-out hover:scale-125"
        />
        <UilLocationPoint
          onClick={handleLocationClick}
          size={25}
          className="text-white cursor-pointer transition ease-out hover:scale-125"
        />
        </div>
      </div>
      <form onSubmit={handleSearchClick} className="flex flex-col  items-center space-y-4">
        <div className=" search_input flex flex-row space-x-4 ">
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.currentTarget.value)}
            placeholder="Latitude"
            className=" Latitude_input_field text-xl font-light p-2 shadow-xl  focus:outline-none rounded"
          />
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.currentTarget.value)}
            placeholder="Longitude"
            className=" longitute_input_field text-xl font-light p-2 shadow-xl focus:outline-none rounded"
          />
        </div>
      </form>
      <div className="flex flex-row w-1/4 items-center justify-center mt-4">
        <button
          name="metric"
          className="text-xl text-white font-light hover:scale-125 transition ease-out"
          onClick={handleunitChange}
        >
          °C
        </button>
        <p className="text-xl text-white mx-1">|</p>
        <button
          name="imperial"
          className="text-xl text-white font-light hover:scale-125 transition ease-out"
          onClick={handleunitChange}
        >
          °F
        </button>
      </div>
    </div>
  );
}

export default Inputs;
