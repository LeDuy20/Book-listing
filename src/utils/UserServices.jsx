import axios from '../services/customer-axios'

const createUserRegister = (fullName, email, password, phone) => {
  return axios.post('/api/v1/user/register' , { fullName, email, password, phone })
}  
const  loginUser = (username, password) => {
  return axios.post('/api/v1/auth/login', { username, password })
}
const callFetchAccount = () => {
  return axios.get('/api/v1/auth/account')
}
export {
  createUserRegister,
  loginUser,
  callFetchAccount

} 