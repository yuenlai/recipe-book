<template>
  <button
    :class="[
      'favorite-btn',
      {
        'is-favorite': isFav,
        'is-animating': isAnimating,
        'is-recent': isRecentChange
      }
    ]"
    @click="handleClick"
  >
    <el-icon :size="20" class="star-icon">
      <StarFilled v-if="isFav" />
      <Star v-else />
    </el-icon>
    <span v-if="showPlus" class="plus-badge">+1</span>
  </button>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRecipeStore } from '../stores/recipe'
import { ElMessage } from 'element-plus'

const props = defineProps({
  recipeId: {
    type: Number,
    required: true
  }
})

const store = useRecipeStore()
const isAnimating = ref(false)
const showPlus = ref(false)
const recentChangeTime = ref(0)
const isRecentChange = computed(() => Date.now() - recentChangeTime.value < 2000)

const isFav = computed(() => store.isFavorite(props.recipeId))

watch(() => props.recipeId, () => {
  recentChangeTime.value = 0
})

async function handleClick(e) {
  e.stopPropagation()

  if (isAnimating.value) return

  isAnimating.value = true
  showPlus.value = true

  const result = store.toggleFavorite(props.recipeId)
  recentChangeTime.value = Date.now()

  setTimeout(() => {
    showPlus.value = false
  }, 600)

  setTimeout(() => {
    isAnimating.value = false
  }, 400)

  if (result.isFavorite) {
    ElMessage({
      message: `已收藏「${result.recipeName}」`,
      type: 'success',
      duration: 2500,
      showClose: true,
      offset: 60,
      customClass: 'favorite-toast',
      appendTo: document.body
    })
  } else {
    showUndoToast(result)
  }
}

let undoToastId = 0

function showUndoToast(result) {
  undoToastId++
  const currentToastId = undoToastId
  const btnId = `undo-btn-${currentToastId}`

  const handleUndoClick = (e) => {
    if (e.target && e.target.id === btnId) {
      e.stopPropagation()
      const undoResult = store.undoLastFavoriteChange()
      if (undoResult) {
        recentChangeTime.value = Date.now()
        ElMessage({
          message: `已恢复收藏「${undoResult.recipeName}」`,
          type: 'success',
          duration: 2000,
          offset: 60,
          customClass: 'favorite-toast',
          appendTo: document.body
        })
      }
      toast.close()
    }
    document.removeEventListener('click', handleUndoClick, true)
  }

  document.addEventListener('click', handleUndoClick, true)

  const toast = ElMessage({
    message: `<button id="${btnId}" class="undo-btn">撤销</button><span style="flex:1;">已取消收藏「${result.recipeName}」</span>`,
    type: 'warning',
    duration: 4000,
    showClose: true,
    offset: 60,
    customClass: 'favorite-toast with-undo',
    appendTo: document.body,
    dangerouslyUseHTMLString: true,
    onClose: () => {
      document.removeEventListener('click', handleUndoClick, true)
    }
  })
}
</script>

<style scoped>
.favorite-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: #999;
  overflow: visible;
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.favorite-btn.is-favorite {
  color: #FFB800;
  background: white;
}

.favorite-btn.is-favorite:hover {
  color: #FF9800;
}

.favorite-btn.is-animating .star-icon {
  animation: starPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.favorite-btn.is-recent {
  box-shadow: 0 0 0 2px rgba(255, 184, 0, 0.4);
  animation: pulseRing 2s ease-out;
}

@keyframes starPop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

@keyframes pulseRing {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 184, 0, 0.6);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(255, 184, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 2px rgba(255, 184, 0, 0.4);
  }
}

.star-icon {
  transition: transform 0.2s ease;
}

.plus-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #FF6B35, #FF8A80);
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  animation: plusFly 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  pointer-events: none;
  box-shadow: 0 2px 4px rgba(255, 107, 53, 0.3);
}

@keyframes plusFly {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(0.8);
  }
}
</style>

<style>
.favorite-toast {
  border-radius: 12px !important;
  padding: 14px 20px !important;
  font-size: 14px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
}

.favorite-toast.with-undo {
  display: flex !important;
  align-items: center !important;
  min-width: 280px !important;
}

.favorite-toast .undo-btn {
  background: transparent;
  border: 1px solid #E6A23C;
  color: #E6A23C;
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
  margin-right: auto;
  flex-shrink: 0;
}

.favorite-toast .undo-btn:hover {
  background: #E6A23C;
  color: white;
}

.favorite-toast .el-message__content {
  flex: 1;
}

.favorite-toast.el-message--success {
  background: linear-gradient(135deg, #f0f9eb, #e1f3d8) !important;
  border: 1px solid #c2e7b0 !important;
}

.favorite-toast.el-message--info {
  background: linear-gradient(135deg, #f4f4f5, #e9e9eb) !important;
  border: 1px solid #d3d4d6 !important;
}

.favorite-toast.el-message--warning {
  background: linear-gradient(135deg, #fdf6ec, #faecd8) !important;
  border: 1px solid #e7c897 !important;
}
</style>
