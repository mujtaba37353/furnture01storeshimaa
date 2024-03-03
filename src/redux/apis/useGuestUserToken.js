import { useCreateGuestUserMutation } from './gestUserApi'

export default function useGuestUserToken() {
  const [createGuestUser] = useCreateGuestUserMutation()
  const calledGetGuestUser = (state) => {
    if (state) {
      createGuestUser().then(({ data }) => {
        if (data.token) {
          localStorage.setItem('token', data.token)
        }
      })
    }
  }
  return calledGetGuestUser
}
