import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
const screenWidth = Dimensions.get("window").width;

const Weather_Information = ({ data }) => {
  const translateMoonPhase = (moonPhase) => {
    return moonPhase
      .replace(/New Moon/g, "Yeni Ay")
      .replace(/Waxing Crescent/g, "Ağda Hilal")
      .replace(/First Quarter/g, "İlkdördün")
      .replace(/Waxing Gibbous/g, "Ağdalı Kambur")
      .replace(/Full Moon/g, "Dolunay")
      .replace(/Waning Gibbous/g, "Sönen Kambur Ay")
      .replace(/Last Quarter/g, "Sondördün")
      .replace(/Waning Crescent/g, "Azalan Hilal");
  };

  const data1 = data.current;
  const data2 = data.forecast.forecastday[0].astro;
  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <View style={styles.first}>
          <View style={styles.wind}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Text style={[styles.text, { maxWidth: 70 }]}>
                Rüzgar sıcaklığı: {data1.windchill_c}°
              </Text>
              <Text style={styles.text}>{data1.wind_kph} km/s</Text>
            </View>
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.3)",
                width: 80,
                height: 80,
                borderRadius: 40,
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>K</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Text style={{ color: "white" }}>B</Text>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    justifyContent: "center",
                    alignItems: "center",
                    transform: [{ rotate: data1.wind_degree - 180 + "deg" }],
                    transformOrigin: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="navigation"
                    size={28}
                    color="white"
                  />
                </View>
                <Text style={{ color: "white" }}>D</Text>
              </View>

              <Text style={{ color: "white" }}>G</Text>
            </View>
          </View>
          <View style={styles.astro}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.text0}>gün doğumu</Text>
              <Text style={styles.text1}>
                {data2.sunrise.split(" ")[0]}
                <Feather name="sunrise" size={24} color="white" />
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.text0}>gün batımı</Text>
              <Text style={styles.text1}>
                {data2.sunset.split(" ")[0]}
                <Feather name="sunset" size={24} color="white" />
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.text0}>Ay Hali</Text>
              <Text style={styles.text1}>
                {translateMoonPhase(data2.moon_phase)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.text0}>ay şığı</Text>
              <Text style={styles.text1}>{data2.moon_illumination}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.second}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.text0}>Güncelleme</Text>
            <Text style={styles.text1}>{data1.last_updated.split(" ")[1]}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.text0}>Basınç</Text>
            <Text style={styles.text1}>{data1.pressure_mb}mmHg</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.text0}>Nem</Text>
            <Text style={styles.text1}>{data1.humidity} %</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.text0}>Bulut</Text>
            <Text style={styles.text1}>{data1.cloud}%</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.text0}>UV</Text>
            <Text style={styles.text1}> {data1.uv}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.text0}>Yağış mm</Text>
            <Text style={styles.text1}>{data1.precip_mm} mm</Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.text0}>Hissedilen Sıcaklık</Text>
            <Text style={styles.text1}>{data1.feelslike_c}°</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Weather_Information;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth * 0.95,

    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    justifyContent: "space-evenly",
    borderColor: "rgba(50,50,50,0.3)",
    alignItems: "center",
    backgroundColor: "rgba(50,50,50,0.3)", // Arkaplan rengi
  },
  container1: { flexDirection: "row", gap: 10 },
  second: {
    padding: 20,
    justifyContent: "space-evenly",
    width: "50%",
    backgroundColor: "rgba(50,50,50,0.5)",
    borderRadius: 25,
  },
  first: { width: "50%", gap: 10 },
  wind: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "rgba(50,50,50,0.5)",
    borderRadius: 25,
  },
  astro: {
    gap: 5,
    justifyContent: "space-evenly",
    padding: 15,
    backgroundColor: "rgba(50,50,50,0.5)",
    borderRadius: 25,
  },
  text: { color: "white", fontSize: 14 },
  text0: { color: "rgba(255,255,255,0.7)", fontSize: 13 },
  text1: { color: "white", fontSize: 15, fontWeight: "bold" },
});
