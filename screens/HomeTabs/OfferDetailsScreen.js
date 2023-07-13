import React, {useEffect, useRef, useState} from 'react';
import Accordion from '../../components/Accordian';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Linking,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getSingleOffer} from '../../redux/actions/offer';
import LeftIcon from '../../assets/angle-left.png';
import {getUserEarnings} from '../../redux/actions/payout';

const OfferDetailsScreen = ({route, navigation}) => {
  const {user} = useSelector(state => state.user);
  const {offer, loading} = useSelector(state => state.offer);
  const {itemId} = route.params;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSingleOffer(itemId));
    dispatch(getUserEarnings(user?._id));
  }, [dispatch, itemId]);

  const handleOffer = async () => {
    const offerUrl = `${offer.offerLink}&aff_sub2=${user?._id}`;
    await Linking.openURL(offerUrl);
  };
  return (
    <View style={{flex: 1}}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        offer && (
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={LeftIcon}
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 15,
                    paddingRight: 30,
                  }}
                />
              </TouchableOpacity>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', color: '#005249'}}>
                {offer?.offerName}
              </Text>
              <TouchableOpacity
                style={{
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 10,
                  borderColor: '#005249',
                  borderWidth: 1,
                }}
                onPress={() => navigation.navigate('Wallet', {replace: true})}>
                <Text style={{fontWeight: 'bold', color: '#005249'}}>
                  ₹{user?.wallet.amount}
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
              <Image
                source={{
                  uri: `${offer?.coverImage}`,
                }}
                style={{
                  width: '100%',
                  height: undefined,
                  borderRadius: 10,
                  aspectRatio: 1,
                  transform: [{scale: 1}],
                  resizeMode: 'contain',
                }}
              />
              <View
                style={{
                  alignSelf: 'flex-end',
                  marginRight: 20,
                  marginTop: -25,
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#005249',
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                  }}
                  onPress={handleOffer}>
                  <Text
                    style={{color: 'white', fontWeight: '800', fontSize: 14}}>
                    Get ₹{offer?.po}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
                <Image
                  source={{
                    uri: `${offer?.logo}`,
                  }}
                  style={{width: 60, height: 60, borderRadius: 10}}
                />
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#005249',
                    }}>
                    {offer?.offerName}
                  </Text>
                  <Text
                    style={{color: 'gray', fontSize: 14, fontWeight: '600'}}>
                    {offer?.geo}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: 'lightgray',
                  marginTop: 20,
                }}
              />

              <Accordion
                title="About Application"
                content={
                  <Text style={{color: 'black'}}>{offer?.appDescription}</Text>
                }
                expand={true}
              />
              <View style={{borderWidth: 0.5, borderColor: 'lightgray'}} />
              <Accordion
                title="Today's Task"
                content={<Text style={{color: 'black'}}>{offer?.task}</Text>}
                expand={true}
              />

              <View style={{borderWidth: 0.5, borderColor: 'lightgray'}} />
            </ScrollView>
            <TouchableOpacity
              style={styles.button}
              onPress={handleOffer}
              disabled={loading}>
              <Text style={styles.buttonText}>Start Now</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
  );
};

export default OfferDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  contentText: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#005249',
    paddingVertical: 12,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
