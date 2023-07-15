import React, {useEffect, useMemo, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
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

const Stack = createStackNavigator();

function App() {
  const dispatch = useDispatch();
  const {isAuthenticated, user} = useSelector(state => state.user);
  const {offers} = useSelector(state => state.offer);
  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getAllOffers())
    dispatch(getUserEarnings(user?._id));
    storageUser();
    storageOffer()
  }, [dispatch]);

  const storageUser = async () => {
    let userr = await AsyncStorage.getItem('user');
    let isAuthenticatedd = await AsyncStorage.getItem('isAuthenticated');
    if (!userr && user) {
      try {
        await AsyncStorage.setItem('user', user);
      } catch (error) {
        console.log(error);
      }
    }

    if (!isAuthenticatedd && isAuthenticated) {
      try {
        await AsyncStorage.setItem('isAuthenticated', isAuthenticated);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const storageOffer = async () => {
    let offerss = await AsyncStorage.getItem('offers');
    if (!offerss && offers) {
      try {
        await AsyncStorage.setItem('offers', offers);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <NavigationContainer>
      <ForegroundNotification />
      {isAuthenticated ? (
        <AppNavigator />
      ) : (
        <AuthNavigator />
      )}
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
