<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useStatementStore } from '~/stores/statements'
import { useFilterTags } from '~/stores/filter'

const statementStore = useStatementStore();
const filterTagsStore = useFilterTags();

const { data: statements } = await useAsyncData('all-statements', () => queryCollection('statements').all())
statementStore.setStatements(statements.value);

const { data: topics } = await useAsyncData('filter-topics', () => queryCollection('topics').all())
filterTagsStore.setTags(topics.value);

</script>