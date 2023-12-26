import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import {Slot, SplashScreen, Stack} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {Text, useColorScheme, View} from 'react-native';
import Toast, {BaseToast, ErrorToast} from "react-native-toast-message";

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '/boarding',
};


SplashScreen.preventAutoHideAsync();


const toastConfig = {
  success: (props) => (
      <BaseToast
          {...props}
          style={{ borderLeftColor: 'green', height: 380, paddingHorizontal: 0, zIndex: 1000}}
          contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 0, flex: 1}}
          text1Style={{
            paddingStart: 12,
            fontSize: 24,
            fontWeight: '400'
          }}
          autoHide={false}
          hideOnPress={true}
          showProgress={true}
          text1NumberOfLines={2}
          text2NumberOfLines={5}
          text2Style={{
            paddingStart: 12,
            paddingTop: 8,
            fontSize: 24,
            fontWeight: '400'
          }}
      />
  ),
  info: (props) => (
      <BaseToast
          {...props}
          style={{ borderLeftColor: 'pink', height: 120, zIndex: 1000}}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          text1Style={{
            fontSize: 24,
            fontWeight: '400'
          }}
          autoHide={false}
          hideOnPress={true}

          showProgress={true}
          text1NumberOfLines={1}
          text2NumberOfLines={3}
          text2Style={{
            fontSize: 17
          }}

      />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
      <ErrorToast
          {...props}
          text1Style={{
            fontSize: 24
          }}
          text2Style={{
            fontSize: 17
          }}
      />
  ),

  tomatoToast: ({ text1, props }) => (
      <View style={{ height: 60, width: '100%', backgroundColor: 'tomato', zIndex: 1000 }}>
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
  )
}










export default function RootLayout() {

    const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <>

        <Slot/>
          <Toast
              style={{ zIndex: 30 }}
              className={"bg-gray-200 z-30"}
              config={toastConfig}
          />

      </>
  );
}
