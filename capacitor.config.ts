import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eccomerce.app',
  appName: 'eccomerce',
  webDir: 'dist/eccomerce',
  server: {
    androidScheme: 'https'
    // "url": "http://10.10.100.50:4200",
    // "cleartext": true
  },
};

export default config;
