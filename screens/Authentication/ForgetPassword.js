import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MoneyRide from '../../assets/mobile-phone.png';
import Loader from '../../components/Loader';
import LeftIcon from '../../assets/angle-left.png';
import {forgotPassword} from '../../redux/actions/user';

const ForgetPassword = ({navigation}) => {
  const {loading,message,error} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');


  useEffect(() => {
    if (error) {
      ToastAndroid.show(`${error}`, ToastAndroid.SHORT);
      dispatch({ type: 'clearError' });
    }
    if (message) {
    //   ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
      navigation.navigate("ResetPassword")
      dispatch({ type: 'clearMessage' });
    }
  }, [dispatch,loading]);

  const handleForgetPassword = () => {
    if (!email) {
      return ToastAndroid.show('Please enter your email', ToastAndroid.SHORT);
    }
    dispatch(forgotPassword(email));
  };
  return (
    <View>
      <View style={{height: '48%', backgroundColor: '#005249', padding: 20}}>
        <View
          style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={LeftIcon}
              style={{width: 20, height: 18, tintColor: 'white'}}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              color: 'white',
              fontWeight: 'bold',
              marginLeft: 20,
            }}>
            Free Money Ride
          </Text>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginVertical: 50,
          }}>
          <Image
            source={MoneyRide}
            style={{width: 200, height: 200, alignSelf: 'center'}}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 15,
              textAlign: 'center',
              paddingVertical: 30,
            }}>
            Please Enter Your Email Address To Receive a Verification Token.
          </Text>
        </View>
      </View>
      <View style={styles.view}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            color: '#005249',
            marginBottom: 15,
          }}>
          Forgot Password
        </Text>
        <View>
          <Text style={styles.heading}>Email</Text>
          <TextInput
            value={email}
            onChangeText={value => {
              setEmail(value);
            }}
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={'gray'}
          />
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleForgetPassword}>
          <Text style={styles.loginButtonText}>{`Send`}</Text>
        </TouchableOpacity>
      </View>
      <Loader loading={loading} />
    </View>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  view: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'white',
    height: '100%',
    padding: 30,
    marginTop: '-14%',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 64, 255, 0.1)',
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    margin: 5,
    color: 'black',
  },
  input: {
    width: '100%',
    height: 40,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderColor: 'gray',
    color: 'black',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#FFAE42',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 20,
  },
  loginButtonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
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
