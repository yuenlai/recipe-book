<template>
  <div class="training-camp-page">
    <div class="page-header">
      <h1>厨房新手训练营 👨‍🍳</h1>
      <p>从零开始，一步步成为烹饪大师</p>
    </div>

    <div class="progress-overview">
      <div class="overview-card level-card">
        <div class="card-icon">🎓</div>
        <div class="card-content">
          <div class="card-label">当前等级</div>
          <div class="card-value">Lv.{{ trainingStats.currentLevel }}</div>
          <div class="level-name">{{ levelName }}</div>
        </div>
      </div>

      <div class="overview-card progress-card">
        <div class="card-content">
          <div class="card-label">学习进度</div>
          <div class="progress-bar-wrapper">
            <el-progress 
              :percentage="trainingStats.progress" 
              :stroke-width="16"
              :color="progressColor"
              status="success"
            />
          </div>
          <div class="progress-text">
            已完成 {{ trainingStats.completedTasks }} / {{ trainingStats.totalTasks }} 道菜
          </div>
        </div>
      </div>

      <div class="overview-card skill-card">
        <div class="card-icon">📚</div>
        <div class="card-content">
          <div class="card-label">已掌握技巧</div>
          <div class="card-value">{{ trainingStats.unlockedSkills.length }} 项</div>
          <div class="card-sub-label">共 {{ totalSkills }} 项技巧</div>
        </div>
      </div>

      <div class="overview-card achievement-card">
        <div class="card-icon">🏆</div>
        <div class="card-content">
          <div class="card-label">获得成就</div>
          <div class="card-value">{{ unlockedAchievements.length }} 个</div>
          <div class="card-sub-label">共 {{ totalAchievements }} 个成就</div>
        </div>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="main-tabs" stretch>
      <el-tab-pane label="学习路线" name="stages">
        <div class="stages-list">
          <div
            v-for="stage in trainingStagesWithProgress"
            :key="stage.id"
            class="stage-card"
            :class="{ 'is-locked': !stage.isUnlocked, 'is-completed': stage.isCompleted }"
            @click="handleStageClick(stage)"
          >
            <div class="stage-header" :style="{ backgroundColor: stage.color + '15' }">
              <div class="stage-icon-wrapper" :style="{ backgroundColor: stage.color }">
                <span class="stage-icon">{{ stage.isCompleted ? '✅' : (stage.isUnlocked ? stage.icon : '🔒') }}</span>
              </div>
              <div class="stage-info">
                <div class="stage-name">
                  {{ stage.name }}
                  <el-tag v-if="stage.isCompleted" size="small" type="success" effect="light">已完成</el-tag>
                  <el-tag v-else-if="!stage.isUnlocked" size="small" type="info" effect="plain">未解锁</el-tag>
                  <el-tag v-else size="small" type="warning" effect="light">进行中</el-tag>
                </div>
                <div class="stage-desc">{{ stage.description }}</div>
              </div>
              <div class="stage-progress">
                <div class="progress-circle" :style="{ '--progress': stage.progress }">
                  <span class="progress-text">{{ stage.progress }}%</span>
                </div>
                <div class="stage-count">{{ stage.completedCount }}/{{ stage.totalCount }}</div>
              </div>
            </div>

            <div v-if="stage.isUnlocked" class="stage-tasks">
              <div
                v-for="task in stage.tasks"
                :key="task.id"
                class="task-item"
                :class="{ 'is-completed': task.isCompleted }"
                @click.stop="handleTaskClick(task)"
              >
                <div class="task-check" @click.stop="toggleTaskComplete(task)">
                  <el-icon v-if="task.isCompleted" class="check-icon"><Check /></el-icon>
                  <span v-else class="check-circle"></span>
                </div>
                <div class="task-recipe" :style="{ backgroundColor: task.recipe?.coverColor + '20' }">
                  <span class="recipe-emoji">{{ task.recipe?.emoji }}</span>
                </div>
                <div class="task-info">
                  <div class="task-title">{{ task.title }}</div>
                  <div class="task-desc">{{ task.description }}</div>
                  <div class="task-skills">
                    <el-tag
                      v-for="skillId in task.skills.slice(0, 3)"
                      :key="skillId"
                      size="small"
                      :type="isSkillUnlocked(skillId) ? 'success' : 'info'"
                      effect="plain"
                    >
                      {{ getSkillById(skillId)?.emoji }} {{ getSkillById(skillId)?.name }}
                    </el-tag>
                  </div>
                </div>
                <div class="task-actions">
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click.stop="goToRecipe(task.recipeId)"
                  >
                    <el-icon><Reading /></el-icon>
                    查看食谱
                  </el-button>
                </div>
              </div>
            </div>

            <div v-else class="stage-locked">
              <el-icon class="lock-icon"><Lock /></el-icon>
              <span>完成上一阶段后解锁</span>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="技能树" name="skills">
        <div class="skills-section">
          <div class="section-title">
            <el-icon><Medal /></el-icon>
            <span>烹饪技能树</span>
          </div>
          <div class="skills-grid">
            <div
              v-for="level in 5"
              :key="level"
              class="skill-level-group"
            >
              <div class="level-header">
                <span class="level-title">Lv.{{ level }} {{ levelNames[level - 1] }}</span>
                <span class="level-progress">
                  {{ getSkillsByLevel(level).filter(s => s.isUnlocked).length }} / {{ getSkillsByLevel(level).length }}
                </span>
              </div>
              <div class="skills-row">
                <div
                  v-for="skill in getSkillsByLevel(level)"
                  :key="skill.id"
                  class="skill-card"
                  :class="{ 'is-unlocked': skill.isUnlocked }"
                >
                  <div class="skill-icon">{{ skill.isUnlocked ? skill.emoji : '🔒' }}</div>
                  <div class="skill-name">{{ skill.name }}</div>
                  <div class="skill-desc">{{ skill.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="成就墙" name="achievements">
        <div class="achievements-section">
          <div class="section-title">
            <el-icon><Trophy /></el-icon>
            <span>我的成就</span>
          </div>
          <div class="achievements-grid">
            <div
              v-for="achievement in achievements"
              :key="achievement.id"
              class="achievement-card"
              :class="{ 'is-unlocked': isAchievementUnlocked(achievement.id) }"
            >
              <div class="achievement-icon">{{ isAchievementUnlocked(achievement.id) ? achievement.icon : '🔒' }}</div>
              <div class="achievement-name">{{ achievement.name }}</div>
              <div class="achievement-desc">{{ achievement.description }}</div>
              <div v-if="isAchievementUnlocked(achievement.id)" class="achievement-badge">
                <el-icon><Check /></el-icon>
                已获得
              </div>
              <div v-else class="achievement-progress">
                {{ getAchievementProgress(achievement) }}
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog 
      v-model="showResetDialog" 
      title="重置学习进度" 
      width="400px"
    >
      <p>确定要重置所有学习进度吗？此操作不可恢复。</p>
      <template #footer>
        <el-button @click="showResetDialog = false">取消</el-button>
        <el-button type="danger" @click="confirmReset">确定重置</el-button>
      </template>
    </el-dialog>

    <div class="reset-section">
      <el-button type="danger" plain @click="showResetDialog = true">
        <el-icon><RefreshRight /></el-icon>
        重置学习进度
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipe'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'

const store = useRecipeStore()
const router = useRouter()

const activeTab = ref('stages')
const showResetDialog = ref(false)

const {
  trainingStats,
  trainingStagesWithProgress,
  skills,
  skillsWithProgress,
  achievements,
  unlockedAchievements,
  trainingCompletedTasks,
  trainingUnlockedAchievements,
  newlyUnlockedAchievements
} = storeToRefs(store)

const totalSkills = computed(() => Object.keys(skills.value).length)
const totalAchievements = computed(() => achievements.value.length)

const levelNames = ['厨房小白', '入门学徒', '家常菜达人', '硬菜高手', '料理达人', '烹饪大师']

const levelName = computed(() => {
  const level = Math.min(trainingStats.value.currentLevel, levelNames.length - 1)
  return levelNames[level]
})

const progressColor = computed(() => {
  const progress = trainingStats.value.progress
  if (progress < 30) return '#4CAF50'
  if (progress < 60) return '#FF9800'
  if (progress < 90) return '#E91E63'
  return '#9C27B0'
})

function getSkillsByLevel(level) {
  return skillsWithProgress.value.filter(s => s.level === level)
}

function getSkillById(skillId) {
  return skills.value[skillId]
}

function isSkillUnlocked(skillId) {
  return trainingStats.value.unlockedSkills.includes(skillId)
}

function isAchievementUnlocked(achievementId) {
  return unlockedAchievements.value.some(a => a.id === achievementId)
}

function getAchievementProgress(achievement) {
  const stats = trainingStats.value
  switch (achievement.id) {
    case 'first_dish':
      return `${stats.completedTasks}/1`
    case 'stage1_complete':
      return `${stats.completedStages.includes(1) ? 1 : 0}/1`
    case 'home_cook':
      return `${stats.completedStages.includes(2) ? 1 : 0}/1`
    case 'hard_dish_master':
      return `${stats.completedStages.includes(3) ? 1 : 0}/1`
    case 'pastry_chef':
      return `${stats.completedStages.includes(4) ? 1 : 0}/1`
    case 'sweet_lover':
      return `${stats.completedStages.includes(5) ? 1 : 0}/1`
    case 'master_chef':
      return `${stats.completedStages.length}/6`
    case 'skill_collector':
      return `${stats.unlockedSkills.length}/10`
    case 'skill_master':
      return `${stats.unlockedSkills.length}/18`
    case 'speed_cook':
      return `${stats.completedTasks}/10`
    default:
      return ''
  }
}

function handleStageClick(stage) {
  if (!stage.isUnlocked) {
    ElMessage.info('请先完成上一阶段的学习')
  }
}

function handleTaskClick(task) {
  if (!task.recipe) return
}

function toggleTaskComplete(task) {
  if (task.isCompleted) {
    store.uncompleteTrainingTask(task.id)
    ElMessage.success(`已取消"${task.title}"的完成标记`)
  } else {
    const newAchievements = store.completeTrainingTask(task.id)
    
    if (newAchievements && newAchievements.length > 0) {
      const achievementList = achievements.value
      newAchievements.forEach(achId => {
        const ach = achievementList.find(a => a.id === achId)
        if (ach) {
          ElMessage.success({
            message: `🎉 解锁成就：${ach.name}`,
            duration: 3000
          })
        }
      })
    }
    
    ElMessage.success(`恭喜完成"${task.title}"！`)
  }
}

function goToRecipe(recipeId) {
  router.push(`/recipe/${recipeId}`)
}

function confirmReset() {
  store.resetTrainingProgress()
  showResetDialog.value = false
  ElMessage.success('学习进度已重置')
}
</script>

<style scoped>
.training-camp-page {
  padding-bottom: 60px;
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

.progress-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.overview-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 13px;
  color: #757575;
  margin-bottom: 4px;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #3D3D3D;
}

.card-sub-label {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.level-name {
  font-size: 13px;
  color: #FF6B35;
  font-weight: 600;
  margin-top: 2px;
}

.level-card {
  background: linear-gradient(135deg, #FFF7E6, #FFF0E8);
}

.progress-card {
  background: linear-gradient(135deg, #E8F5E9, #F1F8E9);
}

.progress-bar-wrapper {
  margin: 8px 0;
}

.progress-text {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.skill-card {
  background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
}

.achievement-card {
  background: linear-gradient(135deg, #FFF3E0, #FFE0B2);
}

.main-tabs {
  background: white;
  border-radius: 16px;
  padding: 0 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stage-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.stage-card:hover:not(.is-locked) {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stage-card.is-locked {
  opacity: 0.7;
}

.stage-header {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stage-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stage-icon {
  font-size: 32px;
}

.stage-info {
  flex: 1;
}

.stage-name {
  font-size: 18px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stage-desc {
  font-size: 13px;
  color: #757575;
}

.stage-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.progress-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: conic-gradient(#FF6B35 calc(var(--progress) * 1%), #F0F0F0 0);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.progress-circle::before {
  content: '';
  position: absolute;
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
}

.progress-text {
  position: relative;
  font-size: 13px;
  font-weight: 600;
  color: #FF6B35;
  z-index: 1;
}

.stage-count {
  font-size: 12px;
  color: #999;
}

.stage-tasks {
  border-top: 1px solid #F0F0F0;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.task-item:hover {
  background: #FAFAFA;
  border-color: #F0F0F0;
}

.task-item.is-completed {
  background: #F0F9EB;
}

.task-check {
  cursor: pointer;
  flex-shrink: 0;
}

.check-icon {
  font-size: 24px;
  color: #67C23A;
}

.check-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #DCDFE6;
  border-radius: 50%;
  display: block;
  transition: all 0.2s ease;
}

.check-circle:hover {
  border-color: #FF6B35;
}

.task-recipe {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.recipe-emoji {
  font-size: 24px;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 15px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 4px;
}

.task-desc {
  font-size: 12px;
  color: #757575;
  margin-bottom: 8px;
}

.task-skills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.task-actions {
  flex-shrink: 0;
}

.stage-locked {
  padding: 40px;
  text-align: center;
  color: #999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.lock-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 20px;
}

.skills-section,
.achievements-section {
  padding: 20px 0;
}

.skills-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skill-level-group {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F0F0F0;
}

.level-title {
  font-size: 16px;
  font-weight: 600;
  color: #3D3D3D;
}

.level-progress {
  font-size: 13px;
  color: #FF6B35;
  font-weight: 600;
}

.skills-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.skill-card {
  padding: 16px;
  border-radius: 12px;
  background: #F5F5F5;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.skill-card.is-unlocked {
  background: linear-gradient(135deg, #FFF7E6, #FFF0E8);
  border-color: #FFE4D6;
}

.skill-card:hover {
  transform: translateY(-2px);
}

.skill-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.skill-name {
  font-size: 14px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 4px;
}

.skill-desc {
  font-size: 11px;
  color: #757575;
  line-height: 1.4;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.achievement-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.achievement-card.is-unlocked {
  background: linear-gradient(135deg, #FFF7E6, #FFF0E8);
  border-color: #FFE4D6;
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.achievement-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.achievement-name {
  font-size: 15px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 6px;
}

.achievement-desc {
  font-size: 12px;
  color: #757575;
  margin-bottom: 12px;
  line-height: 1.4;
}

.achievement-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: #67C23A;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.achievement-progress {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.reset-section {
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid #F0F0F0;
  margin-top: 20px;
}

@media (max-width: 992px) {
  .progress-overview {
    grid-template-columns: repeat(2, 1fr);
  }

  .skills-row {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 24px;
  }

  .progress-overview {
    grid-template-columns: 1fr;
  }

  .stage-header {
    flex-wrap: wrap;
  }

  .stage-progress {
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 12px;
  }

  .task-item {
    flex-wrap: wrap;
  }

  .task-actions {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .skills-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
