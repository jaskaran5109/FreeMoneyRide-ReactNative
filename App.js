import React, {useEffect, useMemo, useState} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './screens/HomeTabs/Home';
import Register from './screens/Authentication/Register';
import Login from './screens/Authentication/Login';
import {Provider, useDispatch, useSelector} from 'react-redux';
import store from './redux/store';
import {
  createFcmToken,
  getMyProfile,
  getUserReport,
} from './redux/actions/user';
import {getAllOffers} from './redux/actions/offer';
import OfferDetailsScreen from './screens/HomeTabs/OfferDetailsScreen';
import {getUserEarnings} from './redux/actions/payout';
import {PhoneProvider} from './PhoneContext';
import Welcome from './screens/HomeTabs/Welcome';
import ForgetPassword from './screens/Authentication/ForgetPassword';
import ResetPassword from './screens/Authentication/ResetPassword';
import messaging from '@react-native-firebase/messaging';
import {ForegroundNotification} from './screens/Components/ForegroundNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

const Stack = createStackNavigator();

function App() {
  const dispatch = useDispatch();
  const {isAuthenticated, user} = useSelector(state => state.user);
  const {offers} = useSelector(state => state.offer);

  const [userr, setUserr] = useState(null);

  useEffect(() => {
    // dispatch(getMyProfile());
    dispatch(getAllOffers());
    // dispatch(getUserEarnings(user?._id));

    AsyncStorage.getItem('user').then(savedUser => {
      if (savedUser) {
        setUserr(JSON.parse(savedUser)); // Parse the JSON data
      } else {
        dispatch(getMyProfile());
        dispatch(getUserEarnings(user?._id));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      AsyncStorage.setItem('user', JSON.stringify(user));
      setUserr(user);
    }
    if(!isAuthenticated){
      setUserr(null)
    }
  }, [user,isAuthenticated]);
  

  useEffect(() => {
    SplashScreen.hide();
  }, []);


  return (
    <NavigationContainer>
      <ForegroundNotification />
      {isAuthenticated || userr ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const AuthNavigator = () => {
  return (
    <PhoneProvider>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </PhoneProvider>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {user} = useSelector(state => state.user);
  useEffect(() => {
    requestUserPermission();
  }, [dispatch]);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken();
    }
  }

  const getFcmToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    dispatch(createFcmToken(user?.phoneNumber, fcmToken));
    if (!fcmToken) {
      try {
        let fcmToken = await messaging().getToken();
        if (fcmToken) {
          dispatch(createFcmToken(user?.phoneNumber, fcmToken));
          await AsyncStorage.setItem('fcmToken', fcmToken);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    checkWelcomeStatus();
  }, []);

  const checkWelcomeStatus = async () => {
    const welcomeDisplayed = await AsyncStorage.getItem('Welcome');
    if (welcomeDisplayed === 'true') {
      navigation.navigate('HomeTab');
    }
  };

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="HomeTab" component={Home} />
      <Stack.Screen name="OfferDetail" component={OfferDetailsScreen} />
    </Stack.Navigator>
  );
};

export default () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
