import React, {useEffect, useMemo, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './screens/HomeTabs/Home';
import Register from './screens/Authentication/Register';
import Login from './screens/Authentication/Login';
import {Provider, useDispatch, useSelector} from 'react-redux';
import store from './redux/store';
import {getMyProfile, getUserReport} from './redux/actions/user';
import {getAllOffers} from './redux/actions/offer';
import OfferDetailsScreen from './screens/HomeTabs/OfferDetailsScreen';
import {getUserEarnings} from './redux/actions/payout';
import {PhoneProvider} from './PhoneContext';
import Welcome from './screens/HomeTabs/Welcome';
import ForgetPassword from './screens/Authentication/ForgetPassword';
import ResetPassword from './screens/Authentication/ResetPassword';

const Stack = createStackNavigator();

function App() {
 
  const dispatch = useDispatch();
  const {isAuthenticated, user} = useSelector(state => state.user);
  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getAllOffers());
    dispatch(getUserEarnings(user?._id));
  }, [dispatch]);
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
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
