import {BrowserRouter, Route, Redirect} from 'react-router-dom';


import Index from './pages/Index';
import Sign from './pages/Sign';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import {useAuth} from "./context/AuthContext";

require('dotenv').config();

const Routes = () => {
  const { isAuth, isLoading } = useAuth();

  if(isLoading) {
    return <div />
  }

  if(isAuth){
    return(
      <BrowserRouter basename="/micelio">
        <Route path={'/home'} component={Home} exact/>
        <Route path={'/dashboard'} component={Dashboard}/>
        <Redirect to={'/home'} />
      </BrowserRouter>
    )
  }

  return(
    <BrowserRouter basename="/micelio">
      <Route path={'/'} component={Index} exact/>
      <Route path={'/sign'} component={Sign}/>
      <Redirect to={'/'} />
    </BrowserRouter>
  )



}

export default Routes;
