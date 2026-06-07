export const SKILLS = {
  cut_vegetables: {
    id: 'cut_vegetables',
    name: '蔬菜切配',
    emoji: '🔪',
    description: '掌握常见蔬菜的切法和处理技巧',
    level: 1
  },
  egg_cooking: {
    id: 'egg_cooking',
    name: '蛋类烹饪',
    emoji: '🥚',
    description: '学会煎、炒、蒸、煮等多种蛋类做法',
    level: 1
  },
  stir_fry_basic: {
    id: 'stir_fry_basic',
    name: '基础翻炒',
    emoji: '🍳',
    description: '掌握火候控制和翻炒的基本技巧',
    level: 1
  },
  seasoning: {
    id: 'seasoning',
    name: '调味基础',
    emoji: '🧂',
    description: '了解盐、糖、酱油等基础调料的使用',
    level: 1
  },
  meat_marinade: {
    id: 'meat_marinade',
    name: '肉类腌制',
    emoji: '🥩',
    description: '学会用调料腌制肉类，使其更入味',
    level: 2
  },
  sauce_making: {
    id: 'sauce_making',
    name: '酱汁调制',
    emoji: '🥫',
    description: '掌握各类菜肴酱汁的调配方法',
    level: 2
  },
  boiling: {
    id: 'boiling',
    name: '汆煮焯水',
    emoji: '💧',
    description: '学会食材的焯水和汆烫处理',
    level: 2
  },
  thickening: {
    id: 'thickening',
    name: '勾芡收汁',
    emoji: '🍯',
    description: '掌握淀粉勾芡和大火收汁的技巧',
    level: 2
  },
  frying: {
    id: 'frying',
    name: '油炸技巧',
    emoji: '🍗',
    description: '学会控制油温，炸出外酥里嫩的食物',
    level: 3
  },
  braising: {
    id: 'braising',
    name: '红烧炖煮',
    emoji: '🍲',
    description: '掌握慢炖和红烧的火候控制',
    level: 3
  },
  dough_making: {
    id: 'dough_making',
    name: '面团制作',
    emoji: '🥟',
    description: '学会和面、醒面、擀皮等面食基础',
    level: 3
  },
  sugar_cooking: {
    id: 'sugar_cooking',
    name: '糖色炒制',
    emoji: '🍬',
    description: '掌握炒糖色的技巧，为菜肴上色',
    level: 3
  },
  steak_cooking: {
    id: 'steak_cooking',
    name: '牛排煎制',
    emoji: '🥩',
    description: '掌握牛排熟度判断和淋油增香',
    level: 4
  },
  baking: {
    id: 'baking',
    name: '烘焙基础',
    emoji: '🎂',
    description: '了解烤箱使用和烘焙基本原理',
    level: 4
  },
  dessert_making: {
    id: 'dessert_making',
    name: '甜品制作',
    emoji: '🍮',
    description: '学会制作各类中式和西式甜点',
    level: 4
  },
  plating: {
    id: 'plating',
    name: '装盘美化',
    emoji: '🍽️',
    description: '提升菜肴的视觉呈现和摆盘技巧',
    level: 4
  },
  menu_planning: {
    id: 'menu_planning',
    name: '菜单设计',
    emoji: '📋',
    description: '学会搭配一桌营养均衡的宴席',
    level: 5
  },
  advanced_skills: {
    id: 'advanced_skills',
    name: '进阶技巧',
    emoji: '👨‍🍳',
    description: '掌握高阶烹饪技巧，成为厨房达人',
    level: 5
  }
}

export const TRAINING_STAGES = [
  {
    id: 1,
    name: '厨房小白入门',
    description: '从零开始，学会最基础的烹饪技巧，做出人生第一道菜',
    icon: '🌱',
    color: '#4CAF50',
    unlockLevel: 0,
    tasks: [
      {
        id: 't1-1',
        recipeId: 3,
        title: '番茄炒蛋',
        description: '最经典的家常菜，练习基础翻炒和调味',
        skills: ['egg_cooking', 'stir_fry_basic', 'seasoning'],
        tips: '油温要高，蛋液入锅立刻膨胀；加一点糖可以提鲜'
      },
      {
        id: 't1-2',
        recipeId: 8,
        title: '清炒时蔬',
        description: '练习蔬菜处理和大火快炒的技巧',
        skills: ['cut_vegetables', 'stir_fry_basic', 'seasoning'],
        tips: '菜梗和菜叶要分开炒，保证熟度一致'
      },
      {
        id: 't1-3',
        recipeId: 4,
        title: '麻婆豆腐',
        description: '学会豆腐处理和简单勾芡',
        skills: ['boiling', 'thickening', 'seasoning'],
        tips: '豆腐焯水可以去除豆腥味'
      }
    ]
  },
  {
    id: 2,
    name: '家常菜达人',
    description: '掌握常见肉类和蔬菜的烹饪方法，做出一桌像样的家常菜',
    icon: '🍳',
    color: '#FF9800',
    unlockLevel: 1,
    tasks: [
      {
        id: 't2-1',
        recipeId: 1,
        title: '宫保鸡丁',
        description: '练习鸡肉腌制和调味汁调配',
        skills: ['meat_marinade', 'sauce_making', 'stir_fry_basic'],
        tips: '花生米最后放，保持酥脆口感'
      },
      {
        id: 't2-2',
        recipeId: 7,
        title: '回锅肉',
        description: '学习五花肉处理和川菜经典调味',
        skills: ['boiling', 'meat_marinade', 'seasoning'],
        tips: '肉片要煸至卷曲，俗称"灯盏窝"'
      },
      {
        id: 't2-3',
        recipeId: 9,
        title: '意大利面',
        description: '掌握意面煮法和西式酱汁制作',
        skills: ['sauce_making', 'seasoning'],
        tips: '煮面水要加盐，面条要煮至al dente'
      },
      {
        id: 't2-4',
        recipeId: 6,
        title: '鱼香肉丝',
        description: '练习切丝刀工和鱼香味调配',
        skills: ['cut_vegetables', 'sauce_making', 'meat_marinade'],
        tips: '酸甜比例1:1，调出正宗鱼香味'
      }
    ]
  },
  {
    id: 3,
    name: '硬菜挑战',
    description: '挑战红烧、糖醋等复杂技法，学会宴客级别的硬菜',
    icon: '🍖',
    color: '#E91E63',
    unlockLevel: 2,
    tasks: [
      {
        id: 't3-1',
        recipeId: 2,
        title: '红烧肉',
        description: '学习糖色炒制和慢炖技巧',
        skills: ['sugar_cooking', 'braising', 'boiling'],
        tips: '一定要加开水，冷水会使肉紧缩'
      },
      {
        id: 't3-2',
        recipeId: 5,
        title: '糖醋排骨',
        description: '掌握复炸技巧和糖醋汁比例',
        skills: ['frying', 'sauce_making', 'meat_marinade'],
        tips: '复炸一次更酥脆，糖醋比例1:1'
      },
      {
        id: 't3-3',
        recipeId: 22,
        title: '炸鸡翅',
        description: '练习腌制和油炸温度控制',
        skills: ['meat_marinade', 'frying', 'seasoning'],
        tips: '油温170度中小火慢炸，最后升高油温复炸'
      }
    ]
  },
  {
    id: 4,
    name: '面点高手',
    description: '从面粉到美食，掌握饺子、葱油饼等中式面点',
    icon: '🥟',
    color: '#9C27B0',
    unlockLevel: 3,
    tasks: [
      {
        id: 't4-1',
        recipeId: 20,
        title: '煎饺',
        description: '学习调馅、包饺子和煎制技巧',
        skills: ['dough_making', 'meat_marinade', 'frying'],
        tips: '白菜要挤干水分，防止饺子出水'
      },
      {
        id: 't4-2',
        recipeId: 21,
        title: '葱油饼',
        description: '掌握热水面团和分层技巧',
        skills: ['dough_making', 'seasoning'],
        tips: '葱花多一些更香，中小火慢煎'
      }
    ]
  },
  {
    id: 5,
    name: '甜品入门',
    description: '开启甜蜜之旅，学会制作经典甜品和饮品',
    icon: '🍰',
    color: '#FF5722',
    unlockLevel: 4,
    tasks: [
      {
        id: 't5-1',
        recipeId: 14,
        title: '芒果布丁',
        description: '学习吉利丁使用和淡奶油打发',
        skills: ['dessert_making', 'seasoning'],
        tips: '吉利丁要用冷水泡软，不要用热水'
      },
      {
        id: 't5-2',
        recipeId: 16,
        title: '双皮奶',
        description: '掌握蒸制技巧和奶皮形成',
        skills: ['dessert_making', 'seasoning'],
        tips: '盖保鲜膜防止水汽滴落'
      },
      {
        id: 't5-3',
        recipeId: 17,
        title: '杨枝甘露',
        description: '练习西米煮法和食材搭配',
        skills: ['dessert_making', 'seasoning'],
        tips: '西米煮15分钟后关火焖10分钟更Q弹'
      },
      {
        id: 't5-4',
        recipeId: 18,
        title: '珍珠奶茶',
        description: '学习珍珠煮制和奶茶调配',
        skills: ['dessert_making', 'seasoning'],
        tips: '边煮边搅拌防止粘底'
      }
    ]
  },
  {
    id: 6,
    name: '进阶料理',
    description: '挑战牛排、烘焙等高阶技巧，成为真正的厨房达人',
    icon: '👨‍🍳',
    color: '#3F51B5',
    unlockLevel: 5,
    tasks: [
      {
        id: 't6-1',
        recipeId: 10,
        title: '牛排',
        description: '掌握牛排煎制的专业技巧',
        skills: ['steak_cooking', 'meat_marinade', 'seasoning'],
        tips: '牛排要提前回温，表面吸干水分才能煎出焦壳'
      },
      {
        id: 't6-2',
        recipeId: 15,
        title: '巧克力蛋糕',
        description: '学习烤箱使用和蛋糕烘焙',
        skills: ['baking', 'dessert_making', 'plating'],
        tips: '面粉要过筛，防止结块'
      },
      {
        id: 't6-3',
        recipeId: 13,
        title: '提拉米苏',
        description: '掌握意式甜点的经典做法',
        skills: ['dessert_making', 'plating', 'seasoning'],
        tips: '手指饼干快速蘸咖啡液，不要泡太久'
      },
      {
        id: 't6-4',
        recipeId: 11,
        title: '凯撒沙拉',
        description: '学习沙拉酱汁和食材搭配',
        skills: ['menu_planning', 'sauce_making', 'plating'],
        tips: '面包丁最后放，保持酥脆'
      }
    ]
  }
]

export const ACHIEVEMENTS = [
  {
    id: 'first_dish',
    name: '初出茅庐',
    description: '完成第一道菜',
    icon: '🎉',
    condition: (stats) => stats.completedTasks >= 1
  },
  {
    id: 'stage1_complete',
    name: '入门学徒',
    description: '完成第一阶段学习',
    icon: '🌱',
    condition: (stats) => stats.completedStages.includes(1)
  },
  {
    id: 'home_cook',
    name: '家庭主厨',
    description: '完成家常菜达人阶段',
    icon: '👨‍🍳',
    condition: (stats) => stats.completedStages.includes(2)
  },
  {
    id: 'hard_dish_master',
    name: '硬菜高手',
    description: '完成硬菜挑战阶段',
    icon: '🏆',
    condition: (stats) => stats.completedStages.includes(3)
  },
  {
    id: 'pastry_chef',
    name: '面点师',
    description: '完成面点高手阶段',
    icon: '🥟',
    condition: (stats) => stats.completedStages.includes(4)
  },
  {
    id: 'sweet_lover',
    name: '甜品达人',
    description: '完成甜品入门阶段',
    icon: '🍰',
    condition: (stats) => stats.completedStages.includes(5)
  },
  {
    id: 'master_chef',
    name: '烹饪大师',
    description: '完成所有阶段学习',
    icon: '👑',
    condition: (stats) => stats.completedStages.length === 6
  },
  {
    id: 'skill_collector',
    name: '技能收集者',
    description: '掌握10种烹饪技巧',
    icon: '📚',
    condition: (stats) => stats.unlockedSkills.length >= 10
  },
  {
    id: 'skill_master',
    name: '技能大师',
    description: '掌握所有烹饪技巧',
    icon: '🎓',
    condition: (stats) => stats.unlockedSkills.length >= 18
  },
  {
    id: 'speed_cook',
    name: '快手厨师',
    description: '完成10道菜肴',
    icon: '⚡',
    condition: (stats) => stats.completedTasks >= 10
  }
]

export default TRAINING_STAGES
