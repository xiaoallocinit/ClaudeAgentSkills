# Vue3 Component Generator Skill

> Vue 3 组件代码生成技能，提供标准化的组件结构和最佳实践指南

## 📋 概述

本技能用于生成符合最佳实践的 Vue 3 组件代码，包括：
- 标准组件结构
- Composition API 使用规范
- TypeScript 类型定义
- 组合式函数 (Composables)

本技能提供两个核心模板：
1. **component.vue.template** - 完整的 Vue 3 组件模板
2. **composable.ts.template** - 组合式函数模板

## 🎯 适用场景

### 何时使用此技能

- ✅ 创建新的 Vue 3 组件
- ✅ 重构现有组件为 Composition API
- ✅ 创建可复用的组合式函数
- ✅ 需要标准化团队组件规范时
- ✅ 学习 Vue 3 最佳实践

### 何时不使用此技能

- ❌ 简单的 HTML 页面（不需要 Vue）
- ❌ Vue 2 Options API 组件
- ❌ React 或其他框架组件

## 📁 模板文件说明

### component.vue.template

标准 Vue 3 单文件组件模板，包含：

**结构特点：**
- `<script setup lang="ts">` 语法
- Props 和 Emits 类型定义
- 响应式状态管理
- 计算属性示例
- 方法定义
- 生命周期钩子
- scoped 样式区块

**占位符：**
- `{{COMPONENT_NAME}}` - 组件名称
- `{{DESCRIPTION}}` - 组件描述
- `{{COMPONENT_CLASS}}` - 组件 CSS 类名

### composable.ts.template

组合式函数模板，包含：

**结构特点：**
- 标准函数结构
- 响应式状态管理
- 生命周期集成
- 返回值类型定义
- 完整的 TypeScript 类型

**占位符：**
- `{{COMPOSABLE_NAME}}` - 组合式函数名称
- `{{DESCRIPTION}}` - 函数描述

## 🔧 使用方法

### 生成基础组件

当需要创建一个新组件时，使用以下结构：

```vue
<script setup lang="ts">
// 1. 导入依赖
import { ref, computed, onMounted } from 'vue'

// 2. 类型定义
interface Props {
  // props 类型
}

interface Emits {
  // emits 类型
}

// 3. Props 和 Emits
const props = withDefaults(defineProps<Props>(), {
  // 默认值
})

const emit = defineEmits<Emits>()

// 4. 响应式状态
const state = ref()

// 5. 计算属性
const computedValue = computed(() => {})

// 6. 方法
const handleAction = () => {}

// 7. 生命周期
onMounted(() => {})
</script>

<template>
  <!-- 模板内容 -->
</template>

<style scoped>
/* 样式 */
</style>
```

### 生成组合式函数

当需要创建可复用逻辑时：

```typescript
import { ref, onMounted, onUnmounted } from 'vue'

interface UseXxxOptions {
  // 配置选项类型
}

interface UseXxxReturn {
  // 返回值类型
}

export function useXxx(options: UseXxxOptions = {}): UseXxxReturn {
  // 响应式状态
  const state = ref()

  // 方法
  const doSomething = () => {}

  // 生命周期
  onMounted(() => {})
  onUnmounted(() => {})

  // 返回
  return {
    state,
    doSomething
  }
}
```

## ✅ 最佳实践

### 命名规范

**组件文件：**
- 使用 PascalCase.vue（如 UserProfile.vue）
- 文件名应描述组件功能
- 避免使用缩写

**组合式函数：**
- use 前缀 + camelCase（如 useUserAuth.ts）
- 描述性命名
- 一个文件一个 composable

**Props：**
- 使用 camelCase
- 布尔值使用 is/has/should 前缀
- 示例：isVisible, hasError, shouldAutoFocus

**Events：**
- 使用 kebab-case
- 使用动词描述动作
- 示例：update:modelValue, item-selected, form-submitted

### 组件结构顺序

#### script setup 区域顺序：
1. 导入语句（Vue 核心 → 第三方库 → 本地模块）
2. 类型定义（Interfaces/Types）
3. Props 定义
4. Emits 定义
5. 组合式函数调用
6. 响应式状态（ref/reactive）
7. 计算属性（computed）
8. 方法函数
9. 监听器（watch/watchEffect）
10. 生命周期钩子
11. defineExpose（如需要）

#### 单文件组件顺序：
1. `<script setup>`
2. `<template>`
3. `<style scoped>`

### Props 设计原则

**必需 vs 可选：**
```typescript
interface Props {
  // 必需 props - 不设默认值
  title: string
  userId: string
  
  // 可选 props - 提供默认值
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  disabled: false
})
```

**Props 数量：**
- 尽量少于 5 个
- 超过 5 个考虑重构为配置对象
- 或拆分为多个子组件

**复杂类型：**
```typescript
// ✅ 推荐：使用 interface 定义
interface User {
  id: string
  name: string
  avatar: string
}

interface Props {
  user: User
}

// ❌ 不推荐：内联定义
interface Props {
  user: {
    id: string
    name: string
    avatar: string
  }
}
```

### 事件设计原则

**命名约定：**
```typescript
// ✅ 推荐：描述性动词
interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'item-selected', item: Item): void
  (e: 'form-submitted', data: FormData): void
}

// ❌ 不推荐：模糊命名
interface Emits {
  (e: 'change', value: any): void
  (e: 'click'): void
}
```

**v-model 模式：**
```typescript
// 遵循 update:xxx 模式实现 v-model
interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

// 使用
const emit = defineEmits<Emits>()
const updateValue = (newValue: string) => {
  emit('update:modelValue', newValue)
}
```

**事件参数类型：**
```typescript
// ✅ 提供清晰的类型
interface SelectEvent {
  item: Item
  index: number
  event: MouseEvent
}

interface Emits {
  (e: 'select', data: SelectEvent): void
}

// ❌ 避免 any
interface Emits {
  (e: 'select', data: any): void
}
```

## ⚠️ 注意事项

### 1. 避免在 setup 中使用 this

```typescript
// ❌ 错误：Composition API 中没有 this
const handleClick = function() {
  console.log(this.value) // undefined
}

// ✅ 正确：直接使用变量
const value = ref('')
const handleClick = () => {
  console.log(value.value)
}
```

### 2. 响应式解构会丢失响应性

```typescript
// ❌ 错误：解构丢失响应性
const { name, age } = reactive({ name: '张三', age: 18 })
// name 和 age 不再是响应式

// ✅ 正确：使用 toRefs
const state = reactive({ name: '张三', age: 18 })
const { name, age } = toRefs(state)
// name 和 age 保持响应式

// ✅ 或者：从 store 解构时使用 storeToRefs
import { storeToRefs } from 'pinia'
const store = useUserStore()
const { name, age } = storeToRefs(store)
```

### 3. 注意 ref 和 reactive 的选择

```typescript
// ✅ 基础类型用 ref
const count = ref(0)
const message = ref('Hello')
const isVisible = ref(false)

// ✅ 对象类型可用 reactive
const user = reactive({
  name: '张三',
  age: 18
})

// ✅ 需要整体替换的用 ref
const user = ref({ name: '张三', age: 18 })
user.value = { name: '李四', age: 20 } // 可以整体替换

// ❌ reactive 不能整体替换
const user = reactive({ name: '张三', age: 18 })
user = { name: '李四', age: 20 } // 错误！丢失响应性
```

### 4. 生命周期钩子需要在 setup 同步调用

```typescript
// ✅ 正确：在 setup 顶层同步调用
onMounted(() => {
  console.log('mounted')
})

// ❌ 错误：在异步回调中注册
setTimeout(() => {
  onMounted(() => {
    console.log('mounted')
  })
}, 1000)

// ✅ 正确：可以在异步函数内执行逻辑
onMounted(async () => {
  const data = await fetchData()
  console.log(data)
})
```

## 💡 完整示例

### 示例 1：带搜索的列表组件

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

/**
 * @component SearchableList
 * @description 带搜索功能的列表组件
 */

// ==================== 类型定义 ====================

interface Item {
  id: string
  name: string
  description: string
}

interface Props {
  items: Item[]
  placeholder?: string
}

interface Emits {
  (e: 'item-click', item: Item): void
}

// ==================== Props & Emits ====================

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入搜索关键词'
})

const emit = defineEmits<Emits>()

// ==================== 响应式状态 ====================

const searchQuery = ref('')

// ==================== 计算属性 ====================

const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return props.items
  }

  const query = searchQuery.value.toLowerCase()
  return props.items.filter(item => 
    item.name.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  )
})

const itemCount = computed(() => filteredItems.value.length)

// ==================== 方法 ====================

const handleItemClick = (item: Item) => {
  emit('item-click', item)
}

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<template>
  <div class="searchable-list">
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        :placeholder="placeholder"
      />
      <button
        v-if="searchQuery"
        class="clear-button"
        @click="clearSearch"
      >
        清除
      </button>
    </div>

    <!-- 结果计数 -->
    <div class="result-count">
      找到 {{ itemCount }} 个结果
    </div>

    <!-- 列表 -->
    <div class="item-list">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="list-item"
        @click="handleItemClick(item)"
      >
        <div class="item-name">{{ item.name }}</div>
        <div class="item-description">{{ item.description }}</div>
      </div>

      <!-- 空状态 -->
      <div v-if="itemCount === 0" class="empty-state">
        没有找到匹配的结果
      </div>
    </div>
  </div>
</template>

<style scoped>
.searchable-list {
  width: 100%;
}

.search-box {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #1890ff;
}

.clear-button {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.clear-button:hover {
  background-color: #e0e0e0;
}

.result-count {
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list-item {
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.list-item:hover {
  background-color: #f0f0f0;
}

.item-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.item-description {
  font-size: 12px;
  color: #999;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #999;
}
</style>
```

### 示例 2：useFetch 组合式函数

```typescript
/**
 * @composable useFetch
 * @description 通用的数据获取 Hook
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Ref, ComputedRef } from 'vue'

// ==================== 类型定义 ====================

export interface UseFetchOptions<T> {
  /**
   * 初始数据
   */
  initialData?: T
  /**
   * 是否立即执行
   */
  immediate?: boolean
  /**
   * 请求超时时间（毫秒）
   */
  timeout?: number
  /**
   * 重试次数
   */
  retryCount?: number
  /**
   * 重试延迟（毫秒）
   */
  retryDelay?: number
}

export interface UseFetchReturn<T> {
  /**
   * 响应数据
   */
  data: Ref<T | undefined>
  /**
   * 加载状态
   */
  isLoading: Ref<boolean>
  /**
   * 错误信息
   */
  error: Ref<Error | null>
  /**
   * 是否成功
   */
  isSuccess: ComputedRef<boolean>
  /**
   * 是否失败
   */
  isError: ComputedRef<boolean>
  /**
   * 执行请求
   */
  execute: () => Promise<void>
  /**
   * 重置状态
   */
  reset: () => void
  /**
   * 取消请求
   */
  cancel: () => void
}

// ==================== 组合式函数 ====================

export function useFetch<T>(
  url: string | Ref<string>,
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
  const {
    initialData,
    immediate = true,
    timeout = 10000,
    retryCount = 0,
    retryDelay = 1000
  } = options

  // ==================== 响应式状态 ====================

  const data = ref<T | undefined>(initialData) as Ref<T | undefined>
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  let abortController: AbortController | null = null
  let retryAttempts = 0

  // ==================== 计算属性 ====================

  const isSuccess = computed(() => {
    return !isLoading.value && error.value === null && data.value !== undefined
  })

  const isError = computed(() => {
    return !isLoading.value && error.value !== null
  })

  // ==================== 方法 ====================

  /**
   * 执行请求
   */
  const execute = async () => {
    // 取消之前的请求
    cancel()

    isLoading.value = true
    error.value = null

    // 创建新的 AbortController
    abortController = new AbortController()

    try {
      const currentUrl = typeof url === 'string' ? url : url.value

      const timeoutId = setTimeout(() => {
        abortController?.abort()
      }, timeout)

      const response = await fetch(currentUrl, {
        signal: abortController.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      data.value = await response.json()
      retryAttempts = 0
    } catch (err: any) {
      error.value = err

      // 如果不是主动取消且还有重试次数
      if (err.name !== 'AbortError' && retryAttempts < retryCount) {
        retryAttempts++
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        return execute()
      }
    } finally {
      isLoading.value = false
      abortController = null
    }
  }

  /**
   * 重置状态
   */
  const reset = () => {
    data.value = initialData
    isLoading.value = false
    error.value = null
    retryAttempts = 0
  }

  /**
   * 取消请求
   */
  const cancel = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  // ==================== 生命周期 ====================

  onMounted(() => {
    if (immediate) {
      execute()
    }
  })

  onUnmounted(() => {
    cancel()
  })

  // ==================== 返回 ====================

  return {
    data,
    isLoading,
    error,
    isSuccess,
    isError,
    execute,
    reset,
    cancel
  }
}
```

**使用示例：**

```vue
<script setup lang="ts">
import { useFetch } from '@/composables/useFetch'

interface User {
  id: number
  name: string
  email: string
}

const { data, isLoading, isError, error, execute } = useFetch<User[]>(
  'https://api.example.com/users',
  {
    immediate: true,
    retryCount: 3,
    retryDelay: 1000
  }
)
</script>

<template>
  <div>
    <div v-if="isLoading">加载中...</div>
    <div v-else-if="isError">错误：{{ error?.message }}</div>
    <div v-else>
      <div v-for="user in data" :key="user.id">
        {{ user.name }}
      </div>
    </div>
    <button @click="execute">重新加载</button>
  </div>
</template>
```

## 📚 参考资源

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vue 3 TypeScript 支持](https://cn.vuejs.org/guide/typescript/overview.html)
- [Pinia 官方文档](https://pinia.vuejs.org/)

---

**版本**: 1.0.0  
**最后更新**: 2024-12-10  
**兼容性**: Vue 3.3+, TypeScript 5.0+
