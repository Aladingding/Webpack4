import React  from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom'
import { BrowserRouter,HashRouter,MemoryRouter,Router,hashHistory,Switch } from 'react-router-dom';
import App from 'components/App.js';

// import A from './a.js';
// import B from './b.js';

// document.getElementById('container');
// //
// A();
// B();
// container.innerHTML = 1111;

render(<HashRouter>
    <Switch>
        <App />
    </Switch>
</HashRouter>, document.getElementById('root'));


