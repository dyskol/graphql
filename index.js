import Router from './router/Router';
import { loginPage } from './src/loginPage';
import { mainPage } from './src/mainPage';

const router = new Router({
  mode: 'hash',
  root: '/'
});

router
  .add(/login/, () => {
    loginPage(router)
  })
  .add('', () => {
    mainPage(router)
  })