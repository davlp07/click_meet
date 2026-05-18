<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <NavBar />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
 import NavBar from 'components/NavBar.vue'
</script>
