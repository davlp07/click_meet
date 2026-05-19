<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="border-radius: 1rem; min-width: 350px;">

      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-primary text-bold flex items-center">
          <q-icon name="edit" size="sm" class="q-mr-sm" />
          Editar Agendamento
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form @submit.prevent="onSalvar" class="column q-gutter-md">

          <q-select
            v-model="formLocal.sala_id"
            :options="salas.map(s => ({ label: s.nome, value: s.id }))"
            label="Sala"
            outlined
            emit-value
            map-options
            required
          />

          <q-input v-model="formLocal.data" label="Data" type="date" outlined required />

          <div class="row q-gutter-md">
            <q-input v-model="formLocal.horario_inicio" label="Horário Início" type="time" outlined required class="col" />
            <q-input v-model="formLocal.horario_fim" label="Horário Fim" type="time" outlined required class="col" />
          </div>

          <div class="row justify-end q-gutter-sm">
            <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
            <q-btn unelevated label="Salvar" color="primary" type="submit" />
          </div>

        </q-form>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['modelValue', 'salas', 'agendamento']);
const emit = defineEmits(['update:modelValue', 'salvar']);

const formLocal = ref({});


watch(() => props.agendamento, (novoAgendamento) => {
  if (novoAgendamento) {
    formLocal.value = { ...novoAgendamento };
  }
}, { deep: true, immediate: true });

const onSalvar = () => {
  emit('salvar', formLocal.value);
};
</script>
