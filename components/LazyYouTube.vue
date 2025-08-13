<template>
  <div class="lazy-youtube" :class="{ loaded }" @click="loadVideo">
    <div v-if="!loaded" class="lazy-youtube__facade">
      <img 
        :src="thumbnailUrl" 
        :alt="`Play ${title || 'YouTube video'}`"
        class="lazy-youtube__thumbnail"
        loading="lazy"
      />
      <button class="lazy-youtube__play-button" :aria-label="`Play ${title || 'YouTube video'}`">
        <svg viewBox="0 0 68 48" width="68" height="48">
          <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"></path>
          <path d="M45 24 27 14v20" fill="#fff"></path>
        </svg>
      </button>
    </div>
    <iframe 
      v-else
      :src="embedUrl"
      :title="title || 'YouTube video player'"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
      class="lazy-youtube__iframe"
    ></iframe>
  </div>
</template>

<script setup>
import { useYouTube } from '~/composables/useYouTube'

const props = defineProps({
  videoId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  thumbnailQuality: {
    type: String,
    default: 'hq',
    validator: (value) => ['default', 'hq', 'mq', 'sd', 'maxres'].includes(value)
  }
})

const { getThumbnail } = useYouTube()

const loaded = ref(false)

const thumbnailUrl = computed(() => getThumbnail(props.videoId, props.thumbnailQuality))
const embedUrl = computed(() => `https://www.youtube.com/embed/${props.videoId}?autoplay=1`)

const loadVideo = () => {
  loaded.value = true
}

// Expose the loadVideo method for parent components
defineExpose({
  loadVideo
})
</script>

<style scoped>
.lazy-youtube {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: var(--border-radius-s);
  overflow: hidden;
  box-shadow: var(--box-shadow-l);
  border: 3px solid var(--white-color);
}

.lazy-youtube__facade {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: #000;
}

.lazy-youtube__thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.lazy-youtube__facade:hover .lazy-youtube__thumbnail {
  opacity: 0.8;
}

.lazy-youtube__play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.3s ease;
}

.lazy-youtube__play-button:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

.lazy-youtube__play-button svg {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.lazy-youtube__iframe {
  width: 100%;
  height: 100%;
  border: none;
}

@media (max-width: 768px) {
  .lazy-youtube__play-button svg {
    width: 48px;
    height: 34px;
  }
}
</style>
