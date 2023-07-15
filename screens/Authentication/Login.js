import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../redux/actions/user';
import MoneyRide from '../../assets/mobile-phone.png';
import Loader from '../../components/Loader';

const Login = ({navigation}) => {
  const { error, message,loading } = useSelector((state) => state.user);

  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [valid, setValid] = useState(false);

  const phoneInput = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      ToastAndroid.show(`${error}`, ToastAndroid.SHORT);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
      dispatch({ type: 'clearMessage' });
    }
  }, [dispatch,loading]);

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      return ToastAndroid.show(
        'Please enter all required fields',
        ToastAndroid.SHORT,
      );
    }
    if (!valid) {
      return ToastAndroid.show(
        'Phone number is not valid!',
        ToastAndroid.SHORT,
      );
    }
   
    dispatch(login(phoneNumber, password));
  };

  useEffect(() => {
    const checkValid = phoneInput.current?.isValidNumber(phoneNumber);
    setValid(checkValid ? checkValid : false);
  }, [phoneNumber]);

  return (
    <View>
      <View style={{height: '40%', backgroundColor: '#005249', padding: 20}}>
        <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>
          Free Money Ride
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginVertical: 30,
          }}>
          <Image
            source={MoneyRide}
            style={{width: 200, height: 200, alignSelf: 'center'}}
          />
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
          Login
        </Text>
        <View
          style={{
            marginBottom: 10,
            display: 'flex',
            flexDirection: 'row',
          }}>
          <PhoneInput
            ref={phoneInput}
            defaultValue={phoneNumber}
            defaultCode="IN"
            onChangeFormattedText={text => {
              setPhoneNumber(text);
            }}
            withDarkTheme
            withShadow
            textInputStyle={{height: 55}}
            textContainerStyle={{
              borderLeftWidth: 1,
              borderLeftColor: 'lightgray',
              height: 55,
              backgroundColor: 'white',
              alignItems: 'center',
            }}
          />
          {valid ? (
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/5290/5290058.png',
              }}
              style={{
                width: 20,
                height: 20,
                marginLeft: '-10%',
                marginTop: '6%',
              }}
            />
          ) : (
            phoneNumber?.length > 5 && (
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/4461/4461426.png',
                }}
                style={{
                  width: 20,
                  height: 20,
                  marginLeft: '-10%',
                  marginTop: '6%',
                }}
              />
            )
          )}
        </View>
        <View>
          <Text style={styles.heading}>Password</Text>
          <TextInput
            value={password}
            onChangeText={value => {
              setPassword(value);
            }}
            secureTextEntry={true}
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={'gray'}
          />
        </View>
        <View
          style={{
            alignItems: 'baseline',
            display: 'flex',
            flexDirection: 'row',
            alignSelf: 'flex-end',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
            <Text
              style={{
                color: '#005249',
                fontWeight: '500',
              }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => handleLogin()}>
          <Text style={styles.loginButtonText}>{loading ? <ActivityIndicator color={'black'}/> : `Login`}</Text>
        </TouchableOpacity>
        <View
          style={{
            alignItems: 'baseline',
            display: 'flex',
            flexDirection: 'row',
            alignSelf: 'center',
          }}>
          <Text
            style={{
              color: 'gray',
              fontWeight: '500',
              marginBottom: 20,
            }}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text
              style={{
                color: '#005249',
                fontWeight: '500',
                marginBottom: 20,
              }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Loader loading={loading}/>
    </View>
  );
};

export default Login;

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
