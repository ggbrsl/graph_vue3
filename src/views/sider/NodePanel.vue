<template>
  <div class="layout" v-show="!(imageBlob.length==0&&currentKey.key == '0')">
    <!-- <svg-icon
      :iconName="item.icon"
      v-if="currentKey == '0'"
      v-for="item in list2"
      style="width: 40px; height: 40px; cursor: pointer"
      @mousedown="mousedownFunc(item.type)"
    ></svg-icon> -->
    <img
      draggable="false"
      width="50"
      height="50"
      :src="item.blob"
      v-for="item in imageBlob"
      v-if="currentKey.key == '0'"
      :alt="currentKey.title"
      @mousedown="mousedownFunc2(item.key)"
    ></img>
    <svg-icon
      :iconName="item.icon"
      v-else
      v-for="item in list"
      style="width: 40px; height: 40px; cursor: pointer"
      @mousedown="mousedownFunc(item.type)"
    ></svg-icon>
  </div>
</template>

<script lang="ts">
import Vue, { defineComponent, reactive, toRefs, watch, ref, onMounted } from 'vue'
import { randomNumber } from '@/utils/index'
import LogicFlow from '@logicflow/core';
import { useStore } from 'vuex'
import nodeWithImage from '@/views/registerNode/nodeWithImage/nodeWithImage'
export default defineComponent({
  props: {
    // saveflag: Boolean
    lf: Object,
    currentKey: Object
  },
  setup(props, context) {
    const state = reactive({
      list: [
        {
          icon: "icon-tupian",
          type: "tuxiangyuan"
        },
        {
          icon: "icon-icon_kuaisupipei",
          type: "pipei"
        },
        {
          icon: "icon-weizhixiuzheng",
          type: "xiuzheng"
        },
        {
          icon: "icon-icon",
          type: "jianju"
        },
        {
          icon: "icon-BLOB",
          type: "blob"
        },
        {
          icon: "icon-calculator-calculate-mathematics-calculation-accou",
          type: "jisuan"
        },
        {
          icon: "icon-tiaojianjiance",
          type: "jiance"
        },
        {
          icon: "icon-fasongshuju",
          type: "fasong"
        },
      ],
      list2: [],
      dragRow: { type: '' },
      dragRow2: { type: '' },
      imageBlob: []
    })

    let randomNum = ref(null);

    onMounted(() => {
      console.log("imageBlob:", localStorage.getItem('imageBlob'))
      // state.imageBlob = JSON.parse(localStorage.getItem('imageBlob')) ? JSON.parse(localStorage.getItem('imageBlob')) : []
    })

    const store = useStore()
    store.watch(
      (state) => state.imageBlob,
      (newV) => {
        // localStorage.setItem("imageBlob", newV)
        state.imageBlob = [...newV]
        newV.forEach((item: any, index: any) => {
          nodeWithImage(props.lf, item.blob, item.key)
        })
      }
    )

    const mousedownFunc = (val: any) => {
      state.dragRow.type = val
      randomNum.value = randomNumber()
      props.lf.dnd.startDrag({
        type: val,
        text: "新建节点"
      })
    };

    const mousedownFunc2 = (val: any) => {
      let title = ''
      state.imageBlob.forEach(item => {
        if (item.key === val) {
          title = item.name
        }
      })
      state.dragRow.type = val
      randomNum.value = randomNumber()
      props.lf.dnd.startDrag({
        type: val,
        text: title
      })
    };

    return {
      ...toRefs(state),
      mousedownFunc,
      mousedownFunc2
    }
  }
})
</script>
<style lang="scss" scoped>
.layout {
  position: absolute;
  z-index: 800;
  left: 20px;
  top: 20px;
  width: 80px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  gap: 20px;
  border-radius: 10px;
  padding: 10px;
  background-color: white;
  box-shadow: 0 0 10px 1px rgb(228, 224, 219);
  border-radius: 6px;
}
svg-icon {
  width: 100px;
  height: 100px;
}
</style>