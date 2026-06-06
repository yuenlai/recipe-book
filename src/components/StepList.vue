<template>
  <div class="step-list">
    <h3 class="section-title">
      <el-icon><SetUp /></el-icon>
      烹饪步骤
    </h3>

    <div class="steps">
      <div
        v-for="step in steps"
        :key="step.order"
        :class="['step-item', { completed: completedSteps[step.order - 1] }]"
        @click="toggleStep(step.order - 1)"
      >
        <div class="step-number" :class="{ done: completedSteps[step.order - 1] }">
          <el-icon v-if="completedSteps[step.order - 1]"><Check /></el-icon>
          <span v-else>{{ step.order }}</span>
        </div>

        <div class="step-content">
          <p class="step-description">{{ step.description }}</p>
          <div v-if="step.tip" class="step-tip">
            <el-icon><InfoFilled /></el-icon>
            <span>{{ step.tip }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  steps: {
    type: Array,
    required: true
  }
})

const completedSteps = ref([])

function toggleStep(index) {
  if (completedSteps.value.includes(index)) {
    completedSteps.value = completedSteps.value.filter(i => i !== index)
  } else {
    completedSteps.value.push(index)
  }
}
</script>

<style scoped>
.step-list {
  margin: 24px 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 16px;
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
</style>
