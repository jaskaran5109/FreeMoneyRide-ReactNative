import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import WelcomeImage from '../../assets/welcome.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Welcome = ({navigation}) => {
  const handleSkip = async () => {
    await AsyncStorage.setItem('Welcome', 'true');
    navigation.navigate('HomeTab');
  };

  return (
    <View style={styles.container} activeOpacity={1}>
      <Image source={WelcomeImage} style={styles.image} />
      <TouchableOpacity style={styles.textContainer} onPress={handleSkip}>
        <Text style={styles.text}>SKIP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 100,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default Welcome;
