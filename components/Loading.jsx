import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const Loading = () => {
  return (
    <View>
      <LottieView
        source={require("../assets/Lottie/0.json")}
        style={{ width: 400, height: 400 }}
        autoPlay
        loop
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
