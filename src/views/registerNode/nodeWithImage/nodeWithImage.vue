<template>
  <div class="node-title" ref="myNode">
    <div class="node-icon">
      <img
        draggable="false"
        width="120"
        height="120"
        :src="props.imageUrl"
        alt=""
      />
    </div>
    <div class="node-name"><span></span></div>
  </div>
</template>
  <script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import IconFont from '@/components/iconfont/index.vue'
import '@/components/iconfont/index.js'
const props = defineProps({
  properties: {
    type: Object,
    default: null,
  },
  imageUrl: String,
})

let myNode = ref(null);

onMounted(() => {
  let borderColor = '#e6f7ff'
  myNode.value.style.border = `5px solid ${borderColor}`; //stroke边框
})

  </script>
  
  <style scoped>
/* .node-icon {
  color: "#4921c3";
  font-size: 19px;
  width: 26px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  background-color: aqua;
} */
.node-title {
  height: 100%;
  width: 100%;
  background: #fff;
  border: 1px solid #e6f7ff;
  box-sizing: border-box;
  /* padding: 10px 10px 10px 6px; */
  padding: 5px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.node-name > span {
  border: none !important;
}
</style>