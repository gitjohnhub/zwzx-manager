<template>
  <div id="container"></div>
</template>
<script lang='ts' setup>
import { Line } from '@antv/g2plot';
import { onMounted ,watch,ref} from 'vue';
const props = defineProps(['data']);
const data = ref(props.data)
watch(data,(newValue)=>{
  console.log(newValue)
})
onMounted(()=>{
  console.log('data=>',data.value)
  const line = new Line('container', {
  data:data.value,
  xField: '_id',
  yField: '_count',
});
  line.render();
})

</script>