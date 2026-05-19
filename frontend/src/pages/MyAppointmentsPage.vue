<template>
  <q-page class="flex column items-center bg-grey-2 q-py-xl">
    <h3 class="text-h4 q-mb-xl text-primary text-bold">Meus agendamentos</h3>

    <q-card class="glass-card shadow-4 q-pa-sm" style="border-radius: 2rem; width: 100%; max-width: 800px; min-height: 350px;">
      <q-card-section>

        <div v-if="meusAgendamentos.length === 0" class="flex column items-center justify-center q-py-xl text-grey-5">
          <q-icon name="event_busy" size="4rem" class="q-mb-md" />
          <div class="text-h6">Você ainda não possui agendamentos.</div>
        </div>

        <div v-else>
          <q-list separator padding>
            <q-item v-for="agendamento in meusAgendamentos" :key="agendamento.id" class="q-py-md items-center">

              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="meeting_room" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-h6 text-primary text-bold q-mb-xs">
                  {{ agendamento.sala_nome }}
                </q-item-label>
                <q-item-label caption class="text-subtitle2 text-grey-8 flex items-center">
                  <q-icon name="event" size="xs" class="q-mr-xs" />
                  {{ agendamento.data }}
                  <q-icon name="schedule" size="xs" class="q-ml-md q-mr-xs" />
                  {{ agendamento.horario_inicio }} às {{ agendamento.horario_fim }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="row q-gutter-sm">
                  <q-btn outline color="primary" icon="edit" label="Editar" size="sm" @click="abrirModalEditar(agendamento)" />
                  <q-btn unelevated color="negative" icon="cancel" label="Cancelar" size="sm" @click="abrirModalCancelar(agendamento.id)" />
                </div>
              </q-item-section>

            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>

    <ModalCancelar
      v-model="modalCancelar"
      @confirmar="confirmarCancelamento"
    />

    <ModalEditar
      v-model="modalEditar"
      :salas="salas"
      :agendamento="formEditar"
      @salvar="salvarEdicao"
    />

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

import { validarAgendamento } from '../utils/validacoes';

import ModalCancelar from '../components/ModalCancelar.vue';
import ModalEditar from '../components/ModalEditar.vue';

const router = useRouter();

const meusAgendamentos = ref([]);
const salas = ref([]);

const agendamentoSelecionado = ref(null);
const modalCancelar = ref(false);

const modalEditar = ref(false);
const formEditar = ref({
  id: null,
  sala_id: null,
  data: '',
  horario_inicio: '',
  horario_fim: ''
});

/* --------------------------  MODAL DE CANCELAMENTO   -------------------------- */

const abrirModalCancelar = (id) => {
  agendamentoSelecionado.value = id;
  modalCancelar.value = true;
};

const confirmarCancelamento = async () => {
  try {
    await axios.delete(`http://localhost:3000/api/agendamentos/${agendamentoSelecionado.value}`);
    console.log(`Deletando o agendamento ${agendamentoSelecionado.value}...`);

    meusAgendamentos.value = meusAgendamentos.value.filter(a => a.id !== agendamentoSelecionado.value);
    modalCancelar.value = false;

  } catch (error) {
    console.error('Erro ao cancelar:', error);
  }
};

/* --------------------------  MODAL DE EDITAR   -------------------------- */

const abrirModalEditar = (item) => {
  const dataOriginal = item.data.split('/').reverse().join('-');

  formEditar.value = {
    id: item.id,
    sala_id: item.sala_id,
    data: dataOriginal,
    horario_inicio: item.horario_inicio,
    horario_fim: item.horario_fim
  };
  modalEditar.value = true;
};

const salvarEdicao = async (dadosAtualizados) => {
  const payload = dadosAtualizados || formEditar.value;

  // --- VALIDAÇÃO DOS DADOS ---
  const verificacao = validarAgendamento({
    salaId: payload.sala_id,
    data: payload.data,
    horarioInicio: payload.horario_inicio,
    horarioFim: payload.horario_fim,
    salas: salas.value,
    agendamentos: meusAgendamentos.value,
    agendamentoIdIgnorado: payload.id
  });

  if (!verificacao.valido) {
    alert(verificacao.erro);
    return; // Para a execução se for inválido
  }
  // ----------------------------------------------------------

  try {
    await axios.put(`http://localhost:3000/api/agendamentos/${payload.id}`, payload);

    const index = meusAgendamentos.value.findIndex(a => a.id === payload.id);
    if (index !== -1) {
      const salaNome = salas.value.find(s => s.id === payload.sala_id)?.nome;
      meusAgendamentos.value[index] = {
        ...payload,
        sala_nome: salaNome,
        data: payload.data.split('-').reverse().join('/')
      };
    }

    modalEditar.value = false;
  } catch (error) {
    console.error('Erro ao editar:', error);
  }
};


onMounted(async () => {
  const userString = localStorage.getItem('user');

  if (!userString) {
    router.push('/');
    return;
  }

  const userId = JSON.parse(userString).id;

  try {
    const [resAgendamentos, resSalas] = await Promise.all([
      axios.get(`http://localhost:3000/api/agendamentos/usuario/${userId}`),
      axios.get('http://localhost:3000/api/salas')
    ]);

    salas.value = resSalas.data;

    meusAgendamentos.value = resAgendamentos.data;
    meusAgendamentos.value.forEach(agendamento => {
        agendamento.data = agendamento.data.split('-').reverse().join('/');
    });

  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
  }
});

</script>
