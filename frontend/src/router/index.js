import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    // Verifica se o 'user' está guardado no localStorage
    const isAuthenticated = localStorage.getItem('user') !== null;

    // Se a rota exige autenticação e o usuário não está logado
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/'); // Manda ele de volta para a tela de login
    }
    // Se ele já está logado e tenta acessar a página de login
    else if (to.path === '/' && isAuthenticated) {
      next('/dashboard'); // Manda ele direto pro dashboard
    }
    // Se estiver tudo certo, deixa passar
    else {
      next();
    }
  });

  return Router
})
