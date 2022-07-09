import { ChakraProvider } from '@chakra-ui/react';

import baseTheme from '../themes/base';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={baseTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
