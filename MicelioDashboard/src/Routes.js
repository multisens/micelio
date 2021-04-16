import {BrowserRouter, Route} from 'react-router-dom';

import Index from './pages/Index';
import Sign from './pages/Sign';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

require('dotenv').config();

const Routes = () => (
  <BrowserRouter basename="/micelio">
    <Route path={'/'} component={Index} exact />
    <Route path={'/sign'} component={Sign} />
    <Route path={'/home'} component={Home} exact />
    <Route path={'/home'} component={Home} />
    <Route path={'/dashboard'} component={Dashboard} />
  </BrowserRouter>
)

export default Routes;
