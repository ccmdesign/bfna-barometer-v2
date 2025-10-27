<template>
  <ccm-footer class="bar-footer">
    <div class="footer-content | subgrid | stack | text-align:center">
      <h2 class="h2">Subscribe for Updates</h2>
      <p>Each month, we will spotlight trending transatlantic topics and find potential alignment between the U.S., the U.K., and the European Union. Sign up here for updates!</p>
      <form @submit.prevent="handleSubmit" class="stack | text-align:center" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form">
        <div class="message" v-if="message" :class="{'message--success': success, 'message--failure': !success}">
          {{ message }}
        </div>
        <div class="switcher">
          <input 
            type="email" 
            name="EMAIL" 
            id="mce-EMAIL" 
            v-model="email"
            placeholder="Email" 
            class="input" 
            :class="{'input--error': emailError}"
            required
          />
          <div v-if="emailError" class="error-message">{{ emailError }}</div>
        </div>
        <input type="hidden" name="b_53fc7e266c23506906a0a602f_d1267f2349" tabindex="-1" value="">
        <bar-button 
          type="submit" 
          class="align-self:center justify-self:center" 
          color="accent" 
          variant="primary"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Subscribing...' : 'Submit Now' }} 
          <span class="icon">arrow_forward</span>
        </bar-button>
      </form>
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

const email = ref('')
const message = ref('')
const success = ref(false)
const isSubmitting = ref(false)
const emailError = ref('')

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleSubmit = async () => {
  emailError.value = ''
  message.value = ''
  
  if (!email.value) {
    emailError.value = 'Email is required'
    return
  }
  
  if (!validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email address'
    return
  }
  
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // Usar JSONP para contornar CORS
    const script = document.createElement('script')
    const callbackName = 'mailchimpCallback_' + Date.now()
    
    window[callbackName] = (data) => {
      if (data.result === 'success') {
        success.value = true
        message.value = 'Thank you for subscribing! Please check your email to confirm your subscription.'
        email.value = ''
      } else {
        success.value = false
        message.value = data.msg || 'There was an error subscribing. Please try again.'
      }
      isSubmitting.value = false
      document.head.removeChild(script)
      delete window[callbackName]
    }
    
    // Usar a versão JSONP da URL do Mailchimp
    const url = `https://bfna.us20.list-manage.com/subscribe/post-json?u=53fc7e266c23506906a0a602f&id=d1267f2349&c=${callbackName}&EMAIL=${encodeURIComponent(email.value)}`
    
    script.src = url
    document.head.appendChild(script)
    
  } catch (error) {
    console.error('Subscription error:', error)
    success.value = false
    message.value = 'There was an error subscribing. Please try again.'
    isSubmitting.value = false
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
.message {
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-sm);
  
  &--success {
    background-color: var(--success-color, #d4edda);
    color: var(--success-text-color, #155724);
    border: 1px solid var(--success-border-color, #c3e6cb);
  }
  
  &--failure {
    background-color: var(--error-color, #f8d7da);
    color: var(--error-text-color, #721c24);
    border: 1px solid var(--error-border-color, #f5c6cb);
  }
}

.input--error {
  border-color: var(--error-color, #dc3545);
}

.error-message {
  color: var(--error-color, #dc3545);
  font-size: var(--size--2);
  margin-top: var(--space-xs);
}
</style>