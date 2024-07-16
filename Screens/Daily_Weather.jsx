import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import Hourly_Weather from "./Hourly_Weather";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const tarih = (data) => {
  let dateString = data;

  let date = new Date(dateString);

  let daysOfWeek = [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
  ];

  let dayName = daysOfWeek[date.getDay()];
  return dayName;
};

export default function Daily_Weather({ data }) {
  const [showHour, setShowHour] = useState(true);
  const [hour, setHour] = useState(null);
  const [index1, setIndex1] = useState(null); // Initializing with null
  const show = () => {
    setShowHour(!showHour);
  };
  const change = (index) => {
    setIndex1(index);
    setHour(data[index].hour);
  };

  return (
    <View style={styles.container}>
      {data && showHour && (
        <View style={styles.daily}>
          <FontAwesome name="calendar" size={22} color="white" />
          <Text style={styles.dailytext}>Günlük hava durumu</Text>
        </View>
      )}
      {showHour ? (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          nestedScrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                change(index), show();
              }}
            >
              <View style={styles.container1}>
                <View>
                  <Image
                    source={{
                      uri:
                        "https:" +
                        item.day.condition.icon.replace("64x64", "128x128"),
                    }}
                    style={{
                      width: 88,
                      height: 88,
                    }}
                    alt="resim"
                  />
                </View>
                <View>
                  <Text style={styles.temp}>
                    {Math.round(item.day.maxtemp_c)}°/
                    {Math.round(item.day.mintemp_c)}°
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <FontAwesome6
                    name="droplet"
                    size={10}
                    color="rgb(79, 195, 247)"
                  />
                  <Text style={styles.temp}>
                    {item.day.daily_chance_of_rain}%
                  </Text>
                </View>
                <View>
                  <Text style={styles.date}>{tarih(item.date)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={show}
            style={{ paddingLeft: 20, marginVertical: 5 }}
          >
            <View style={{ flexDirection: "row", gap: 15 }}>
              <FontAwesome6 name="arrow-left-long" size={24} color="white" />
              <Text style={{ color: "white", fontSize: 18 }}>
                {tarih(data[index1].date)}
              </Text>
            </View>
          </TouchableOpacity>
          <Hourly_Weather data={hour} />
        </View>
      )}
    </View>
  );
}
//? yağış ihtimalini kar mı yağmurmu belirle
const styles = StyleSheet.create({
  container: {
    height: 285,
    borderRadius: 20,
    backgroundColor: "rgba(50,50,50,0.2)", // Arkaplan rengi
  },
  container1: {
    width: (screenWidth * 0.9) / 3,
    height: 220,
    borderRadius: 20,
    paddingVertical: 10,
    margin: 5,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(50,50,50,0.5)", // Arkaplan rengi
  },
  date: { color: "white", fontSize: 20 },
  temp: { color: "rgb(158, 158, 158)" },
  daily: {
    flexDirection: "row",
    width: "90%",
    paddingHorizontal: 20,
    marginVertical: 10,
    gap: 15,
    alignItems: "center",
  },
  dailytext: {
    color: "white",
  },
});
