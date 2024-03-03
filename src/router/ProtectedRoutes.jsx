import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = ({ condition }) => {
  return condition ? <Outlet /> : <Navigate to="/" />
}
export default ProtectedRoutes
