const routes = [
  {
    // 1. ROTA PÚBLICA (Sem NavBar): Pode ser acessada por qualquer pessoa, mesmo sem estar logada
    path: '/',
    component: () => import('pages/LoginPage.vue')
  },

  // 2. ROTAS PRIVADAS (Com NavBar): Só podem ser acessadas se o usuário estiver logado
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'agendar', component: () => import('pages/SchedulePage.vue') }
    ]
  },

  // ROTA 404: Captura qualquer caminho que não corresponda às rotas acima
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
