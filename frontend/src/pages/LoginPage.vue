<template>
  <q-layout view="lHh Lpr lFf">
  <q-page-container>
    <q-page class="flex flex-center bg-primary flex row justify-evenly q-gutter-x-xl q-px-xl">

      <div class="col-5 flex flex-column items-center q-gutter-y-lg justify-center hero-block">
        <img src="/icons/group.png" class="icon-gp" style="width: 17rem; height: 17rem; opacity: 0.8"/>
        <h3 class="text-white text-center text-bold subtitle" style="opacity: 0.8">Faça login para agendar suas reuniões!</h3>
      </div>

      <q-card class="col-5  glass-card" style="border-radius: 2rem">
        <q-card-section>
          <q-form class="q-pa-lg flex-column justify-center" style="height: 42vh; width: 100%" @submit.prevent="handleLogin">

            <q-input
              v-model="form.username"
              label="Usuário"
              dark
              color="white"
              lazy-rules
              :rules="[val => !!val || 'O usuário é obrigatório']"
            />

            <q-input
              v-model="form.password"
              label="Senha"
              type="password"
              dark
              color="white"
              class="q-mt-md"
            />

            <q-btn
              label="Entrar"
              @click="handleLogin"
              :loading="loading"
              class="full-width q-mt-xl btn-login"
              size="lg"
              rounded
            />
          </q-form>
        </q-card-section>
      </q-card>

    </q-page>

  </q-page-container>
  </q-layout>
</template>

<style scoped>

@keyframes levitate {
  0% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0); }
}

.hero-block {
  transition: transform 0.5s ease;
  cursor: default;
}

.hero-block:hover {
  animation: levitate 3s ease-in-out infinite;
}

.hero-block:hover .icon-gp {
  filter: drop-shadow(0 10px 20px rgba(255, 255, 255, 0.4));
}

.icon-gp, .subtitle {
  transition: all 0.5s ease;
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px); /* Safari/iPhones */
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}

.btn-login {
  transition: all 0.5s ease;
  color: white;
  background: linear-gradient(to right, #008dac, #296a7f);
}

.btn-login:hover {
  transform: scale(1.05);
  background: linear-gradient(to right, #0083b0, #00b4db);

}

</style>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar';
import axios from 'axios'

const $q = useQuasar()

const router = useRouter()
const loading = ref(false)
const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.username) {
    $q.notify({
      message: 'Por favor, insira o usuário.',
      color: 'negative',
      icon: 'error'
    });
    return
  }

  loading.value = true

  try {

    const res = await axios.post('http://localhost:3000/api/login', {
      username: form.username
    })

    localStorage.setItem('user', JSON.stringify(res.data.user))
    router.push('/dashboard')

  } catch (error) {
    console.error('Erro ao fazer login:', error)
    $q.notify({
      message: 'Erro ao fazer login. Por favor, tente novamente.',
      color: 'negative',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>
