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
import GameLink from './pages/GameLink';
import VideoLink from './pages/VideoLink';
import InitialQuest from './pages/InitialQuest';
import SpecQuest from './pages/SpecQuest';
import FinalQuest from './pages/FinalQuest';
// experiment not logged in micelio
import Form from './pages/Form';
import InitialForm from './pages/InitialForm';
import SpecForm from './pages/SpecForm';
import FinalForm from './pages/FinalForm';
import GameExp from './pages/GameExp';
import VideoExp from './pages/VideoExp';

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
          <Route path={'/gameLink/:id'} component={GameLink}/>
          <Route path={'/videoLink/:id'} component={VideoLink}/>
          <Route path={'/initialQuest/:id'} component={InitialQuest}/>
          <Route path={'/specQuest/:id'} component={SpecQuest}/>
          <Route path={'/finalQuest/:id'} component={FinalQuest}/>
          <Route path={'/form/:id'} component={Form}/>
          <Route path={'/initialForm/:id'} component={InitialForm}/>
          <Route path={'/specForm/:id'} component={SpecForm}/>
          <Route path={'/finalForm/:id'} component={FinalForm}/>
          <Route path={'/gameExp/:id'} component={GameExp}/>
          <Route path={'/videoExp/:id'} component={VideoExp}/>
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
        <Route path={'/initialForm/:id'} component={InitialForm}/>
        <Route path={'/specForm/:id'} component={SpecForm}/>
        <Route path={'/finalForm/:id'} component={FinalForm}/>
        <Route path={'/gameExp/:id'} component={GameExp}/>
        <Route path={'/videoExp/:id'} component={VideoExp}/>
        <Redirect to={'/'} />
      </Switch>
    </BrowserRouter>
  )

}

export default Routes;
