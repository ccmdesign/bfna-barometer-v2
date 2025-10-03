<template>
  <div class="subgrid">
    <div class="bar-infographic__chart-wrapper" :style="{ '--bar-scale': barScale }">
      <div
        class="bar-infographic__country"
        v-for="item in countries"
        :key="item.country"
        :class="{ 'hidden-country': hiddenCountries.includes(item.country) }"
      >
        <div class="bar-infographic__country-score" :style="{ '--score': item.val, 'background-color': highlight.includes(item.country) ? 'var(--base-color)' : 'var(--accent-color)' }" :score="item.val"></div>
        <div class="bar-infographic__country-name">{{ item.country.toUpperCase() }}</div>
      </div>
    </div>
    <div id="print:tags-all" class="tags | cluster print:hidden" centered>
      <bar-tag
        :country-name="toggleAllLabel"
        country-code="__ALL__"
        color="base-10"
        :visible="hiddenCountries.length === 0"
        @toggleCountryVisibility="(pay) => handleCountryVisibility(pay)"
      >
        {{ toggleAllLabel }}
      </bar-tag>
    </div>
    <div id="print:tags-countries" class="tags | cluster print:hidden" centered>
      <bar-tag
        v-for="item in countries"
        :key="item.country"
        :country-name="getCountryName(item.country)"
        :country-code="item.country"
        :visible="!hiddenCountries.includes(item.country)"
        color="base-10"
        @toggleCountryVisibility="(pay) => handleCountryVisibility(pay)"
      />
    </div>
  </div>
</template>

<script setup>
const { getCountryName } = useCountries()
const { data } = defineProps({
  data: {
    type: Object,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  highlight: {
    type: Array,
    required: false,
  }
})

const countries = computed(() => {
  return data.countries || []
})

const hiddenCountries = ref([])
const visibleCountries = computed(() => {
  return (data.countries || []).filter(item => !hiddenCountries.value.includes(item.country))
})

const allCountryCodes = computed(() => {
  return (data.countries || []).map(c => c.country)
})

const toggleAllLabel = computed(() => {
  return hiddenCountries.value.length ? 'Select all' : 'Deselect all'
})

const barScale = computed(() => {
  const vals = (data.countries || []).map(item => item.val)
  const max = Math.max(...vals, 0)
  if (max === 0) return '100%' // avoid div by zero
  const scale = 100 / max
  return `${scale}%`
})


const handleCountryVisibility = ({ countryCode, visible }) => {
  if (countryCode === '__ALL__') {
    if (!visible) {
      hiddenCountries.value = [...allCountryCodes.value]
    } else {
      hiddenCountries.value = []
    }
    return
  }
  if (!visible) {
    if (!hiddenCountries.value.includes(countryCode)) {
      hiddenCountries.value.push(countryCode)
    }
  } else {
    hiddenCountries.value = hiddenCountries.value.filter(c => c !== countryCode)
  }
}
</script>

<style scoped>
.bar-infographic__chart-wrapper {
  --bar-scale: 100%;
  --legend-height: 45px;
  --gap: var(--space-xs);

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: flex-end;
  aspect-ratio: 16/6;
  position: relative;
  gap: var(--gap);
  padding-inline: var(--space-s);
  padding-top: calc(var(--space-xs) + var(--legend-height));

  @media (min-width: 1024px) { flex-direction: row; }

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
    @media (max-width: 1024px) {
      right: calc(var(--legend-height) * -1 - 1px);
      text-align: left;
    }
    top: 0;
    font-weight: 200;
    font-size: var(--size-0);
  }
}

@media (max-width: 1024px) {
  .bar-infographic__country-name {
    display: flex;
    align-items: center;
    border-right: 1px solid var(--base-color-40-tint);
    height: calc(100% - var(--gap) * -1);
    width: 100%;
    width: 28px;
  }

  .bar-infographic__country-score {
    width: calc(var(--score) * var(--bar-scale) - 52px);
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
    text-align: center;
  }

  .bar-infographic__country-score {
    height: calc(var(--score) * var(--bar-scale));
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

.bar-infographic__country {
  transition: opacity 0.3s ease-out, display 0.3s ease-out allow-discrete;
}

.hidden-country {
  opacity: 0.1;
  pointer-events: none;
}

@starting-style {
  .bar-infographic__country:not(.hidden-country) {
    opacity: 0;
  }
}

</style>