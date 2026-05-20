<template>
  <q-page class="bg-grey-2 q-pa-xl">
    <div class="row justify-center q-mb-xl">
      <h3 class="text-h4 text-primary text-bold">Gestão de Agenda</h3>
    </div>

    <div class="row q-col-gutter-xl justify-center">
      <div class="col-12 col-md-4">
        <CalendarPanel
          :appointments="meusAgendamentos"
          @date-selected="filtrarPorData"
        />

        <q-btn
          flat
          color="primary"
          icon="restart_alt"
          label="Mostrar todos os agendamentos"
          class="full-width q-mt-md"
          @click="dataFiltro = null"
        />
      </div>

      <div class="col-12 col-md-8">
        <q-card class="glass-card shadow-4 q-pa-sm" style="border-radius: 2rem; min-height: 400px;">
          <q-card-section>
            <div class="text-h6 text-primary text-bold q-mb-md">
              {{ dataFiltro ? `Agendamentos para o dia: ${dataFiltro.split('/').reverse().join('/')}` : 'Todos os seus agendamentos' }}
            </div>

            <div v-if="agendamentosFiltrados.length === 0" class="flex column items-center justify-center q-py-xl text-grey-5">
              <q-icon name="event_busy" size="4rem" class="q-mb-md" />
              <div class="text-h6 text-center">Nenhum agendamento encontrado para este período.</div>
            </div>

            <div v-else>
              <q-list separator padding>
                <q-item v-for="agendamento in agendamentosFiltrados" :key="agendamento.id" class="q-py-md items-center">

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
      </div>
    </div>

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
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

// Importação das validações utilitárias
import { validarAgendamento } from '../utils/validacoes';

// Importação dos componentes locais
import CalendarPanel from '../components/CalendarPanel.vue';
import ModalCancelar from '../components/ModalCancelar.vue';
import ModalEditar from '../components/ModalEditar.vue';

const router = useRouter();
const $q = useQuasar();

const meusAgendamentos = ref([]);
const salas = ref([]);
const dataFiltro = ref(null);

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

const agendamentosFiltrados = computed(() => {
  if (!dataFiltro.value) return meusAgendamentos.value;

  return meusAgendamentos.value.filter(a => {
    const dataFormatada = a.data.split('/').reverse().join('/');
    return dataFormatada === dataFiltro.value;
  });
});

const filtrarPorData = (data) => {
  dataFiltro.value = data;
};

/* --------------------------  CANCELAMENTO  -------------------------- */
const abrirModalCancelar = (id) => {
  agendamentoSelecionado.value = id;
  modalCancelar.value = true;
};

const confirmarCancelamento = async () => {
  try {
    await axios.delete(`http://localhost:3000/api/agendamentos/${agendamentoSelecionado.value}`);
    meusAgendamentos.value = meusAgendamentos.value.filter(a => a.id !== agendamentoSelecionado.value);
    modalCancelar.value = false;
  } catch (error) {
    $q.notify({
      message: 'Erro ao cancelar agendamento.',
      color: 'negative',
      icon: 'error'
    });
    console.error('Erro ao cancelar agendamento:', error);
  }
};

/* --------------------------  EDIÇÃO  -------------------------- */
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

  /* -------------------------- VALIDAÇÃO DOS DADOS -------------------------- */
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
    $q.notify({
      message: verificacao.erro,
      color: 'negative',
      icon: 'error'
    });
    return;
  }
  /* ------------------------------------------------------------------------ */

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
    console.error('Erro ao editar agendamento:', error);
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
    console.error('Erro ao carregar dados iniciais:', error);
  }
});
</script>
