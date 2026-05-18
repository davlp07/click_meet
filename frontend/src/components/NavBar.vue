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
  import { useRouter } from 'vue-router';

      const router = useRouter();

      const handleLogout = () => {
        confirm('Deseja realmente sair?') &&
        localStorage.removeItem('user');
        router.push('/');
      }

</script>
