<template>
  <bar-section class="topics-section">
    <h1>Topics</h1>
    <div class="topics-section__filters | cluster">
      <select name="topic-filter" id="topic-filter" split-left>
        <option value="all">All</option>
        <option value="topic1">Topic 1</option>
        <option value="topic2">Topic 2</option>
        <option value="topic3">Topic 3</option>
      </select>
      <bar-button variant="secondary" color="base-300" size="s">Sorted by: Most Recent</bar-button>
      <bar-button variant="secondary" color="base-300" size="s" split-right>View Archived Topics</bar-button>
    </div>

    <div class="topics-grid">
      <div v-for="topic in topics" :key="topic.title" class="topic-card">
        <bar-topic-card :topic="topic" />
      </div>
    </div>
  </bar-section>
</template>

<script setup>
const topics = [
  {
    "title": "Democracy",
    "date": "May 2025",
    "new": true,
    "category": "Governance & Democracy"
  },
  {
    "title": "Security & Defense",
    "date": "Apr 2025",
    "category": "Security & Global Affairs"
  },
  {
    "title": "Elections & Vote Turnout",
    "date": "Mar 2025",
    "category": "Governance & Democracy"
  },
  {
    "title": "E-Governance",
    "date": "Oct 2024",
    "category": "Technology & Innovation"
  },
  {
    "title": "Foreign Direct Investment",
    "date": "Jul 2024",
    "category": "Security & Global Affairs"
  },
  {
    "title": "Migration",
    "date": "Mar 2024",
    "category": "Security & Global Affairs"
  },
  {
    "title": "Artificial Intelligence",
    "date": "Dec 2023",
    "category": "Technology & Innovation"
  },
  {
    "title": "Youth Unemployment",
    "date": "Oct 2023",
    "category": "Economy & Sustainability"
  },
  {
    "title": "Trade with China",
    "date": "Sep 2023",
    "category": "Security & Global Affairs"
  },
  {
    "title": "Cybersecurity",
    "date": "Jun 2023",
    "category": "Security & Global Affairs"
  },
  {
    "title": "Woman in Government",
    "date": "Apr 2023",
    "category": "Governance & Democracy"
  },
  {
    "title": "Broadband & Digital Connectivity",
    "date": "Feb 2023",
    "category": "Technology & Innovation"
  },
  {
    "title": "Renewable Energy & Greenhouse Gas Emissions",
    "date": "Nov 2022",
    "category": "Economy & Sustainability"
  },
  {
    "title": "Media Freedom",
    "date": "Sep 2022",
    "category": "Governance & Democracy"
  },
  {
    "title": "Voting & Registration Rights",
    "date": "Sep 2022",
    "category": "Governance & Democracy"
  }
]
</script>

<style scoped>
.topics-section {
  grid-column: content-start / content-end;
}

.topics-section__filters {
  padding-block: var(--space-m);
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--base-gutter);
}

.topic-card {

  &:hover {
  }
}
</style>