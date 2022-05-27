import { render } from 'solid-js/web';
import App from './App';

render(() => <App foo="bar" />, document.getElementById('root') as HTMLElement);
