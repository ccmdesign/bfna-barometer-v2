<template>
    <nuxt-link @click="$router.back()" class="back-button">
        <div><span class="icon">arrow_back_ios</span></div> BACK
    </nuxt-link>
</template>
<script setup>
const router = useRouter()
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