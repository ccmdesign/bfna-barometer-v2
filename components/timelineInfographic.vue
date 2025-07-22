<script setup>
import { useTimelineStore } from '@/stores/timeline'

const props = defineProps({
  dataset: {
    type: Object,
    // see original for default structure
  },
});

const { getCountryName } = useCountries()
const infographicData = props.dataset.countries;
const timelineStore = useTimelineStore();

const countries = computed(() => {
  return (infographicData || []).slice().sort((a, b) => {
    const nameA = getCountryName(a.country || a.label).toLowerCase();
    const nameB = getCountryName(b.country || b.label).toLowerCase();
    return nameA.localeCompare(nameB);
  });
});

const chartData = ref([]);
const years = ref([]);
const months = ref({});

const timelineList = ref([]);
const eventList = ref([]);
const lineLabel = ref([]);


const isMarkerVisible = computed(() => props.dataset.vizMarkers);
const isBarVisible = (countryCode) => !hiddenCountries.value.includes(countryCode);

const hiddenCountries = ref([])
const handleCountryVisibility = ({ countryCode, visible }) => {

  if (!visible) {
    if (!hiddenCountries.value.includes(countryCode)) {
      hiddenCountries.value.push(countryCode)
    }
  } else {
    hiddenCountries.value = hiddenCountries.value.filter(c => c !== countryCode)
  }
}

function getMonth(n) {
  const month = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return month[n];
}

function renderTimelineHeights() {
  const eventsList = eventList.value;
  const timeline = timelineList.value;

  for (let i in eventsList) {
    if (i > 0) {
      let distanceLine = timeline[i].clientWidth;
      let textSize = eventsList[i].clientWidth;
      let posPrevEvent = i - 1;

      while (
        posPrevEvent >= 0 &&
        timeline[posPrevEvent].classList.contains("hide-line")
      ) {
        distanceLine += timeline[posPrevEvent].clientWidth;
        posPrevEvent -= 1;
      }

      if (textSize > distanceLine) {
        let prevEventHeight = eventsList[posPrevEvent].clientHeight;
        let paddingBottom = `calc(${prevEventHeight}px + 1rem)`;
        eventsList[i].style.paddingBottom = paddingBottom;
      } else {
        eventsList[i].style.paddingBottom = "1rem";
      }
    }

    if(Number(i) == eventsList.length -1) {
      const highestHeight = eventsList.reduce((max, item) => item.clientHeight > max.clientHeight ? item: max, eventsList[0]);
      if(highestHeight.clientHeight > 500) {
        timelineStore.setTimelineHeightValue(true);
      }
    }
  }

  const lineLabels = lineLabel.value;
  if (lineLabels && lineLabels[0]) {
    timelineStore.setTimelineMarginLeft(lineLabels[0].clientWidth);
  }
}

function isLineHidden(markers, labels) {
  let hidden = true;

  if (markers.length > 0) {
    hidden =
      hidden &&
      markers
        .map(({ markerKeys }) =>
          markerKeys.map((z) => !isMarkerVisible.value[z]).every((j) => j)
        ).every((x) => x);
  }
  if (labels.length > 0) {
    hidden =
      hidden &&
      labels
        .map(({ countries }) =>
          countries.map((z) => !isBarVisible(z)).every((x) => x)
        )
        .every((x) => x);
  }

  return hidden;
}

// Build chartData from dataset
if (infographicData && infographicData.length) {
  for (let i in infographicData) {
    let country = infographicData[i].country || infographicData[i].label;

    // Corrigido para UTC
    let currVal = infographicData[i].val;
    let prevVal = infographicData[i > 0 ? i - 1 : 0].val;

    let curr, prev;
    if (Array.isArray(currVal)) {
      curr = new Date(Date.UTC(currVal[0], currVal[1] - 1, currVal[2] || 1));
    } else {
      curr = new Date(currVal);
    }
    if (Array.isArray(prevVal)) {
      prev = new Date(Date.UTC(prevVal[0], prevVal[1] - 1, prevVal[2] || 1));
    } else {
      prev = new Date(prevVal);
    }

    let month = getMonth(curr.getUTCMonth());
    let year = Number(curr.getUTCFullYear());
    let prevYear = Number(prev.getUTCFullYear());

    let markers = []; // markerKeys
    let labels = []; // countries

    let isMarker = "label" in infographicData[i] ? true : false;

    if (year === prevYear && i > 0) {
      const yearIndex = years.value.indexOf(year);
      if (isMarker) {
        const list = chartData.value[yearIndex].markers;
        const monthIndex = list.findIndex((item)=> item.month === month);

        if (monthIndex > -1) {
          list[monthIndex].markerKeys.push(infographicData[i].key);
          list[monthIndex].markers.push(infographicData[i].label);

        } else {
          list.push({
            month: month,
            markerKeys: [infographicData[i].key],
            markers: [infographicData[i].label],
          });
        }
      } else {
        const list = chartData.value[yearIndex].labels;
        const monthIndex = list.findIndex((item)=> item.month === month);

        if (monthIndex > -1) {
          list[monthIndex].countries.push(country);
        } else {
          list.push({
            month: month,
            countries: [country],
          });
        }
      }

    } else {
      // O primeiro daquele ano.
      if (isMarker) {
        // Add markers.
        markers = [{
          month: month,
          markerKeys: [infographicData[i].key],
          markers: [infographicData[i].label]
        }];
      } else {
        // Add labels.
        labels = [{
          month: month,
          countries: [country],
        }];
      }

      chartData.value.push({
        year: year,
        distance: year - prevYear,
        labels: labels,
        markers: markers,
      });

      years.value.push(year);
    }
  }
}

onMounted(() => {
  renderTimelineHeights();
});
onUpdated(() => {
  renderTimelineHeights();
});
</script>

<template>
    <div class="subgrid">
      <div class="timeline-infographic__chart-wrapper">
        <ul class="timeline">
          <li
            ref="timelineList"
            v-for="(i, index) in chartData"
            class="event timeline__item"
            :style="{ '--distance': i.distance, '--height': i.height }"
            :key="index"
            :class="{ 'hide-line': isLineHidden(i.markers, i.labels) }"
          >
            <ul class="event__list" ref="eventList">
              <li v-for="(j, idx) in i.labels" :key="`label-${idx}`">
                <div ref="lineLabel" class="label" :key="idx" v-if="j.countries
                      .filter((z) => isBarVisible(z)).some(x=> x)">
                  <!--<span>{{ j.month }}</span> - --><strong>{{
                    j.countries
                      .filter((z) => isBarVisible(z))
                      .map((z) => getCountryName(z))
                      .join(", ")
                  }}</strong>
                </div>
              </li>
              <li v-for="(j, idx) in i.markers" :key="`marker-${idx}`">
                <div class="label" :key="idx" v-if="j.markerKeys.filter((z) => isMarkerVisible[z]).some(x=>x)">
                  <span class="marker">{{ j.month }}</span> - <strong>{{
                    j.markers.filter((z, index) => (isMarkerVisible[j.markerKeys[index]])).join(", ")
                  }}</strong>
                </div>
              </li>
            </ul>
            <div class="event__year">{{ i.year }}</div>
          </li>
        </ul>
      </div>
      <div class="tags | cluster" centered>
        <bar-tag
          v-for="item in countries"
          :key="item.country"
          :country-name="getCountryName(item.country)"
          :country-code="item.country"
          :visible="!hiddenCountries.includes(item.country)"
          @toggleCountryVisibility="(pay) => handleCountryVisibility(pay)"
        />
      </div>
    </div>
</template>

<style scoped lang="scss">
.timeline-infographic__chart-wrapper {

  --legend-height: 45px;
  --gap: var(--space-xs);

  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) { flex-direction: row; }

  align-items: end;
  justify-content: center;
  aspect-ratio: 16/6;
  position: relative;
  gap: var(--gap);
  padding-inline: var(--space-s);
  padding-top: calc(var(--space-xs) + var(--legend-height));
  padding-bottom: calc(var(--space-xs) + var(--legend-height));

}

.label {
  min-width: 20ch;
  max-width: 23ch;
  overflow: hidden;
  white-space: pre-wrap;
}

.event__year {
  font-weight: bold;
}

.marker {
  color: var(--accent-color);
  background-color: hsla(var(--base-hsl), 0.1);
  padding: var(--s-5) var(--s-1);
}

.flag1 > strong {
  display: block;
}

.event {
  --height: 0;
  flex: var(--distance);
  position: relative;
  display: flex;
}

.event:after {
  content: "";
  position: absolute;
  --size: 10px;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background-color: var(--accent-color);
}

.timeline {
  width: 70%;
}

@media (max-width: 39.98em) {
  .timeline {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    min-height: 560px;
  }

  .timeline:before {
    content: "";
    width: 2px;
    background: linear-gradient(
      transparent 0%,
      var(--accent-color) 5%,
      var(--accent-color) 95%,
      transparent 100%
    );
    height: 110%;
    top: -5%;
    position: absolute;
    left: 15%;
  }

  .event {
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    position: relative;
  }
  .event__year {
    order: -1;
    margin-right: var(--s0);
    text-align: right;
    flex: 1;
  }

  .event__list {
    flex: 1;
  }

  .event__extra {
    display: block;
    font-style: italic;
    opacity: 0.6;
    margin-bottom: 0.5rem;
    margin-top: -0.3rem;
  }

  .event:after {
    top: 4px;
    left: calc(15% - 4px);
  }

  .flag1 {
    margin-left: -11px;
    margin-top: 5px;
  }
}

@media (min-width: 40em) {
  .timeline {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid var(--accent-color);
    position: relative;
    transform: translateY(60px);
  }

  .timeline:before,
  .timeline:after {
    content: "";
    position: absolute;
    border-bottom: 2px solid var(--accent-color);
  }

  .timeline:before {
    left: -15vw;
    right: 100%;
    top: 100%;
  }
  .timeline:after {
    right: -15vw;
    left: 100%;
    top: 100%;
  }

  .event {
    --height: 0;
    clear: both;
    text-align: right;
    position: relative;
    flex: var(--distance) 1 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .event:after {
    content: "";
    position: absolute;
    --size: 10px;
    bottom: calc(var(--size) * -0.6);
    right: calc(var(--size) * -0.5);
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background-color: var(--accent-color);
  }

  .event__list {
    position: absolute;
    right: 0;
    display: flex;
    border-right: 1px solid var(--accent-color);
    padding-right: var(--space-xs);
    padding-left: var(--space-xs);
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: calc(var(--height) * 1.6rem + 1rem);
    width: max-content;
  }

  .event__list li {
    white-space: nowrap;
  }

  .event__year {
    font-weight: bold;
    position: absolute;
    bottom: -2.5rem;
    right: -2ch;
  }

  .flag1 {
    margin-right: -10px;
  }
}

@media (min-width: 1280px) {
  .timeline {
    padding-top: var(--space-s);
  }
}

.hide-line .event__year,
.hide-line .event__list,
.hide-line::after,
.hide-label {
  display: none;
}

@media (min-width: 40em) and (max-width: 1079px) {
  .timeline {
    transform: translateY(220px);
  }
}

:deep(.button) {
  margin-top: var(--space-s);
}

.tags {
  padding-block: var(--space-xl);
  @media (max-width: 1024px) { display: none; }
}
</style>
