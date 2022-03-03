import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar'; // statusbar -> 시계 배터리 등을 뜻함
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import {Fontisto} from '@expo/vector-icons';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

const {width:SCREEN_WIDTH} = Dimensions.get("window"); //변수 선언. 핸드폰의 화면 크기를 구해서 넓이를 width에 할당

const API_KEY = "5eb289b6b166105ed142883e3bd40953";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Rain: "rain",
  Snow: "snow",
  Atmosphere: "cloudy-gusts",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [country, setContury] = useState("Loading..");
  const [city, setCity] = useState("Loading..");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(null);
  const getWeather = async() => { // async and await 기능
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setContury(location[0].timezone);
    setCity(location[0].city);
    
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alert&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(()=>{
    getWeather();
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{country}</Text>
        <Text style={styles.Tinydecription}>{city}</Text>
      </View>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerstyle={styles.weather}>
        {days.length === 0 ? (<View style={styles.day}> 
            <ActivityIndicator color = "#dee2e6" size ="large"/></View>) : 
        (
          days.map((day, index) => 
          <View key = {index} style={styles.day}> 
            <Text style={styles.temp}> {parseFloat(day.temp.day).toFixed(1)}℃</Text>
            <View>
              <Text style={styles.description}>  {day.weather[0].main} <Fontisto name ={icons[day.weather[0].main]} size={28} color="white"/></Text>
            </View>
            <Text style={styles.Tinydecription}>      {day.weather[0].description}</Text>
          </View>
          ))}
      </ScrollView>

      <StatusBar style="light"/>
    </View>
  );
}

const styles = StyleSheet.create({ // create object -> 자동 완성 기능을 사용할 수 있다.
  container: {
    backgroundColor: '#212121',
    flex: 1,
    //justifyContent: 'center', // 가로축 중앙
    //alignItems: 'center', // 세로축 중앙
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },
  cityName: {
    color: '#dee2e6',
    fontSize: 51,
    fontWeight: "400"
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems:"flex-start",
  },
  temp: {
    color: '#dee2e6',
    fontSize : 80,
    marginTop: 40,
  },
  description: {
    color: '#dee2e6',
    fontSize: 60,
    marginTop: -10,
  },
  Tinydecription:{
    color : '#dee2e6',
    fontSize : 20,
  },
});
