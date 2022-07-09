import { extendTheme } from '@chakra-ui/react';
import { COLOR_PRIMARY, COLOR_PRIMARY_DARK } from '../styles/_variables';

export default extendTheme({
  global: {
    'html, body': {
      fontFamily: 'Poppins, sans-serif',
    },
  },
  sizes: {
    container: {
      '2xl': '1440px',
    },
  },
  colors: {
    micelio: {
      primary: COLOR_PRIMARY,
      primaryDark: COLOR_PRIMARY_DARK,
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
    List: {
      parts: ['list', 'item'],
      variants: {
        primary: {
          list: {
            background: 'red',
            color: 'red',
          },
        },
      },
    },
    ListItem: {
      variants: {
        selected: {
          background: 'red',
          color: 'red',
        },
      },
    },
  },
});
