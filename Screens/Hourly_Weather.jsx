import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";

const screenWidth = Dimensions.get("window").width;

const TemperatureChart = ({ data }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const [currentTime, setCurrentTime] = useState("");
  const [currentTime1, setCurrentTime1] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Ay değeri 0-11 olduğu için +1 ekliyoruz
      const day = String(now.getDate()).padStart(2, "0"); // Günü iki basamaklı yapmak için padStart kullanıyoruz

      const formattedDate = `${year}-${month}-${day}`;
      setCurrentTime1(formattedDate);

      const hours = String(now.getHours()).padStart(2, "0");
      setCurrentTime(`${hours}:00`);
    };
    updateTime();
    const intervalId = setInterval(updateTime, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.daily}>
        <MaterialCommunityIcons name="hours-24" size={26} color="white" />
        <Text style={styles.dailytext}>Saatlik hava durumu</Text>
      </View>
      {data ? (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          nestedScrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 60,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  marginHorizontal: 5,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        color: "white",
                      }}
                    >
                      {Math.round(item.temp_c)}°
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 55,
                      height: 3,
                      borderBottomWidth: 3,
                      borderColor:
                        Math.round(item.temp_c) > 40
                          ? "rgb(255, 0, 0)"
                          : Math.round(item.temp_c) > 30
                          ? "rgb(221, 44, 0)"
                          : Math.round(item.temp_c) > 20
                          ? "rgb(255, 109, 0)"
                          : Math.round(item.temp_c) > 10
                          ? "rgb(255, 225, 0)"
                          : Math.round(item.temp_c) > 0
                          ? "rgb(0, 230, 118)"
                          : Math.round(item.temp_c) > -10
                          ? "rgb(100, 145, 255)"
                          : "rgb(45, 55, 255)",
                    }}
                  ></View>
                  <View>
                    <Image
                      source={{
                        uri: "https:" + item.condition.icon,
                      }}
                      style={{
                        width: 48,
                        height: 48,
                      }}
                      alt="resim"
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: 10,
                        color: "white",
                      }}
                    >
                      {item.wind_kph} km/s
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 12,
                        color: "white",
                      }}
                    >
                      {formatTime(item.time) === currentTime &&
                      currentTime1 === item.time.split(" ")[0] ? (
                        <Text
                          style={{
                            color:
                              Math.round(item.temp_c) > 40
                                ? "rgb(255, 0, 0)"
                                : Math.round(item.temp_c) > 30
                                ? "rgb(221, 44, 0)"
                                : Math.round(item.temp_c) > 20
                                ? "rgb(255, 109, 0)"
                                : Math.round(item.temp_c) > 10
                                ? "rgb(255, 225, 0)"
                                : Math.round(item.temp_c) > 0
                                ? "rgb(0, 230, 118)"
                                : Math.round(item.temp_c) > -10
                                ? "rgb(100, 145, 255)"
                                : "rgb(45, 55, 255)",
                          }}
                        >
                          ŞİMDİ
                        </Text>
                      ) : (
                        formatTime(item.time)
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      ) : (
        <View>
          <Text style={{ color: "white" }}>Veri yok</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.95,
    height: 250,
    borderRadius: 20,
    paddingVertical: 5,
    borderWidth: 7,
    borderColor: "rgba(50,50,50,0.3)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(50,50,50,0.5)", // Arkaplan rengi
  },
  daily: {
    flexDirection: "row",
    width: "90%",
    marginVertical: 10,
    gap: 15,
    alignItems: "center",
  },
  dailytext: {
    color: "white",
  },
});

export default TemperatureChart;
