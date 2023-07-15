const {useEffect} = require('react');
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

export const ForegroundNotification = () => {
  useEffect(() => {
    const unSubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Message handled in the foreground!', remoteMessage);
    });
    PushNotification.localNotification({
      channelId: '1234',
      title: 'Free Money Ride',
      messageId:"0:8798668scgs9o",
      body: 'Testing Notification Foreground',
      soundName: 'default',
      vibrate: true,
      playSound: true,
      largeIcon: "ic_launcher"
    });
    return unSubscribe;
  }, []);
  return  null;
};
