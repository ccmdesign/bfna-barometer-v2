<template>
  <div class="subgrid">
    <div class="bar-infographic__chart-wrapper">
      <div class="bar-infographic__country" v-for="country in countries" :key="country.code">
        <div class="bar-infographic__country-score" :style="{ '--score': country.score }" :score="country.score"></div>
        <div class="bar-infographic__country-name">{{ country.code }}</div>        
      </div>
    </div>
    <div class="tags | cluster" centered>
      <bar-tag v-for="country in countries" :key="country.code" :country-name="country.country" :country-code="country.code" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const countries = [
  { "code": "DK", "country": "Denmark", "score": 0.88 },
  { "code": "EE", "country": "Estonia", "score": 0.85 },
  { "code": "SE", "country": "Sweden", "score": 0.84 },
  { "code": "IE", "country": "Ireland", "score": 0.83 },
  { "code": "CZ", "country": "Czech Republic", "score": 0.82 },
  { "code": "BE", "country": "Belgium", "score": 0.81 },
  { "code": "FI", "country": "Finland", "score": 0.80 },
  { "code": "FR", "country": "France", "score": 0.80 },
  { "code": "DE", "country": "Germany", "score": 0.79 },
  { "code": "LU", "country": "Luxembourg", "score": 0.78 },
  { "code": "LV", "country": "Latvia", "score": 0.77 },
  { "code": "AT", "country": "Austria", "score": 0.76 },
  { "code": "NL", "country": "Netherlands", "score": 0.76 },
  { "code": "PT", "country": "Portugal", "score": 0.75 },
  { "code": "GB", "country": "United Kingdom", "score": 0.75 },
  { "code": "US", "country": "United States", "score": 0.75 },
  { "code": "CA", "country": "Canada", "score": 0.74 },
  { "code": "ES", "country": "Spain", "score": 0.74 },
  { "code": "LT", "country": "Lithuania", "score": 0.73 },
  { "code": "EU", "country": "European Union", "score": 0.70 },
  { "code": "IT", "country": "Italy", "score": 0.70 },
  { "code": "CY", "country": "Cyprus", "score": 0.65 },
  { "code": "MT", "country": "Malta", "score": 0.64 },
  { "code": "HR", "country": "Croatia", "score": 0.62 },
  { "code": "PL", "country": "Poland", "score": 0.62 },
  { "code": "SI", "country": "Slovenia", "score": 0.62 },
  { "code": "GR", "country": "Greece", "score": 0.58 },
  { "code": "SK", "country": "Slovakia", "score": 0.58 },
  { "code": "BG", "country": "Bulgaria", "score": 0.51 },
  { "code": "RO", "country": "Romania", "score": 0.45 },
  { "code": "HU", "country": "Hungary", "score": 0.32 }
]
</script>

<style scoped>
.bar-infographic__chart-wrapper {

  --legend-height: 45px;
  --gap: var(--space-xs);

  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) { flex-direction: row; }

  align-items: center;
  justify-content: flex-end;
  aspect-ratio: 16/6;
  position: relative;
  gap: var(--gap);
  padding-inline: var(--space-s);
  padding-top: calc(var(--space-xs) + var(--legend-height));

}

.bar-infographic__country {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
}

.bar-infographic__country-name {
  font-size: var(--size--1);
  font-weight: 600;
  color: var(--base-color-80-shade);
  width: calc(100% - var(--gap) * -1);
}

.bar-infographic__country-score {
  background-color: var(--primary-color);
  position: relative;

  &::after {
    content: attr(score);
    position: absolute;
    right: calc(var(--legend-height) * -1);
    top: 0;
    font-weight: 200;
    font-size: var(--size-0);
  }
}

@media (max-width: 1024px) {
  .bar-infographic__country {
  }

  .bar-infographic__country-name {
    display: flex;
    align-items: center;
    border-right: 1px solid var(--base-color-40-tint);
    height: calc(100% - var(--gap) * -1);width: 100%;
    width: 28px;
  }

  .bar-infographic__country-score {
    width: calc(var(--score) * 100% - 28px);
    height: 100%;
    order: 1;
    border-radius: 0 var(--border-radius-s) var(--border-radius-s) 0;

    &::after {
      content: attr(score);
      font-size: var(--size-0);
    }
  }
}


@media (min-width: 1024px) {
  .bar-infographic__country {
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
  }

  .bar-infographic__country-name {
    border-top: 1px solid var(--base-color-40-tint);
    width: calc(100% - var(--gap) * -1);
  }

  .bar-infographic__country-score {
    height: calc(var(--score) * 100%);
    background-color: var(--primary-color);
    width: 100%;
    border-radius: var(--border-radius-m) var(--border-radius-m) 0 0;
    position: relative;

    &::after {
      content: attr(score);
      position: absolute;
      top: calc(var(--legend-height) * -1);
      left: 0;
      right: 3px;
      transform: rotate(-90deg);
      font-weight: 200;
      font-size: var(--size-0);
    }

    &:hover {
      transform: scale(1.05);
      transition: transform 0.3s ease;
      transform-origin: bottom;
    }
  }
}

.tags {
  padding-block: var(--space-l);
  @media (max-width: 1024px) { display: none; }
}
</style>