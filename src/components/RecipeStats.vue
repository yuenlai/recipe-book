<template>
  <div class="recipe-stats" :class="{ compact, 'with-servings-control': showServingsControl }">
    <div class="stat-card" :class="{ highlight: highlightTime }">
      <div class="stat-icon">
        <el-icon><Clock /></el-icon>
      </div>
      <div class="stat-content">
        <span class="stat-value">{{ totalTime }}</span>
        <span class="stat-label">总时长(分钟)</span>
      </div>
    </div>

    <div class="stat-card servings-card">
      <div class="stat-icon">
        <el-icon><User /></el-icon>
      </div>
      <div class="stat-content" v-if="!showServingsControl">
        <span class="stat-value">{{ servings }}</span>
        <span class="stat-label">{{ servingsUnit }}</span>
      </div>
      <div class="stat-content servings-control" v-else>
        <span class="stat-label">用餐人数</span>
        <div class="servings-adjuster">
          <el-button circle size="small" @click="decreaseServings" :disabled="localServings <= 1">
            <el-icon><Minus /></el-icon>
          </el-button>
          <span class="servings-value">{{ localServings }}</span>
          <el-button circle size="small" @click="increaseServings" :disabled="localServings >= 20">
            <el-icon><Plus /></el-icon>
          </el-button>
        </div>
        <span class="servings-original" v-if="localServings !== servings">
          (原配方 {{ servings }} 人份)
        </span>
      </div>
    </div>

    <div class="stat-card difficulty-card" :class="difficultyClass">
      <div class="stat-icon">
        <el-icon><component :is="difficultyIcon" /></el-icon>
      </div>
      <div class="stat-content">
        <span class="stat-value">{{ difficulty }}</span>
        <span class="stat-label">难度</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Clock, User, Minus, Plus, Star, StarFilled, Medal } from '@element-plus/icons-vue'

const props = defineProps({
  prepTime: {
    type: Number,
    default: 0
  },
  cookTime: {
    type: Number,
    default: 0
  },
  servings: {
    type: Number,
    default: 1
  },
  difficulty: {
    type: String,
    default: '简单'
  },
  compact: {
    type: Boolean,
    default: false
  },
  highlightTime: {
    type: Boolean,
    default: false
  },
  showServingsControl: {
    type: Boolean,
    default: false
  },
  servingsUnit: {
    type: String,
    default: '人份'
  }
})

const emit = defineEmits(['update:servings'])

const totalTime = computed(() => props.prepTime + props.cookTime)

const localServings = ref(props.servings)

watch(() => props.servings, (val) => {
  localServings.value = val
})

const difficultyClass = computed(() => {
  const map = { '简单': 'easy', '中等': 'medium', '困难': 'hard' }
  return map[props.difficulty] || 'easy'
})

const difficultyIcon = computed(() => {
  const map = { '简单': Star, '中等': StarFilled, '困难': Medal }
  return map[props.difficulty] || Star
})

function increaseServings() {
  if (localServings.value < 20) {
    localServings.value++
    emit('update:servings', localServings.value)
  }
}

function decreaseServings() {
  if (localServings.value > 1) {
    localServings.value--
    emit('update:servings', localServings.value)
  }
}
</script>

<style scoped>
.recipe-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.recipe-stats.compact {
  gap: 8px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 12px;
  background: linear-gradient(135deg, #FFF8F0 0%, #FFFEFB 100%);
  border-radius: 12px;
  border: 1px solid #FFE8D6;
  transition: all 0.2s ease;
}

.recipe-stats.compact .stat-card {
  padding: 10px 8px;
  gap: 6px;
  border-radius: 10px;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);
}

.stat-card.highlight {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
  border-color: #FF6B35;
}

.stat-card.highlight .stat-icon,
.stat-card.highlight .stat-value,
.stat-card.highlight .stat-label {
  color: white;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 107, 53, 0.1);
  color: #FF6B35;
  flex-shrink: 0;
}

.recipe-stats.compact .stat-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
}

.stat-icon .el-icon {
  font-size: 18px;
}

.recipe-stats.compact .stat-icon .el-icon {
  font-size: 14px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #3D3D3D;
  line-height: 1.2;
}

.recipe-stats.compact .stat-value {
  font-size: 14px;
}

.stat-label {
  font-size: 11px;
  color: #999;
  line-height: 1.2;
}

.recipe-stats.compact .stat-label {
  font-size: 10px;
}

.difficulty-card.easy {
  background: linear-gradient(135deg, #F0F9EB 0%, #FCFFF9 100%);
  border-color: #C7E8C0;
}

.difficulty-card.easy .stat-icon {
  background: rgba(103, 194, 58, 0.15);
  color: #67C23A;
}

.difficulty-card.easy .stat-value {
  color: #529B2F;
}

.difficulty-card.medium {
  background: linear-gradient(135deg, #FDF6EC 0%, #FFFBF5 100%);
  border-color: #F5DAB1;
}

.difficulty-card.medium .stat-icon {
  background: rgba(230, 162, 60, 0.15);
  color: #E6A23C;
}

.difficulty-card.medium .stat-value {
  color: #B88230;
}

.difficulty-card.hard {
  background: linear-gradient(135deg, #FEF0F0 0%, #FFF7F7 100%);
  border-color: #F5C2C2;
}

.difficulty-card.hard .stat-icon {
  background: rgba(245, 108, 108, 0.15);
  color: #F56C6C;
}

.difficulty-card.hard .stat-value {
  color: #C45656;
}

.servings-control {
  width: 100%;
  align-items: center;
  gap: 4px;
}

.servings-adjuster {
  display: flex;
  align-items: center;
  gap: 8px;
}

.servings-value {
  font-size: 18px;
  font-weight: 700;
  color: #3D3D3D;
  min-width: 28px;
  text-align: center;
}

.servings-original {
  font-size: 10px;
  color: #999;
  white-space: nowrap;
}

.recipe-stats.with-servings-control {
  grid-template-columns: 1fr auto 1fr;
}

.recipe-stats.with-servings-control .servings-card {
  min-width: 160px;
}

@media (max-width: 600px) {
  .stat-value {
    font-size: 16px;
  }

  .stat-label {
    font-size: 10px;
  }

  .stat-icon {
    width: 32px;
    height: 32px;
  }

  .stat-icon .el-icon {
    font-size: 16px;
  }

  .recipe-stats.with-servings-control {
    grid-template-columns: 1fr;
  }

  .recipe-stats.with-servings-control .servings-card {
    min-width: 0;
  }
}
</style>
