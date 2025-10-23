<template>
  <ccm-footer class="bar-footer">
    <div class="footer-content | subgrid | stack | text-align:center">
      <h2 class="h2">Subscribe for Updates</h2>
      <p>Each month, we will spotlight trending transatlantic topics and find potential alignment between the U.S., the U.K., and the European Union. Sign up here for updates!</p>
      <!--<form @submit.prevent="submitForm" class="stack | text-align:center">
      <div class="message" v-if="message" :class="{'message--success': success, 'message--failure': !success}">{{ message }}</div>
      <div class="switcher">
        <input v-model="name" type="text" placeholder="Name" class="input" />
        <input v-model="email" type="email" placeholder="Email" class="input" />
      </div>
      <bar-button type="submit" class="align-self:center justify-self:center" color="accent" variant="primary">Submit Now <span class="icon">arrow_forward</span></bar-button>
      </form>-->
      <div class="pb">
        <span>Powered by</span>
        <img src="/assets/bfna-logo.svg" alt="Bertelsmann Foundation">
      </div>
    </div>
    <bar-by-line />
    <barCurve />
  </ccm-footer>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')
const success = ref(false)

const submitForm = async () => {
  message.value = '';
  success.value = false;
  
  try {
    const res = await $fetch('/api/mailchimp/subscribe', {
      method: 'POST',
      body: { name: name.value, email: email.value }
    })
    
    // Atribuir os valores do retorno da requisição
    success.value = res.success
    message.value = res.message
    
  } catch (err) {
    success.value = false
    message.value = 'Error while subscribing to our newsletter. Please contact us for support.'
    console.log('Error:', message.value)
  }
}
</script>

<style scoped lang="scss">
.bar-footer {
  --bar-curve-color: var(--base-color-07-tint);
  background-color: var(--base-color);
  background-image: url(/assets/barometer-footer.svg);
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: bottom left;
  color: var(--white-color);
  padding-block: var(--space-2xl) var(--space-xs);
  position: relative;
  overflow: hidden;
  & > * {
    position: relative;
    z-index: 3;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--bar-curve-color);
  }
}

.footer-content {
  p {
  }
  @media (min-width: 768px) {
    grid-column: 5 / 11;
  }
}

:deep(.bar-curve) {
  position: absolute;
  top: 0;
  grid-column: full-start / full-end;
  transform: rotate(180deg);
}

.pb {
  display: flex;
  text-transform: uppercase;
  gap: 12px;
  justify-content: center;
  align-items: center;
  font-size: var(--size--2);
}
</style>