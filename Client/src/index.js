import { render } from 'react-dom'
import './index.css'
import { Provider } from 'react-redux'
import './i18n'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { persistor, store } from './redux/Store'
import App from './App'
import { ThemeProvider } from '@mui/material'
import { theme } from './core-ui/theme'
const root = document.getElementById('root')
import { PersistGate } from 'redux-persist/integration/react'
import "currency-flags/dist/currency-flags.min.css"
import {HelmetProvider} from 'react-helmet-async'
import Whatsapp from './components/whatsapp/Whatsapp'
render(
  <Provider store={store}>
    <ToastContainer />
    <ThemeProvider theme={theme}>
      <PersistGate persistor={persistor}>
        <HelmetProvider>
        <Whatsapp />

        <App />
        </HelmetProvider>
      </PersistGate>
    </ThemeProvider>
  </Provider>,
  root
)
