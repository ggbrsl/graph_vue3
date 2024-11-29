<template>
  <!-- 左侧节点面板 -->
  <NodePanel :lf="lf" v-if="flag" :currentKey="currentKey" />
  <!-- 画布 -->
  <div ref="container" style="height: calc(100vh - 76px)"></div>
  <!-- 工具栏 -->
  <Control :lf="lf" v-if="flag" :currentKey="currentKey" />
  <!-- 属性面板 -->
</template>
  <script lang="ts" setup>
import { defineComponent, ref, onMounted, reactive, watch } from 'vue';
import graphJsonData from '../../graph_data/graph-data.json';
import graphJsonData2 from '../../graph_data/graph-data2.json';

import LogicFlow from '@logicflow/core';
import '@logicflow/core/dist/index.css';
import { Menu, Snapshot, MiniMap } from '@logicflow/extension';
import nodeWithIcon from '@/views/registerNode/nodeWithIcon/nodeWithIcon'
import nodeWithImage from '@/views/registerNode/nodeWithImage/nodeWithImage'
import NodePanel from '../sider/NodePanel.vue'
import Control from '../sider/Control.vue'
import PropertyDialog from '../sider/PropertyDialog.vue'

let lf: LogicFlow = reactive({});
let graphData = reactive({});
let container = ref(null)
const props = defineProps({
  currentKey: Object,
  saveflag: Boolean
})

let flag = ref(false)
let data = {}

type NodeConfig = {
  id: string;
  properties?: Record<string, unknown>;
  text?: {
    x: number;
    y: number;
    value: string;
  };
  type: string;
  x: number;
  y: number;
};

watch(
  () => {
    return props.saveflag
  },
  () => {
    graphData = lf.getGraphData();
    data = graphData

    const jsonData = JSON.stringify(graphData);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  }
)


const initlf = () => {
  // 画布基础配置
  const mylf = new LogicFlow({
    container: container.value,
    plugins: [Menu, MiniMap, Snapshot],
    stopScrollGraph: true,
    stopZoomGraph: true,
    keyboard: {
      enabled: true,
    },
    grid: {
      type: 'mesh',
      size: 10,
      config: {
        color: '#ababab',
        thickness: 0.0001,
      },
    },
  });
  lf = mylf

  // 设置主题
  lf.setTheme({
    nodeText: {
      color: '#000000',
      overflowMode: 'ellipsis', //超出显示省略号
      padding: '0 15px',
      fontSize: 14,
    },
  })

  lf.setDefaultEdgeType('line')

  // lf.adapterOut = (data, retainedFields?: string[]) => adapterOut(data, retainedFields)

  registerNode()
}
const adapterOut = (data, retainedFields?: string[]) => {
  console.log("logicFlowData:", data, retainedFields)
  let definitions = {}
  data.nodes.forEach((node: NodeConfig, index: any) => {
    let processNode = {}
    let kkey = `TECHFLOW-${index}`
    processNode[kkey] = {}
    // const processNode = {
    //   kkey: {}, // 如果是xml的属性，json中属性用'-'开头
    // };
    definitions = processNode
  })
  const adapterOutData = {
    "procedure": definitions
  }
  return adapterOutData
}
// 注册自定义节点
const registerNode = () => {
  nodeWithIcon(lf, 'icon-tupian', 'tuxiangyuan')   // 图像源
  nodeWithIcon(lf, 'icon-icon_kuaisupipei', 'pipei')   // 快速匹配
  nodeWithIcon(lf, 'icon-weizhixiuzheng', 'xiuzheng')   // 位置修正
  nodeWithIcon(lf, 'icon-icon', 'jianju')   // 间距检测
  nodeWithIcon(lf, 'icon-BLOB', 'blob')   // blob
  nodeWithIcon(lf, 'icon-calculator-calculate-mathematics-calculation-accou', 'jisuan')   // 变量计算
  nodeWithIcon(lf, 'icon-tiaojianjiance', 'jiance')   // 条件检测
  nodeWithIcon(lf, 'icon-fasongshuju', 'fasong')   // 发送数据
  let currentData = localStorage.getItem(props.currentKey.key)
  lf.render(JSON.parse(currentData))
  flag.value = true
}

onMounted(() => {
  // showGraph();
  initlf()
});

// 拖拽
const mouseDownHandle = (config: any) => {
  lf.dnd.startDrag(config)
}

  </script>
<style scoped lang="scss">
</style>