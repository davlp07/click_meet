<template>
  <q-page class="flex items-center bg-grey-2 column q-pt-xl">

    <h3 class="text-h4 q-mb-xl text-primary text-bold">Bem-vindo(a), {{ userName }}!</h3>

    <div class="row justify-center q-gutter-lg q-px-md" style="width: 100%; max-width: 1300px;">

      <q-card
        v-for="sala in salas"
        :key="sala.id"
        class="bg-white shadow-2 column justify-between"
        style="border-radius: 1rem; width: 24rem; min-height: 26rem;"
      >

        <div>
          <q-card-section class="bg-primary text-white text-center" style="border-radius: 1rem 1rem 0 0;">
            <div class="text-h6">{{ sala.nome }}</div>
          </q-card-section>

          <q-card-section class="q-pt-md">
            <div class="flex items-center q-mb-sm">
              <q-icon name="people" size="sm" color="secondary" class="q-mr-sm" />
              <span class="text-subtitle2">Capacidade: {{ sala.capacidade }} pessoas</span>
            </div>

            <q-separator class="q-my-sm" />

            <div class="flex items-center q-mb-sm">
              <q-icon name="schedule" size="sm" color="secondary" class="q-mr-sm" />
              <span class="text-subtitle2">Horário de Funcionamento: {{ sala.horario_abertura }} - {{ sala.horario_fechamento }}</span>
            </div>

            <q-separator class="q-my-sm" />

            <div class="q-mt-sm">
              <div class="text-caption text-bold text-grey-8 q-mb-xs">Horários Ocupados:</div>

              <div v-if="sala.agendamentos && sala.agendamentos.length > 0" class="flex q-gutter-xs">
                <q-chip
                  v-for="agendamento in sala.agendamentos"
                  :key="agendamento.id"
                  :color="agendamento.usuario_id === user.id ? 'primary' : 'warning'"
                  :text-color="agendamento.usuario_id === user.id ? 'white' : 'dark'"
                  size="sm"
                  icon="schedule"
                >
                  {{ agendamento.data.split('-').reverse().join('/') }} | {{ agendamento.horario_inicio }} às {{ agendamento.horario_fim }}
                </q-chip>
              </div>

              <div v-else class="text-caption text-positive flex items-center text-bold q-mt-xs">
                <q-icon name="check_circle" size="xs" class="q-mr-xs" />
                Não há nenhum horário marcado nesta sala.
              </div>
            </div>

          </q-card-section>
        </div>

        <q-card-actions align="center" class="q-pb-md">
          <q-btn label="Agendar" color="accent" rounded class="full-width q-mx-sm" @click="redirecionarAgenda(sala.id)"/>
        </q-card-actions>

      </q-card>

    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const user = JSON.parse(localStorage.getItem('user')) || { nome: 'Usuário' };
const userName = computed(() => user.nome.split(' ')[0]);

const salas = ref([]);

// onMounted garante que a requisição ocorra assim que a tela terminar de carregar
onMounted(async () => {
  try {
    const responseSalas = await axios.get('http://localhost:3000/api/salas');
    salas.value = responseSalas.data;

    try {
      const responseAgendamentos = await axios.get('http://localhost:3000/api/agendamentos');
      const todosAgendamentos = responseAgendamentos.data;

      salas.value.forEach(sala => {
        sala.agendamentos = todosAgendamentos.filter(
          agendamento => agendamento.sala_id === sala.id
        );
      });
    } catch (errAgendamento) {
      console.error('Erro ao carregar os agendamentos:', errAgendamento);
    }

  } catch (error) {
    console.error('Erro ao carregar as salas do servidor:', error);
  }
});

const redirecionarAgenda = (salaId) => {
  router.push({ path: '/dashboard/agendar', query: { sala: salaId } });
};
</script>
