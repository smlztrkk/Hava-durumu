import React, { useEffect, useState, useRef, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import Modal from "react-native-modal";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Daily_Weather from "./Screens/Daily_Weather.jsx";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Weather_Information from "./Screens/Weather_Information.jsx";
import Settings from "./Screens/Settings.jsx";
import * as Location from "expo-location";
import MyProvider, { MyContext } from "./MyProvider.jsx";
import Loading from "./components/Loading.jsx";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "./Firebase.js";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
//!-------------------------------------------------------------------------sayfalara ayır firestore ile şehirleri çek ve listele sayfaları ana sayfa yap app.js de çıkar ondan sonra diğerlerini ayır
//?-------------------------------------------------------------------------sayfalara ayır firestore ile şehirleri çek ve listele
//*-------------------------------------------------------------------------sayfalara ayır firestore ile şehirleri çek ve listele düzenlemeler yap yüksekliginide cominitiden bak safeareaview
//?-------------------------------------------------------------------------sayfalara ayır firestore ile şehirleri çek ve listele

//!-------------------------------------------------------------------------sayfalara ayır firestore ile şehirleri çek ve listele ----

//!-------------------------------------------------------------------------sayfalara ayır firestore ile şehirleri çek ve listele ---

export default function App() {
  return (
    <MyProvider>
      <InnerApp />
    </MyProvider>
  );
}
function InnerApp() {
  const { value, setValue } = useContext(MyContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sehir, setSehir] = useState("istanbul");
  const [isInputVisible, setIsInputVisible] = useState(false);
  const inputRef = useRef(null);
  const widthAnim = useRef(new Animated.Value(0)).current;
  const [isModalVisible, setModalVisible] = useState(false);

  async function readCityDocument() {
    const docRef = doc(FIREBASE_DB, "City", "KefiUtwZeNCDawRpJkAk");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  }
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setSehir(location.coords.latitude + "," + location.coords.longitude);
    })();
  }, []);

  const getLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setSehir(location.coords.latitude + "," + location.coords.longitude);
    fetchWeatherData();
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleIconPress = () => {
    setIsInputVisible(!isInputVisible);
    Animated.timing(widthAnim, {
      toValue: isInputVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    });
  };

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=8100388d073e40a2a0e120817242706&q=${sehir}&days=10&aqi=yes&alerts=yes&lang=tr`
      );
      setData(response.data); // Tüm veriyi saklıyoruz
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWeatherData();
    const intervalId = setInterval(fetchWeatherData, 100000);

    // Bileşen unmounted olduğunda interval'ı temizle
    return () => clearInterval(intervalId);
  }, [sehir]);
  const convertTo24HourFormat = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  };

  const time24hrise = convertTo24HourFormat(
    data?.forecast?.forecastday[0]?.astro?.sunrise || "00:00 AM"
  );
  const time24hset = convertTo24HourFormat(
    data?.forecast?.forecastday[0]?.astro?.sunset || "00:00 AM"
  );
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      setCurrentTime(`${hours}:00`);
    };
    updateTime();
  }, [time24hrise]);
  //!----------------------------------------------------------------------------
  const updateCityDocument = async () => {
    try {
      // data ve data.location var mı kontrol et
      if (!data || !data.location) {
        throw new Error("Geçersiz veri yapısı");
      }

      const { name, region, lat, lon } = data.location;

      // name ve diğer özellikler var mı kontrol et
      if (!name || !lat || !lon) {
        throw new Error("Eksik veri özellikleri");
      }

      const docRef = doc(FIREBASE_DB, "City", "KefiUtwZeNCDawRpJkAk");

      // Belgeyi oku, mevcut veriyi al
      const docSnap = await getDoc(docRef);
      const existingWeatherInfo = docSnap.exists()
        ? docSnap.data().WeatherInformation
        : [];

      // Eğer mevcut veri array değilse, boş array yap
      const weatherInfoArray = Array.isArray(existingWeatherInfo)
        ? existingWeatherInfo
        : [];

      // Yeni şehir verilerini oluştur
      const newCity = {
        city: name === region ? name : `${region} / ${name}`,
        latitude: lat,
        longitude: lon,
      };

      // Mevcut şehirlerin arasında yeni şehri kontrol et
      const cityExists = weatherInfoArray.some(
        (info) => info.city === newCity.city
      );

      if (!cityExists) {
        // Yeni şehir mevcut değilse ekle
        await updateDoc(docRef, { WeatherInformation: arrayUnion(newCity) });
        console.log("Yeni şehir eklendi:", newCity);
      } else {
        console.log("Şehir zaten mevcut:", newCity.city);
      }

      readCityDocument();
    } catch (error) {
      console.error("Belge güncellenirken hata oluştu:", error);
      throw error; // Hatayı dışarıya taşı
    }
  };

  const images = [
    require("./assets/images/0.jpg"),
    require("./assets/images/1.jpg"),
    require("./assets/images/2.jpg"),
    require("./assets/images/3.jpg"),
    require("./assets/images/4.jpg"),
    require("./assets/images/5.jpg"),
    require("./assets/images/6.jpg"),
    require("./assets/images/7.jpg"),
    require("./assets/images/8.jpg"),
    require("./assets/images/9.jpg"),
    require("./assets/images/10.jpg"),
    require("./assets/images/11.jpg"),
    require("./assets/images/12.jpg"),
    require("./assets/images/13.jpg"),
    require("./assets/images/14.jpg"),
    require("./assets/images/15.jpg"),
    require("./assets/images/16.jpg"),
  ];
  const renderBackgroundImage = () => {
    return time24hrise > currentTime && time24hset < currentTime ? (
      <Image style={styles.image} source={images[value]} resizeMode="cover" />
    ) : (
      <Image style={styles.image} source={images[value]} resizeMode="cover" />
    );
  };

  const turkishToEnglish = (text) => {
    const turkishChars = {
      ç: "C",
      Ç: "C",
      ğ: "G",
      Ğ: "G",
      ı: "I",
      İ: "I",
      ö: "O",
      Ö: "O",
      ş: "S",
      Ş: "S",
      ü: "U",
      Ü: "U",
    };

    // Türkçe karakterleri İngiliz alfabesine dönüştür
    const convertedText = text.replace(
      /[çğıöşüÇĞİÖŞÜ]/g,
      (match) => turkishChars[match]
    );

    setSehir(convertedText);
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.container1}>
        <Loading />
      </SafeAreaView>
    );
  }
  return (
    <View style={styles.container}>
      {renderBackgroundImage()}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={updateCityDocument}
        >
          <AntDesign name="plus" size={28} color="white" />
        </TouchableOpacity>

        <View style={styles.header2}>
          {!isInputVisible && (
            <TouchableOpacity
              onPress={handleIconPress}
              style={styles.searchIcon}
            >
              <Ionicons name="search-outline" size={28} color="white" />
            </TouchableOpacity>
          )}
          <Animated.View
            style={[
              styles.inputContainer,
              {
                width: widthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"], // Genişleme yüzdesi, ihtiyaçlarınıza göre ayarlayın
                }),
              },
            ]}
          >
            {isInputVisible && (
              <View style={styles.inputContainer1}>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  onChangeText={(text) => turkishToEnglish(text)}
                  onBlur={handleIconPress}
                  placeholder="Arama yapın"
                  placeholderTextColor="darkgray"
                />
                <TouchableOpacity onPress={handleIconPress}>
                  <Entypo name="cross" size={24} color="gray" />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
          <View>
            <TouchableOpacity onPress={() => getLocation()}>
              <Ionicons name="location-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={toggleModal}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </SafeAreaView>
      <ScrollView>
        <SafeAreaView style={styles.contentContainer}>
          <View style={styles.contentContainer1}>
            <View style={styles.weatherInfo}>
              <View style={styles.header1}>
                <Text style={styles.locationName}>
                  {data.location.country}{" "}
                </Text>
                <Text style={styles.region}>
                  {data.location.region == data.location.name
                    ? data.location.name
                    : data.location.region + " / " + data.location.name}
                </Text>
              </View>
              <View style={styles.weatherInfo1}>
                <Text style={styles.currentTemp}>
                  {Math.round(data.current.temp_c)}°
                </Text>
                <Text style={styles.tempRange}>
                  {Math.round(data.forecast.forecastday[0].day.maxtemp_c)}°/
                  {Math.round(data.forecast.forecastday[0].day.mintemp_c)}°
                </Text>
              </View>
              <View style={styles.weatherDetails}>
                <View>
                  <Text style={styles.conditionText}>
                    {data.current.condition.text}
                  </Text>
                </View>
              </View>
            </View>
            <View>
              {/* <Hourly_Weather data={data.forecast.forecastday[0].hour} /> */}
              <Daily_Weather data={data.forecast.forecastday} />
            </View>
          </View>
          <View style={styles.contentContainer2}></View>
          <View style={styles.contentContainer3}>
            <Weather_Information data={data} />
          </View>
          {/* <Slider
            style={{
              width: screenWidth,
              height: 40,
              marginBottom: 30,
            }}
            value={sliderValue}
            onValueChange={(value) => setSliderValue(value)}
            step={5} //ilerleme değeri 0-1 arasında
            minimumValue={0}
            maximumValue={100}
            disabled={false}
            thumbTintColor="blue"
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#777777"
          /> */}
        </SafeAreaView>
      </ScrollView>

      <StatusBar style="auto" />
      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={toggleModal}
        onBackdropPress={() => setModalVisible(false)}
        backdropOpacity={0.4}
        swipeDirection="down"
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalRol}></View>
          <Settings />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    alignItems: "center",
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContainer: {
    backgroundColor: "rgb(38, 50, 56)",
    borderRadius: 30,
    maxHeight: 800,
    minHeight: 400,
    width: "100%",
    padding: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalRol: {
    backgroundColor: "gray",
    position: "absolute",
    top: 0,
    borderRadius: 25,
    margin: 10,
    height: 4,
    width: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  container: {
    flex: 1,
  },
  container1: {
    flex: 1,
    backgroundColor: "rgb(0,0,0)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "rgba(10,10,10,0.5)",
  },
  contentContainer1: {
    flex: 1,
    marginTop: 80,
    paddingVertical: 0,
    height: screenHeight - 80,
    width: screenWidth,
    alignItems: "center",
    justifyContent: "space-around",
  },
  contentContainer2: {
    flex: 1,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer3: {
    flex: 1,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    backgroundColor: "rgba(10,10,10,0.5)",
  },
  header1: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  iconButton: {
    padding: 10,
  },
  locationName: {
    fontWeight: "500",
    maxWidth: screenWidth * 0.6,
    fontSize: 34,
    color: "rgb(224, 224, 224)",
  },
  weatherInfo: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginLeft: 20,
  },
  weatherInfo1: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  currentTemp: {
    fontSize: 132,
    fontWeight: "350",
    color: "white",
  },
  weatherDetails: {
    maxWidth: 250,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 30,
  },
  region: {
    fontWeight: "500",

    maxWidth: screenWidth * 0.32,
    fontSize: 18,
    color: "rgb(158, 158, 158)",
  },
  conditionText: {
    fontWeight: "350",
    fontSize: 16,
    color: "rgb(158, 158, 158)",
  },
  tempRange: {
    fontWeight: "500",
    fontSize: 14,
    color: "rgb(176, 190, 197)",
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  daily: {
    flexDirection: "row",
    width: "90%",
    paddingHorizontal: 10,
    marginVertical: 10,
    gap: 15,
    alignItems: "center",
  },
  dailytext: {
    color: "white",
  },
  input: {
    color: "white",
    maxWidth: 160,
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: 200,
  },
  inputContainer1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    backgroundColor: "rgba(100, 116, 139,0.3)",
    borderColor: "rgb(10, 70, 100)",
    borderRadius: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  searchIcon: {
    backgroundColor: "rgba(100, 116, 139,0.3)",
    padding: 5,
    borderRadius: 25,
  },
  header2: {
    flexDirection: "row",
    gap: 20,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
