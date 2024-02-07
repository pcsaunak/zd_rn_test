/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  Header,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Zendrive, {ZendriveDriveDetectionMode} from 'react-native-zendrive';

import {SDK_KEY} from '@env';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [zdSdkState, setZdSdkState] = useState('Not Initialised');
  const [driveId, setDriveId] = useState<string | undefined>('');
  const [driveStartTime, setDriveStartTime] = useState<number | null>();
  const [isDriveInProgress, setIsDriveInProgress] = useState(false);
  const [driveMode, setDriveMode] = useState<ZendriveDriveDetectionMode>(
    ZendriveDriveDetectionMode.AUTO_ON,
  );

  useEffect(() => {
    console.log('Drive Mode changed --- Inside Use Effect');
    initZdSdk();
  }, [driveMode]);

  const initZdSdk = () => {
    Zendrive.setup({
      driverId: 'test-simple-integration',
      sdkKey: SDK_KEY,
      driveDetectionMode: driveMode,
    }).then(result => {
      if (result.isSuccess) {
        console.log('Zendrive Initialised');
        setZdSdkState('Initialised');
      } else {
        console.log('Zendrive not initialised' + result.errorMessage);
      }
    });
  };

  const toggleSdkMode = () => {
    console.log('Toggle SDK clicked');
    if (driveMode === ZendriveDriveDetectionMode.AUTO_ON) {
      setDriveMode(ZendriveDriveDetectionMode.AUTO_OFF);
    } else {
      setDriveMode(ZendriveDriveDetectionMode.AUTO_ON);
    }
  };

  const startManualDrive = async () => {
    console.log('Starting Manual Drive');
    const result = await Zendrive.startDrive();
    if (result.isSuccess) {
      setIsDriveInProgress(true);
      getActiveDriveInfo();
    }
  };

  const stopManualDrive = async () => {
    console.log('Stopping Manual Drive');
    const result = await Zendrive.stopManualDrive();
    if (result.isSuccess) {
      setIsDriveInProgress(false);
      setDriveId('');
      setDriveStartTime(null);
    }
  };

  const getActiveDriveInfo = () => {
    Zendrive.getActiveDriveInfo().then(result => {
      if (result) {
        setDriveId(result.driveId);
        setDriveStartTime(result.startTimeMillis);
      }
    });
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <View
            style={[
              styles.sectionContainer,
              {marginBottom: 10, marginTop: 10},
            ]}>
            <Text style={[styles.sectionTitle, styles.highlight]}>
              Zendrive Section
            </Text>
            <View style={{marginTop: 10, marginBottom: 10}}>
              <Text>SDK Drive Mode: {driveMode}</Text>
              <Button title="Toggle Drive Mode" onPress={toggleSdkMode} />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Button title="Initialise ZD" onPress={initZdSdk} />
              <Text>{zdSdkState}</Text>
            </View>
            {driveMode === ZendriveDriveDetectionMode.AUTO_OFF ? (
              <View>
                <Button title="Start Manual Drive" onPress={startManualDrive} />
                <View style={{marginTop: 10}}>
                  <Button title="Stop Manual Drive" onPress={stopManualDrive} />
                </View>
              </View>
            ) : null}
          </View>
          <View>
            <Button
              title="Display Active Drive Info"
              onPress={getActiveDriveInfo}
            />
          </View>
          <View style={styles.sectionContainer}>
            <Text> Drive ID: {driveId} </Text>
            <Text> Drive Start Time: {driveStartTime} </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    marginTop: 32,
    paddingHorizontal: 24,
  },
  showButton: {
    opacity: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    flex: 1,
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
