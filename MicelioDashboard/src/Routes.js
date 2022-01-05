import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';


import Index from './pages/Index';
import Sign from './pages/Sign';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Game from './pages/Game';
import Experiment from './pages/Experiment';
import ExpDetails from './pages/ExpDetails';
import Form from './pages/Form';
import ConsentTerm from './pages/ConsentTerm';

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
        <Switch>
          <Route path={'/home'} component={Home} exact/>
          <Route path={'/sobre'} component={Dashboard}/>
          <Route path={'/game/:id'} component={Game}/>
          <Route path={'/experiment'} component={Experiment}/>
          <Route path={'/expDetails/:id'} component={ExpDetails}/>
          <Route path={'/consentTerm/:id'} component={ConsentTerm}/>
          <Route path={'/form/:id'} component={Form}/>
          <Redirect to={'/home'} />
        </Switch>
      </BrowserRouter>
    )
  }

  return(
    <BrowserRouter basename="/micelio">
      <Switch>
        <Route path={'/'} component={Index} exact/>
        <Route path={'/sign'} component={Sign}/>
        <Route path={'/form/:id'} component={Form}/>
        <Redirect to={'/'} />
      </Switch>
    </BrowserRouter>
  )

}

export default Routes;
