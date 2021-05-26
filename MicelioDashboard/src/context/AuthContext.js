import { createContext, useContext, useState, useEffect } from 'react'
import Api from "../services/Api";

const AuthContext = createContext('auth')

export const AuthProvider = ({children}) => {

  const [auth, setAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [name, setName] = useState('')

  useEffect(() => {

    Api.get('/user').then(() => {
      setAuth(true)
      setIsLoading(false)
    }).catch(() => {
      setIsLoading(false)
    })

  }, [])


  return (
    <AuthContext.Provider value={{isAuth: auth, isLoading, name, setAuth, setIsLoading, setName}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}
