import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'eccomerce',
  webDir: 'dist/eccomerce',
  server: {
    androidScheme: 'https'
  }
};

export default config;
