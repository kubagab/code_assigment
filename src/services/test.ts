import 'dotenv/config'; 
import { fetchWeatherData } from './weather'; 

async function testWeather() {
  try {
    console.log('Test 2: Nieprawidłowe miasto');
    const result = await fetchWeatherData('XYZ123Wrong');
    console.log('Success:', result);
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

testWeather();
