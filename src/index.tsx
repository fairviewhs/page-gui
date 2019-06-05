import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'mobx-react';
// Stores
import generatedComponentStore from './stores/GeneratedComponent.store';
import componentStructureStore from './stores/ComponentStructure.store';

export const store = () => ({
  generatedComponentStore,
  componentStructureStore
})

ReactDOM.render(
  <Provider {...store()}>
    <App />
  </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
