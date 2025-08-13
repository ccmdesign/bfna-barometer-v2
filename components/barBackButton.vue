<template>
    <button @click="goBack" class="back-button">
        <div><span class="icon">arrow_back_ios</span></div> BACK
    </button>
</template>
<script setup>
const router = useRouter()

const goBack = () => {
  // Try to go back, but fallback to home if no history
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
<style scoped lang="scss">
.back-button {
    color: var(--white-color);
    text-decoration: none;
    display: flex;
    align-items: center;
    font-size: var(--size--1);
    gap: var(--space-2xs);
    margin-bottom: var(--space-m);
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
    div {
        height: 1.25em;
        width: 1.25em;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        background-color: var(--white-color-10-alpha);
        border-radius: 50%;
        span {
            font-size: var(--size--2);
            line-height: 1;
            text-align: center;
        }
    }
}
</style>