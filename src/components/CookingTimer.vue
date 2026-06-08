<template>
  <div :class="['cooking-timer', { completed, skipped }]">
    <div class="timer-display">
      <svg class="timer-ring" viewBox="0 0 100 100">
        <circle
          class="ring-bg"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke-width="6"
        />
        <circle
          class="ring-progress"
          :class="{ completed, skipped }"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke-width="6"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div class="timer-info">
        <span class="timer-time">{{ displayTime }}</span>
        <span class="timer-label">{{ displayLabel }}</span>
        <div v-if="completed" class="status-badge success">
          <el-icon><Check /></el-icon> 已完成
        </div>
        <div v-else-if="skipped" class="status-badge warning">
          <el-icon><Warning /></el-icon> 已跳过
        </div>
        <div v-if="completed && completedTimeText" class="completed-time">
          {{ completedTimeText }}
        </div>
      </div>
    </div>

    <div class="timer-controls">
      <template v-if="!completed && !skipped">
        <el-button
          v-if="!isRunning"
          type="success"
          circle
          @click="start"
        >
          <el-icon><VideoPlay /></el-icon>
        </el-button>
        <el-button
          v-else
          type="warning"
          circle
          @click="pause"
        >
          <el-icon><VideoPause /></el-icon>
        </el-button>
        <el-button type="info" circle @click="reset">
          <el-icon><RefreshRight /></el-icon>
        </el-button>
      </template>
      <template v-else>
        <el-button type="info" circle @click="reset">
          <el-icon><RefreshRight /></el-icon>
        </el-button>
      </template>
      <el-button type="danger" circle @click="remove">
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted, watch } from 'vue'
import { useRecipeStore } from '../stores/recipe'

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  remaining: {
    type: Number,
    required: true
  },
  isRunning: {
    type: Boolean,
    default: false
  },
  startedAt: {
    type: Number,
    default: null
  },
  completed: {
    type: Boolean,
    default: false
  },
  skipped: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['start', 'pause', 'reset', 'remove', 'update:remaining', 'complete'])

const store = useRecipeStore()
const localRemaining = ref(props.remaining)
const intervalId = ref(null)
const hasCompleted = ref(false)

const circumference = 2 * Math.PI * 45
const progress = computed(() => localRemaining.value / props.duration)
const dashOffset = computed(() => circumference * (1 - progress.value))

const formattedTime = computed(() => {
  const mins = Math.floor(localRemaining.value / 60)
  const secs = Math.floor(localRemaining.value % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

const displayTime = computed(() => {
  if (props.completed) {
    return '✓ 完成'
  }
  if (props.skipped) {
    return '⏭ 跳过'
  }
  return formattedTime.value
})

const displayLabel = computed(() => {
  return props.label
})

const completedTimeText = computed(() => {
  if (!props.completedAt) return ''
  const date = new Date(props.completedAt)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return `${diff}秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
})

watch(() => props.remaining, (val) => {
  localRemaining.value = val
})

watch(() => props.isRunning, (running) => {
  if (running) {
    startInterval()
  } else {
    stopInterval()
  }
}, { immediate: true })

watch(() => props.completed, (val) => {
  if (val) {
    stopInterval()
    localRemaining.value = 0
  }
})

function startInterval() {
  stopInterval()
  hasCompleted.value = false
  const startTime = Date.now()
  const startRemaining = localRemaining.value

  intervalId.value = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000
    localRemaining.value = Math.max(0, startRemaining - elapsed)

    if (localRemaining.value <= 0 && !hasCompleted.value) {
      hasCompleted.value = true
      stopInterval()
      store.completeTimer(props.id)
      emit('complete', props.id)
    }
  }, 100)
}

function stopInterval() {
  if (intervalId.value) {
    clearInterval(intervalId.value)
    intervalId.value = null
  }
}

function start() {
  emit('start', props.id)
}

function pause() {
  stopInterval()
  emit('pause', props.id)
  emit('update:remaining', { id: props.id, remaining: localRemaining.value })
}

function reset() {
  stopInterval()
  hasCompleted.value = false
  localRemaining.value = props.duration
  emit('reset', props.id)
}

function remove() {
  stopInterval()
  emit('remove', props.id)
}

onUnmounted(() => {
  stopInterval()
})
</script>

<style scoped>
.cooking-timer {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.timer-display {
  position: relative;
  width: 140px;
  height: 140px;
}

.timer-ring {
  width: 100%;
  height: 100%;
}

.ring-bg {
  stroke: #F0F0F0;
}

.ring-progress {
  stroke: #FF6B35;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.1s linear;
}

.timer-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.timer-time {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #3D3D3D;
  font-variant-numeric: tabular-nums;
}

.timer-label {
  display: block;
  font-size: 11px;
  color: #757575;
  margin-top: 4px;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timer-controls {
  display: flex;
  gap: 8px;
}

.cooking-timer.completed {
  border: 2px solid #4CAF50;
  background: linear-gradient(135deg, #F1F8E9 0%, #E8F5E9 100%);
}

.cooking-timer.skipped {
  border: 2px solid #FF9800;
  background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
}

.ring-progress.completed {
  stroke: #4CAF50;
}

.ring-progress.skipped {
  stroke: #FF9800;
}

.completed .timer-time {
  color: #4CAF50;
}

.skipped .timer-time {
  color: #FF9800;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: 6px;
  font-weight: 600;
}

.status-badge.success {
  background: #4CAF50;
  color: white;
}

.status-badge.warning {
  background: #FF9800;
  color: white;
}

.completed-time {
  font-size: 10px;
  color: #9E9E9E;
  margin-top: 4px;
}
</style>
