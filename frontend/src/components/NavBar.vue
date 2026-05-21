<template>
  <q-header class="text-white flex flex-center q-px-md" style="height: 10vh; background-color: #1A2238;" elevated>
      <q-toolbar>
        <q-toolbar-title style="cursor: default;">ClickMeet</q-toolbar-title>
        <q-btn flat label="Salas" to="/dashboard" />
        <q-btn flat label="Novo Agendamento" to="/dashboard/agendar" />
        <q-btn flat label="Meus Agendamentos" to="/dashboard/meus-agendamentos" />
        <q-btn flat icon="logout" @click="handleLogout"/>
      </q-toolbar>
    </q-header>
</template>

<script setup>
  import { useQuasar } from 'quasar';
  import { useRouter } from 'vue-router';

  const $q = useQuasar();

      const router = useRouter();

      const handleLogout = () => {
        $q.dialog({
          title: 'Sair do Sistema',
          message: 'Tem certeza que deseja encerrar a sua sessão?',
          persistent: true,
          ok: {
            label: 'Sair',
            color: 'negative'
          },
          cancel: {
            label: 'Voltar',
            color: 'primary',
            flat: true
          }
        }).onOk(() => {
          localStorage.removeItem('user');
          router.push('/');
        });
      }

</script>
