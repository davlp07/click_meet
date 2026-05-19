<template>
  <q-page class="flex column items-center bg-grey-2 q-py-xl">
    <h3 class="text-h4 q-mb-xl text-primary text-bold">Agende sua reunião:</h3>

    <q-card class="col-12 glass-card" style="border-radius: 2rem; min-width: 25rem; height: 25rem;">
      <q-card-section>
        <div class="text-h6 text-center text-primary q-mb-lg">Selecione a sala e o horário</div>

        <q-select
          v-model="selectedSala"
          :options="salas.map(sala => ({ label: sala.nome, value: sala.id }))"
          label="Sala"
          emit-value
          map-options
          outlined

          class="q-mb-md"
        />

        <q-input
          v-model="data"
          label="Data"
          type="date"
          outlined

          class="q-mb-md"
        />

       <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-sm-6">
            <q-input
              v-model="horarioInicio"
              label="Horário de Início"
              type="time"
              outlined
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="horarioFim"
              label="Horário de Fim"
              type="time"
              outlined
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-md">
        <q-btn label="Agendar" color="accent" rounded class="q-mx-sm" style="width: 70%;" @click="agendar"/>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
// Importa a função de validação
import { validarAgendamento } from '../utils/validacoes';

const salas = ref([]);
const agendamentos = ref([]);

const selectedSala = ref('');
const data = ref('');
const horarioInicio = ref('');
const horarioFim = ref('');

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  try {
    const [resSalas, resAgendamentos] = await Promise.all([
      axios.get('http://localhost:3000/api/salas'),
      axios.get('http://localhost:3000/api/agendamentos')
    ]);

    salas.value = resSalas.data;
    agendamentos.value = resAgendamentos.data;

    if (route.query.sala) {
      selectedSala.value = Number(route.query.sala);
    }
  } catch (error) {
    console.error('Erro ao buscar os dados iniciais do formulário:', error);
  }
});

const agendar = async () => {
  if (!selectedSala.value || !data.value || !horarioInicio.value || !horarioFim.value) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const userString = localStorage.getItem('user');
  if (!userString) {
    alert('Sessão expirada. Faça login novamente.');
    router.push('/');
    return;
  }

  // --- VALIDAÇÃO DOS DADOS ---
  const verificacao = validarAgendamento({
    salaId: selectedSala.value,
    data: data.value,
    horarioInicio: horarioInicio.value,
    horarioFim: horarioFim.value,
    salas: salas.value,
    agendamentos: agendamentos.value
  });

  if (!verificacao.valido) {
    alert(verificacao.erro);
    return;
  }
  // -----------------------------

  try {
    await axios.post('http://localhost:3000/api/agendamentos', {
      sala_id: selectedSala.value,
      usuario_id: JSON.parse(userString).id,
      data: data.value,
      horario_inicio: horarioInicio.value,
      horario_fim: horarioFim.value
    });
    alert('Agendamento realizado com sucesso!');
    router.push('/dashboard');
  } catch (error) {
    console.error('Erro ao agendar:', error);
    alert('Ocorreu um erro ao tentar agendar. Por favor, tente novamente.');
  }
};
</script>
