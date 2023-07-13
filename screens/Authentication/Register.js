import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
  ToastAndroid,
  Button,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarIcon from '../../assets/calendar.png';
import {useDispatch, useSelector} from 'react-redux';
import {getAllUsers, register} from '../../redux/actions/user';
import PhoneInput from 'react-native-phone-number-input';
import MoneyRide from '../../assets/mobile-phone.png';
import {PhoneContext} from '../../PhoneContext';
import auth from '@react-native-firebase/auth';
import Loader from '../../components/Loader';
import axios from 'axios';
import {server} from '../../redux/store';

const genderData = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
];

const Register = ({navigation}) => {
  const {phoneNumber, setPhoneNumber, code, setCode} = useContext(PhoneContext);

  const [valid, setValid] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [codeloading, setCodeLoading] = useState(false);
  const {loading} = useSelector(state => state.user);
  const dispatch = useDispatch();

  const inputRefs = useRef([]);
  const phoneInput = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('male');
  const [date, setDate] = useState(new Date());
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showDate, setShowDate] = useState(false);

  const [phoneError, setphoneError] = useState('');

  useEffect(() => {
    dispatch(getAllUsers());
    const checkValid = phoneInput.current?.isValidNumber(phoneNumber);
    setValid(checkValid ? checkValid : false);
    phoneValid();
  }, [phoneNumber]);

  function onAuthStateChanged(user) {
    if (user) {
      // dispatch(
      //   register(name, email, password, phoneNumber, gender, dateOfBirth),
      // );
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onChange = (event, selectedDate) => {
    setShowDate(false);

    // on cancel set date value to previous date
    if (event?.type === 'dismissed') {
      setDate(selectedDate);
      return;
    }
    setDate(selectedDate);
  };

  useEffect(() => {
    const dateNew = new Date(date);
    const day = dateNew.getDate();
    const month = dateNew.getMonth() + 1;
    const year = dateNew.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;
    setDateOfBirth(formattedDate);
  }, [date]);
  const handleRegister = () => {
    if (!phoneNumber) {
      return ToastAndroid.show(
        'Please enter your mobile number',
        ToastAndroid.SHORT,
      );
    }
    if (!name) {
      return ToastAndroid.show('Please enter your name', ToastAndroid.SHORT);
    }
    if (!email) {
      return ToastAndroid.show('Please enter your email', ToastAndroid.SHORT);
    }
    if (!password) {
      return ToastAndroid.show(
        'Please enter your password',
        ToastAndroid.SHORT,
      );
    }
    if (!gender) {
      return ToastAndroid.show('Please enter your gender', ToastAndroid.SHORT);
    }
    if (!dateOfBirth) {
      return ToastAndroid.show(
        'Please enter your Date Of Birth',
        ToastAndroid.SHORT,
      );
    }
    if (phoneError !== '') {
      return ToastAndroid.show(
        phoneError + ' with this mobile number',
        ToastAndroid.SHORT,
      );
    }
    signInWithPhoneNumber(phoneNumber);
    // dispatch(register(name, email, password,phoneNumber, gender, dateOfBirth));
  };

  async function signInWithPhoneNumber(phoneNo) {
    if (!phoneNumber) {
      return ToastAndroid.show(
        'Please enter your phone number',
        ToastAndroid.SHORT,
      );
    }
    try {
      setCodeLoading(true);
      const confirmation = await auth().signInWithPhoneNumber(phoneNo);
      setConfirm(confirmation);
      setCodeLoading(false);
    } catch (error) {
      setCodeLoading(false);
    }
  }

  const confirmCode = async () => {
    try {
      setCodeLoading(true);
      await confirm.confirm(code);
      setCodeLoading(false);
      if (!codeloading)
        dispatch(
          register(name, email, password, phoneNumber, gender, dateOfBirth),
        );
    } catch (error) {
      ToastAndroid.show('Invalid code.', ToastAndroid.SHORT);
      setCodeLoading(false);
    }
  };
  const handleOTPChange = (index, value) => {
    setCode(prevOTP => {
      const newOTP = [...prevOTP];
      newOTP[index] = value;
      return newOTP.join('');
    });

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOTPKeyPress = (index, key) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const phoneValid = async () => {
    const {data} = await axios.post(
      `${server}/phoneCheck`,
      {phoneNumber},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    );
    if (data.message === 'User Exist') {
      setphoneError(data.message);
    } else {
      setphoneError('');
    }
  };

  if (!confirm) {
    return (
      <View style={styles.container}>
        <View style={{height: '100%'}}>
          <View
            style={{height: '45%', backgroundColor: '#005249', padding: 20}}>
            <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>
              Money Free Ride
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

          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.view}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  color: '#005249',
                  marginBottom: 15,
                }}>
                Welcome
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
                  textInputStyle={{height: 55, color: 'black'}}
                  textContainerStyle={{
                    borderLeftWidth: 1,
                    borderLeftColor: 'lightgray',
                    height: 55,
                    backgroundColor: 'white',
                    alignItems: 'center',
                  }}
                  placeholder="Enter your Mobile Number"
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
              <Text
                style={{
                  fontSize: 10,
                  color: 'gray',
                  fontWeight: '500',
                  textAlign: 'center',
                  marginBottom: 3,
                }}>
                We need to send OTP to authenticate your number
              </Text>
              <View>
                <Text style={styles.heading}>Name</Text>
                <TextInput
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={value => setName(value)}
                  style={styles.input}
                  placeholderTextColor={'gray'}
                />
              </View>
              <View>
                <Text style={styles.heading}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={value => {
                    setEmail(value);
                  }}
                  style={styles.input}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCompleteType="email"
                  placeholderTextColor={'gray'}
                />
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
              <View>
                <Text style={styles.heading}>Date Of Birth</Text>
                <View>
                  <TouchableWithoutFeedback onPress={() => setShowDate(true)}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        borderBottomColor: 'gray',
                        borderBottomWidth: 1,
                        borderRadius: 10,
                        height: 40,
                        paddingHorizontal: 10,
                        marginBottom: 14,
                        borderRightWidth: 1,
                        paddingTop: 5,
                      }}>
                      <Text
                        style={{
                          flex: 1,
                          paddingTop: 5,
                          color: 'black',
                        }}>
                        {dateOfBirth}
                      </Text>
                      <Image
                        source={CalendarIcon}
                        size={20}
                        style={{
                          width: 30,
                          height: 30,
                          tintColor: '#00000F',
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
              {showDate && (
                <DateTimePicker
                  onChange={onChange}
                  value={date}
                  dateFormat="dd-MM-YYYY"
                  onTouchCancel={() => setShowDate(false)}
                  mode="date"
                  is24Hour={true}
                />
              )}

              <View>
                <Text style={styles.heading}>Gender</Text>
                <Dropdown
                  style={styles.dropdown}
                  iconStyle={styles.iconStyle}
                  data={genderData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={'Select gender'}
                  value={gender}
                  onChange={item => {
                    setGender(item.value);
                  }}
                  itemTextStyle={{color: 'black'}}
                  placeholderStyle={{color: 'black'}}
                  selectedTextStyle={{color: 'black'}}
                />
              </View>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleRegister}>
                <Text style={styles.loginButtonText}>
                  {codeloading ? <ActivityIndicator color={'black'} /> : `Next`}
                </Text>
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
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text
                    style={{
                      color: '#005249',
                      fontWeight: '500',
                    }}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
        <Loader loading={codeloading} />
      </View>
    );
  }
  return (
    <View style={{backgroundColor: '#005249', flex: 1}}>
      <View style={{height: '58%', backgroundColor: '#005249', padding: 20}}>
        <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>
          Money Free Ride
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
          <Text
            style={{
              fontSize: 20,
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              marginVertical: 15,
            }}>
            OTP
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: 'lightgray',
              fontWeight: '500',
              textAlign: 'center',
              marginVertical: 15,
            }}>
            Please enter the OTP sent to your mobile number
          </Text>
        </View>
      </View>
      <View style={styles.view}>
        <View>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              color: 'white',
              fontWeight: 'bold',
              color: 'black',
            }}>
            Check your messages
          </Text>
          <Text
            style={{
              fontSize: 12,
              textAlign: 'center',
              color: 'white',
              fontWeight: 'bold',
              color: 'gray',
              paddingVertical: 10,
            }}>
            MoneyFreeRide has sent you a code to verify
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {Array.from({length: 6}).map((_, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={styles.input2}
              keyboardType="numeric"
              maxLength={1}
              value={code[index] || ''}
              onChangeText={value => handleOTPChange(index, value)}
              onKeyPress={({nativeEvent: {key}}) =>
                handleOTPKeyPress(index, key)
              }
            />
          ))}
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={confirmCode}>
          <Text style={styles.loginButtonText}>
            {loading || codeloading ? (
              <ActivityIndicator color={'black'} />
            ) : (
              'Submit'
            )}
          </Text>
        </TouchableOpacity>
      </View>
      <Loader loading={loading || codeloading} />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#005249',
  },
  view: {
    backgroundColor: 'white',
    padding: 30,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: 'auto',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    imageResolution: '300dpi',
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
    marginBottom: 14,
    paddingHorizontal: 10,
    borderColor: 'gray',
    color: 'black',
  },
  input2: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'gray',
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 5,
    color: 'black',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#FFAE42',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 30,
  },
  loginButtonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  codeFiledRoot: {
    height: 55,
    marginTop: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 14,
    color: 'black',
  },
  root: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  cell: {
    marginHorizontal: 5,
    height: 45,
    width: 45,
    lineHeight: 50,
    fontSize: 30,
    textAlign: 'center',
    borderRadius: 8,
    color: '#3759b8',
    backgroundColor: '#fff',

    // IOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    // Android
    elevation: 3,
  },
  title: {
    paddingTop: 50,
    color: '#000',
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'center',
    paddingBottom: 40,
  },
  icon: {
    width: 217 / 2.4,
    height: 158 / 2.4,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  subTitle: {
    paddingTop: 30,
    color: '#000',
    textAlign: 'center',
  },
  nextButton: {
    width: '100%',
    backgroundColor: '#FFAE42',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 20,
  },
  nextButtonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  otpInput: {
    width: '100%',
    height: 35,
    borderRadius: 5,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 5,
  },
});
