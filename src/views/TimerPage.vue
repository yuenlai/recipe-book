<template>
  <div class="timer-page">
    <div class="page-header">
      <h1>烹饪计时 ⏱️</h1>
      <p v-if="timers.length > 0">共 {{ timers.length }} 个计时器</p>
    </div>

    <div v-if="timers.length === 0" class="empty-state">
      <el-empty description="还没有计时器记录">
        <el-button type="primary" @click="goHome">去选择食谱</el-button>
      </el-empty>
    </div>

    <div v-else>
      <div v-if="pendingTimers.length > 0" class="timer-section">
        <h3 class="section-title">进行中</h3>
        <div class="timer-grid">
          <CookingTimer
            v-for="timer in pendingTimers"
            :key="timer.id"
            :id="timer.id"
            :label="timer.label"
            :duration="timer.duration"
            :remaining="timer.remaining"
            :is-running="timer.isRunning"
            :started-at="timer.startedAt"
            :completed="timer.completed"
            :skipped="timer.skipped"
            :completed-at="timer.completedAt"
            @start="handleStart"
            @pause="handlePause"
            @reset="handleReset"
            @remove="handleRemove"
            @update:remaining="handleUpdateRemaining"
          />
        </div>
      </div>

      <div v-if="completedTimers.length > 0" class="timer-section">
        <div class="section-header">
          <h3 class="section-title completed">已完成 ({{ completedTimers.length }})</h3>
          <el-button
            type="danger"
            plain
            size="small"
            @click="handleClearCompleted"
          >
            <el-icon><Delete /></el-icon>
            一键清除已完成
          </el-button>
        </div>
        <div class="timer-grid">
          <CookingTimer
            v-for="timer in completedTimers"
            :key="timer.id"
            :id="timer.id"
            :label="timer.label"
            :duration="timer.duration"
            :remaining="timer.remaining"
            :is-running="timer.isRunning"
            :started-at="timer.startedAt"
            :completed="timer.completed"
            :skipped="timer.skipped"
            :completed-at="timer.completedAt"
            @start="handleStart"
            @pause="handlePause"
            @reset="handleReset"
            @remove="handleRemove"
            @update:remaining="handleUpdateRemaining"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRecipeStore } from '../stores/recipe'
import CookingTimer from '../components/CookingTimer.vue'

const router = useRouter()
const store = useRecipeStore()

const timers = computed(() => store.timers)
const pendingTimers = computed(() => store.pendingTimers)
const completedTimers = computed(() => store.completedTimers)

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
  store.updateTimerRemaining(id, remaining)
}

async function handleClearCompleted() {
  try {
    await ElMessageBox.confirm(
      `确定要清除所有 ${completedTimers.value.length} 个已完成的计时器吗？`,
      '清除确认',
      {
        confirmButtonText: '确定清除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    store.clearCompletedTimers()
    ElMessage.success(`已清除 ${completedTimers.value.length} 个已完成计时器`)
  } catch {
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

.timer-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 4px solid #FF6B35;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title.completed {
  border-left-color: #4CAF50;
  color: #4CAF50;
  margin-bottom: 0;
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
