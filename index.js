/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Zendrive from 'react-native-zendrive';
import moment from 'moment';

Zendrive.registerZendriveCallbackEventListener(async notifiedEvent => {
  console.log('Inside Register Zendrive Callback ');
  console.log('Event Received: ' + JSON.stringify(notifiedEvent));
  switch (notifiedEvent.kind) {
    case 'on-drive-start':
      console.log('Drive Started');
      const drive = notifiedEvent.event;
      console.log('Drive ID: ' + drive.driveId);
      console.log('Tracking Id: ' + drive.trackingId);
      break;

    case 'on-drive-end':
      console.log('Drive Stopped');
      const result = notifiedEvent.event;
      console.log('Stopping drive with ID: ' + result.driveId);
      break;

    case 'on-settings-changed':
      const event = notifiedEvent.event;
      console.log('Errors Found: ' + event.errorsFound);
      console.log('Warning found: ' + event.warningsFound);
      if (event) {
        Zendrive.getZendriveSettings().then(settings => {
          if (settings) {
            console.log(JSON.stringify(settings));
          }
        });
      }
  }
});

AppRegistry.registerComponent(appName, () => App);
