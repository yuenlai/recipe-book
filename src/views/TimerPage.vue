<template>
  <div class="timer-page">
    <div class="page-header">
      <h1>烹饪计时 ⏱️</h1>
      <p v-if="timers.length > 0">{{ timers.length }} 个计时器</p>
    </div>

    <div v-if="timers.length === 0" class="empty-state">
      <el-empty description="还没有活跃的计时器">
        <el-button type="primary" @click="goHome">去选择食谱</el-button>
      </el-empty>
    </div>

    <div v-else class="timer-grid">
      <CookingTimer
        v-for="timer in timers"
        :key="timer.id"
        :id="timer.id"
        :label="timer.label"
        :duration="timer.duration"
        :remaining="timer.remaining"
        :is-running="timer.isRunning"
        :started-at="timer.startedAt"
        @start="handleStart"
        @pause="handlePause"
        @reset="handleReset"
        @remove="handleRemove"
        @update:remaining="handleUpdateRemaining"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipe'
import CookingTimer from '../components/CookingTimer.vue'

const router = useRouter()
const store = useRecipeStore()

const timers = computed(() => store.timers)

function handleStart(id) {
  store.startTimer(id)
}

function handlePause(id) {
  store.pauseTimer(id)
}

function handleReset(id) {
  store.resetTimer(id)
}

function handleRemove(id) {
  store.removeTimer(id)
}

function handleUpdateRemaining({ id, remaining }) {
  const timer = store.timers.find(t => t.id === id)
  if (timer) {
    timer.remaining = remaining
  }
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.timer-page {
  padding-bottom: 40px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  padding-top: 20px;
}

.page-header h1 {
  font-size: 32px;
  color: #3D3D3D;
  margin-bottom: 8px;
}

.page-header p {
  color: #757575;
  font-size: 16px;
}

.timer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.empty-state {
  padding: 80px 0;
}

@media (max-width: 600px) {
  .timer-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-header h1 {
    font-size: 24px;
  }
}
</style>
