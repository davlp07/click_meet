<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="border-radius: 1rem; min-width: 350px;">

      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-negative text-bold flex items-center">
          <q-icon name="warning" size="sm" class="q-mr-sm" />
          Cancelar Reunião
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        Tem certeza de que deseja cancelar este agendamento? Esta ação não pode ser desfeita e a sala ficará livre para outras pessoas.
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat label="Não, voltar" color="grey-8" v-close-popup />
        <q-btn unelevated label="Sim, Quero Cancelar" color="negative" @click="$emit('confirmar')" />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps(['modelValue']);
defineEmits(['update:modelValue', 'confirmar']);
</script>
