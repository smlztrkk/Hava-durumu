import React, { useRef, useContext } from "react";
import { StyleSheet, View, FlatList, Pressable, Animated } from "react-native";
import { MyContext } from "../MyProvider";
const images = [
  require("../assets/images/0.jpg"),
  require("../assets/images/1.jpg"),
  require("../assets/images/2.jpg"),
  require("../assets/images/3.jpg"),
  require("../assets/images/4.jpg"),
  require("../assets/images/5.jpg"),
  require("../assets/images/6.jpg"),
  require("../assets/images/7.jpg"),
  require("../assets/images/8.jpg"),
  require("../assets/images/9.jpg"),
  require("../assets/images/10.jpg"),
  require("../assets/images/11.jpg"),
  require("../assets/images/12.jpg"),
  require("../assets/images/13.jpg"),
  require("../assets/images/14.jpg"),
  require("../assets/images/15.jpg"),
  require("../assets/images/16.jpg"),
];
const ImageItem = ({ item }) => {
  const { value, setValue } = useContext(MyContext);
  const scaleValue = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.8,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const choseImage = () => {
    setValue(item.index);
  };

  return (
    <View style={{ flex: 1, padding: 5 }}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={choseImage}
      >
        <Animated.Image
          source={images[item.index]}
          style={[styles.image, { transform: [{ scale: scaleValue }] }]}
        />
      </Pressable>
    </View>
  );
};
const Settings = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={(item, index) => {
          return <ImageItem item={item} />;
        }}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 150,
    height: 250,
    borderRadius: 15,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  slider: {
    width: "80%",
    height: 40,
  },
});
