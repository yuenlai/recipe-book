<template>
  <div class="fridge-page">
    <div class="page-header">
      <div class="header-left">
        <h1>冰箱库存管理 🧊</h1>
        <p>记录现有食材和保质期，优先推荐快到期食材的菜谱，避免浪费</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          添加食材
        </el-button>
        <el-button type="warning" plain @click="handleClearExpired" :disabled="stats.expired === 0">
          <el-icon><Delete /></el-icon>
          清理过期
        </el-button>
        <el-button type="danger" plain @click="handleClearAll" :disabled="stats.total === 0">
          <el-icon><Delete /></el-icon>
          清空库存
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">总食材数</div>
        </div>
      </div>
      <div class="stat-card urgent">
        <div class="stat-icon">⚠️</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.expiring }}</div>
          <div class="stat-label">快到期</div>
        </div>
      </div>
      <div class="stat-card expired">
        <div class="stat-icon">❌</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.expired }}</div>
          <div class="stat-label">已过期</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📂</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.categories }}</div>
          <div class="stat-label">分类数</div>
        </div>
      </div>
    </div>

    <div v-if="expiringItems.length > 0" class="expiring-alert">
      <div class="alert-header">
        <el-icon><WarningFilled /></el-icon>
        <span>以下食材即将过期，请尽快使用！</span>
      </div>
      <div class="expiring-list">
        <div v-for="item in expiringItems" :key="item.id" class="expiring-item">
          <span class="item-name">{{ item.name }}</span>
          <el-tag :type="item.expiryInfo.status === 'today' ? 'danger' : 'warning'" size="small">
            {{ item.expiryInfo.label }}
          </el-tag>
        </div>
      </div>
    </div>

    <div v-if="recommendedRecipes.length > 0" class="recommend-section">
      <div class="section-header">
        <h3>
          <el-icon><StarFilled /></el-icon>
          优先推荐 - 消耗快到期食材
        </h3>
        <router-link to="/" class="view-more">查看更多</router-link>
      </div>
      <div class="recommend-grid">
        <div
          v-for="item in recommendedRecipes"
          :key="item.recipe.id"
          class="recommend-card"
          @click="goToRecipe(item.recipe.id)"
        >
          <div class="card-emoji" :style="{ backgroundColor: item.recipe.coverColor }">
            {{ item.recipe.emoji }}
          </div>
          <div class="card-info">
            <div class="card-name">{{ item.recipe.name }}</div>
            <div class="card-match">
              <span class="match-badge">可消耗 {{ item.matchCount }} 种快到期食材</span>
            </div>
            <div class="card-ingredients">
              <el-tag
                v-for="ing in item.matchedItems.slice(0, 3)"
                :key="ing.id"
                size="small"
                type="warning"
                effect="light"
              >
                {{ ing.name }}
              </el-tag>
            </div>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <div class="inventory-container">
      <div v-if="groupedInventory.length === 0" class="empty-inventory">
        <div class="empty-icon">🧊</div>
        <div class="empty-text">冰箱空空如也</div>
        <div class="empty-hint">
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加第一种食材
          </el-button>
        </div>
      </div>

      <div v-else class="inventory-groups">
        <div
          v-for="group in groupedInventory"
          :key="group.category"
          class="inventory-group"
        >
          <div class="group-header">
            <span class="group-emoji">{{ group.emoji }}</span>
            <span class="group-name">{{ group.category }}</span>
            <span class="group-count">{{ group.items.length }} 项</span>
          </div>
          <div class="group-items">
            <div
              v-for="item in group.items"
              :key="item.id"
              :class="['inventory-item', item.expiryInfo.status]"
            >
              <div class="item-main">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-quantity">
                  {{ item.quantity }}{{ item.unit }}
                </div>
              </div>
              <div class="item-dates">
                <div class="date-row">
                  <span class="date-label">购入：</span>
                  <span class="date-value">{{ formatDate(item.purchaseDate) }}</span>
                </div>
                <div class="date-row">
                  <span class="date-label">保质期：</span>
                  <span class="date-value" :style="{ color: item.expiryInfo.color }">
                    {{ formatDate(item.expiryDate) }}
                  </span>
                </div>
              </div>
              <div class="item-status">
                <el-tag
                  :type="getStatusTagType(item.expiryInfo.status)"
                  size="small"
                  effect="light"
                >
                  {{ item.expiryInfo.label }}
                </el-tag>
              </div>
              <div class="item-actions">
                <el-button
                  type="primary"
                  size="small"
                  text
                  @click="handleEdit(item)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  text
                  @click="handleDelete(item)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
              <div v-if="item.note" class="item-note">
                <el-icon><InfoFilled /></el-icon>
                {{ item.note }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showAddDialog"
      :title="editingItem ? '编辑食材' : '添加食材'"
      width="500px"
      @closed="resetForm"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="食材名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入食材名称" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <div class="quantity-input">
            <el-input-number
              v-model="formData.quantity"
              :min="0"
              :precision="1"
              :step="10"
              style="width: 200px"
            />
            <el-select v-model="formData.unit" style="width: 120px; margin-left: 12px">
              <el-option label="g" value="g" />
              <el-option label="kg" value="kg" />
              <el-option label="ml" value="ml" />
              <el-option label="L" value="L" />
              <el-option label="个" value="个" />
              <el-option label="把" value="把" />
              <el-option label="盒" value="盒" />
              <el-option label="包" value="包" />
              <el-option label="瓶" value="瓶" />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="购入日期">
          <el-date-picker
            v-model="formData.purchaseDate"
            type="date"
            placeholder="选择购入日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="保质期" prop="expiryDate">
          <el-date-picker
            v-model="formData.expiryDate"
            type="date"
            placeholder="选择保质期截止日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formData.note"
            type="textarea"
            :rows="2"
            placeholder="可选，如：已切好、未开封等"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ editingItem ? '保存修改' : '确认添加' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElForm } from 'element-plus'
import { useRecipeStore } from '../stores/recipe'

const store = useRecipeStore()
const router = useRouter()
const formRef = ref()

const showAddDialog = ref(false)
const editingItem = ref(null)

const stats = computed(() => store.fridgeStats)
const expiringItems = computed(() => store.expiringItems)
const groupedInventory = computed(() => store.groupedFridgeInventory)
const recommendedRecipes = computed(() => store.recommendedRecipesForFridge)

const formData = ref({
  name: '',
  quantity: 500,
  unit: 'g',
  purchaseDate: new Date().toISOString().split('T')[0],
  expiryDate: '',
  note: ''
})

const formRules = {
  name: [{ required: true, message: '请输入食材名称', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  expiryDate: [{ required: true, message: '请选择保质期', trigger: 'change' }]
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function getStatusTagType(status) {
  switch (status) {
    case 'expired':
    case 'today':
      return 'danger'
    case 'urgent':
      return 'warning'
    case 'soon':
      return 'success'
    default:
      return 'info'
  }
}

function resetForm() {
  editingItem.value = null
  formData.value = {
    name: '',
    quantity: 500,
    unit: 'g',
    purchaseDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    note: ''
  }
  formRef.value?.clearValidate()
}

function handleEdit(item) {
  editingItem.value = item
  formData.value = {
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
    purchaseDate: item.purchaseDate,
    expiryDate: item.expiryDate,
    note: item.note || ''
  }
  showAddDialog.value = true
}

function handleDelete(item) {
  ElMessageBox.confirm(`确定要删除「${item.name}」吗？`, '确认删除', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.removeFridgeItem(item.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

async function handleSubmit() {
  try {
    await formRef.value.validate()
    
    const formCopy = { ...formData.value }
    const isEditing = !!editingItem.value
    const editingId = editingItem.value?.id

    showAddDialog.value = false
    
    if (isEditing) {
      store.updateFridgeItem(editingId, formCopy)
      ElMessage.success('修改成功')
    } else {
      store.addFridgeItem(formCopy)
      ElMessage.success('添加成功')
    }
    
    resetForm()
  } catch (error) {
    console.error('Form validation error:', error)
    ElMessage.error('请填写完整信息')
  }
}

function handleClearExpired() {
  ElMessageBox.confirm('确定要清理所有已过期的食材吗？', '确认清理', {
    confirmButtonText: '清理',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.removeExpiredItems()
    ElMessage.success('已清理过期食材')
  }).catch(() => {})
}

function handleClearAll() {
  ElMessageBox.confirm('确定要清空冰箱库存吗？所有食材数据将被清除。', '确认清空', {
    confirmButtonText: '清空',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.clearFridgeInventory()
    ElMessage.success('已清空库存')
  }).catch(() => {})
}

function goToRecipe(id) {
  router.push(`/recipe/${id}`)
}
</script>

<style scoped>
.fridge-page {
  padding-bottom: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-top: 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.header-left h1 {
  font-size: 28px;
  color: #3D3D3D;
  margin-bottom: 8px;
}

.header-left p {
  color: #757575;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #E0E0E0;
}

.stat-card.urgent {
  border-left-color: #E6A23C;
}

.stat-card.expired {
  border-left-color: #F56C6C;
}

.stat-icon {
  font-size: 32px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #3D3D3D;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #757575;
}

.expiring-alert {
  background: linear-gradient(135deg, #FFF7E6, #FFF0E8);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #FFE4D6;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #E6A23C;
  margin-bottom: 12px;
}

.expiring-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.expiring-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
}

.item-name {
  color: #3D3D3D;
  font-weight: 500;
}

.recommend-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #3D3D3D;
  margin: 0;
}

.view-more {
  font-size: 13px;
  color: #FF6B35;
  text-decoration: none;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.recommend-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #FAFAFA;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.recommend-card:hover {
  background: #FFF0E8;
  border-color: #FFE4D6;
}

.card-emoji {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-name {
  font-size: 14px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 4px;
}

.card-match {
  margin-bottom: 6px;
}

.match-badge {
  font-size: 11px;
  color: #E6A23C;
  background: #FFF7E6;
  padding: 2px 8px;
  border-radius: 10px;
}

.card-ingredients {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.arrow-icon {
  color: #BDBDBD;
  flex-shrink: 0;
}

.inventory-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.empty-inventory {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  color: #757575;
  margin-bottom: 16px;
}

.inventory-groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F0F0F0;
}

.group-emoji {
  font-size: 18px;
}

.group-name {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #3D3D3D;
}

.group-count {
  font-size: 12px;
  color: #FF6B35;
  background: #FFF0E8;
  padding: 2px 8px;
  border-radius: 10px;
}

.group-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.inventory-item {
  background: #FAFAFA;
  border-radius: 12px;
  padding: 16px;
  border: 2px solid transparent;
  position: relative;
  transition: all 0.2s ease;
}

.inventory-item:hover {
  background: #FFF8F0;
  border-color: #FFE4D6;
}

.inventory-item.expired {
  background: #FEF0F0;
  border-color: #FDE2E2;
}

.inventory-item.today,
.inventory-item.urgent {
  background: #FFF7E6;
  border-color: #FFE8CC;
}

.item-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.inventory-item .item-name {
  font-size: 15px;
  font-weight: 600;
  color: #3D3D3D;
}

.item-quantity {
  font-size: 15px;
  font-weight: 600;
  color: #FF6B35;
}

.item-dates {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.date-row {
  display: flex;
  gap: 4px;
  font-size: 12px;
}

.date-label {
  color: #999;
}

.date-value {
  color: #666;
}

.item-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-actions {
  display: flex;
  gap: 8px;
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.inventory-item:hover .item-actions {
  opacity: 1;
}

.item-note {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #E0E0E0;
  font-size: 12px;
  color: #999;
}

.quantity-input {
  display: flex;
  align-items: center;
}

@media (max-width: 992px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .recommend-grid {
    grid-template-columns: 1fr;
  }

  .group-items {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
    gap: 12px;
  }

  .stat-icon {
    font-size: 28px;
  }

  .stat-value {
    font-size: 20px;
  }

  .group-items {
    grid-template-columns: 1fr;
  }

  .item-actions {
    opacity: 1;
  }
}
</style>
