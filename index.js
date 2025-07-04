import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Codegen didn\'t run for',
  'The global process.env.EXPO_OS is not defined',
]);
