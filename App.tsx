import React, { useEffect } from 'react';
import { Platform, StatusBar, } from 'react-native';
import './global.css';
import Navigation from './src/navigation/Navigation';
import { requestPhotoPermission } from './src/utils/Constants';
import { checkFilePermission } from './src/utils/librayHelpers';

export default function App() {
  useEffect(() => {
    requestPhotoPermission();
    checkFilePermission(Platform.OS);
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <Navigation />
    </>
  );
}


