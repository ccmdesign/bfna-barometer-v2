<script setup>
const props = defineProps({
  video: {
    type: Boolean,
    default: false
  }
})

const goDownToMapSection = () => {
  const mapSection = document.getElementById('map');
  if (mapSection) {
    mapSection.scrollIntoView({ behavior: 'smooth' });
  }
}

const lazyYouTubeRef = ref(null)

const playYoutubeVideo = () => {
  if (lazyYouTubeRef.value) {
    lazyYouTubeRef.value.loadVideo()
  }
}

const data = reactive({
  video: false
})
  
</script>

<template>
  <ccm-hero class="hero">
    <div class="video-container" v-if="data.video">
      <button class="video-container__close" @click="data.video = false"><span class="icon">close</span></button>
      <video v-if="video" autoplay >
        <source src="/assets/video.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
    <video class="hero__video-loop" v-if="video" autoplay loop muted >
      <source src="/assets/teaser.webm" type="video/webm" />
      Your browser does not support the video tag.
    </video>
    <bar-topbar id="topbar" />
    <div class="hero-content | padding-block:2xl">
      <div class="hero-content__inner | stack">
        <slot name="column_left">
          <hgroup class="stack">
            <p class="h2">Welcome to the</p>
            <h1>Transatlantic Barometer</h1>
          </hgroup>
          
          <p class="font-size:1 | color:base-40-tint">This interactive multimedia site provides its users with quick facts, visual representations, and reliable information on pressing transatlantic challenges.</p>

          <div class="cluster">
            <bar-button variant="primary" color="white" @click="goDownToMapSection"><span>Start</span><span class="icon">arrow_downward</span></bar-button>
            <bar-button variant="primary" color="faded" @click="data.video = true"><span class="icon">play_arrow</span><span>Watch Video</span></bar-button>
          </div>
        </slot>
      </div>
      <div class="hero-content__inner | stack">
        <slot name="column_right">
          <LazyYouTube 
            v-if="useRouter().currentRoute.value.name === 'index'"
            ref="lazyYouTubeRef"
            video-id="ervofXVlR_w"
            title="Transatlantic Barometer Introduction Video"
            class="hero__video"
          />
        </slot>
      </div>
    </div>
    <barCurve />
  </ccm-hero>
</template>

<style scoped lang="scss">
.hero {
  --bar-curve-color: var(--white-color);
  background-color: var(--base-color);
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: auto 1fr auto;
  position: relative;
  overflow: hidden;
  & > * {
    position: relative;
    z-index: 3;
  }
  .h2, h1 {
    font-weight: 700;
  }
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--bar-curve-color);
  }
}

.hero-content__inner {
  @media (max-width: 1024px) {
    padding-top: var(--space-m);
  }
  :deep(hgroup) {
    align-items: flex-start;
  }
}

.hero__video {
  display: flex;
  justify-self: center;
  margin: auto;
  max-width: 800px;
  width: 100%;
}

.hero-content {
  grid-column: content-start / content-end;
  grid-row: 2 / 3;
  color: var(--white-color);

  /* --_stack-space: var(--space-m); */

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-m);
  }

  
}

:deep(hgroup) {
    --_stack-space: var(--space-2xs);
  }

.hero {
  padding-block: var(--space-xs) var(--space-2xl);
}

:deep(.bar-curve) {
  position: absolute;
  bottom: 0;
  grid-column: full-start / full-end;
}

.hero__video-loop {
  grid-column: full-start / full-end;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  object-fit: cover;
}

.video-container {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  max-height: 80vh;
  max-width: 95vw;
  aspect-ratio: 16/9;
  z-index: 99;
  transform: translate(-50%, -50%);
  background: var(--base-color);
  padding: var(--space-xl);
  video {
    width: 100%;
    height: 100%;
    aspect-ratio: 16/9;
  }
}

  .video-container__close {
    position: absolute;
    top: var(--space-s);
    right: var(--space-s);
    background: none;
    border: none;
    color: var(--white-color);
    cursor: pointer;
  }
</style>