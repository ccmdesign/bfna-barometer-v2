<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useStatementStore } from '~/stores/statements'

const statementStore = useStatementStore();

const { data: statements } = await useAsyncData('statements', () => queryCollection('statements').all())
statementStore.setStatements(statements.value);

</script>