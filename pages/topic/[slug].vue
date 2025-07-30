<template>
  <bar-hero>
    <template #column_left>
      <hgroup class="stack">
        <bar-back-button />
        <p class="font-weight:700">Governance & Democracy</p>
        <h1>{{ topic.title }}</h1>
        <p class="margin-bottom:m">Statements compiled in {{ topic.period }}</p>
        <p>{{ topic.description }}</p>
      </hgroup>
    </template>
    <template #column_right v-if="topic.video">
      <nuxt-link class="video-thumb" :to="topic.video" target="_blank">
        <img :src="getThumbnail(topic.video)" alt="Video thumbnail">
        <span class="video-thumb__player">
          <span class="icon">arrow_right</span>
        </span>
      </nuxt-link>
    </template>
  </bar-hero>

  <bar-section class="map-section">
    <bar-map-section id="map" :topic="topic.slug" />
  </bar-section>

  <!--<bar-section color="faded" size="l" class="padding-bottom:0">
    <div class="with-sidebar">
      <div class="main-content | stack">
        <h2>Canada on Democracy</h2>
        <p>Canada is classified as an electoral democracy in the Varieties of Democracy (V-Dem) Institute’s 2025 Democracy Report. This means that elections are free and fair and protection of civil liberties is “satisfactory”, but not as robust as in liberal democracies.</p>
        <p>Canada, along with Spain, is in 17th place among the 30 Transatlantic Barometer countries on V-Dem’s Liberal Democracy Index. Canada scored 0.84/1.00 on the V-Dem Electoral Democracy Index in 2024, above the Barometer average of 0.80 and down slightly from its 0.85 in 2018. On the World Press Freedom Index, Canada scored 78.75/100 in 2025, down from its 2018 score of 84.72 but above the Barometer average of 76.07. Its Global State of Democracy Judiciary Independence score was 0.74/1.00 in 2023, a notable decline from its 0.81 score in 2018 and the same as the 0.74 Barometer average. Canada has declined on judicial independence since 2018, primarily over increasing criticism of the judiciary by political leaders and a lengthy judicial complaints process that did not provide accused judges with extensive opportunities to defend themselves.</p>
        <p>Parliament passed changes to the judicial complaints process in 2023, but these changes are not yet reflected in the data. The Organization for Security and Cooperation in Europe noted “full confidence in the electoral process” in its report on the 2021 Canadian snap elections.</p>  
      </div>

      <aside class="sidebar">
        <h2>Sources</h2>
        <ul class="stack | margin-top:s">
          <li v-for="link in sidebar_links" :key="link.title">
            <a :href="link.url">{{ link.title }}</a> <span class="icon" size="xs">open_in_new</span>
          </li>
          </ul>
        </aside>
      </div>
  </bar-section>

  <bar-section color="faded" size="l">
    <div class="switcher">
      <bar-indicator-card v-for="card in data_cards" :key="card.indicator" :data="card" />
    </div>
  </bar-section>

  <!--<bar-section>
    <h2 class="section-title">infographics</h2>

    <ccm-tabs :tabs="tabs" class="infographics-tabs | padding-top:s">
      <template #tab1>
        <bar-infographic title="Liberal Democracy" />
      </template>
      <template #tab2>
        <bar-infographic title="Electoral Democracy" />
      </template>
      <template #tab3>
        <bar-infographic title="World Press Freedom" />
      </template>
      <template #tab4>
        <bar-infographic title="Judicial Independence" />
      </template>
    </ccm-tabs>
  </bar-section>-->
  <bar-footer id="footer" />

</template>

<script setup>
import { useYouTube } from '~/composables/useYouTube'
const route = useRoute()
const { data: topic } = await useAsyncData('topic', () => queryCollection('topics')
  .where('slug', '=', route.params?.slug)
  .first())

const { getThumbnail } = useYouTube()


</script>

<style scoped lang="scss">
hgroup {
  --_stack-space: var(--space-2xs);
}

.with-sidebar {
  aside { min-width: 23%; /* @TODO: Magic number to align with the subgrid. O ideal seria termos essa sidebar definida no subgrid. */ }
}

.topic-page__sidebar {
  --_stack-space: var(--space-2xs);
}

.infographics-tabs :deep(.ccm-tabs__tabs) {
  --_cluster-space: var(--space-xl);
}

.hero {
  background-image: url(/assets/abstract.webp);
  background-position: bottom right;
  background-size: 140% auto;
}

.bar-footer {
  --bar-curve-color: var(--white-color);
}


.video-thumb {
  position: relative;
  & > img {
    width: 100%;
    object-fit: cover;
    aspect-ratio: 16/9;
    border-radius: var(--size--1);
    border: var(--space-2xs) solid var(--base-color-80-tint);
    box-shadow: 0px 64px 64px -32px var(--base-color-05-shade);
  }
  .video-thumb__player {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: var(--size-5);
    height: var(--size-5);
    border-radius: 50%;
    background-color: var(--base-color-80-tint);
    display: flex;
    flex-flow: row nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
    span{
      font-size: var(--size-4);
      color: var(--white-color);
    }
  }
}
</style>