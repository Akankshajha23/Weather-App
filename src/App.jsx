import { FaReact } from "react-icons/fa";
import TopButtons from "./Components/TopButtons";
import Inputs from "./Components/Inputs";
import TimeAndLocation from "./Components/TimeAndLocation";
import TempAndDetails from "./Components/TempAndDetails";
import getFormattedWeatherData from "./Services/Weatherservice";
import { useEffect, useState } from "react";

import Forecast from "./Components/Forecast";

import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

function capitalizeFirstLetter(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
};
const App = () => {
  const [query, setQuery] = useState({ q: "tokyo" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {

    const cityName =  query.q ? query.q :'current location';
    toast.info(`Fetching weather data for ${capitalizeFirstLetter(cityName)}`);

    
    await getFormattedWeatherData({ ...query,units }).then((data) =>{
      toast.success(`Fetched weather data for ${data.name}, ${data.country}`)
      setWeather(data);
      console.log(data);
    });
    
  };
  useEffect(() => {
    getWeather();
  }, [query, units]);

  const formatBackground = () =>{
    if(!weather) return 'from cyan-600 to blue-700'
    const threshold = units === 'metric' ? 20 : 60
    if(weather.temp <= threshold) return 'from-cyan-600 to blue-700'
    return 'from-yellow-600 to-orange-700';
  }

  return (
    <div className={`mx-auto max-w-screen-lg mt-4 py-5 px-32 bg-gradient-to-br shadow-xl shadow-gray-400 ${formatBackground()}`}>
      <TopButtons setQuery = {setQuery}></TopButtons>
      <Inputs setQuery = {setQuery} setUnits = {setUnits} ></Inputs>

      {weather && (
        <>
          <TimeAndLocation weather={weather}></TimeAndLocation>
          <TempAndDetails weather={weather} units = {units}></TempAndDetails>
          <Forecast title="3 hour step forecast" data ={weather.hourly}></Forecast>
          <Forecast title="daily forecast" data={weather.daily}></Forecast>
        </>
      )}
      <ToastContainer autoClose={2500} hideProgressBar = {true} theme = "colored" />
    </div>
  );
};

export default App;
