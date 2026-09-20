import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';
import { AppRenderer } from './components/render';

document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  if (appContainer) {
    const app = new AppRenderer();
    app.init(appContainer);
  }
});