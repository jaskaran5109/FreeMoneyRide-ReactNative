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
import {getAllAppOffers, getAllOffers, getSingleOffer} from '../../redux/actions/offer';
import {
  getMyProfile,
  getUserReport,
  updateUserWallet,
} from '../../redux/actions/user';
import {createUserEarnings, getUserEarnings} from '../../redux/actions/payout';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OfferColumnsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {appoffers, loading, message} = useSelector(state => state.offer);
  const {user,reports} = useSelector(state => state.user);
  const {earnings} = useSelector(state => state.payout);
  const [refreshing, setRefreshing] = useState(false);


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getUserEarnings(user?._id));
      setRefreshing(false);
      handleReport();
      dispatch(getAllAppOffers(user?._id));
    }, 1000);
  }, []);
  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getUserEarnings(user?._id));
    dispatch(getAllAppOffers(user?._id));
    dispatch(getUserReport('', user?._id));
  }, [dispatch, refreshing]);

  useEffect(() => {
    dispatch(getAllAppOffers(user?._id));
  }, [])
  const handleReport = async () => {
    try {
      if (reports && Array.isArray(reports)) {
        const filteredReports = reports.filter(
          report => report.Conversions === 1,
        );
        for (const report of filteredReports) {
          if (earnings && Array.isArray(earnings)) {
            const isFound = earnings.some(element => {
              if (
                element.offerId === report.OfferID.toString() &&
                element?.userId === report.Aff_Sub_2
              ) {
                return true;
              }
              return false;
            });
            console.log(isFound);
            if (!isFound) {
              // await dispatch(updateUserWallet(user?._id, report.Affiliate_Price));
              await dispatch(
                createUserEarnings(
                  user?._id,
                  `${report.OfferID}`,
                  report.Affiliate_Price,
                  'INR',
                  `Congratulations, your reward for ${report?.OfferName} has been added to your wallet.`,
                ),
              );
              await dispatch(getUserEarnings(user?._id));
              console.log('Running Yoo');
              console.log('________________________');
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isFirstRender.current) {
      handleReport(); // Run handleReport on refresh
    }
    isFirstRender.current = false;
  }, [earnings]);

  return (
    <ScrollView
      style={{flex: 1}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {!loading && appoffers ? (
        appoffers.map(data => {
          return (
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
          );
        })
      ) : (
        <Text style={{textAlign: 'center', margin: 20, color: '#005249'}}>
          No App Offers Found
        </Text>
      )}

      <Loader loading={loading} />
    </ScrollView>
  );
};

export default OfferColumnsScreen;

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
