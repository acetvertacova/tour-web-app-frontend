import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import store from './store/store.js';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);