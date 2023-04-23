<template>
  <EchartView :echart-data="echart"/>
</template>
<script setup lang="ts">
import EchartView from '@/components/EchartView.vue';
import { ref } from 'vue';
const echart = ref({
  title: 'hello',
  xAxis: ['1m','2m'],
  series:[1,2]
})
</script>