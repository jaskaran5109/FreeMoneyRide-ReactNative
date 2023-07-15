import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import {CurrencyList} from '../../CurrencyList';
import {TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getAllOffers} from '../../redux/actions/offer';
import {getMyProfile, getUserReport} from '../../redux/actions/user';
import {getUserEarnings} from '../../redux/actions/payout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Shopping = ({navigation}) => {
  const dispatch = useDispatch();
  const {offers, error, message, loading} = useSelector(state => state.offer);
  const {earnings} = useSelector(state => state.payout);
  const {user} = useSelector(state => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredOffers, setFilteredOffers] = useState([]);

  const [fadeAnim] = useState(new Animated.Value(0));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      dispatch(getMyProfile());
      filterOffers();
    }, 1000);
  }, []);


  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getAllOffers());
    dispatch(getUserReport('', user?._id));
    dispatch(getUserEarnings(user?._id));
    filterOffers();
    if (error) {
      ToastAndroid.show(`${error}`, ToastAndroid.SHORT);
      dispatch({type: 'clearError'});
    }
    if (message) {
      ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
      dispatch({type: 'clearMessage'});
    }
  }, [dispatch, refreshing]);

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

  
  const filterOffers = () => {
    if (
      offers &&
      Array.isArray(offers) &&
      offers.filter &&
      earnings &&
      Array.isArray(earnings) &&
      earnings.filter
    ) {
      const filtered = offers.filter(offer => {
        return !earnings.some(earning => earning.offerId === offer.externalId);
      });
      setFilteredOffers(filtered);
    }
  };
  useEffect(() => {
    filterOffers();
  }, [dispatch]);
  const shoppingOffers = filteredOffers.filter(
    data => data?.isEnabled && data?.isShopping,
  );
  
  return (
    <ScrollView
      style={{flex: 1}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Modal visible={loading} transparent={true}>
        <View style={styles.modalContainer}>
          <Animated.View
            style={[styles.indicatorContainer, {opacity: fadeAnim}]}>
            <ActivityIndicator size="large" color="#0000ff" />
          </Animated.View>
        </View>
      </Modal>
      {!loading && shoppingOffers.length>0 ? (
        shoppingOffers.map(data => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('OfferDetail', {
                itemId: data?._id,
              })
            }
            key={data?._id}>
            <View style={styles.container}>
              <Image
                style={styles.offerImage}
                source={{
                  uri: data?.logo,
                }}
              />
              <View style={styles.offerDetails}>
                <Text style={styles.offerTitle}>{data?.offerName}</Text>
                <Text style={styles.offerGeo}>{data?.geo}</Text>
                <View style={{alignSelf: 'flex-start'}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#005249',
                      borderRadius: 10,
                      alignItems: 'center',
                      padding: 10,
                    }}
                    onPress={() =>
                      navigation.navigate('OfferDetail', {
                        itemId: data?._id,
                      })
                    }>
                    <Text style={styles.offerPrice}>
                      {' '}
                      Get{' '}
                      {CurrencyList.map(list => {
                        if (list.code === data?.geo) return list.symbol;
                      })}
                      ₹{data?.po}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{textAlign: 'center', margin: 20, color: '#005249'}}>
          No Shopping Offers Found
        </Text>
      )}
    </ScrollView>
  );
};

export default Shopping;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 8,
    marginTop: 5,
  },
  offerImage: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  offerDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'capitalize',
    color: '#005249',
  },
  offerGeo: {
    fontSize: 14,
    marginBottom: 5,
    textTransform: 'capitalize',
    color: 'gray',
  },
  offerDescription: {
    marginBottom: 8,
  },
  offerPrice: {
    paddingHorizontal: 2,
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  offerCategory: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
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
