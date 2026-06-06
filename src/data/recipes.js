export const recipes = [
  {
    id: 1,
    name: '宫保鸡丁',
    category: '中餐',
    difficulty: '中等',
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    emoji: '🍗',
    coverColor: '#FF6B35',
    description: '经典川菜，鸡肉丁与花生米的完美结合，麻辣鲜香，回味无穷。',
    ingredients: [
      { name: '鸡胸肉', amount: '300g', note: '切丁' },
      { name: '花生米', amount: '50g', note: '炸熟' },
      { name: '干辣椒', amount: '10个', note: '剪段' },
      { name: '花椒', amount: '1小勺', note: null },
      { name: '葱姜蒜', amount: '适量', note: '切末' },
      { name: '料酒', amount: '1勺', note: null },
      { name: '生抽', amount: '2勺', note: null },
      { name: '醋', amount: '1勺', note: null },
      { name: '糖', amount: '1勺', note: null },
      { name: '淀粉', amount: '适量', note: '勾芡用' }
    ],
    steps: [
      { order: 1, description: '鸡胸肉切丁，加料酒、盐、淀粉腌制', tip: '腌制15分钟更入味' },
      { order: 2, description: '调制宫保汁：生抽、醋、糖、淀粉、水混合', tip: null },
      { order: 3, description: '热锅凉油，下花椒爆香后捞出', tip: '花椒炸至微黄即可' },
      { order: 4, description: '下干辣椒段爆香，加入鸡丁翻炒', tip: null },
      { order: 5, description: '鸡丁变色后加入葱姜蒜翻炒', tip: null },
      { order: 6, description: '倒入宫保汁，大火收汁', tip: null },
      { order: 7, description: '最后加入花生米，快速翻匀出锅', tip: '花生米最后放，保持酥脆' }
    ],
    tags: ['川菜', '下饭', '家常']
  },
  {
    id: 2,
    name: '红烧肉',
    category: '中餐',
    difficulty: '中等',
    prepTime: 20,
    cookTime: 90,
    servings: 4,
    emoji: '🥩',
    coverColor: '#8B4513',
    description: '肥而不腻、入口即化的经典红烧肉，色泽红亮，咸甜适口。',
    ingredients: [
      { name: '五花肉', amount: '500g', note: '切块' },
      { name: '冰糖', amount: '30g', note: null },
      { name: '生抽', amount: '3勺', note: null },
      { name: '老抽', amount: '1勺', note: '上色用' },
      { name: '料酒', amount: '2勺', note: null },
      { name: '八角', amount: '2个', note: null },
      { name: '桂皮', amount: '1小块', note: null },
      { name: '香叶', amount: '2片', note: null },
      { name: '葱姜', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '五花肉切块，冷水下锅焯水去血沫', tip: '焯水后冲洗干净' },
      { order: 2, description: '锅中少油，加冰糖小火炒至焦糖色', tip: '糖色不要炒糊，呈琥珀色即可' },
      { order: 3, description: '放入五花肉翻炒上色', tip: null },
      { order: 4, description: '加入葱姜、八角、桂皮、香叶', tip: null },
      { order: 5, description: '加料酒、生抽、老抽翻炒均匀', tip: null },
      { order: 6, description: '加开水没过肉块，大火烧开转小火炖1小时', tip: '一定要加开水，冷水会使肉紧缩' },
      { order: 7, description: '大火收汁，汤汁浓稠即可', tip: null }
    ],
    tags: ['家常菜', '硬菜', '下饭']
  },
  {
    id: 3,
    name: '番茄炒蛋',
    category: '中餐',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    emoji: '🍳',
    coverColor: '#FF4444',
    description: '最经典的家常菜，酸甜可口，营养丰富，简单易做。',
    ingredients: [
      { name: '番茄', amount: '2个', note: '切块' },
      { name: '鸡蛋', amount: '3个', note: '打散' },
      { name: '糖', amount: '1小勺', note: null },
      { name: '盐', amount: '适量', note: null },
      { name: '葱花', amount: '少许', note: '装饰用' }
    ],
    steps: [
      { order: 1, description: '鸡蛋打散加少许盐', tip: null },
      { order: 2, description: '热锅多油，倒入蛋液炒至凝固盛出', tip: '油温要高，蛋液入锅立刻膨胀' },
      { order: 3, description: '锅中留底油，放入番茄块翻炒', tip: null },
      { order: 4, description: '番茄出汁后加入糖和盐调味', tip: '加一点糖可以提鲜' },
      { order: 5, description: '倒入炒好的鸡蛋，翻匀出锅', tip: null },
      { order: 6, description: '撒上葱花装饰', tip: null }
    ],
    tags: ['家常', '快手', '下饭']
  },
  {
    id: 4,
    name: '麻婆豆腐',
    category: '中餐',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    emoji: '🫘',
    coverColor: '#D2691E',
    description: '麻辣鲜香烫，川味经典，豆腐嫩滑，肉末入味。',
    ingredients: [
      { name: '嫩豆腐', amount: '1盒', note: '切块' },
      { name: '猪肉末', amount: '100g', note: null },
      { name: '豆瓣酱', amount: '2勺', note: null },
      { name: '花椒粉', amount: '1小勺', note: null },
      { name: '蒜末', amount: '适量', note: null },
      { name: '淀粉', amount: '适量', note: '勾芡用' },
      { name: '葱花', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '豆腐切块，入沸水焯1分钟', tip: '焯水可以去豆腥味' },
      { order: 2, description: '热锅加油，炒香肉末', tip: null },
      { order: 3, description: '加入豆瓣酱炒出红油', tip: '小火慢炒，油色红亮' },
      { order: 4, description: '加入适量水或高汤，放入豆腐', tip: null },
      { order: 5, description: '小火煮5分钟让豆腐入味', tip: null },
      { order: 6, description: '淀粉勾芡，撒花椒粉和葱花', tip: '分两次勾芡效果更好' }
    ],
    tags: ['川菜', '下饭', '快手']
  },
  {
    id: 5,
    name: '糖醋排骨',
    category: '中餐',
    difficulty: '中等',
    prepTime: 15,
    cookTime: 40,
    servings: 3,
    emoji: '🍖',
    coverColor: '#DC143C',
    description: '酸甜可口，外酥里嫩，大人小孩都爱吃的经典菜肴。',
    ingredients: [
      { name: '猪小排', amount: '500g', note: '切段' },
      { name: '醋', amount: '3勺', note: null },
      { name: '糖', amount: '3勺', note: null },
      { name: '生抽', amount: '2勺', note: null },
      { name: '料酒', amount: '1勺', note: null },
      { name: '番茄酱', amount: '2勺', note: null },
      { name: '淀粉', amount: '适量', note: null },
      { name: '白芝麻', amount: '少许', note: '装饰' }
    ],
    steps: [
      { order: 1, description: '排骨焯水洗净', tip: null },
      { order: 2, description: '排骨加盐、料酒腌制10分钟', tip: null },
      { order: 3, description: '排骨裹淀粉，入油锅炸至金黄', tip: '油温六成热，复炸一次更酥' },
      { order: 4, description: '调糖醋汁：醋、糖、生抽、番茄酱、水', tip: '糖醋比例1:1' },
      { order: 5, description: '锅中倒入糖醋汁煮开', tip: null },
      { order: 6, description: '放入炸好的排骨，大火收汁', tip: '收汁时要不停翻炒' },
      { order: 7, description: '撒白芝麻，出锅装盘', tip: null }
    ],
    tags: ['家常菜', '酸甜', '宴客']
  },
  {
    id: 6,
    name: '鱼香肉丝',
    category: '中餐',
    difficulty: '中等',
    prepTime: 20,
    cookTime: 15,
    servings: 2,
    emoji: '🥢',
    coverColor: '#E25822',
    description: '酸甜微辣，鱼香味浓郁，下饭神器。',
    ingredients: [
      { name: '猪里脊', amount: '200g', note: '切丝' },
      { name: '木耳', amount: '适量', note: '泡发切丝' },
      { name: '胡萝卜', amount: '1根', note: '切丝' },
      { name: '青椒', amount: '1个', note: '切丝' },
      { name: '豆瓣酱', amount: '1勺', note: null },
      { name: '泡椒', amount: '3个', note: '切碎' },
      { name: '葱姜蒜', amount: '适量', note: '切末' }
    ],
    steps: [
      { order: 1, description: '肉丝加盐、料酒、淀粉腌制', tip: null },
      { order: 2, description: '调鱼香汁：醋、糖、生抽、淀粉、水', tip: '酸甜比例1:1' },
      { order: 3, description: '热锅凉油，滑炒肉丝至变色盛出', tip: null },
      { order: 4, description: '锅中加油，炒香豆瓣酱和泡椒', tip: null },
      { order: 5, description: '加入葱姜蒜和配菜翻炒', tip: null },
      { order: 6, description: '倒入肉丝和鱼香汁，大火翻炒', tip: '快速翻炒，保持肉丝嫩滑' }
    ],
    tags: ['川菜', '下饭', '经典']
  },
  {
    id: 7,
    name: '回锅肉',
    category: '中餐',
    difficulty: '中等',
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    emoji: '🥓',
    coverColor: '#CD5C5C',
    description: '川菜之王，肥而不腻，配上蒜苗香气扑鼻。',
    ingredients: [
      { name: '五花肉', amount: '300g', note: '整块' },
      { name: '蒜苗', amount: '4根', note: '切段' },
      { name: '豆瓣酱', amount: '2勺', note: null },
      { name: '甜面酱', amount: '1勺', note: null },
      { name: '生抽', amount: '1勺', note: null },
      { name: '料酒', amount: '1勺', note: null },
      { name: '姜片', amount: '几片', note: null }
    ],
    steps: [
      { order: 1, description: '五花肉整块冷水下锅，加姜片料酒煮20分钟', tip: '煮至筷子能插入即可' },
      { order: 2, description: '捞出晾凉，切薄片', tip: '放冰箱冷冻一会更好切' },
      { order: 3, description: '锅中少油，放入肉片煸炒出油', tip: '煸至肉片卷曲，俗称"灯盏窝"' },
      { order: 4, description: '加入豆瓣酱炒出红油', tip: null },
      { order: 5, description: '加入甜面酱和生抽翻炒', tip: null },
      { order: 6, description: '加入蒜苗大火快炒', tip: '蒜苗断生即可，保持脆嫩' }
    ],
    tags: ['川菜', '经典', '下饭']
  },
  {
    id: 8,
    name: '清炒时蔬',
    category: '中餐',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 5,
    servings: 2,
    emoji: '🥬',
    coverColor: '#228B22',
    description: '简单健康的清炒蔬菜，保留食材原味，清爽可口。',
    ingredients: [
      { name: '青菜', amount: '300g', note: '洗净切段' },
      { name: '蒜末', amount: '3瓣', note: null },
      { name: '盐', amount: '适量', note: null },
      { name: '食用油', amount: '2勺', note: null }
    ],
    steps: [
      { order: 1, description: '青菜洗净，菜梗和菜叶分开', tip: null },
      { order: 2, description: '锅中热油，爆香蒜末', tip: null },
      { order: 3, description: '先炒菜梗30秒，再放菜叶', tip: '分开放保证熟度一致' },
      { order: 4, description: '大火快炒，加盐调味', tip: '大火快炒保持蔬菜脆嫩' },
      { order: 5, description: '翻炒均匀即可出锅', tip: null }
    ],
    tags: ['素食', '健康', '快手']
  },
  {
    id: 9,
    name: '意大利面',
    category: '西餐',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    emoji: '🍝',
    coverColor: '#FFD700',
    description: '经典番茄肉酱意面，浓郁美味，在家也能享受西式料理。',
    ingredients: [
      { name: '意大利面', amount: '200g', note: null },
      { name: '牛肉末', amount: '150g', note: null },
      { name: '番茄', amount: '2个', note: '切丁' },
      { name: '洋葱', amount: '半个', note: '切丁' },
      { name: '蒜末', amount: '3瓣', note: null },
      { name: '番茄酱', amount: '3勺', note: null },
      { name: '橄榄油', amount: '2勺', note: null },
      { name: '罗勒叶', amount: '少许', note: '装饰' },
      { name: '帕玛森芝士', amount: '适量', note: '刨丝' }
    ],
    steps: [
      { order: 1, description: '大锅水烧开，加盐煮意面', tip: '煮至面条中心有一点硬度(al dente)' },
      { order: 2, description: '橄榄油热锅，炒香洋葱蒜末', tip: null },
      { order: 3, description: '加入牛肉末炒散', tip: null },
      { order: 4, description: '加入番茄丁和番茄酱翻炒', tip: null },
      { order: 5, description: '小火炖煮10分钟至酱汁浓稠', tip: null },
      { order: 6, description: '意面沥水放入酱汁中翻拌', tip: '加一点煮面水帮助乳化' },
      { order: 7, description: '装盘，撒芝士和罗勒叶', tip: null }
    ],
    tags: ['西餐', '主食', '经典']
  },
  {
    id: 10,
    name: '牛排',
    category: '西餐',
    difficulty: '中等',
    prepTime: 10,
    cookTime: 15,
    servings: 1,
    emoji: '🥩',
    coverColor: '#4A0404',
    description: '完美煎制的牛排，外焦里嫩，配上黑胡椒酱，美味无比。',
    ingredients: [
      { name: '牛排', amount: '1块', note: '约250g，厚度2cm' },
      { name: '黄油', amount: '20g', note: null },
      { name: '蒜', amount: '3瓣', note: '拍碎' },
      { name: '迷迭香', amount: '2枝', note: null },
      { name: '海盐', amount: '适量', note: null },
      { name: '黑胡椒', amount: '适量', note: '现磨' },
      { name: '橄榄油', amount: '1勺', note: null }
    ],
    steps: [
      { order: 1, description: '牛排提前30分钟取出回温', tip: '室温牛排受热均匀' },
      { order: 2, description: '用厨房纸吸干表面水分', tip: '表面干燥才能煎出完美焦壳' },
      { order: 3, description: '两面撒海盐和黑胡椒', tip: null },
      { order: 4, description: '大火加热锅，倒橄榄油', tip: '锅要冒烟' },
      { order: 5, description: '牛排入锅，每面煎2-3分钟', tip: '不要频繁翻动' },
      { order: 6, description: '加入黄油、蒜和迷迭香，用勺子淋油', tip: '增香提味' },
      { order: 7, description: '取出静置5分钟再切', tip: '静置让肉汁重新分布' }
    ],
    tags: ['西餐', '高级', '约会']
  },
  {
    id: 11,
    name: '凯撒沙拉',
    category: '西餐',
    difficulty: '简单',
    prepTime: 15,
    cookTime: 10,
    servings: 2,
    emoji: '🥗',
    coverColor: '#90EE90',
    description: '清爽健康的经典凯撒沙拉，自制酱汁更美味。',
    ingredients: [
      { name: '生菜', amount: '1颗', note: '撕成小块' },
      { name: '面包', amount: '2片', note: '切丁烤脆' },
      { name: '帕玛森芝士', amount: '30g', note: '刨片' },
      { name: '鸡胸肉', amount: '150g', note: '煎熟切片' },
      { name: '蛋黄酱', amount: '3勺', note: null },
      { name: '柠檬汁', amount: '1勺', note: null },
      { name: '蒜末', amount: '1瓣', note: null },
      { name: '鳀鱼', amount: '2条', note: '可选' }
    ],
    steps: [
      { order: 1, description: '面包丁入烤箱烤至金黄酥脆', tip: '180度约8分钟' },
      { order: 2, description: '鸡胸肉煎熟切片备用', tip: null },
      { order: 3, description: '调制凯撒酱：蛋黄酱、柠檬汁、蒜末、鳀鱼混合', tip: '鳀鱼可以增添鲜味' },
      { order: 4, description: '生菜洗净沥干放入大碗', tip: null },
      { order: 5, description: '淋上酱汁，撒芝士拌匀', tip: null },
      { order: 6, description: '摆上鸡胸肉和面包丁', tip: '面包丁最后放保持酥脆' }
    ],
    tags: ['西餐', '轻食', '健康']
  },
  {
    id: 12,
    name: '奶油蘑菇汤',
    category: '西餐',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 25,
    servings: 2,
    emoji: '🍲',
    coverColor: '#DEB887',
    description: '浓郁丝滑的奶油蘑菇汤，配上烤面包，温暖的享受。',
    ingredients: [
      { name: '蘑菇', amount: '300g', note: '切片' },
      { name: '黄油', amount: '30g', note: null },
      { name: '面粉', amount: '2勺', note: null },
      { name: '淡奶油', amount: '100ml', note: null },
      { name: '鸡汤', amount: '400ml', note: null },
      { name: '洋葱', amount: '半个', note: '切丁' },
      { name: '蒜', amount: '2瓣', note: '切末' },
      { name: '盐和黑胡椒', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '黄油融化，炒香洋葱和蒜', tip: null },
      { order: 2, description: '加入蘑菇炒至出水变软', tip: null },
      { order: 3, description: '撒入面粉翻炒均匀', tip: '炒1-2分钟去生粉味' },
      { order: 4, description: '慢慢加入鸡汤搅拌', tip: '慢慢加防止结块' },
      { order: 5, description: '煮沸后转小火炖15分钟', tip: null },
      { order: 6, description: '用搅拌机打成细腻糊状', tip: '可以用料理棒更方便' },
      { order: 7, description: '加入淡奶油，调味即可', tip: '不要煮沸，防止奶油分离' }
    ],
    tags: ['西餐', '汤品', '暖胃']
  },
  {
    id: 13,
    name: '提拉米苏',
    category: '甜点',
    difficulty: '中等',
    prepTime: 30,
    cookTime: 0,
    servings: 4,
    emoji: '🍰',
    coverColor: '#6F4E37',
    description: '意大利经典甜点，浓郁的马斯卡彭芝士配上咖啡香气。',
    ingredients: [
      { name: '马斯卡彭芝士', amount: '250g', note: null },
      { name: '手指饼干', amount: '200g', note: null },
      { name: '鸡蛋', amount: '3个', note: '蛋黄蛋白分离' },
      { name: '糖', amount: '80g', note: null },
      { name: '浓缩咖啡', amount: '200ml', note: '冷却' },
      { name: '朗姆酒', amount: '2勺', note: '可选' },
      { name: '可可粉', amount: '适量', note: '装饰' }
    ],
    steps: [
      { order: 1, description: '蛋黄加糖打至浓稠发白', tip: '隔水加热更容易打发' },
      { order: 2, description: '加入马斯卡彭芝士拌匀', tip: '芝士提前回温软化' },
      { order: 3, description: '蛋白打至湿性发泡', tip: null },
      { order: 4, description: '蛋白分次翻拌入芝士糊', tip: '翻拌不要搅拌，防止消泡' },
      { order: 5, description: '咖啡加朗姆酒混合', tip: null },
      { order: 6, description: '手指饼干蘸咖啡液铺底', tip: '快速蘸取，不要泡太久' },
      { order: 7, description: '铺一层芝士糊，重复一层', tip: null },
      { order: 8, description: '冷藏4小时以上，吃前撒可可粉', tip: '冷藏过夜味道更佳' }
    ],
    tags: ['甜点', '免烤', '意式']
  },
  {
    id: 14,
    name: '芒果布丁',
    category: '甜点',
    difficulty: '简单',
    prepTime: 15,
    cookTime: 5,
    servings: 4,
    emoji: '🥭',
    coverColor: '#FFB347',
    description: '热带风情的芒果布丁，细腻顺滑，清凉爽口。',
    ingredients: [
      { name: '芒果', amount: '2个', note: '取肉打泥' },
      { name: '淡奶油', amount: '200ml', note: null },
      { name: '牛奶', amount: '200ml', note: null },
      { name: '吉利丁片', amount: '10g', note: '泡软' },
      { name: '糖', amount: '50g', note: null }
    ],
    steps: [
      { order: 1, description: '吉利丁片冷水泡软', tip: '约5分钟' },
      { order: 2, description: '芒果取肉，搅拌机打成泥', tip: '留一些果肉切丁装饰' },
      { order: 3, description: '牛奶加糖小火加热至糖融化', tip: '不需要煮沸' },
      { order: 4, description: '加入泡软的吉利丁搅拌融化', tip: null },
      { order: 5, description: '加入芒果泥拌匀', tip: null },
      { order: 6, description: '淡奶油打至六分发', tip: null },
      { order: 7, description: '混合后倒入模具，冷藏4小时', tip: '冷藏过夜口感更好' }
    ],
    tags: ['甜点', '清凉', '夏日']
  },
  {
    id: 15,
    name: '巧克力蛋糕',
    category: '甜点',
    difficulty: '中等',
    prepTime: 20,
    cookTime: 35,
    servings: 8,
    emoji: '🎂',
    coverColor: '#3C1414',
    description: '浓郁湿润的巧克力蛋糕，巧克力爱好者的终极诱惑。',
    ingredients: [
      { name: '低筋面粉', amount: '150g', note: null },
      { name: '可可粉', amount: '50g', note: null },
      { name: '黑巧克力', amount: '150g', note: '融化' },
      { name: '黄油', amount: '100g', note: '软化' },
      { name: '鸡蛋', amount: '3个', note: null },
      { name: '糖', amount: '120g', note: null },
      { name: '牛奶', amount: '100ml', note: null },
      { name: '泡打粉', amount: '1小勺', note: null }
    ],
    steps: [
      { order: 1, description: '巧克力和黄油隔水融化', tip: '温度不要太高' },
      { order: 2, description: '鸡蛋加糖打至蓬松', tip: '打至体积增加一倍' },
      { order: 3, description: '倒入巧克力液拌匀', tip: null },
      { order: 4, description: '筛入面粉、可可粉、泡打粉', tip: '过筛防止结块' },
      { order: 5, description: '加入牛奶搅拌成顺滑面糊', tip: null },
      { order: 6, description: '倒入模具，170度烤35分钟', tip: '牙签插入不粘即可' },
      { order: 7, description: '冷却后脱模，可装饰', tip: null }
    ],
    tags: ['甜点', '烘焙', '巧克力']
  },
  {
    id: 16,
    name: '双皮奶',
    category: '甜点',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    emoji: '🍮',
    coverColor: '#FFFACD',
    description: '广东传统甜品，奶香浓郁，口感嫩滑。',
    ingredients: [
      { name: '全脂牛奶', amount: '500ml', note: null },
      { name: '鸡蛋清', amount: '3个', note: null },
      { name: '糖', amount: '50g', note: null },
      { name: '红豆', amount: '适量', note: '装饰可选' }
    ],
    steps: [
      { order: 1, description: '牛奶煮至微沸，倒入碗中冷却结皮', tip: '不要搅拌，静置形成奶皮' },
      { order: 2, description: '蛋清加糖打散过滤', tip: '过滤让口感更细腻' },
      { order: 3, description: '奶皮形成后，从边缘倒出牛奶', tip: '保留奶皮在碗中' },
      { order: 4, description: '牛奶与蛋清液混合搅匀', tip: null },
      { order: 5, description: '沿碗边慢慢倒回，让奶皮浮起', tip: '动作要轻，让奶皮覆盖表面' },
      { order: 6, description: '盖保鲜膜，中火蒸15分钟', tip: '盖保鲜膜防止水汽滴落' },
      { order: 7, description: '冷藏后食用，可加红豆装饰', tip: null }
    ],
    tags: ['甜点', '广式', '传统']
  },
  {
    id: 17,
    name: '杨枝甘露',
    category: '饮品',
    difficulty: '简单',
    prepTime: 20,
    cookTime: 10,
    servings: 2,
    emoji: '🥤',
    coverColor: '#FFA500',
    description: '港式经典甜品饮品，芒果椰奶西米的完美组合。',
    ingredients: [
      { name: '芒果', amount: '2个', note: '取肉' },
      { name: '西米', amount: '50g', note: null },
      { name: '椰浆', amount: '200ml', note: null },
      { name: '牛奶', amount: '100ml', note: null },
      { name: '糖', amount: '30g', note: null },
      { name: '西柚', amount: '半个', note: '取果肉' }
    ],
    steps: [
      { order: 1, description: '西米煮至透明，过冷水', tip: '大火煮15分钟，边煮边搅拌' },
      { order: 2, description: '芒果取肉，一半打泥一半切丁', tip: null },
      { order: 3, description: '椰浆加牛奶加糖混合', tip: null },
      { order: 4, description: '加入芒果泥搅拌均匀', tip: null },
      { order: 5, description: '杯底放西米', tip: null },
      { order: 6, description: '倒入芒果椰奶液', tip: null },
      { order: 7, description: '撒上芒果丁和西柚肉', tip: '冷藏后更好喝' }
    ],
    tags: ['饮品', '港式', '夏日']
  },
  {
    id: 18,
    name: '珍珠奶茶',
    category: '饮品',
    difficulty: '简单',
    prepTime: 15,
    cookTime: 20,
    servings: 1,
    emoji: '🧋',
    coverColor: '#8B6914',
    description: '台湾经典饮品，在家也能做出奶茶店的味道。',
    ingredients: [
      { name: '红茶', amount: '2包', note: null },
      { name: '牛奶', amount: '200ml', note: null },
      { name: '木薯珍珠', amount: '50g', note: null },
      { name: '糖', amount: '2勺', note: null },
      { name: '冰块', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '珍珠入沸水煮20分钟', tip: '边煮边搅拌防粘' },
      { order: 2, description: '关火焖10分钟，过冷水', tip: '焖后更Q弹' },
      { order: 3, description: '珍珠加糖拌匀腌制', tip: null },
      { order: 4, description: '红茶用热水泡开', tip: '泡浓一点，奶茶更香' },
      { order: 5, description: '茶放凉，加牛奶和糖搅拌', tip: null },
      { order: 6, description: '杯底放珍珠，加冰块', tip: null },
      { order: 7, description: '倒入奶茶即可', tip: '也可以放入摇摇杯摇匀' }
    ],
    tags: ['饮品', '台式', '人气']
  },
  {
    id: 19,
    name: '冰美式',
    category: '饮品',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    emoji: '☕',
    coverColor: '#4B3621',
    description: '清爽提神的冰美式咖啡，开启美好一天。',
    ingredients: [
      { name: '咖啡豆', amount: '18g', note: '中深烘焙' },
      { name: '水', amount: '200ml', note: null },
      { name: '冰块', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '咖啡豆研磨成中细粉', tip: '现磨更香' },
      { order: 2, description: '用92度水冲泡或萃取', tip: '没有咖啡机可用法压壶' },
      { order: 3, description: '杯中放满冰块', tip: '冰块多些不容易化淡' },
      { order: 4, description: '咖啡直接淋在冰上', tip: '快速冷却锁住香气' }
    ],
    tags: ['饮品', '咖啡', '提神']
  },
  {
    id: 20,
    name: '煎饺',
    category: '小吃',
    difficulty: '中等',
    prepTime: 40,
    cookTime: 15,
    servings: 3,
    emoji: '🥟',
    coverColor: '#DAA520',
    description: '底部金黄酥脆，内馅鲜美多汁的煎饺。',
    ingredients: [
      { name: '饺子皮', amount: '30张', note: '可买现成' },
      { name: '猪肉末', amount: '300g', note: null },
      { name: '白菜', amount: '200g', note: '切碎挤水' },
      { name: '葱姜', amount: '适量', note: '切末' },
      { name: '生抽', amount: '2勺', note: null },
      { name: '香油', amount: '1勺', note: null },
      { name: '盐', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '白菜切碎加盐腌制，挤干水分', tip: '挤干水分防止饺子出水' },
      { order: 2, description: '肉末加调料搅拌上劲', tip: '顺一个方向搅拌' },
      { order: 3, description: '加入白菜和葱姜拌匀', tip: null },
      { order: 4, description: '包饺子，捏紧收口', tip: null },
      { order: 5, description: '平底锅加油，摆入饺子煎至底部金黄', tip: '中火煎2分钟' },
      { order: 6, description: '加入水至饺子1/3处，盖盖焖煮', tip: null },
      { order: 7, description: '水干后开盖，煎至底部酥脆', tip: '最后可以撒芝麻和葱花' }
    ],
    tags: ['小吃', '面食', '经典']
  },
  {
    id: 21,
    name: '葱油饼',
    category: '小吃',
    difficulty: '中等',
    prepTime: 30,
    cookTime: 15,
    servings: 4,
    emoji: '🫓',
    coverColor: '#B8860B',
    description: '层层酥脆，葱香四溢的家常葱油饼。',
    ingredients: [
      { name: '面粉', amount: '300g', note: null },
      { name: '热水', amount: '180ml', note: '70度左右' },
      { name: '葱花', amount: '大量', note: null },
      { name: '食用油', amount: '适量', note: null },
      { name: '盐', amount: '适量', note: null },
      { name: '花椒粉', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '面粉加热水揉成光滑面团', tip: '热水面团更软' },
      { order: 2, description: '醒面20分钟', tip: '盖湿布防止干' },
      { order: 3, description: '面团擀成薄片，刷油', tip: null },
      { order: 4, description: '撒盐、花椒粉和大量葱花', tip: '葱花多一些更香' },
      { order: 5, description: '卷成长条，盘成圆形', tip: null },
      { order: 6, description: '擀平后入锅小火煎', tip: '两面金黄即可' },
      { order: 7, description: '切块装盘', tip: null }
    ],
    tags: ['小吃', '面食', '家常']
  },
  {
    id: 22,
    name: '炸鸡翅',
    category: '小吃',
    difficulty: '简单',
    prepTime: 20,
    cookTime: 15,
    servings: 2,
    emoji: '🍗',
    coverColor: '#FF8C00',
    description: '外酥里嫩的炸鸡翅，配上特制腌料，香气四溢。',
    ingredients: [
      { name: '鸡翅中', amount: '10个', note: '两面划刀' },
      { name: '蒜末', amount: '3瓣', note: null },
      { name: '生抽', amount: '2勺', note: null },
      { name: '料酒', amount: '1勺', note: null },
      { name: '蜂蜜', amount: '1勺', note: null },
      { name: '黑胡椒', amount: '适量', note: null },
      { name: '淀粉', amount: '适量', note: '裹粉用' },
      { name: '面包糠', amount: '适量', note: '可选' }
    ],
    steps: [
      { order: 1, description: '鸡翅两面划刀方便入味', tip: null },
      { order: 2, description: '加蒜末、生抽、料酒、蜂蜜、黑胡椒腌制', tip: '腌制2小时以上更入味' },
      { order: 3, description: '鸡翅裹上淀粉', tip: '可以裹面包糠更酥' },
      { order: 4, description: '油温170度，放入鸡翅炸', tip: '中小火慢炸' },
      { order: 5, description: '炸至金黄捞出', tip: null },
      { order: 6, description: '升高油温复炸1分钟', tip: '复炸更酥脆' },
      { order: 7, description: '控油装盘', tip: '可配蘸酱食用' }
    ],
    tags: ['小吃', '炸物', '聚会']
  }
]

export const categories = ['全部', '中餐', '西餐', '甜点', '饮品', '小吃']

export const difficulties = ['简单', '中等', '困难']

export default recipes
