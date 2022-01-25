import { BrowserRouter, Route, Redirect, Switch, NavLink } from 'react-router-dom';


import Index from './pages/Index';
import Sign from './pages/Sign';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Game from './pages/Game';
// experiment logged in micelio
import Experiment from './pages/Experiment';
import ExpDetails from './pages/ExpDetails';
import ConsentTerm from './pages/ConsentTerm';
import Link from './pages/Link';
import InitialQuest from './pages/InitialQuest';
// experiment not logged in micelio
import Form from './pages/Form';

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
          <Route path={'/link/:id'} component={Link}/>
          <Route path={'/initialQuest/:id'} component={InitialQuest}/>
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
