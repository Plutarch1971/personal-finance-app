import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartbooks.app',
  appName: 'SmartBooks',
  webDir: 'dist',

  server: {
    url: 'https://www.smartbooksfinance.com',
    cleartext: false,
    androidScheme: 'https'
  }
};

export default config;


