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
        <template v-if="currentPhase === 'cook'">
          {{ currentStepIndex + 1 }} / {{ totalSteps }}
        </template>
        <template v-else>
          {{ checkedIngredientCount }} / {{ recipe.ingredients.length }}
        </template>
      </div>
    </div>

    <div class="phase-tabs">
      <div
        :class="['phase-tab', { active: currentPhase === 'prep' }]"
        @click="switchPhase('prep')"
      >
        <el-icon><ShoppingCart /></el-icon>
        <span>准备食材</span>
        <div v-if="allIngredientsChecked" class="phase-done">
          <el-icon><Check /></el-icon>
        </div>
      </div>
      <div class="phase-divider"></div>
      <div
        :class="['phase-tab', { active: currentPhase === 'cook', disabled: !canStartCooking }]"
        @click="trySwitchToCook"
      >
        <el-icon><VideoPlay /></el-icon>
        <span>烹饪步骤</span>
        <div v-if="cookingProgress > 0" class="phase-progress">
          {{ Math.round(cookingProgress) }}%
        </div>
      </div>
    </div>

    <transition name="slide-fade" mode="out-in">
      <div v-if="currentPhase === 'prep'" key="prep" class="phase-content prep-phase">
        <div v-if="!isStarted" class="start-screen">
          <div class="start-emoji">{{ recipe.emoji }}</div>
          <h1>准备开始做<br />{{ recipe.name }}</h1>
          <p class="start-desc">
            共 {{ recipe.ingredients.length }} 种食材，{{ totalSteps }} 个步骤
          </p>
          <div class="prep-stats">
            <div class="prep-stat">
              <el-icon><Timer /></el-icon>
              <span>准备 {{ recipe.prepTime }} 分钟</span>
            </div>
            <div class="prep-stat">
              <el-icon><Dish /></el-icon>
              <span>烹饪 {{ recipe.cookTime }} 分钟</span>
            </div>
          </div>
          <el-button type="primary" size="large" class="start-btn" @click="startPrep">
            <el-icon><ShoppingCart /></el-icon>
            开始准备食材
          </el-button>
        </div>

        <div v-else class="prep-content">
          <div class="prep-header">
            <h2>
              <el-icon><List /></el-icon>
              请准备以下食材
            </h2>
            <div class="prep-progress-info">
              <span>已准备 {{ checkedIngredientCount }} / {{ recipe.ingredients.length }}</span>
              <el-tag :type="allIngredientsChecked ? 'success' : 'warning'" size="small">
                {{ allIngredientsChecked ? '全部完成' : '进行中' }}
              </el-tag>
            </div>
          </div>

          <div class="prep-progress-bar">
            <div
              class="prep-progress-fill"
              :style="{ width: `${ingredientProgress}%` }"
            ></div>
          </div>

          <div class="ingredient-scroll">
            <IngredientList
              ref="ingredientListRef"
              :ingredients="recipe.ingredients"
              :scale-ratio="1"
              :original-servings="recipe.servings"
              :current-servings="recipe.servings"
              :recipe-id="recipe.id"
              :highlight-related="false"
              @ingredient-change="onIngredientChange"
            />
          </div>

          <div class="prep-actions">
            <el-button
              size="large"
              :type="allIngredientsChecked ? 'success' : 'primary'"
              class="prep-next-btn"
              @click="goToCookPhase"
            >
              <template v-if="allIngredientsChecked">
                <el-icon><Check /></el-icon>
                食材准备完成，开始烹饪
              </template>
              <template v-else>
                <el-icon><ArrowRight /></el-icon>
                跳过准备，直接开始烹饪 ({{ checkedIngredientCount }}/{{ recipe.ingredients.length }})
              </template>
            </el-button>
          </div>
        </div>
      </div>

      <div v-else key="cook" class="phase-content cook-phase">
        <div v-if="isFinished" class="finish-screen">
          <div class="finish-icon">🎉</div>
          <h1>恭喜完成！</h1>
          <p class="finish-desc">{{ recipe.name }} 已经做好啦，享用美食吧！</p>
          <el-button type="primary" size="large" @click="exitMode">
            返回食谱
          </el-button>
        </div>

        <div v-else class="cook-content">
          <div class="steps-progress-bar">
            <div
              v-for="(step, index) in recipe.steps"
              :key="step.order"
              :class="[
                'progress-dot',
                {
                  completed: index < currentStepIndex,
                  active: index === currentStepIndex
                }
              ]"
              @click="jumpToStep(index)"
            />
          </div>

          <div class="cook-main">
            <div class="step-section">
              <div class="step-display">
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
                  <div
                    class="timer-display"
                    :class="{
                      'timer-running': timerRunning,
                      'timer-finished': timerFinished
                    }"
                  >
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

            <div class="ingredient-sidebar">
              <div class="sidebar-header">
                <h3>
                  <el-icon><List /></el-icon>
                  本步骤食材
                </h3>
                <span class="sidebar-count">{{ currentStepIngredients.length }} 种</span>
              </div>

              <div v-if="currentStepIngredients.length > 0" class="sidebar-ingredients">
                <div
                  v-for="idx in currentStepIngredientIndices"
                  :key="idx"
                  :class="[
                    'sidebar-ingredient',
                    { checked: isIngredientChecked(idx) }
                  ]"
                  @click="toggleIngredientFromSidebar(idx)"
                >
                  <el-checkbox :model-value="isIngredientChecked(idx)" />
                  <div class="ingredient-info">
                    <span class="ingredient-name">{{ recipe.ingredients[idx].name }}</span>
                    <span class="ingredient-amount">{{ recipe.ingredients[idx].amount }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="sidebar-empty">
                <el-icon><Sunny /></el-icon>
                <span>本步骤不需要额外食材</span>
              </div>

              <div class="sidebar-tip" v-if="uncheckedStepIngredients.length > 0">
                <el-icon><Warning /></el-icon>
                <span>还有 {{ uncheckedStepIngredients.length }} 种食材未准备</span>
              </div>

              <el-button
                class="view-all-btn"
                size="small"
                @click="showAllIngredients = !showAllIngredients"
              >
                <el-icon><component :is="showAllIngredients ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
                {{ showAllIngredients ? '收起' : '查看全部食材' }}
              </el-button>

              <transition name="expand">
                <div v-if="showAllIngredients" class="all-ingredients-panel">
                  <IngredientList
                    :ingredients="recipe.ingredients"
                    :scale-ratio="1"
                    :original-servings="recipe.servings"
                    :current-servings="recipe.servings"
                    :recipe-id="recipe.id"
                    :highlight-related="true"
                    :current-step-index="currentStepIndex"
                  />
                </div>
              </transition>
            </div>
          </div>
        </div>

        <div v-if="!isFinished" class="step-navigation">
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
      </div>
    </transition>

    <div v-if="showTip" class="tip-overlay" @click="showTip = false">
      <div class="tip-content" @click.stop>
        <el-icon class="tip-icon"><InfoFilled /></el-icon>
        <p>{{ tipMessage }}</p>
        <el-button type="primary" size="large" @click="showTip = false">知道了</el-button>
      </div>
    </div>

    <div v-if="showResumeDialog" class="resume-overlay">
      <div class="resume-content">
        <div class="resume-icon">📝</div>
        <h2>发现未完成的烹饪进度</h2>
        <p class="resume-desc">
          上次您在
          <strong>{{ savedProgress?.currentPhase === 'cook' ? '烹饪阶段' : '准备阶段' }}</strong>
          <template v-if="savedProgress?.currentPhase === 'cook'">
            做到了第 <strong>{{ (savedProgress?.currentStepIndex || 0) + 1 }}</strong> 步
          </template>
          <template v-else>
            已准备 <strong>{{ (savedProgress?.checkedIngredients || []).length }}</strong> 种食材
          </template>
        </p>
        <p class="resume-time" v-if="savedProgress?.lastUpdated">
          {{ formatLastUpdated(savedProgress.lastUpdated) }}
        </p>
        <div class="resume-actions">
          <el-button size="large" @click="startNew">重新开始</el-button>
          <el-button type="primary" size="large" @click="resumeCooking">继续上次进度</el-button>
        </div>
      </div>
    </div>

    <div v-if="showPhaseConfirm" class="confirm-overlay" @click="showPhaseConfirm = false">
      <div class="confirm-content" @click.stop>
        <div class="confirm-icon">⚠️</div>
        <h2>还有食材未准备完成</h2>
        <p class="confirm-desc">
          还有 {{ recipe.ingredients.length - checkedIngredientCount }} 种食材未勾选确认，
          确定要直接开始烹饪吗？
        </p>
        <div class="confirm-actions">
          <el-button size="large" @click="showPhaseConfirm = false">继续准备</el-button>
          <el-button type="primary" size="large" @click="forceSwitchToCook">直接开始烹饪</el-button>
        </div>
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipe'
import { ElNotification, ElMessage } from 'element-plus'
import IngredientList from '../components/IngredientList.vue'
import {
  ShoppingCart,
  Check,
  List,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Sunny
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const store = useRecipeStore()

const recipe = computed(() => store.getRecipeById(route.params.id))

const currentPhase = ref('prep')
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

const showResumeDialog = ref(false)
const savedProgress = ref(null)

const showPhaseConfirm = ref(false)
const showAllIngredients = ref(false)

const recordedStepIndices = ref(new Set())
const stepTimerActualDuration = ref({})

const ingredientListRef = ref(null)

const totalSteps = computed(() => recipe.value?.steps?.length || 0)

const totalDuration = computed(() => {
  if (!recipe.value) return 0
  return recipe.value.steps.reduce((sum, step) => sum + step.duration, 0)
})

const currentStep = computed(() => {
  if (!recipe.value || !recipe.value.steps) return null
  return recipe.value.steps[currentStepIndex.value]
})

const checkedIngredientCount = computed(() => {
  if (!recipe.value) return 0
  const checked = store.getCookingIngredientsChecked(recipe.value.id)
  return checked.length
})

const allIngredientsChecked = computed(() => {
  if (!recipe.value) return false
  return checkedIngredientCount.value === recipe.value.ingredients.length
})

const ingredientProgress = computed(() => {
  if (!recipe.value || recipe.value.ingredients.length === 0) return 0
  return (checkedIngredientCount.value / recipe.value.ingredients.length) * 100
})

const cookingProgress = computed(() => {
  if (totalSteps.value === 0) return 0
  return (currentStepIndex.value / totalSteps.value) * 100
})

const canStartCooking = computed(() => {
  return isStarted.value || allIngredientsChecked.value
})

const currentStepIngredientIndices = computed(() => {
  if (!recipe.value || !currentStep.value) return []

  const stepText = (currentStep.value.description + ' ' + (currentStep.value.tip || '')).toLowerCase()
  const indices = []

  recipe.value.ingredients.forEach((ing, idx) => {
    const ingName = ing.name.toLowerCase()
    if (stepText.includes(ingName)) {
      indices.push(idx)
    } else {
      const shortName = ingName.replace(/[肉|片|块|丝|丁|末|个|只|根|颗|粒|片]/g, '')
      if (shortName.length >= 2 && stepText.includes(shortName)) {
        indices.push(idx)
      }
    }
  })

  return indices
})

const currentStepIngredients = computed(() => {
  if (!recipe.value) return []
  return currentStepIngredientIndices.value.map((idx) => recipe.value.ingredients[idx])
})

const uncheckedStepIngredients = computed(() => {
  const checked = store.getCookingIngredientsChecked(recipe.value?.id)
  return currentStepIngredientIndices.value.filter((idx) => !checked.includes(idx))
})

const formattedTimerTime = computed(() => {
  const mins = Math.floor(timerRemaining.value / 60)
  const secs = Math.floor(timerRemaining.value % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

const timerLabel = computed(() => {
  if (timerFinished.value) return '时间到！'
  if (timerRunning.value) return '正在计时...'
  if (timerRemaining.value > 0 && timerRemaining.value !== currentStep.value?.duration)
    return '已暂停'
  return '点击开始计时'
})

function isIngredientChecked(index) {
  const checked = store.getCookingIngredientsChecked(recipe.value?.id)
  return checked.includes(index)
}

function toggleIngredientFromSidebar(index) {
  store.toggleCookingIngredient(recipe.value.id, index)
}

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

function startPrep() {
  isStarted.value = true
  currentPhase.value = 'prep'
  saveProgress()
}

function switchPhase(phase) {
  if (phase === 'cook' && !canStartCooking.value) {
    showPhaseConfirm.value = true
    return
  }
  currentPhase.value = phase
  saveProgress()
}

function trySwitchToCook() {
  if (!canStartCooking.value) {
    showPhaseConfirm.value = true
    return
  }
  switchPhase('cook')
  if (currentStepIndex.value === 0 && !timerFinished.value && currentStep.value) {
    timerRemaining.value = currentStep.value.duration
  }
}

function goToCookPhase() {
  if (!allIngredientsChecked.value) {
    showPhaseConfirm.value = true
    return
  }
  forceSwitchToCook()
}

function forceSwitchToCook() {
  showPhaseConfirm.value = false
  currentPhase.value = 'cook'
  if (currentStep.value) {
    timerRemaining.value = currentStep.value.duration
  }
  saveProgress()
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

  const actualDuration =
    stepTimerActualDuration.value[stepIdx] !== undefined
      ? stepTimerActualDuration.value[stepIdx]
      : timerStartRemaining.value > 0
        ? timerStartRemaining.value - timerRemaining.value
        : 0

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
    saveProgress()
    speak('恭喜你，所有步骤都完成了！')
    return
  }

  currentStepIndex.value++
  resetStepTimer()
  saveProgress()
  speak(currentStep.value?.description)

  if (currentStep.value?.tip) {
    tipMessage.value = currentStep.value.tip
    showTip.value = true
  }

  nextTick(() => {
    const unchecked = uncheckedStepIngredients.value
    if (unchecked.length > 0) {
      const names = unchecked.map((idx) => recipe.value.ingredients[idx].name).join('、')
      ElMessage({
        message: `本步骤需要：${names}`,
        type: 'warning',
        duration: 3000
      })
    }
  })
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

    saveProgress()
    speak(currentStep.value?.description)
  }
}

function jumpToStep(index) {
  if (index < 0 || index >= totalSteps.value) return
  stopTimer()
  currentStepIndex.value = index
  resetStepTimer()
  saveProgress()
  speak(currentStep.value?.description)
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

function onIngredientChange(data) {
  if (data.checked && data.checkedCount === recipe.value?.ingredients.length) {
    ElMessage({
      message: '所有食材已准备完成，点击下方按钮开始烹饪！',
      type: 'success',
      duration: 3000
    })
  }
  saveProgress()
}

function saveProgress() {
  if (!recipe.value) return
  const checkedIngredients = store.getCookingIngredientsChecked(recipe.value.id)
  store.saveCookingProgress(recipe.value.id, {
    currentStepIndex: currentStepIndex.value,
    isStarted: isStarted.value,
    isFinished: isFinished.value,
    completedSteps: Array.from(recordedStepIndices.value),
    stepTimerActualDuration: stepTimerActualDuration.value,
    timerRemaining: timerRemaining.value,
    timerRunning: timerRunning.value,
    timerFinished: timerFinished.value,
    checkedIngredients,
    currentPhase: currentPhase.value
  })
}

function restoreProgress(progress) {
  if (!progress) return
  currentStepIndex.value = progress.currentStepIndex || 0
  isStarted.value = progress.isStarted || false
  isFinished.value = progress.isFinished || false
  currentPhase.value = progress.currentPhase || 'prep'
  recordedStepIndices.value = new Set(progress.completedSteps || [])
  stepTimerActualDuration.value = progress.stepTimerActualDuration || {}
  timerRemaining.value = progress.timerRemaining || (currentStep.value?.duration || 0)
  timerRunning.value = false
  timerFinished.value = progress.timerFinished || false
  showResumeDialog.value = false
  savedProgress.value = null
  if (progress.timerRemaining !== undefined && currentStep.value) {
    timerRemaining.value = Math.max(0, progress.timerRemaining)
  }
}

function resetAllState() {
  currentPhase.value = 'prep'
  currentStepIndex.value = 0
  isStarted.value = false
  isFinished.value = false
  timerRunning.value = false
  timerFinished.value = false
  timerStartRemaining.value = 0
  showAllIngredients.value = false
  recordedStepIndices.value = new Set()
  stepTimerActualDuration.value = {}
  stopTimer()
  if (currentStep.value) {
    timerRemaining.value = currentStep.value.duration
  }
  if (recipe.value) {
    store.uncheckAllCookingIngredients(recipe.value.id)
    store.clearCookingProgress(recipe.value.id)
  }
}

watch(
  () => route.params.id,
  () => {
    resetAllState()
  }
)

function checkSavedProgress() {
  if (!recipe.value) return
  const progress = store.getCookingProgress(recipe.value.id)
  const checkedCount = (progress?.checkedIngredients || []).length

  if (progress && progress.isStarted && !progress.isFinished) {
    savedProgress.value = progress
    showResumeDialog.value = true
  } else if (checkedCount > 0) {
    isStarted.value = true
    currentPhase.value = 'prep'
    if (progress?.currentStepIndex !== undefined) {
      currentStepIndex.value = progress.currentStepIndex
    }
    if (progress?.isFinished !== undefined) {
      isFinished.value = progress.isFinished
    }
    if (progress?.completedSteps) {
      recordedStepIndices.value = new Set(progress.completedSteps)
    }
    if (progress?.stepTimerActualDuration) {
      stepTimerActualDuration.value = progress.stepTimerActualDuration
    }
    if (progress?.timerRemaining !== undefined && currentStep.value) {
      timerRemaining.value = Math.max(0, progress.timerRemaining)
    }
    if (progress?.timerFinished !== undefined) {
      timerFinished.value = progress.timerFinished
    }
    if (progress?.currentPhase) {
      currentPhase.value = progress.currentPhase
    }
    saveProgress()
  } else {
    resetAllState()
  }
}

function startNew() {
  showResumeDialog.value = false
  savedProgress.value = null
  resetAllState()
}

function resumeCooking() {
  if (savedProgress.value) {
    restoreProgress(savedProgress.value)
  }
}

function formatLastUpdated(dateStr) {
  const now = new Date()
  const last = new Date(dateStr)
  const diffMs = now - last
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`
  return last.toLocaleDateString('zh-CN')
}

onMounted(() => {
  checkSavedProgress()
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
  color: #ff6b35;
  font-variant-numeric: tabular-nums;
}

.phase-tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.2);
  gap: 0;
}

.phase-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.phase-tab:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.phase-tab.active {
  background: linear-gradient(135deg, #ff6b35, #ff8c5a);
  color: white;
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4);
}

.phase-tab.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.phase-divider {
  width: 40px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 8px;
}

.phase-done {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #4caf50;
  border-radius: 50%;
  font-size: 12px;
}

.phase-progress {
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
}

.phase-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.prep-phase,
.cook-phase {
  height: 100%;
  display: flex;
  flex-direction: column;
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
  padding: 40px 24px;
}

.start-emoji {
  font-size: 120px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
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

.prep-stats {
  display: flex;
  gap: 32px;
  margin-top: 8px;
}

.prep-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.prep-stat .el-icon {
  color: #ffd700;
  font-size: 20px;
}

.start-btn {
  margin-top: 20px;
  min-width: 240px;
  height: 60px;
  font-size: 20px;
  border-radius: 30px;
}

.finish-icon {
  font-size: 100px;
}

.prep-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow: hidden;
}

.prep-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.prep-header h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  margin: 0;
}

.prep-progress-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.prep-progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
}

.prep-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.ingredient-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  margin-right: -8px;
}

.ingredient-scroll::-webkit-scrollbar {
  width: 6px;
}

.ingredient-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.ingredient-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.prep-actions {
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.prep-next-btn {
  width: 100%;
  height: 60px;
  font-size: 18px;
  border-radius: 30px;
}

.cook-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.steps-progress-bar {
  display: flex;
  gap: 4px;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.2);
}

.progress-dot {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.progress-dot:hover {
  background: rgba(255, 255, 255, 0.4);
}

.progress-dot.completed {
  background: #4caf50;
}

.progress-dot.active {
  background: #ff6b35;
  height: 8px;
}

.cook-main {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  padding: 20px 24px;
  overflow: hidden;
}

.step-section {
  overflow-y: auto;
  padding-right: 8px;
}

.step-section::-webkit-scrollbar {
  width: 6px;
}

.step-section::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.step-section::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.step-display {
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
  background: #ff6b35;
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
  color: #ffd700;
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
  border-left: 4px solid #ffc107;
}

.step-tip .el-icon {
  font-size: 24px;
  color: #ffc107;
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
  border-color: #4caf50;
  box-shadow: 0 0 40px rgba(76, 175, 80, 0.3);
}

.timer-display.timer-finished {
  border-color: #ff6b35;
  box-shadow: 0 0 60px rgba(255, 107, 53, 0.5);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
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

.ingredient-sidebar {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.sidebar-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  margin: 0;
}

.sidebar-count {
  font-size: 13px;
  color: #ff6b35;
  background: rgba(255, 107, 53, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.sidebar-ingredients {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.sidebar-ingredient {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.sidebar-ingredient:hover {
  background: rgba(255, 107, 53, 0.1);
  border-color: rgba(255, 107, 53, 0.3);
}

.sidebar-ingredient.checked {
  background: rgba(76, 175, 80, 0.15);
  border-color: rgba(76, 175, 80, 0.3);
}

.sidebar-ingredient.checked .ingredient-info {
  text-decoration: line-through;
  opacity: 0.6;
}

.sidebar-ingredient .ingredient-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.sidebar-ingredient .ingredient-name {
  font-size: 14px;
  color: white;
  font-weight: 500;
}

.sidebar-ingredient .ingredient-amount {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.sidebar-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 16px;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
}

.sidebar-empty .el-icon {
  font-size: 40px;
  color: rgba(255, 255, 255, 0.2);
}

.sidebar-empty span {
  font-size: 13px;
}

.sidebar-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 107, 53, 0.15);
  border-radius: 10px;
  color: #ff6b35;
  font-size: 13px;
  margin-bottom: 12px;
}

.view-all-btn {
  width: 100%;
  margin-bottom: 12px;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 600px;
}

.all-ingredients-panel {
  overflow-y: auto;
  margin-right: -8px;
  padding-right: 8px;
}

.all-ingredients-panel::-webkit-scrollbar {
  width: 4px;
}

.all-ingredients-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.all-ingredients-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.all-ingredients-panel :deep(.ingredient-list) {
  margin: 0;
}

.all-ingredients-panel :deep(.section-header) {
  display: none;
}

.all-ingredients-panel :deep(.ingredient-progress) {
  display: none;
}

.all-ingredients-panel :deep(.ingredient-item) {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.all-ingredients-panel :deep(.ingredient-name) {
  color: white;
}

.all-ingredients-panel :deep(.ingredient-item.checked) {
  background: rgba(76, 175, 80, 0.15);
}

.all-ingredients-panel :deep(.ingredient-item.highlight-related),
.all-ingredients-panel :deep(.ingredient-item.step-highlight) {
  background: rgba(255, 107, 53, 0.2);
  border-color: #ff6b35;
}

.all-ingredients-panel :deep(.ingredient-item.highlight-related:not(.checked) .ingredient-name),
.all-ingredients-panel :deep(.ingredient-item.step-highlight:not(.checked) .ingredient-name) {
  color: #ff6b35;
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

.tip-overlay,
.resume-overlay,
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.tip-content,
.resume-content,
.confirm-content {
  background: linear-gradient(135deg, #2a2a4a 0%, #1e3a5f 100%);
  border-radius: 24px;
  padding: 40px 32px;
  text-align: center;
  max-width: 420px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tip-icon {
  font-size: 64px;
  color: #ffc107;
}

.tip-content p,
.resume-desc,
.confirm-desc {
  font-size: 20px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.tip-content .el-button,
.resume-actions .el-button,
.confirm-actions .el-button {
  min-width: 160px;
  height: 52px;
  font-size: 18px;
  border-radius: 26px;
  margin-top: 12px;
}

.resume-icon,
.confirm-icon {
  font-size: 72px;
  margin-bottom: 8px;
}

.resume-content h2,
.confirm-content h2 {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.resume-desc strong,
.confirm-desc strong {
  color: #ff6b35;
  font-size: 22px;
}

.resume-time {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.resume-actions,
.confirm-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  width: 100%;
}

.resume-actions .el-button,
.confirm-actions .el-button {
  flex: 1;
  height: 56px;
  font-size: 18px;
  border-radius: 28px;
}

.not-found {
  padding: 80px 0;
  color: #333;
}

@media (max-width: 900px) {
  .cook-main {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }

  .ingredient-sidebar {
    order: -1;
  }
}

@media (max-width: 600px) {
  .phase-tab {
    padding: 10px 16px;
    font-size: 14px;
  }

  .phase-divider {
    width: 20px;
  }

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

  .prep-stats {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
