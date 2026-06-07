export const lowFatRecipes = [
  {
    id: 1001,
    name: '清蒸鸡胸肉',
    category: '减脂',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 15,
    servings: 1,
    emoji: '🍗',
    coverColor: '#4CAF50',
    calories: 185,
    protein: 35,
    carbs: 0,
    fat: 4,
    description: '高蛋白低脂肪的减脂首选，鲜嫩多汁不柴。',
    ingredients: [
      { name: '鸡胸肉', amount: '200g', note: '切片' },
      { name: '生姜', amount: '3片', note: null },
      { name: '葱', amount: '2根', note: '切段' },
      { name: '料酒', amount: '1勺', note: null },
      { name: '盐', amount: '适量', note: null },
      { name: '黑胡椒', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '鸡胸肉洗净切片，加料酒、盐、黑胡椒腌制10分钟', tip: '用刀背拍松肉质更嫩' },
      { order: 2, description: '盘底铺姜片和葱段，放上鸡胸肉', tip: null },
      { order: 3, description: '水开后上锅蒸12-15分钟', tip: '不要蒸太久，避免肉质变老' },
      { order: 4, description: '取出后可淋少许生抽或撒葱花', tip: '搭配柠檬汁更清爽' }
    ],
    tags: ['减脂', '高蛋白', '清蒸', '低油']
  },
  {
    id: 1002,
    name: '香煎三文鱼',
    category: '减脂',
    difficulty: '中等',
    prepTime: 10,
    cookTime: 12,
    servings: 1,
    emoji: '🐟',
    coverColor: '#2196F3',
    calories: 280,
    protein: 22,
    carbs: 0,
    fat: 20,
    description: '富含优质脂肪和Omega-3，健康减脂两不误。',
    ingredients: [
      { name: '三文鱼', amount: '180g', note: null },
      { name: '柠檬', amount: '半个', note: null },
      { name: '海盐', amount: '适量', note: null },
      { name: '黑胡椒', amount: '适量', note: null },
      { name: '橄榄油', amount: '1勺', note: null },
      { name: '迷迭香', amount: '1枝', note: '可选' }
    ],
    steps: [
      { order: 1, description: '三文鱼用厨房纸吸干表面水分', tip: '表面干燥才能煎出脆皮' },
      { order: 2, description: '两面撒海盐和黑胡椒腌制5分钟', tip: null },
      { order: 3, description: '热锅倒少许橄榄油，鱼皮朝下煎4分钟', tip: '中小火慢煎' },
      { order: 4, description: '翻面继续煎3-4分钟', tip: '挤上柠檬汁提鲜' },
      { order: 5, description: '出锅前放上迷迭香，用余温逼出香气', tip: '搭配水煮蔬菜更佳' }
    ],
    tags: ['减脂', '优质脂肪', '高蛋白', '低油']
  },
  {
    id: 1003,
    name: '西兰花炒虾仁',
    category: '减脂',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 8,
    servings: 2,
    emoji: '🥦',
    coverColor: '#8BC34A',
    calories: 150,
    protein: 20,
    carbs: 8,
    fat: 4,
    description: '高蛋白高纤维，清爽不油腻的减脂好菜。',
    ingredients: [
      { name: '虾仁', amount: '200g', note: '去虾线' },
      { name: '西兰花', amount: '300g', note: '切小朵' },
      { name: '蒜末', amount: '3瓣', note: null },
      { name: '料酒', amount: '1勺', note: null },
      { name: '盐', amount: '适量', note: null },
      { name: '橄榄油', amount: '1勺', note: null }
    ],
    steps: [
      { order: 1, description: '虾仁加料酒、少许盐腌制5分钟', tip: null },
      { order: 2, description: '西兰花入沸水焯1分钟捞出过冷水', tip: '保持翠绿色泽' },
      { order: 3, description: '热锅少油，爆香蒜末', tip: null },
      { order: 4, description: '下虾仁快速翻炒至变色', tip: '约1-2分钟' },
      { order: 5, description: '加入西兰花继续翻炒2分钟', tip: '大火快炒保持脆嫩' },
      { order: 6, description: '加盐调味出锅', tip: '不要炒太久' }
    ],
    tags: ['减脂', '低热量', '高蛋白', '高纤维']
  },
  {
    id: 1004,
    name: '凉拌黄瓜鸡丝',
    category: '减脂',
    difficulty: '简单',
    prepTime: 15,
    cookTime: 10,
    servings: 2,
    emoji: '🥒',
    coverColor: '#CDDC39',
    calories: 120,
    protein: 18,
    carbs: 6,
    fat: 3,
    description: '清爽开胃的凉拌菜，低卡饱腹又美味。',
    ingredients: [
      { name: '鸡胸肉', amount: '200g', note: null },
      { name: '黄瓜', amount: '2根', note: '切丝' },
      { name: '大蒜', amount: '3瓣', note: '切末' },
      { name: '生抽', amount: '2勺', note: null },
      { name: '醋', amount: '1勺', note: null },
      { name: '香油', amount: '少许', note: null },
      { name: '香菜', amount: '少许', note: '可选' }
    ],
    steps: [
      { order: 1, description: '鸡胸肉冷水下锅煮熟，约10分钟', tip: '用筷子能轻松穿透即熟' },
      { order: 2, description: '煮熟的鸡胸肉放凉后撕成细丝', tip: '顺着纹理撕更省力' },
      { order: 3, description: '黄瓜切丝铺在盘底', tip: '用盐腌一下挤水更爽脆' },
      { order: 4, description: '放上鸡丝，撒上蒜末和香菜', tip: null },
      { order: 5, description: '淋上生抽、醋、香油拌匀', tip: '冷藏后口感更佳' }
    ],
    tags: ['减脂', '凉拌', '低卡', '高蛋白']
  },
  {
    id: 1005,
    name: '藜麦鸡胸肉沙拉',
    category: '减脂',
    difficulty: '简单',
    prepTime: 20,
    cookTime: 15,
    servings: 2,
    emoji: '🥗',
    coverColor: '#FF9800',
    calories: 320,
    protein: 28,
    carbs: 35,
    fat: 8,
    description: '营养均衡的减脂沙拉，碳水蛋白脂肪黄金配比。',
    ingredients: [
      { name: '藜麦', amount: '100g', note: null },
      { name: '鸡胸肉', amount: '200g', note: null },
      { name: '生菜', amount: '1颗', note: '撕小块' },
      { name: '小番茄', amount: '10个', note: '对半切' },
      { name: '黄瓜', amount: '半根', note: '切丁' },
      { name: '橄榄油', amount: '2勺', note: null },
      { name: '柠檬汁', amount: '2勺', note: null },
      { name: '黑胡椒', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '藜麦洗净，加水煮15分钟至透明', tip: '藜麦与水比例1:2' },
      { order: 2, description: '鸡胸肉煎熟或煮熟切片', tip: '煎制更香但热量稍高' },
      { order: 3, description: '生菜洗净沥干，铺在碗底', tip: null },
      { order: 4, description: '依次放上藜麦、鸡胸肉、小番茄、黄瓜', tip: '颜色搭配更有食欲' },
      { order: 5, description: '橄榄油、柠檬汁、黑胡椒调汁淋上', tip: '现吃现拌更脆' }
    ],
    tags: ['减脂', '沙拉', '低GI', '营养均衡']
  },
  {
    id: 1006,
    name: '清蒸鲈鱼',
    category: '减脂',
    difficulty: '中等',
    prepTime: 15,
    cookTime: 12,
    servings: 2,
    emoji: '🐠',
    coverColor: '#00BCD4',
    calories: 140,
    protein: 25,
    carbs: 0,
    fat: 4,
    description: '低脂高蛋白，肉质细嫩易消化，减脂期绝佳选择。',
    ingredients: [
      { name: '鲈鱼', amount: '500g', note: '处理干净' },
      { name: '生姜', amount: '5片', note: null },
      { name: '葱', amount: '3根', note: '切丝' },
      { name: '料酒', amount: '2勺', note: null },
      { name: '蒸鱼豉油', amount: '2勺', note: null },
      { name: '盐', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '鲈鱼两面划几刀，抹盐和料酒腌制10分钟', tip: null },
      { order: 2, description: '鱼身和鱼肚放入姜片和葱段', tip: null },
      { order: 3, description: '水开后上锅蒸8-10分钟', tip: '根据鱼大小调整时间' },
      { order: 4, description: '蒸好后倒掉盘中汤汁，捡去葱姜', tip: '去掉腥味重的汤汁' },
      { order: 5, description: '淋上蒸鱼豉油，撒上新葱丝', tip: null },
      { order: 6, description: '烧热少许油淋在葱丝上', tip: '低油版可省略此步' }
    ],
    tags: ['减脂', '低脂肪', '高蛋白', '清蒸']
  },
  {
    id: 1007,
    name: '芦笋炒牛肉',
    category: '减脂',
    difficulty: '中等',
    prepTime: 15,
    cookTime: 8,
    servings: 2,
    emoji: '🥩',
    coverColor: '#795548',
    calories: 220,
    protein: 28,
    carbs: 6,
    fat: 9,
    description: '嫩牛柳配鲜芦笋，高蛋白高纤维，减脂期的美味享受。',
    ingredients: [
      { name: '牛里脊', amount: '200g', note: '切薄片' },
      { name: '芦笋', amount: '200g', note: '切斜段' },
      { name: '蒜末', amount: '3瓣', note: null },
      { name: '生抽', amount: '1勺', note: null },
      { name: '料酒', amount: '1勺', note: null },
      { name: '淀粉', amount: '1勺', note: null },
      { name: '橄榄油', amount: '1勺', note: null },
      { name: '黑胡椒', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '牛肉加生抽、料酒、淀粉、黑胡椒腌制10分钟', tip: '加少许油锁住水分' },
      { order: 2, description: '芦笋入沸水焯30秒捞出过冷水', tip: '保持脆嫩' },
      { order: 3, description: '热锅少油，爆香蒜末', tip: null },
      { order: 4, description: '下牛肉快速滑炒至变色盛出', tip: '大火快炒保持嫩滑' },
      { order: 5, description: '锅中留底油，下芦笋翻炒1分钟', tip: null },
      { order: 6, description: '牛肉回锅，一起翻炒均匀出锅', tip: '不要炒太久' }
    ],
    tags: ['减脂', '高蛋白', '补铁', '低油']
  },
  {
    id: 1008,
    name: '番茄金针菇豆腐汤',
    category: '减脂',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    emoji: '🍲',
    coverColor: '#E91E63',
    calories: 95,
    protein: 10,
    carbs: 12,
    fat: 2,
    description: '低卡饱腹的美味汤品，暖胃又不发胖。',
    ingredients: [
      { name: '番茄', amount: '2个', note: '切块' },
      { name: '金针菇', amount: '150g', note: '去根撕开' },
      { name: '嫩豆腐', amount: '1盒', note: '切块' },
      { name: '鸡蛋', amount: '1个', note: '打散' },
      { name: '葱花', amount: '少许', note: null },
      { name: '盐', amount: '适量', note: null },
      { name: '香油', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '番茄去皮切块，金针菇洗净撕散', tip: '番茄顶部划十字烫一下容易去皮' },
      { order: 2, description: '锅中少油，炒番茄至出沙', tip: '边炒边压更容易出沙' },
      { order: 3, description: '加入适量清水煮开', tip: null },
      { order: 4, description: '放入金针菇和豆腐煮5分钟', tip: null },
      { order: 5, description: '淋入蛋液形成蛋花', tip: '蛋液要慢慢淋入' },
      { order: 6, description: '加盐调味，撒葱花，滴香油', tip: '香油少量即可' }
    ],
    tags: ['减脂', '低卡', '汤品', '高蛋白']
  },
  {
    id: 1009,
    name: '燕麦水果碗',
    category: '减脂',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 5,
    servings: 1,
    emoji: '🥣',
    coverColor: '#9C27B0',
    calories: 280,
    protein: 10,
    carbs: 45,
    fat: 6,
    description: '健康减脂早餐，高纤维慢吸收，饱腹一上午。',
    ingredients: [
      { name: '即食燕麦', amount: '50g', note: null },
      { name: '脱脂牛奶', amount: '200ml', note: null },
      { name: '蓝莓', amount: '50g', note: null },
      { name: '草莓', amount: '3颗', note: '切片' },
      { name: '香蕉', amount: '半根', note: '切片' },
      { name: '奇亚籽', amount: '5g', note: null },
      { name: '肉桂粉', amount: '少许', note: '可选' }
    ],
    steps: [
      { order: 1, description: '燕麦用牛奶或温水浸泡5分钟', tip: '冷藏过夜口感更好' },
      { order: 2, description: '撒上奇亚籽和肉桂粉', tip: null },
      { order: 3, description: '摆上切好的水果', tip: '水果随季节变化' },
      { order: 4, description: '可以淋少许蜂蜜增加风味', tip: '严格减脂期可省略' }
    ],
    tags: ['减脂', '早餐', '高纤维', '低GI']
  },
  {
    id: 1010,
    name: '菠菜鸡蛋卷',
    category: '减脂',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 8,
    servings: 2,
    emoji: '🍳',
    coverColor: '#3F51B5',
    calories: 160,
    protein: 14,
    carbs: 4,
    fat: 9,
    description: '高蛋白高纤维的减脂早餐，简单易做。',
    ingredients: [
      { name: '鸡蛋', amount: '3个', note: null },
      { name: '菠菜', amount: '100g', note: '切碎' },
      { name: '牛奶', amount: '30ml', note: null },
      { name: '盐', amount: '适量', note: null },
      { name: '橄榄油', amount: '1勺', note: null },
      { name: '黑胡椒', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '菠菜焯水挤干水分切碎', tip: '去除草酸' },
      { order: 2, description: '鸡蛋加牛奶、盐、黑胡椒打散', tip: null },
      { order: 3, description: '加入菠菜碎拌匀', tip: null },
      { order: 4, description: '平底锅刷薄油，倒入蛋液', tip: '小火慢煎' },
      { order: 5, description: '底部凝固后卷起来，继续煎至金黄', tip: '卷成柱状切片' }
    ],
    tags: ['减脂', '早餐', '高蛋白', '低卡']
  },
  {
    id: 1011,
    name: '紫薯鸡胸肉卷',
    category: '减脂',
    difficulty: '中等',
    prepTime: 20,
    cookTime: 25,
    servings: 2,
    emoji: '🍠',
    coverColor: '#673AB7',
    calories: 260,
    protein: 28,
    carbs: 22,
    fat: 6,
    description: '颜值高又美味的减脂餐，碳水蛋白完美搭配。',
    ingredients: [
      { name: '鸡胸肉', amount: '300g', note: '切薄片' },
      { name: '紫薯', amount: '150g', note: null },
      { name: '生菜', amount: '2片', note: null },
      { name: '黄瓜', amount: '半根', note: '切条' },
      { name: '黑胡椒', amount: '适量', note: null },
      { name: '盐', amount: '适量', note: null },
      { name: '料酒', amount: '1勺', note: null }
    ],
    steps: [
      { order: 1, description: '紫薯蒸熟压成泥', tip: '不用加糖' },
      { order: 2, description: '鸡胸肉用刀背拍松，加料酒、盐、黑胡椒腌制', tip: '拍至0.5cm厚' },
      { order: 3, description: '鸡胸肉片铺平，抹上紫薯泥', tip: '边缘留出不要抹' },
      { order: 4, description: '放上生菜和黄瓜条', tip: null },
      { order: 5, description: '卷起来，用牙签固定', tip: '卷紧一些' },
      { order: 6, description: '蒸锅水开后蒸20分钟', tip: '也可以用空气炸锅' },
      { order: 7, description: '取出切段，拔掉牙签', tip: '搭配蘸料食用' }
    ],
    tags: ['减脂', '高蛋白', '低GI', '创意菜']
  },
  {
    id: 1012,
    name: '凉拌木耳秋葵',
    category: '减脂',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 5,
    servings: 2,
    emoji: '🫑',
    coverColor: '#009688',
    calories: 85,
    protein: 4,
    carbs: 12,
    fat: 2,
    description: '高纤维低热量的凉拌菜，清肠又减脂。',
    ingredients: [
      { name: '秋葵', amount: '200g', note: null },
      { name: '干木耳', amount: '10g', note: '泡发' },
      { name: '蒜末', amount: '3瓣', note: null },
      { name: '生抽', amount: '2勺', note: null },
      { name: '醋', amount: '1勺', note: null },
      { name: '小米辣', amount: '1个', note: '可选' },
      { name: '香油', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '秋葵洗净，木耳提前泡发', tip: null },
      { order: 2, description: '水开加少许盐和油，放入秋葵焯2分钟', tip: '保持翠绿色' },
      { order: 3, description: '木耳焯1分钟捞出', tip: null },
      { order: 4, description: '秋葵切小段，木耳撕小朵', tip: null },
      { order: 5, description: '加入蒜末、小米辣、生抽、醋、香油拌匀', tip: '冷藏半小时更入味' }
    ],
    tags: ['减脂', '低卡', '高纤维', '凉拌']
  },
  {
    id: 1013,
    name: '希腊酸奶水果杯',
    category: '减脂',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    emoji: '🥛',
    coverColor: '#607D8B',
    calories: 200,
    protein: 18,
    carbs: 25,
    fat: 2,
    description: '高蛋白低脂肪的健康甜点或早餐。',
    ingredients: [
      { name: '无糖希腊酸奶', amount: '200g', note: null },
      { name: '蓝莓', amount: '30g', note: null },
      { name: '树莓', amount: '30g', note: null },
      { name: '燕麦片', amount: '15g', note: null },
      { name: '杏仁片', amount: '10g', note: null },
      { name: '蜂蜜', amount: '少许', note: '可选' }
    ],
    steps: [
      { order: 1, description: '杯子底部铺上一层酸奶', tip: null },
      { order: 2, description: '撒上燕麦片和杏仁片', tip: null },
      { order: 3, description: '再铺一层酸奶和水果', tip: '层层叠加更好看' },
      { order: 4, description: '顶部装饰水果和杏仁片', tip: '可淋少许蜂蜜' }
    ],
    tags: ['减脂', '早餐', '高蛋白', '低卡']
  },
  {
    id: 1014,
    name: '冬瓜虾仁汤',
    category: '减脂',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    emoji: '🥘',
    coverColor: '#03A9F4',
    calories: 80,
    protein: 12,
    carbs: 5,
    fat: 1,
    description: '利尿消水肿的减脂汤，清淡鲜美无负担。',
    ingredients: [
      { name: '冬瓜', amount: '300g', note: '去皮切片' },
      { name: '虾仁', amount: '100g', note: '去虾线' },
      { name: '鸡蛋', amount: '1个', note: null },
      { name: '葱花', amount: '少许', note: null },
      { name: '盐', amount: '适量', note: null },
      { name: '香油', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '虾仁加少许料酒腌制5分钟', tip: null },
      { order: 2, description: '锅中加水烧开，放入冬瓜片', tip: null },
      { order: 3, description: '冬瓜煮至透明后加入虾仁', tip: null },
      { order: 4, description: '虾仁变色后淋入蛋液', tip: '慢慢淋入形成蛋花' },
      { order: 5, description: '加盐调味，撒葱花，滴香油', tip: '不要加太多盐' }
    ],
    tags: ['减脂', '低卡', '消水肿', '汤品']
  },
  {
    id: 1015,
    name: '糙米蔬菜碗',
    category: '减脂',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 40,
    servings: 2,
    emoji: '🍚',
    coverColor: '#795548',
    calories: 350,
    protein: 12,
    carbs: 60,
    fat: 5,
    description: '慢吸收的优质碳水，搭配蔬菜营养均衡。',
    ingredients: [
      { name: '糙米', amount: '100g', note: null },
      { name: '胡萝卜', amount: '1根', note: '切丁' },
      { name: '豌豆', amount: '50g', note: null },
      { name: '玉米粒', amount: '50g', note: null },
      { name: '西兰花', amount: '100g', note: '切小朵' },
      { name: '橄榄油', amount: '1勺', note: null },
      { name: '盐', amount: '适量', note: null },
      { name: '黑胡椒', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '糙米提前浸泡2小时，煮熟备用', tip: '糙米与水比例1:2.5' },
      { order: 2, description: '胡萝卜丁、豌豆、玉米焯水备用', tip: null },
      { order: 3, description: '西兰花焯水备用', tip: null },
      { order: 4, description: '糙米铺在碗底，摆上蔬菜', tip: null },
      { order: 5, description: '淋少许橄榄油，撒盐和黑胡椒', tip: '可加个煎蛋增加蛋白' }
    ],
    tags: ['减脂', '低GI', '素食', '高纤维']
  }
]

export const FAT_LOSS_WEEK_PLAN = [
  {
    day: 1,
    label: '周一',
    theme: '高蛋白启动日',
    description: '高蛋白摄入，启动脂肪燃烧',
    breakfast: [1009, 1010],
    lunch: [1001, 1003, 1015],
    dinner: [1006, 1012],
    snack: [1013],
    tips: ['早餐要吃饱，避免上午饥饿', '多喝水，每天至少2000ml'],
    recommendedPairing: '高蛋白 + 高纤维，饱腹感强'
  },
  {
    day: 2,
    label: '周二',
    theme: '优质脂肪日',
    description: '摄入健康脂肪，促进新陈代谢',
    breakfast: [1009],
    lunch: [1002, 1012, 1015],
    dinner: [1003, 1008],
    snack: [1013],
    tips: ['三文鱼富含Omega-3，对身体有益', '控制脂肪摄入量，不要过量'],
    recommendedPairing: '优质脂肪 + 蔬菜，营养均衡'
  },
  {
    day: 3,
    label: '周三',
    theme: '轻断食日',
    description: '控制总热量，让肠胃休息',
    breakfast: [1010],
    lunch: [1004, 1008],
    dinner: [1014],
    snack: [1013],
    tips: ['今天热量较低，注意补充蛋白质', '如果感到头晕可以吃一小把坚果'],
    recommendedPairing: '低热量 + 高纤维，清肠排毒'
  },
  {
    day: 4,
    label: '周四',
    theme: '碳水循环日',
    description: '适量补充碳水，保持运动表现',
    breakfast: [1009, 1010],
    lunch: [1007, 1003, 1015],
    dinner: [1001, 1012],
    snack: [1013],
    tips: ['碳水集中在午餐摄入', '晚餐减少碳水，避免堆积脂肪'],
    recommendedPairing: '碳水 + 蛋白 + 蔬菜，黄金配比'
  },
  {
    day: 5,
    label: '周五',
    theme: '高蛋白巩固日',
    description: '巩固减脂成果，保持肌肉量',
    breakfast: [1010],
    lunch: [1006, 1003, 1015],
    dinner: [1004, 1008],
    snack: [1013],
    tips: ['多吃蛋白质，减少肌肉流失', '可以增加运动量'],
    recommendedPairing: '高蛋白 + 低热量，燃脂增肌'
  },
  {
    day: 6,
    label: '周六',
    theme: '创意减脂日',
    description: '尝试新的减脂食谱，保持兴趣',
    breakfast: [1009],
    lunch: [1011, 1012],
    dinner: [1005],
    snack: [1013],
    tips: ['可以适当放松，但不要暴饮暴食', '烹饪时少油少盐'],
    recommendedPairing: '创意料理 + 均衡营养，美味不发胖'
  },
  {
    day: 7,
    label: '周日',
    theme: '调整恢复日',
    description: '适度放松，调整状态迎接新一周',
    breakfast: [1009, 1010],
    lunch: [1007, 1012, 1015],
    dinner: [1014, 1008],
    snack: [1013],
    tips: ['可以和家人朋友分享减脂美食', '总结一周减脂成果，制定下周目标'],
    recommendedPairing: '营养均衡 + 适度放松，可持续减脂'
  }
]

export const FAT_LOSS_TIPS = [
  '每餐保证蛋白质摄入，提高饱腹感',
  '多吃蔬菜，每天至少500g',
  '选择低GI碳水，如糙米、燕麦、红薯',
  '用橄榄油、椰子油代替普通食用油',
  '每天喝够2000-2500ml水',
  '避免含糖饮料和精加工食品',
  '烹饪方式优先选择蒸、煮、烤、凉拌',
  '细嚼慢咽，每餐20分钟以上',
  '保证7-8小时睡眠，有助于减脂',
  '配合适量运动，效果更佳'
]

export const FAT_LOSS_NUTRIENT_GOALS = {
  dailyCalories: 1500,
  protein: 100,
  carbs: 150,
  fat: 40
}

export function getFatLossRecipeById(id) {
  return lowFatRecipes.find(r => r.id === Number(id))
}

export function getWeekPlanWithRecipes() {
  return FAT_LOSS_WEEK_PLAN.map(day => ({
    ...day,
    breakfastRecipes: day.breakfast.map(id => getFatLossRecipeById(id)).filter(Boolean),
    lunchRecipes: day.lunch.map(id => getFatLossRecipeById(id)).filter(Boolean),
    dinnerRecipes: day.dinner.map(id => getFatLossRecipeById(id)).filter(Boolean),
    snackRecipes: day.snack.map(id => getFatLossRecipeById(id)).filter(Boolean)
  }))
}

export function calculateDayNutrition(dayPlan) {
  const allRecipes = [
    ...dayPlan.breakfastRecipes,
    ...dayPlan.lunchRecipes,
    ...dayPlan.dinnerRecipes,
    ...dayPlan.snackRecipes
  ]
  
  return {
    calories: allRecipes.reduce((sum, r) => sum + (r.calories || 0), 0),
    protein: allRecipes.reduce((sum, r) => sum + (r.protein || 0), 0),
    carbs: allRecipes.reduce((sum, r) => sum + (r.carbs || 0), 0),
    fat: allRecipes.reduce((sum, r) => sum + (r.fat || 0), 0),
    totalPrepTime: allRecipes.reduce((sum, r) => sum + (r.prepTime || 0), 0),
    totalCookTime: allRecipes.reduce((sum, r) => sum + (r.cookTime || 0), 0),
    totalTime: allRecipes.reduce((sum, r) => sum + (r.prepTime || 0) + (r.cookTime || 0), 0),
    recipeCount: allRecipes.length
  }
}

export function calculateWeekNutrition() {
  const weekPlan = getWeekPlanWithRecipes()
  const dailyNutrition = weekPlan.map(day => calculateDayNutrition(day))
  
  return {
    daily: dailyNutrition,
    total: {
      calories: dailyNutrition.reduce((sum, d) => sum + d.calories, 0),
      protein: dailyNutrition.reduce((sum, d) => sum + d.protein, 0),
      carbs: dailyNutrition.reduce((sum, d) => sum + d.carbs, 0),
      fat: dailyNutrition.reduce((sum, d) => sum + d.fat, 0),
      totalTime: dailyNutrition.reduce((sum, d) => sum + d.totalTime, 0)
    },
    average: {
      calories: Math.round(dailyNutrition.reduce((sum, d) => sum + d.calories, 0) / 7),
      protein: Math.round(dailyNutrition.reduce((sum, d) => sum + d.protein, 0) / 7),
      carbs: Math.round(dailyNutrition.reduce((sum, d) => sum + d.carbs, 0) / 7),
      fat: Math.round(dailyNutrition.reduce((sum, d) => sum + d.fat, 0) / 7)
    }
  }
}

export default lowFatRecipes
