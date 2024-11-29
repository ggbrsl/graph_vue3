<template>
  <div class="panelLayout">
    <a-tooltip title="放大" placement="left">
      <svg-icon
        class="svgIcon"
        iconName="icon-ZoomIn"
        @click="zoomIn"
      ></svg-icon>
    </a-tooltip>
    <a-tooltip title="缩小" placement="left">
      <svg-icon
        class="svgIcon"
        iconName="icon-ZoomOut"
        @click="zoomOut"
      ></svg-icon>
    </a-tooltip>
    <a-tooltip title="大小适应" placement="left">
      <svg-icon
        class="svgIcon"
        iconName="icon-Aim"
        @click="zoomReset"
      ></svg-icon>
    </a-tooltip>
    <a-tooltip title="定位还原" placement="left">
      <svg-icon
        class="svgIcon"
        iconName="icon-refresh"
        @click="reset"
      ></svg-icon>
    </a-tooltip>
    <a-tooltip title="上一步" placement="left">
      <svg-icon
        class="svgIcon"
        iconName="icon-d-arrow-left"
        @click="undo"
      ></svg-icon>
    </a-tooltip>
    <a-tooltip title="下一步" placement="left">
      <svg-icon
        class="svgIcon"
        iconName="icon-d-arrow-right"
        @click="redo"
      ></svg-icon>
    </a-tooltip>
    <a-tooltip title="小地图" placement="left">
      <svg-icon
        class="svgIcon"
        iconName="icon-MapLocation"
        @click="miniMap"
      ></svg-icon>
    </a-tooltip>
    <a-tooltip title="下载json文件" placement="left">
      <svg-icon
        class="svgIcon"
        iconName="icon-download"
        @click="download"
      ></svg-icon>
    </a-tooltip>
    <a-tooltip title="保存" placement="left">
      <svg-icon
        class="svgIcon"
        iconName="icon-FolderChecked"
        @click="save"
      ></svg-icon>
    </a-tooltip>
  </div>
</template>
<script lang="ts" setup>
import { useStore, mapState } from 'vuex'
import { GETIMAGEBLOB } from '@/store/mutation-types'
import { computed, ref } from 'vue'
import { message } from 'ant-design-vue';
import moment from "moment";
const props = defineProps({
  lf: Object,
  currentKey: Object
})


const store = useStore()

const zoomIn = () => {
  props.lf.zoom(true)
}

const zoomOut = () => {
  props.lf.zoom(false)
}

const zoomReset = () => {
  props.lf.resetZoom()
}

const reset = () => {
  props.lf.resetZoom()
  props.lf.resetTranslate()
}

const undo = () => {
  props.lf.undo()
}

const redo = () => {
  props.lf.redo()
}

const miniMap = () => {
  props.lf.extension.miniMap.show(props.lf.graphModel.width - 155, props.lf.graphModel.height - 225)
}

const download = () => {
  //   props.lf.extension.snapshot.customCssRules = `
  //     .lf-canvas-overlay {
  //       background: #f0f4fb;
  //     }
  //   `;
  //   props.lf.getSnapshot();

  let data = props.lf.getGraphData()
  console.log("ddddata:", data)
  let nodes = data.nodes
  let edges = data.edges

  if (props.currentKey.key !== '0') {
    let definitions = {}
    let technics = {}
    nodes.forEach((node: any, index: any) => {
      let techPredependency = []
      edges.forEach((edge: any, i: any) => {
        if (node.id == edge.targetNodeId) {
          let index = nodes.findIndex(obj => obj.id == edge.sourceNodeId)
          techPredependency.push(`TECH-${index + 1}`)
        }
      })

      technics[`TECH-${index + 1}`] = {
        "type": node.text.value,
        "techDesc": node.text.value,
        "techPredependency": techPredependency,
        "params": {
          "": ""
        }
      }
    })
    definitions["technics"] = technics
    // tabMap[props.currentKey.title] = definitions
    console.log("definitions:", definitions)
    localStorage.setItem(props.currentKey.title, JSON.stringify(definitions))

    // 下载
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const jsonData = JSON.stringify(definitions);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${time}_file.json`;
    a.click();
    URL.revokeObjectURL(url);
  } else {
    let definitions = {}
    let procedure = {}
    nodes.forEach((node: any, index: any) => {
      let techPredependency = []
      edges.forEach((edge: any, i: any) => {
        if (node.id == edge.targetNodeId) {
          let index = nodes.findIndex(obj => obj.id == edge.sourceNodeId)
          techPredependency.push(`TECHFLOW-${index + 1}`)
        }
      })

      procedure[`TECHFLOW-${index + 1}`] = {
        "techFlowDesc": node.text.value,
        "techFlowPredependency": techPredependency,
        "technics": JSON.parse(localStorage.getItem(node.text.value)),
        "type": `technics flow ${index + 1}`
      }
    })
    definitions["procedure"] = procedure
    console.log("definitions:", definitions)

    // 下载
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const jsonData = JSON.stringify(definitions);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${time}_file.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

};

const save = () => {
  let data = props.lf.getGraphData()
  let nodes = data.nodes
  let edges = data.edges
  console.log("data:", data)
  const jsonData = JSON.stringify(data);
  //   localStorage.setItem(props.currentKey.key, jsonData)
  console.log("save:", jsonData)

  //   props.lf.adapterOut = (data, retainedFields?: string[]) => adapterOut(data, retainedFields)

  //   let ddata = props.lf.getGraphData()
  //   console.log("ddata:", ddata)

  if (props.currentKey.key !== '0') {

    let definitions = {}
    let technics = {}
    nodes.forEach((node: any, index: any) => {
      let techPredependency = []
      edges.forEach((edge: any, i: any) => {
        if (node.id == edge.targetNodeId) {
          let index = nodes.findIndex(obj => obj.id == edge.sourceNodeId)
          techPredependency.push(`TECH-${index + 1}`)
        }
      })

      technics[`TECH-${index + 1}`] = {
        "type": node.text.value,
        "techDesc": node.text.value,
        "techPredependency": techPredependency,
        "params": {
          "": ""
        }
      }
    })
    definitions["technics"] = technics
    // tabMap[props.currentKey.title] = definitions
    console.log("definitions:", definitions)
    localStorage.setItem(props.currentKey.title, JSON.stringify(definitions))

    localStorage.setItem(props.currentKey.key, jsonData)

    const blob = props.lf.getSnapshotBlob('#f0f4fb', 'image/jpeg')   // 获取blob对象
    blob.then(res => {
      console.log("resres:", res)
      const imageUrl = window.URL.createObjectURL(new Blob([res.data], { type: 'image/jpeg' }))
      console.log("getSnapshotBase64:", imageUrl)

      let blobArr = store.state.imageBlob
      blobArr = blobArr.filter((item: any) => item.key !== props.currentKey.key)
      blobArr.push({ key: props.currentKey.key, name: props.currentKey.title, blob: imageUrl })
      store.commit(GETIMAGEBLOB, blobArr)
      localStorage.setItem("imageBlob", JSON.stringify(blobArr))
    })
  }


  message.success('保存成功');
}

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


</script>

<style lang="scss" scoped>
.panelLayout {
  height: 270px;
  width: 30px;
  background: #f3f5f8;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  top: 6px;
  right: 10px;
  z-index: 999;
  padding: 4px 0;
  box-shadow: 3px 0 10px 1px rgb(228, 224, 219);
  .svgIcon {
    cursor: pointer;
  }
  .svgIcon::after {
    content: attr(13);
    position: absolute;
    white-space: nowrap;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #f9f9f9;
    color: #000;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.3s linear, top 0.3s linear;
  }

  .svgIcon:hover::after {
    visibility: visible;
    opacity: 1;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>