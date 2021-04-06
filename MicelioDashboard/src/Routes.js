import {BrowserRouter, Route} from 'react-router-dom';

import Index from './pages/Index';

const Routes = () => (
  <BrowserRouter>
    <Route path={'/'} component={Index} exact />
  </BrowserRouter>
)

export default Routes;
