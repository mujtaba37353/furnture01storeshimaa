import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './router/Router'
import logoPath from './assets/svg/whiteLogo.svg'
import { useTranslation } from 'react-i18next'
import { useLazyGetMeQuery } from './redux/apis/UserApis.js'
import { useCreateGuestUserMutation } from './redux/apis/gestUserApi.js'
import JarirTextEarea from './components/Footers/jarir/jarirTextErea/index.jsx'
import Navbar_ButtunStyle from './layouts/Navbars/buttonStyle/without/Navbar_ButtunStyle.jsx'
function App() {
  const [getMe] = useLazyGetMeQuery()
  const [, { _, changeLanguage }] = useTranslation()
  const [createGuestUser] = useCreateGuestUserMutation()
  useEffect(() => {
    if (localStorage?.i18nextLng) {
      changeLanguage(localStorage?.i18nextLng)
    }
  }, [])
  useEffect(() => {
    if (localStorage?.token) {
      getMe()
        .unwrap()
        .then((res) => res)
        .catch(() => {
          createGuestUser()
            .unwrap()
            .then((res) => {
              localStorage.setItem('token', res.token)
            })
        })
    }
  }, [])
  useEffect(() => {
    if (!localStorage.token) {
      createGuestUser()
        .unwrap()
        .then((res) => {
          localStorage.setItem('token', res.token)
        })
    }
  }, [])
  return (
    <BrowserRouter>
      <Navbar_ButtunStyle logoPath={logoPath} />
      <AppRoutes />
      <JarirTextEarea logo={logoPath} />
    </BrowserRouter>
  )
}
export default App
