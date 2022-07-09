import { ChakraProvider } from '@chakra-ui/react';

import baseTheme from '../themes/base';
import 'react-toastify/dist/ReactToastify.min.css';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={baseTheme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
