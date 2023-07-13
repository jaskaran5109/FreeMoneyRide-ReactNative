import React, {useState, useEffect} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import MoneyRideFirst from '../../assets/mobile-phone.png';
import Home from './Home';

const slides = [
  {
    key: 'one',
    title:
      'Have Free Time ? Make worth it , complete some easy tasks and make a lot of real Money',
    text: 'Just click on the offers ,Read the steps carefully and Follow them and get the REWARDS',
    image: MoneyRideFirst,
    backgroundColor: '#005249',
  },
];

const Welcome = () => {
  const [showRealApp, setShowRealApp] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const startAnimation = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000, // Adjust the duration as desired
      useNativeDriver: true,
    }).start();
  };


  useEffect(() => {
    if (!showRealApp) {
      startAnimation();
    }
  }, [showRealApp]);

  const renderItem = ({item, index}) => {
    if (index === 0) {
      const slideTransform = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
      });

      const imageTransform = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [800, 1],
      });

      return (
        <Animated.View
          style={[
            styles.slide,
            {
              backgroundColor: item.backgroundColor,
              transform: [{translateY: slideTransform}],
            },
          ]}>
          <Animated.Text style={[styles.title, {opacity: animation}]}>
            {item.title}
          </Animated.Text>
          <Animated.Image
            source={item.image}
            style={[
              styles.image,
              {opacity: animation, transform: [{scale: imageTransform}]},
            ]}
          />
          <Animated.Text style={[styles.text, {opacity: animation}]}>
            {item.text}
          </Animated.Text>
        </Animated.View>
      );
    }
  };
  const onDone = () => {
    setShowRealApp(true);
  };

  if (showRealApp) {
    return <Home />;
  } else {
    return (
      <AppIntroSlider renderItem={renderItem} data={slides} onDone={onDone} />
    );
  }
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
});

export default Welcome;
