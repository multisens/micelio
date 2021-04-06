import {BrowserRouter, Route} from 'react-router-dom';

import Index from './pages/Index';
import Sign from './pages/Sign';

require('dotenv').config();

const Routes = () => (
  <BrowserRouter basename="/micelio">
    <Route path={'/'} component={Index} exact />
    <Route path={'/sign'} component={Sign} />
  </BrowserRouter>
)

export default Routes;
