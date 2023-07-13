import {
  View,
  Modal,
  Animated,
  ActivityIndicator,
  StyleSheet,
  Easing,
} from 'react-native';
import React, {useEffect, useState} from 'react';

const Loader = ({loading}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, fadeAnim]);

  return (
    <View>
      <Modal visible={loading} transparent={true}>
        <View style={styles.modalContainer}>
          <Animated.View
            style={[styles.indicatorContainer, {opacity: fadeAnim}]}>
            <ActivityIndicator size="large" color="#0000ff" />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  indicatorContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
