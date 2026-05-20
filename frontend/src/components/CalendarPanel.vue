<template>
  <q-card class="glass-card shadow-4" style="border-radius: 2rem; overflow: hidden;">
    <q-date
      v-model="dateModel"
      :events="events"
      event-color="primary"
      flat
      class="full-width"
      today-btn
      @update:model-value="onDateClick"
      @navigation="onNavigation"
    />

    <q-card-section class="bg-primary text-white q-pa-sm text-center">
      <div class="text-caption text-bold">
        {{ appointmentsCount }} {{ appointmentsCount === 1 ? 'dia com agendamento' : 'dias com agendamentos' }} neste mês
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  appointments: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['date-selected']);

const dateModel = ref(new Date().toISOString().split('T')[0].replace(/-/g, '/'));

const viewedMonth = ref(new Date().getMonth() + 1);
const viewedYear = ref(new Date().getFullYear());

const events = computed(() => {
  return props.appointments.map(a => {
    return a.data.split('/').reverse().join('/');
  });
});

const appointmentsCount = computed(() => {
  const datasUnicas = new Set(events.value);
  const diasEsteMes = Array.from(datasUnicas).filter(data => {
    const [ano, mes] = data.split('/').map(Number);
    return mes === viewedMonth.value && ano === viewedYear.value;
  });
  return diasEsteMes.length;
});

const onDateClick = (value) => {
  emit('date-selected', value);
};

const onNavigation = ({ month, year }) => {
  viewedMonth.value = month;
  viewedYear.value = year;
};

</script>
