<template>
  <bar-section class="compare-box | stack">
    <div class="cluster">
      <hgroup split-right>
        <h2 class="h1">Democracy</h2>
        <p>Governance & Democracy, May ‘25</p>
      </hgroup>
      <bar-button color="base" size="small">Close</bar-button>
    </div>
    <div class="switcher">
      <div class="section-panel | stack">
        <bar-flag country="ca" size="small" />
        <h3 class="h2">Canada</h3>
        <p>Canada is classified as an electoral democracy in the Varieties of Democracy (V-Dem) Institute’s 2025 Democracy Report. This means that elections are free and fair and protection of civil liberties is “satisfactory”, but not as robust as in liberal democracies.</p>
        <p>Canada, along with Spain, is in 17th place among the 30 Transatlantic Barometer countries on V-Dem’s Liberal Democracy Index. Canada scored 0.84/1.00 on the V-Dem Electoral Democracy Index in 2024, above the Barometer average of 0.80 and down slightly from its 0.85 in 2018. On the World Press Freedom Index, Canada scored 78.75/100 in 2025, down from its 2018 score of 84.72 but above the Barometer average of 76.07. Its Global State of Democracy Judiciary Independence score was 0.74/1.00 in 2023, a notable decline from its 0.81 score in 2018 and the same as the 0.74 Barometer average. Canada has declined on judicial independence since 2018, primarily over increasing criticism of the judiciary by political leaders and a lengthy judicial complaints process that did not provide accused judges with extensive opportunities to defend themselves.</p>
        <p>Parliament passed changes to the judicial complaints process in 2023, but these changes are not yet reflected in the data. The Organization for Security and Cooperation in Europe noted “full confidence in the electoral process” in its report on the 2021 Canadian snap elections.</p>
        <bar-button>More details</bar-button>
      </div>

      <div class="section-panel | stack">
        <bar-flag country="lu" size="small"  />
        <h3 class="h2">Luxembourg</h3>
        <p>Luxembourg is classified as a liberal democracy in the Varieties of Democracy (V-Dem) Institute’s 2025 Democracy Report. This means that elections are free and fair, there are constraints on the executive, and civil liberties are protected.</p>
        <p>Luxembourg ranks 10th among the 30 Transatlantic Barometer countries on V-Dem’s Liberal Democracy Index. Luxembourg scored 0.87/1.00 on the V-Dem Electoral Democracy Index in 2024, above the Barometer average of 0.80 and down slightly from its score of 0.88 in 2018. On the World Press Freedom Index, Luxembourg scored 83.04/100 in 2025, down from its 2018 score of 85.28, but above the Barometer average of 76.07. Luxembourg’s Global State of Democracy Judiciary Independence score was 0.71/1.00 in 2023, slightly above its 2018 score of 0.70 and below the 0.74 Barometer average. Regarding judicial independence, Parliament passed substantial legislation in December 2022 that established an independent body with the power to make judicial appointments, but these changes are not yet reflected in this data.</p>
        <p>The Organization for Security and Cooperation in Europe report on the 2023 parliamentary elections noted “no significant concerns” and saw no need for further observation.</p>
        <bar-button>More details</bar-button>
      </div>
    </div>

    <!-- <bar-infographic /> -->

  </bar-section>
</template>

<script setup>


</script>

<style scoped>
  .compare-box {
    border: 1px solid var(--base-color-20-tint);
    border-radius: var(--border-radius-m);
    margin-inline: var(--space-l);
    padding-inline: var(--space-m);
  
  }
</style>