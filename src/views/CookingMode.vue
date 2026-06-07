<template>
  <div v-if="recipe" class="cooking-mode" :class="{ 'mode-active': isStarted }">
    <div class="cooking-header">
      <el-button class="exit-btn" circle @click="exitMode">
        <el-icon><Close /></el-icon>
      </el-button>
      <div class="recipe-info">
        <span class="recipe-emoji">{{ recipe.emoji }}</span>
        <span class="recipe-name">{{ recipe.name }}</span>
      </div>
      <div class="progress-indicator">
        {{ currentStepIndex + 1 }} / {{ totalSteps }}
      </div>
    </div>

    <div class="steps-progress-bar">
      <div
        v-for="(step, index) in recipe.steps"
        :key="step.order"
        :class="['progress-dot', {
          completed: index < currentStepIndex,
          active: index === currentStepIndex
        }]"
      />
    </div>

    <div class="step-content" :style="{ borderTopColor: recipe.coverColor }">
      <div v-if="!isStarted" class="start-screen">
        <div class="start-emoji">{{ recipe.emoji }}</div>
        <h1>准备开始做<br/>{{ recipe.name }}</h1>
        <p class="start-desc">共 {{ totalSteps }} 个步骤，预计用时 {{ formatDuration(totalDuration) }}</p>
        <el-button type="primary" size="large" class="start-btn" @click="startCooking">
          <el-icon><VideoPlay /></el-icon>
          开始烹饪
        </el-button>
      </div>

      <div v-else-if="isFinished" class="finish-screen">
        <div class="finish-icon">🎉</div>
        <h1>恭喜完成！</h1>
        <p class="finish-desc">{{ recipe.name }} 已经做好啦，享用美食吧！</p>
        <el-button type="primary" size="large" @click="exitMode">
          返回食谱
        </el-button>
      </div>

      <div v-else class="step-display">
        <div class="step-header">
          <div class="step-number" :style="{ backgroundColor: recipe.coverColor }">
            {{ currentStepIndex + 1 }}
          </div>
          <div class="step-duration">
            <el-icon><Timer /></el-icon>
            <span>{{ formatDuration(currentStep.duration) }}</span>
          </div>
        </div>

        <p class="step-description">{{ currentStep.description }}</p>

        <div v-if="currentStep.tip" class="step-tip">
          <el-icon><InfoFilled /></el-icon>
          <span>{{ currentStep.tip }}</span>
        </div>

        <div class="timer-section">
          <div class="timer-display" :class="{ 'timer-running': timerRunning, 'timer-finished': timerFinished }">
            <span class="timer-time">{{ formattedTimerTime }}</span>
            <span class="timer-label">{{ timerLabel }}</span>
          </div>

          <div class="timer-controls">
            <el-button
              v-if="!timerRunning && !timerFinished"
              type="success"
              size="large"
              @click="startTimer"
            >
              <el-icon><VideoPlay /></el-icon>
              开始计时
            </el-button>
            <el-button
              v-else-if="timerRunning"
              type="warning"
              size="large"
              @click="pauseTimer"
            >
              <el-icon><VideoPause /></el-icon>
              暂停
            </el-button>
            <el-button
              v-if="timerFinished"
              type="success"
              size="large"
              @click="nextStep"
            >
              <el-icon><ArrowRight /></el-icon>
              完成此步
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isStarted && !isFinished" class="step-navigation">
      <el-button
        class="nav-btn prev-btn"
        size="large"
        :disabled="currentStepIndex === 0"
        @click="prevStep"
      >
        <el-icon><ArrowLeft /></el-icon>
        上一步
      </el-button>

      <el-button
        v-if="!timerFinished"
        class="nav-btn next-btn"
        size="large"
        type="primary"
        @click="skipStep"
      >
        跳过此步
        <el-icon><ArrowRight /></el-icon>
      </el-button>
      <el-button
        v-else
        class="nav-btn next-btn"
        size="large"
        type="primary"
        @click="nextStep"
      >
        <el-icon><ArrowRight /></el-icon>
        下一步
      </el-button>
    </div>

    <div v-if="showTip" class="tip-overlay" @click="showTip = false">
      <div class="tip-content" @click.stop>
        <el-icon class="tip-icon"><InfoFilled /></el-icon>
        <p>{{ tipMessage }}</p>
        <el-button type="primary" size="large" @click="showTip = false">知道了</el-button>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <el-empty description="食谱不存在">
      <el-button type="primary" @click="goBack">返回首页</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipe'
import { ElNotification } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = useRecipeStore()

const recipe = computed(() => store.getRecipeById(route.params.id))

const currentStepIndex = ref(0)
const isStarted = ref(false)
const isFinished = ref(false)

const timerRunning = ref(false)
const timerFinished = ref(false)
const timerRemaining = ref(0)
const timerStartRemaining = ref(0)
let timerInterval = null

const showTip = ref(false)
const tipMessage = ref('')

const recordedStepIndices = ref(new Set())
const stepTimerActualDuration = ref({})

const totalSteps = computed(() => recipe.value?.steps?.length || 0)

const totalDuration = computed(() => {
  if (!recipe.value) return 0
  return recipe.value.steps.reduce((sum, step) => sum + step.duration, 0)
})

const currentStep = computed(() => {
  if (!recipe.value || !recipe.value.steps) return null
  return recipe.value.steps[currentStepIndex.value]
})

const formattedTimerTime = computed(() => {
  const mins = Math.floor(timerRemaining.value / 60)
  const secs = Math.floor(timerRemaining.value % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

const timerLabel = computed(() => {
  if (timerFinished.value) return '时间到！'
  if (timerRunning.value) return '正在计时...'
  if (timerRemaining.value > 0 && timerRemaining.value !== currentStep.value?.duration) return '已暂停'
  return '点击开始计时'
})

function formatDuration(seconds) {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
  }
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) return `${secs}秒`
  return secs > 0 ? `${mins}分${secs}秒` : `${mins}分钟`
}

function startCooking() {
  isStarted.value = true
  if (currentStep.value) {
    timerRemaining.value = currentStep.value.duration
  }
  speak(currentStep.value?.description)
}

function startTimer() {
  if (timerRemaining.value <= 0) return
  timerRunning.value = true
  timerFinished.value = false
  timerStartRemaining.value = timerRemaining.value

  const startTime = Date.now()
  const startRemaining = timerRemaining.value

  timerInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000
    timerRemaining.value = Math.max(0, startRemaining - elapsed)

    if (timerRemaining.value <= 0) {
      stopTimer()
      timerFinished.value = true
      playBeep()
      ElNotification({
        title: '⏰ 时间到！',
        message: `第 ${currentStepIndex.value + 1} 步完成了`,
        type: 'success',
        duration: 5000
      })
      speak('时间到，请进行下一步')
    }
  }, 100)
}

function pauseTimer() {
  stopTimer()
  timerRunning.value = false
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function playBeep() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.frequency.value = 880
    oscillator.type = 'sine'
    gainNode.gain.value = 0.3

    oscillator.start()
    setTimeout(() => {
      oscillator.stop()
      audioCtx.close()
    }, 800)
  } catch (e) {
    console.log('Audio not available')
  }
}

function speak(text) {
  if ('speechSynthesis' in window && text) {
    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    } catch (e) {
      console.log('Speech not available')
    }
  }
}

function recordCurrentStepTimer(skipped = false) {
  const stepIdx = currentStepIndex.value
  if (recordedStepIndices.value.has(stepIdx)) {
    return
  }

  const step = currentStep.value
  if (!step) return

  const actualDuration = stepTimerActualDuration.value[stepIdx] !== undefined
    ? stepTimerActualDuration.value[stepIdx]
    : (timerStartRemaining.value > 0 ? timerStartRemaining.value - timerRemaining.value : 0)

  const label = skipped
    ? `${recipe.value.name} - 步骤${stepIdx + 1} (已跳过)`
    : `${recipe.value.name} - 步骤${stepIdx + 1}`

  if (timerFinished.value || skipped) {
    store.addCompletedTimer({
      label,
      duration: step.duration,
      recipeId: recipe.value.id,
      skipped,
      actualDuration
    })
  } else if (actualDuration > 0) {
    store.addTimer({
      label,
      duration: step.duration,
      remaining: Math.max(0, step.duration - actualDuration),
      recipeId: recipe.value.id,
      skipped,
      actualDuration
    })
  } else {
    store.addTimer({
      label,
      duration: step.duration,
      recipeId: recipe.value.id,
      skipped,
      actualDuration: 0
    })
  }

  recordedStepIndices.value.add(stepIdx)
  stepTimerActualDuration.value[stepIdx] = actualDuration
}

function advanceStep(skipped = false) {
  stopTimer()
  recordCurrentStepTimer(skipped)

  if (currentStepIndex.value >= totalSteps.value - 1) {
    isFinished.value = true
    speak('恭喜你，所有步骤都完成了！')
    return
  }

  currentStepIndex.value++
  resetStepTimer()
  speak(currentStep.value?.description)

  if (currentStep.value?.tip) {
    tipMessage.value = currentStep.value.tip
    showTip.value = true
  }
}

function nextStep() {
  advanceStep(false)
}

function skipStep() {
  advanceStep(true)
}

function prevStep() {
  if (currentStepIndex.value > 0) {
    stopTimer()
    currentStepIndex.value--
    resetStepTimer()

    const stepIdx = currentStepIndex.value
    if (stepTimerActualDuration.value[stepIdx] !== undefined) {
      const step = currentStep.value
      if (step) {
        timerRemaining.value = Math.max(0, step.duration - stepTimerActualDuration.value[stepIdx])
        if (timerRemaining.value === 0) {
          timerFinished.value = true
        }
      }
    }

    speak(currentStep.value?.description)
  }
}

function resetStepTimer() {
  timerRunning.value = false
  timerFinished.value = false
  if (currentStep.value) {
    timerRemaining.value = currentStep.value.duration
  }
}

function exitMode() {
  stopTimer()
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel()
  }
  router.push(`/recipe/${recipe.value?.id}`)
}

function goBack() {
  router.push('/')
}

function resetAllState() {
  currentStepIndex.value = 0
  isStarted.value = false
  isFinished.value = false
  timerRunning.value = false
  timerFinished.value = false
  timerStartRemaining.value = 0
  recordedStepIndices.value = new Set()
  stepTimerActualDuration.value = {}
  stopTimer()
  if (currentStep.value) {
    timerRemaining.value = currentStep.value.duration
  }
}

watch(() => route.params.id, () => {
  resetAllState()
})

onMounted(() => {
  resetAllState()
})

onUnmounted(() => {
  stopTimer()
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel()
  }
})
</script>

<style scoped>
.cooking-mode {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: -20px;
  position: relative;
  overflow: hidden;
}

.cooking-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.exit-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border: none !important;
  color: white !important;
}

.exit-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
}

.recipe-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.recipe-emoji {
  font-size: 32px;
}

.recipe-name {
  font-size: 20px;
  font-weight: 600;
}

.progress-indicator {
  font-size: 18px;
  font-weight: 600;
  color: #FF6B35;
  font-variant-numeric: tabular-nums;
}

.steps-progress-bar {
  display: flex;
  gap: 4px;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.2);
}

.progress-dot {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.progress-dot.completed {
  background: #4CAF50;
}

.progress-dot.active {
  background: #FF6B35;
  height: 6px;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px 24px;
  border-top: 4px solid #FF6B35;
  overflow-y: auto;
}

.start-screen,
.finish-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 24px;
}

.start-emoji {
  font-size: 120px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.start-screen h1,
.finish-screen h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
}

.start-desc,
.finish-desc {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.start-btn {
  margin-top: 20px;
  min-width: 200px;
  height: 60px;
  font-size: 20px;
  border-radius: 30px;
}

.finish-icon {
  font-size: 100px;
}

.step-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.step-number {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #FF6B35;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  box-shadow: 0 8px 32px rgba(255, 107, 53, 0.4);
}

.step-duration {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 600;
  color: #FFD700;
}

.step-duration .el-icon {
  font-size: 28px;
}

.step-description {
  font-size: 32px;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
  color: white;
}

.step-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 24px;
  background: rgba(255, 193, 7, 0.15);
  border-radius: 16px;
  border-left: 4px solid #FFC107;
}

.step-tip .el-icon {
  font-size: 24px;
  color: #FFC107;
  flex-shrink: 0;
  margin-top: 2px;
}

.step-tip span {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}

.timer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: auto;
  padding: 32px 0;
}

.timer-display {
  text-align: center;
  padding: 32px 48px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.timer-display.timer-running {
  border-color: #4CAF50;
  box-shadow: 0 0 40px rgba(76, 175, 80, 0.3);
}

.timer-display.timer-finished {
  border-color: #FF6B35;
  box-shadow: 0 0 60px rgba(255, 107, 53, 0.5);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.timer-time {
  display: block;
  font-size: 72px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: white;
  line-height: 1;
}

.timer-label {
  display: block;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 12px;
}

.timer-controls {
  display: flex;
  gap: 16px;
}

.timer-controls .el-button {
  min-width: 180px;
  height: 56px;
  font-size: 18px;
  border-radius: 28px;
}

.step-navigation {
  display: flex;
  gap: 16px;
  padding: 20px 24px 40px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.nav-btn {
  flex: 1;
  height: 60px;
  font-size: 18px;
  border-radius: 30px;
}

.prev-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border: none !important;
  color: white !important;
}

.prev-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2) !important;
}

.next-btn {
  height: 60px;
  font-size: 18px;
  border-radius: 30px;
}

.tip-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.tip-content {
  background: linear-gradient(135deg, #2a2a4a 0%, #1e3a5f 100%);
  border-radius: 24px;
  padding: 40px 32px;
  text-align: center;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.tip-icon {
  font-size: 64px;
  color: #FFC107;
}

.tip-content p {
  font-size: 20px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.tip-content .el-button {
  min-width: 160px;
  height: 52px;
  font-size: 18px;
  border-radius: 26px;
  margin-top: 12px;
}

.not-found {
  padding: 80px 0;
  color: #333;
}

@media (max-width: 600px) {
  .step-description {
    font-size: 26px;
  }

  .step-tip span {
    font-size: 18px;
  }

  .timer-time {
    font-size: 56px;
  }

  .start-screen h1,
  .finish-screen h1 {
    font-size: 28px;
  }

  .start-emoji {
    font-size: 80px;
  }

  .step-number {
    width: 64px;
    height: 64px;
    font-size: 28px;
  }

  .recipe-name {
    font-size: 16px;
  }

  .recipe-emoji {
    font-size: 24px;
  }
}
</style>
