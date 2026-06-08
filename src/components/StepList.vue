<template>
  <div class="step-list">
    <div class="section-header">
      <h3 class="section-title">
        <el-icon><SetUp /></el-icon>
        烹饪步骤
      </h3>
      <div v-if="hasProgress" class="progress-badge">
        <el-icon><Warning /></el-icon>
        <span>进行中 · 第 {{ currentProgressStep + 1 }} 步</span>
      </div>
    </div>

    <div class="steps">
      <div
        v-for="step in steps"
        :key="step.order"
        :class="['step-item', {
          completed: completedSteps.includes(step.order - 1),
          'current-step': currentProgressStep === step.order - 1
        }]"
        @click="toggleStep(step.order - 1)"
      >
        <div class="step-number" :class="{ done: completedSteps.includes(step.order - 1) }">
          <el-icon v-if="completedSteps.includes(step.order - 1)"><Check /></el-icon>
          <span v-else>{{ step.order }}</span>
        </div>

        <div class="step-content">
          <p class="step-description">{{ step.description }}</p>
          <div v-if="step.tip" class="step-tip">
            <el-icon><InfoFilled /></el-icon>
            <span>{{ step.tip }}</span>
          </div>
        </div>

        <div v-if="currentProgressStep === step.order - 1" class="current-indicator">
          <span class="pulse-dot"></span>
          <span>当前步骤</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRecipeStore } from '../stores/recipe'

const props = defineProps({
  steps: {
    type: Array,
    required: true
  },
  recipeId: {
    type: [Number, String],
    default: null
  }
})

const store = useRecipeStore()

const completedSteps = ref([])

const hasProgress = computed(() => {
  if (!props.recipeId) return false
  return store.hasCookingProgress(props.recipeId)
})

const currentProgressStep = computed(() => {
  if (!props.recipeId) return -1
  const progress = store.getCookingProgress(props.recipeId)
  return progress?.currentStepIndex ?? -1
})

function loadProgress() {
  if (!props.recipeId) return
  const progress = store.getCookingProgress(props.recipeId)
  if (progress?.completedSteps) {
    completedSteps.value = [...progress.completedSteps]
  }
}

function saveProgress() {
  if (!props.recipeId) return
  const existing = store.getCookingProgress(props.recipeId) || {
    currentStepIndex: 0,
    isStarted: false,
    isFinished: false,
    stepTimerActualDuration: {},
    timerRemaining: 0,
    timerRunning: false,
    timerFinished: false
  }
  store.saveCookingProgress(props.recipeId, {
    ...existing,
    completedSteps: completedSteps.value
  })
}

function toggleStep(index) {
  if (completedSteps.value.includes(index)) {
    completedSteps.value = completedSteps.value.filter(i => i !== index)
  } else {
    completedSteps.value.push(index)
  }
  saveProgress()
}

watch(() => props.recipeId, () => {
  loadProgress()
})

onMounted(() => {
  loadProgress()
})
</script>

<style scoped>
.step-list {
  margin: 24px 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #3D3D3D;
  margin: 0;
}

.progress-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #FFF3E0;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #E65100;
  animation: pulse 2s infinite;
}

.progress-badge .el-icon {
  font-size: 16px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #FAFAFA;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  position: relative;
  align-items: flex-start;
}

.step-item:hover {
  background: #FFF8F0;
  border-left-color: #FF6B35;
}

.step-item.completed {
  background: #F0FFF0;
  border-left-color: #4CAF50;
}

.step-item.completed .step-description {
  text-decoration: line-through;
  opacity: 0.6;
}

.step-item.current-step {
  background: #FFF8E7;
  border-left-color: #FF6B35;
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.15);
  transform: translateX(4px);
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #FF6B35;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.step-number.done {
  background: #4CAF50;
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-description {
  font-size: 15px;
  line-height: 1.6;
  color: #3D3D3D;
  margin-bottom: 4px;
}

.step-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 8px 12px;
  background: #FFF3E0;
  border-radius: 8px;
  font-size: 13px;
  color: #E65100;
}

.current-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #FF6B35;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  color: white;
  flex-shrink: 0;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: white;
  animation: pulseDot 1.5s infinite;
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
</style>
