<template>
  <bar-hero>
    <div class="switcher">
      <div class="section-panel">
        <bar-flag country="ca" />        
        <h1>Canada</h1>
      </div>
    </div>
  </bar-hero>

  <bar-section>
    <bar-flags />
  </bar-section>

  <bar-section>
    <div class="width-sidebar">
      <div class="main-content">
        <h2>Canada on Democracy</h2>
        <p>Canada is classified as an electoral democracy in the Varieties of Democracy (V-Dem) Institute’s 2025 Democracy Report. This means that elections are free and fair and protection of civil liberties is “satisfactory”, but not as robust as in liberal democracies.</p>
        <p>Canada, along with Spain, is in 17th place among the 30 Transatlantic Barometer countries on V-Dem’s Liberal Democracy Index. Canada scored 0.84/1.00 on the V-Dem Electoral Democracy Index in 2024, above the Barometer average of 0.80 and down slightly from its 0.85 in 2018. On the World Press Freedom Index, Canada scored 78.75/100 in 2025, down from its 2018 score of 84.72 but above the Barometer average of 76.07. Its Global State of Democracy Judiciary Independence score was 0.74/1.00 in 2023, a notable decline from its 0.81 score in 2018 and the same as the 0.74 Barometer average. Canada has declined on judicial independence since 2018, primarily over increasing criticism of the judiciary by political leaders and a lengthy judicial complaints process that did not provide accused judges with extensive opportunities to defend themselves.</p>
        <p>Parliament passed changes to the judicial complaints process in 2023, but these changes are not yet reflected in the data. The Organization for Security and Cooperation in Europe noted “full confidence in the electoral process” in its report on the 2021 Canadian snap elections.</p>  
      </div>
      <aside>
        <h2>Sources</h2>
        <ul>
          <li>V-Dem Democracy Report 2025</li>
        </ul>
      </aside>
    </div>

    <div class="switcher">
      <div class="aux-card">
        <h3>Data1</h3>
      </div>
      <div class="aux-card">
        <h3>Data2</h3>
      </div>
      <div class="aux-card">
        <h3>Data2</h3>
      </div>
      <div class="aux-card">
        <h3>Data2</h3>
      </div>
    </div>
  </bar-section>

  <bar-section>
    <h2>infographics</h2>

    <ccm-tabs :tabs="tabs">
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
  </bar-section>

</template>

<script setup>
const tabs = [
  { label: 'Liberal Democracy', slot: 'tab1' },
  { label: 'Electoral Democracy', slot: 'tab2' },
  { label: 'World Press Freedom', slot: 'tab3' },
  { label: 'Judicial Independence', slot: 'tab4' },
]
</script>

<style scoped>

</style>