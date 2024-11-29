<template>
  <div style="height: calc(100vh)">
    <a-tabs
      v-model:activeKey="activeKey"
      type="editable-card"
      @edit="onEdit"
      @dblclick="dbClick(activeKey)"
    >
      <a-tab-pane
        v-for="pane in panes"
        :key="pane.key"
        :closable="pane.closable"
      >
        <template #tab>
          <a-input
            v-model:value="pane.title"
            v-if="pane.tabslot"
            @pressEnter="inputEnter(pane.key, pane.title)"
          />
          <div v-else>{{ pane.title }}</div>
        </template>
        <!-- <Sider /> -->
        <GraphPage
          :currentKey="pane"
          @dataPass="dataPass"
          :saveflag="saveflag"
        />
      </a-tab-pane>
      <!-- <template #rightExtra>
        <a-button class="btn" @click="save">保存</a-button>
      </template> -->
    </a-tabs>
  </div>
</template>
  <script lang="ts" setup>
import { Options } from "vue-class-component";
import { defineComponent, reactive, ref, onMounted } from 'vue';
import GraphPage from '../canvas/index.vue'
import { useStore } from 'vuex'
import { GETIMAGEBLOB } from '@/store/mutation-types'

// import Sider from '../sider/index.vue'

let panes = ref<{ title: string; key: string; closable?: boolean; tabslot?: boolean }[]>([
  { title: '总流程', key: '0', closable: false, tabslot: false },
  { title: '工艺流 1', key: '1', tabslot: false },
  { title: '工艺流 2', key: '2', tabslot: false },
  { title: '工艺流 3', key: '3', tabslot: false },
]);

const activeKey = ref(panes.value[1].key);
const saveflag = ref(true)
const newTabIndex = ref(0);

const store = useStore()

const add = () => {
  activeKey.value = `newTab${++newTabIndex.value}`;
  panes.value.push({ title: 'New Tab', key: activeKey.value });
  localStorage.setItem(activeKey.value, JSON.stringify({}))
  console.log(panes)
};

const remove = (targetKey: string) => {
  let lastIndex = 0;
  panes.value.forEach((pane, i) => {
    if (pane.key === targetKey) {
      lastIndex = i - 1;
    }
  });
  panes.value = panes.value.filter(pane => pane.key !== targetKey);
  if (panes.value.length && activeKey.value === targetKey) {
    if (lastIndex >= 0) {
      activeKey.value = panes.value[lastIndex].key;
    } else {
      activeKey.value = panes.value[0].key;
    }
  }
  localStorage.removeItem(targetKey)
  //   删除总流程对应工艺
  let blobArr = store.state.imageBlob
  blobArr = blobArr.filter((item: any) => item.key !== targetKey)
  store.commit(GETIMAGEBLOB, blobArr)
  localStorage.setItem("imageBlob", JSON.stringify(blobArr))
};

const onEdit = (targetKey: string | MouseEvent, action: string) => {
  if (action === 'add') {
    add();
  } else {
    remove(targetKey as string);
  }
};

const save = () => {
  //   localStorage.setItem('panes', panes)
};

const dataPass = (data: any) => {
  console.log("datapass:", data)
};

const dbClick = (targetKey: any) => {
  panes.value.forEach((pane, i) => {
    if (pane.key === targetKey) {
      pane.tabslot = true
    }
  });
}

const inputEnter = (targetKey: any, title: any) => {
  console.log("aaaaaaaa:", targetKey, title)
  panes.value.forEach((pane, i) => {
    if (pane.key === targetKey) {
      pane.title = title
      pane.tabslot = false
    }
  });

}

const inputChange = (e: any) => {
  console.log(e)
}
  </script>
  <style scoped>
.btn {
  margin-right: 16px;
}
</style>
  
  