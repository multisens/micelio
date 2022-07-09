import { extendTheme } from '@chakra-ui/react';

export default extendTheme({
  global: {
    'html, body': {
      fontFamily: 'Poppins, sans-serif',
    },
  },
  colors: {
    micelio: {
      primary: '#52b788',
      primaryDark: '#40916c',
    },
  },
  components: {
    Button: {
      variants: {
        primary: {
          backgroundColor: 'micelio.primary',
          color: 'white',
          fontWeight: 'bold',
          transition: 'all .2s',
          _hover: {
            backgroundColor: 'micelio.primaryDark',
          },
        },
      },
    },
  },
});
