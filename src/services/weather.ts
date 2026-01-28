import axios from 'axios';

interface weatherErrorResponse {
  success: false;
  error: {
    code: number;
    type: string;
    info: string;
  };
}
interface weatherSuccessResponse {
  location: {
    name: string;
    lat: string;
    lon: string;
  };
  current: Record<string, unknown>;
}

type weatherResponse = weatherErrorResponse | weatherSuccessResponse;

export async function fetchWeatherData(city: string) {
  const apiKey = process.env.WEATHERSTACK_API_KEY;
  const apiUrl = 'http://api.weatherstack.com/current';

  if (!apiKey) {
    throw new Error('No weatherApiKey in env');
  }

  try {
    const response = await axios.get<weatherResponse>(apiUrl, {
      params: {
        access_key: apiKey,
        query: city,
      },
    });
    const data = response.data;
    const successData = data as weatherSuccessResponse;

    return {
      lat: parseFloat(successData.location.lat),
      lon: parseFloat(successData.location.lon),
      name: successData.location.name,
      weatherData: successData.current,
    };
  } catch (err: any) {
    if (err.response) {
      const data = err.response.data as weatherErrorResponse;

      if (data.success === false) {
        throw new Error(`Weatherstack error ${data.error.code}: ${data.error.info}`);
      }
      throw new Error(`Http error ${err.response.status}: ${err.response.statusText}`);
    } else {
      throw new Error(err.message);
    }
  }
}
