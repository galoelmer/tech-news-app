import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import './index.css';
import App from './App';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeServer } from './server';

if (
  process.env.NODE_ENV === "development" &&
  process.env.REACT_APP_NETLIFY_SERVER !== "netlify-server" &&
  process.env.REACT_APP_ENV === "local-development"
) {
  makeServer({ environment: "development" });
}

const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#4e89ae',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      // light: '#0066ff',
      main: '#43658b',
      // dark: will be calculated from palette.secondary.main,
      // contrastText: '#ffcc00',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
