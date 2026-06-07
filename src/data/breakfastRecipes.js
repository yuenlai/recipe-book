const breakfastRecipes = [
  {
    id: 1001,
    name: '香蕉花生酱吐司',
    category: '早餐',
    difficulty: '简单',
    prepTime: 3,
    cookTime: 2,
    totalTime: 5,
    timeCategory: 10,
    servings: 1,
    emoji: '🍌',
    coverColor: '#FFE082',
    description: '香甜可口的快手早餐，香蕉与花生酱的完美搭配，给你一上午的活力。',
    ingredients: [
      { name: '吐司面包', amount: '2片', note: null },
      { name: '香蕉', amount: '1根', note: '切片' },
      { name: '花生酱', amount: '2勺', note: null },
      { name: '蜂蜜', amount: '适量', note: '可选' }
    ],
    steps: [
      { order: 1, description: '将吐司放入烤面包机烤至金黄酥脆，约2分钟', tip: '喜欢焦香的可以多烤30秒' },
      { order: 2, description: '香蕉切薄片备用', tip: '选择熟透的香蕉更香甜' },
      { order: 3, description: '在烤好的吐司上均匀涂抹花生酱', tip: '可以用 creamy 或 crunchy 花生酱' },
      { order: 4, description: '铺上香蕉片，淋上少许蜂蜜即可享用', tip: null }
    ],
    tags: ['早餐', '快手', '素食', '甜口']
  },
  {
    id: 1002,
    name: '溏心蛋配牛油果吐司',
    category: '早餐',
    difficulty: '简单',
    prepTime: 3,
    cookTime: 5,
    totalTime: 8,
    timeCategory: 10,
    servings: 1,
    emoji: '🥑',
    coverColor: '#A5D6A7',
    description: '营养均衡的健康早餐，优质蛋白质与健康脂肪的完美组合。',
    ingredients: [
      { name: '吐司面包', amount: '2片', note: null },
      { name: '鸡蛋', amount: '1个', note: null },
      { name: '牛油果', amount: '半个', note: null },
      { name: '黑胡椒', amount: '适量', note: null },
      { name: '海盐', amount: '适量', note: null },
      { name: '红辣椒粉', amount: '少许', note: '可选' }
    ],
    steps: [
      { order: 1, description: '烧一锅水，水开后轻轻放入鸡蛋，计时5分钟', tip: '鸡蛋从冰箱拿出后放至室温更佳' },
      { order: 2, description: '同时将吐司烤至金黄', tip: null },
      { order: 3, description: '牛油果切半，挖出果肉，用叉子压成泥，撒盐和黑胡椒调味', tip: '加几滴柠檬汁可防止氧化变黑' },
      { order: 4, description: '5分钟到后立即将鸡蛋放入冰水，剥壳切半', tip: '冰水可以让蛋壳更容易剥离' },
      { order: 5, description: '吐司上抹牛油果泥，放上溏心蛋，撒红辣椒粉即可', tip: null }
    ],
    tags: ['早餐', '快手', '健康', '高蛋白']
  },
  {
    id: 1003,
    name: '酸奶莓莓杯',
    category: '早餐',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 0,
    totalTime: 5,
    timeCategory: 10,
    servings: 1,
    emoji: '🥛',
    coverColor: '#F8BBD0',
    description: '清新爽口的早餐杯，酸奶与新鲜浆果和麦片的完美搭配，清爽不腻。',
    ingredients: [
      { name: '希腊酸奶', amount: '200g', note: null },
      { name: '草莓', amount: '5颗', note: '切粒' },
      { name: '蓝莓', amount: '30g', note: null },
      { name: '即食燕麦片', amount: '30g', note: null },
      { name: '奇亚籽', amount: '1勺', note: null },
      { name: '蜂蜜', amount: '1勺', note: '可选' }
    ],
    steps: [
      { order: 1, description: '草莓洗净切粒，蓝莓洗净备用', tip: '可以用冷冻浆果，解冻后使用' },
      { order: 2, description: '取一个玻璃杯，底部铺一层燕麦片', tip: '可以用格兰诺拉麦片增加风味' },
      { order: 3, description: '倒入一半酸奶，撒上奇亚籽', tip: null },
      { order: 4, description: '铺上草莓粒和蓝莓', tip: '留几颗最后装饰用' },
      { order: 5, description: '倒入剩下的酸奶，顶部装饰剩余的浆果和蜂蜜即可', tip: null }
    ],
    tags: ['早餐', '快手', '素食', '健康', '免煮']
  },
  {
    id: 1004,
    name: '葱香鸡蛋饼',
    category: '早餐',
    difficulty: '简单',
    prepTime: 3,
    cookTime: 5,
    totalTime: 8,
    timeCategory: 10,
    servings: 1,
    emoji: '🥞',
    coverColor: '#FFCC80',
    description: '外酥内软的中式鸡蛋饼，葱香四溢，简单快手，是中国人最爱的早餐之一。',
    ingredients: [
      { name: '面粉', amount: '50g', note: null },
      { name: '鸡蛋', amount: '2个', note: null },
      { name: '葱花', amount: '适量', note: '切碎' },
      { name: '盐', amount: '少许', note: null },
      { name: '清水', amount: '80ml', note: null },
      { name: '食用油', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '面粉放入碗中，加入鸡蛋、盐和清水，搅拌成顺滑的面糊', tip: '面糊要稠度适中，提起筷子能成流线型滴落' },
      { order: 2, description: '加入葱花搅拌均匀', tip: null },
      { order: 3, description: '平底锅刷薄油，小火加热，倒入适量面糊', tip: '锅不要太热，否则容易糊' },
      { order: 4, description: '转动锅子让面糊均匀铺开，煎至底面金黄', tip: '约2-3分钟' },
      { order: 5, description: '翻面继续煎至另一面金黄，约2分钟，出锅切小块即可', tip: null }
    ],
    tags: ['早餐', '快手', '中式', '咸香']
  },
  {
    id: 1005,
    name: '火腿芝士三明治',
    category: '早餐',
    difficulty: '简单',
    prepTime: 3,
    cookTime: 3,
    totalTime: 6,
    timeCategory: 10,
    servings: 1,
    emoji: '🥪',
    coverColor: '#BCAAA4',
    description: '经典的早餐三明治，芝士融化后与火腿完美结合，简单美味。',
    ingredients: [
      { name: '吐司面包', amount: '2片', note: null },
      { name: '火腿片', amount: '2片', note: null },
      { name: '芝士片', amount: '1片', note: null },
      { name: '生菜叶', amount: '2片', note: null },
      { name: '番茄', amount: '2片', note: null },
      { name: '蛋黄酱', amount: '适量', note: null },
      { name: '黄油', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '生菜洗净沥干，番茄切片备用', tip: null },
      { order: 2, description: '平底锅加热，放入黄油，吐司切面向下煎至金黄', tip: null },
      { order: 3, description: '翻面，在一片吐司上放上火腿片和芝士片', tip: '盖盖子让芝士融化' },
      { order: 4, description: '另一片吐司抹上蛋黄酱，放上生菜和番茄片', tip: null },
      { order: 5, description: '将两片吐司合在一起，沿对角线切开即可', tip: null }
    ],
    tags: ['早餐', '快手', '西式', '便携']
  },
  {
    id: 1006,
    name: '微波炉快手蛋糕',
    category: '早餐',
    difficulty: '简单',
    prepTime: 3,
    cookTime: 2,
    totalTime: 5,
    timeCategory: 10,
    servings: 1,
    emoji: '🧁',
    coverColor: '#FFAB91',
    description: '无需烤箱的快手蛋糕，香浓巧克力口味，满足早餐的甜蜜渴望。',
    ingredients: [
      { name: '面粉', amount: '4勺', note: '约50g' },
      { name: '可可粉', amount: '2勺', note: null },
      { name: '白砂糖', amount: '3勺', note: null },
      { name: '泡打粉', amount: '1/4勺', note: null },
      { name: '牛奶', amount: '3勺', note: null },
      { name: '植物油', amount: '2勺', note: null },
      { name: '鸡蛋', amount: '1个', note: null },
      { name: '巧克力碎', amount: '适量', note: '可选' }
    ],
    steps: [
      { order: 1, description: '在马克杯中混合面粉、可可粉、糖和泡打粉', tip: '用大约300ml的马克杯' },
      { order: 2, description: '加入鸡蛋、牛奶和植物油，搅拌均匀至无颗粒', tip: '不要过度搅拌' },
      { order: 3, description: '撒上巧克力碎', tip: null },
      { order: 4, description: '微波炉高火加热90秒，蛋糕会膨胀起来', tip: '时间根据微波炉功率调整' },
      { order: 5, description: '取出静置1分钟，可以淋上酸奶或蜂蜜享用', tip: null }
    ],
    tags: ['早餐', '快手', '甜点', '免烤']
  },
  {
    id: 2001,
    name: '美式松饼配枫糖浆',
    category: '早餐',
    difficulty: '简单',
    prepTime: 8,
    cookTime: 12,
    totalTime: 20,
    timeCategory: 20,
    servings: 2,
    emoji: '🥞',
    coverColor: '#FFCC80',
    description: '松软可口的美式松饼，搭配黄油和枫糖浆，经典的周末早餐选择。',
    ingredients: [
      { name: '低筋面粉', amount: '150g', note: null },
      { name: '泡打粉', amount: '1勺', note: null },
      { name: '白砂糖', amount: '2勺', note: null },
      { name: '盐', amount: '少许', note: null },
      { name: '牛奶', amount: '180ml', note: null },
      { name: '鸡蛋', amount: '1个', note: null },
      { name: '黄油', amount: '30g', note: '融化' },
      { name: '枫糖浆', amount: '适量', note: '食用' },
      { name: '新鲜浆果', amount: '适量', note: '装饰' }
    ],
    steps: [
      { order: 1, description: '将面粉、泡打粉、糖和盐在大碗中混合', tip: null },
      { order: 2, description: '在另一个碗中打散鸡蛋，加入牛奶和融化的黄油搅匀', tip: '黄油放凉一点，避免烫熟鸡蛋' },
      { order: 3, description: '将湿料倒入干料中，轻轻搅拌至刚好混合', tip: '有小颗粒没关系，不要过度搅拌' },
      { order: 4, description: '平底锅小火加热，刷薄油，舀一勺面糊倒入锅中', tip: null },
      { order: 5, description: '待表面出现小气泡时翻面，继续煎至金黄，约2分钟', tip: '约1-2分钟后出现气泡' },
      { order: 6, description: '重复此步骤直到面糊用完', tip: '保持小火，避免烧焦' },
      { order: 7, description: '松饼叠放，放上黄油块，淋枫糖浆，装饰浆果即可', tip: null }
    ],
    tags: ['早餐', '西式', '甜点', '周末']
  },
  {
    id: 2002,
    name: '蔬菜鸡蛋卷',
    category: '早餐',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 10,
    totalTime: 15,
    timeCategory: 20,
    servings: 2,
    emoji: '🍳',
    coverColor: '#FFF59D',
    description: '营养丰富的蔬菜鸡蛋卷，将多种蔬菜卷入嫩滑的蛋皮中，健康又美味。',
    ingredients: [
      { name: '鸡蛋', amount: '3个', note: null },
      { name: '胡萝卜', amount: '30g', note: '擦丝' },
      { name: '黄瓜', amount: '30g', note: '擦丝' },
      { name: '菠菜', amount: '50g', note: '焯水切碎' },
      { name: '香菇', amount: '2朵', note: '切丁' },
      { name: '葱花', amount: '适量', note: null },
      { name: '盐', amount: '少许', note: null },
      { name: '生抽', amount: '1勺', note: null },
      { name: '食用油', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '菠菜焯水1分钟，挤干水分切碎；胡萝卜、黄瓜擦丝；香菇切丁', tip: null },
      { order: 2, description: '鸡蛋打入碗中，加少许盐打散备用', tip: null },
      { order: 3, description: '锅中加少许油，炒香香菇丁，加入胡萝卜丝翻炒至软', tip: null },
      { order: 4, description: '加入菠菜和黄瓜丝，加生抽调味，盛出备用', tip: null },
      { order: 5, description: '平底锅刷薄油，小火加热，倒入一半蛋液，摊成薄蛋皮', tip: '转动锅子让蛋液均匀分布' },
      { order: 6, description: '待蛋皮底部凝固、表面微湿时，在中央铺上炒好的蔬菜', tip: null },
      { order: 7, description: '从一边卷起，卷好后再煎片刻定型，出锅切小段即可', tip: null }
    ],
    tags: ['早餐', '健康', '中式', '蔬菜']
  },
  {
    id: 2003,
    name: '紫薯银耳羹',
    category: '早餐',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 15,
    totalTime: 20,
    timeCategory: 20,
    servings: 2,
    emoji: '🍠',
    coverColor: '#CE93D8',
    description: '香甜软糯的紫薯银耳羹，滋阴润肺，是秋冬季节的暖心早餐。',
    ingredients: [
      { name: '紫薯', amount: '1个', note: '约150g，切小丁' },
      { name: '银耳', amount: '1小朵', note: '泡发' },
      { name: '红枣', amount: '5颗', note: '去核' },
      { name: '枸杞', amount: '少许', note: null },
      { name: '冰糖', amount: '适量', note: null },
      { name: '清水', amount: '800ml', note: null }
    ],
    steps: [
      { order: 1, description: '银耳提前泡发10分钟，撕成小朵，去掉根部', tip: '用冷水泡发更佳' },
      { order: 2, description: '紫薯去皮切小丁，红枣去核备用', tip: '紫薯丁切小一点容易煮烂' },
      { order: 3, description: '锅中加水烧开，放入银耳，小火煮10分钟', tip: '偶尔搅拌防止粘锅' },
      { order: 4, description: '加入紫薯丁和红枣，继续煮至紫薯软烂，约5分钟', tip: null },
      { order: 5, description: '加入冰糖和枸杞，搅拌至冰糖融化即可', tip: '根据口味调整糖量' }
    ],
    tags: ['早餐', '中式', '甜汤', '养生']
  },
  {
    id: 2004,
    name: '芝士蔬菜烘蛋',
    category: '早餐',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 12,
    totalTime: 17,
    timeCategory: 20,
    servings: 2,
    emoji: '🧀',
    coverColor: '#FFE082',
    description: '蓬松嫩滑的芝士蔬菜烘蛋，无需烤箱，一锅到底，营养丰富颜值高。',
    ingredients: [
      { name: '鸡蛋', amount: '4个', note: null },
      { name: '彩椒', amount: '半个', note: '切丁' },
      { name: '洋葱', amount: '1/4个', note: '切丁' },
      { name: '菠菜', amount: '30g', note: '切碎' },
      { name: '芝士碎', amount: '50g', note: null },
      { name: '牛奶', amount: '50ml', note: null },
      { name: '盐', amount: '少许', note: null },
      { name: '黑胡椒', amount: '少许', note: null },
      { name: '橄榄油', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '鸡蛋打散，加入牛奶、盐和黑胡椒搅匀', tip: null },
      { order: 2, description: '烤箱预热至180度，如无烤箱则全程用炉灶小火', tip: null },
      { order: 3, description: '可进烤箱的平底锅加橄榄油，中火加热，炒香洋葱丁', tip: null },
      { order: 4, description: '加入彩椒丁翻炒2分钟，加入菠菜炒软', tip: null },
      { order: 5, description: '转小火，倒入蛋液，轻轻摇动锅子让蛋液均匀分布', tip: null },
      { order: 6, description: '表面撒上芝士碎，小火煎至底部凝固，约5分钟', tip: null },
      { order: 7, description: '放入烤箱烤至表面金黄，约5分钟；或盖上盖子焖至表面凝固', tip: null }
    ],
    tags: ['早餐', '西式', '高蛋白', '蔬菜']
  },
  {
    id: 2005,
    name: '鲜肉小馄饨',
    category: '早餐',
    difficulty: '中等',
    prepTime: 10,
    cookTime: 6,
    totalTime: 16,
    timeCategory: 20,
    servings: 2,
    emoji: '🥟',
    coverColor: '#B3E5FC',
    description: '皮薄馅嫩的鲜肉小馄饨，一碗热汤下肚，温暖一整天。可以提前包好冷冻。',
    ingredients: [
      { name: '馄饨皮', amount: '30张', note: null },
      { name: '猪肉馅', amount: '150g', note: '肥瘦3:7' },
      { name: '葱花', amount: '适量', note: null },
      { name: '姜末', amount: '少许', note: null },
      { name: '紫菜', amount: '适量', note: null },
      { name: '虾皮', amount: '少许', note: null },
      { name: '生抽', amount: '2勺', note: null },
      { name: '香油', amount: '1勺', note: null },
      { name: '盐', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '猪肉馅加葱花、姜末、1勺生抽、香油、少许盐，顺时针搅拌上劲', tip: '分次加入葱姜水让肉馅更嫩' },
      { order: 2, description: '取一张馄饨皮，中间放少许肉馅，对折捏紧，再将两角捏合', tip: '蘸点水帮助粘合' },
      { order: 3, description: '碗中放入紫菜、虾皮、少许葱花、1勺生抽和盐', tip: null },
      { order: 4, description: '锅中烧开水，下馄饨，水开后加半碗凉水，重复2次', tip: '馄饨浮起后再煮1分钟' },
      { order: 5, description: '舀一勺热汤冲入碗中，将调料化开', tip: null },
      { order: 6, description: '捞出馄饨放入汤碗中，滴几滴香油即可', tip: null }
    ],
    tags: ['早餐', '中式', '汤类', '面食']
  },
  {
    id: 2006,
    name: '培根芦笋班尼迪克蛋',
    category: '早餐',
    difficulty: '中等',
    prepTime: 8,
    cookTime: 10,
    totalTime: 18,
    timeCategory: 20,
    servings: 2,
    emoji: '🍳',
    coverColor: '#FFCCBC',
    description: '餐厅级别的早午餐菜品，水波蛋、荷兰酱、培根和芦笋的完美组合。',
    ingredients: [
      { name: '英式马芬', amount: '2个', note: null },
      { name: '培根', amount: '4片', note: null },
      { name: '芦笋', amount: '6-8根', note: null },
      { name: '鸡蛋', amount: '2个', note: '水波蛋用' },
      { name: '黄油', amount: '50g', note: '荷兰酱用' },
      { name: '蛋黄', amount: '1个', note: '荷兰酱用' },
      { name: '柠檬汁', amount: '1勺', note: null },
      { name: '白醋', amount: '1勺', note: null },
      { name: '盐', amount: '少许', note: null },
      { name: '黑胡椒', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '先做荷兰酱：黄油融化保温，蛋黄加柠檬汁隔温水打发至颜色变浅', tip: '温度不要超过60度，防止蛋黄凝固' },
      { order: 2, description: '缓缓加入融化的黄油，边加边搅拌，加盐和胡椒调味，保温备用', tip: null },
      { order: 3, description: '培根煎至金黄酥脆，芦笋焯水1分钟后煎香', tip: null },
      { order: 4, description: '马芬切半，烤至金黄', tip: null },
      { order: 5, description: '烧一锅水，加白醋，水微沸时，将搅出漩涡，打入鸡蛋，煮3分钟', tip: '新鲜鸡蛋更容易成型' },
      { order: 6, description: '组装：马芬上放培根、芦笋，放水波蛋，淋上荷兰酱，撒黑胡椒即可', tip: null }
    ],
    tags: ['早餐', '西式', '早午餐', '精致']
  },
  {
    id: 3001,
    name: '酥脆可颂三明治',
    category: '早餐',
    difficulty: '中等',
    prepTime: 10,
    cookTime: 15,
    totalTime: 25,
    timeCategory: 30,
    servings: 2,
    emoji: '🥐',
    coverColor: '#FFCC80',
    description: '自制的酥脆可颂，搭配滑蛋、牛油果和烟熏三文鱼，开启精致的一天。',
    ingredients: [
      { name: '可颂面团', amount: '300g', note: '可买现成的' },
      { name: '鸡蛋', amount: '3个', note: null },
      { name: '烟熏三文鱼', amount: '100g', note: null },
      { name: '牛油果', amount: '1个', note: null },
      { name: '奶油奶酪', amount: '50g', note: null },
      { name: '菠菜', amount: '30g', note: null },
      { name: '牛奶', amount: '30ml', note: null },
      { name: '黄油', amount: '10g', note: null },
      { name: '黑胡椒', amount: '少许', note: null },
      { name: '柠檬汁', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '可颂面团根据包装说明烤至金黄酥脆，约12-15分钟', tip: '烤箱预热至200度' },
      { order: 2, description: '牛油果切片，淋少许柠檬汁防止氧化', tip: null },
      { order: 3, description: '鸡蛋加牛奶和盐打散，平底锅加黄油，小火炒至半凝固嫩滑状态', tip: '不要炒太老' },
      { order: 4, description: '菠菜焯水挤干，备用', tip: null },
      { order: 5, description: '烤好的可颂横向切开，下半部分抹奶油奶酪', tip: null },
      { order: 6, description: '依次铺上菠菜、滑蛋、牛油果片、烟熏三文鱼', tip: null },
      { order: 7, description: '撒黑胡椒，盖上可颂上半部分即可', tip: '可以用竹签固定' }
    ],
    tags: ['早餐', '西式', '精致', '早午餐']
  },
  {
    id: 3002,
    name: '鲜虾肠粉',
    category: '早餐',
    difficulty: '中等',
    prepTime: 10,
    cookTime: 18,
    totalTime: 28,
    timeCategory: 30,
    servings: 2,
    emoji: '🍤',
    coverColor: '#B2EBF2',
    description: '地道粤式早餐，爽滑的肠粉包裹着鲜嫩的虾仁，配上自制酱油，鲜美无比。',
    ingredients: [
      { name: '肠粉专用粉', amount: '100g', note: null },
      { name: '鲜虾', amount: '8只', note: '去壳去肠' },
      { name: '马蹄', amount: '2个', note: '切碎' },
      { name: '葱花', amount: '适量', note: null },
      { name: '生粉', amount: '1勺', note: null },
      { name: '生抽', amount: '3勺', note: null },
      { name: '蚝油', amount: '1勺', note: null },
      { name: '糖', amount: '半勺', note: null },
      { name: '清水', amount: '250ml', note: null },
      { name: '食用油', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '肠粉粉加200ml清水搅拌至无颗粒，静置10分钟', tip: null },
      { order: 2, description: '虾仁加生粉、少许盐和油腌制10分钟，加入马蹄碎拌匀', tip: null },
      { order: 3, description: '做酱汁：生抽、蚝油、糖加50ml清水煮开，备用', tip: null },
      { order: 4, description: '准备一个平盘，刷薄油，水烧开后放入平盘预热', tip: null },
      { order: 5, description: '舀一勺粉浆倒入平盘，撒上适量虾仁馅和葱花', tip: '粉浆要薄' },
      { order: 6, description: '大火蒸3分钟至粉皮透明起泡', tip: '透明就说明熟了' },
      { order: 7, description: '用刮刀从一边卷起，切段装盘，淋上酱汁即可', tip: '刮刀抹油防粘' }
    ],
    tags: ['早餐', '中式', '粤式', '海鲜']
  },
  {
    id: 3003,
    name: '健康燕麦蔬果碗',
    category: '早餐',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 20,
    totalTime: 30,
    timeCategory: 30,
    servings: 2,
    emoji: '🥣',
    coverColor: '#C5E1A5',
    description: '超模同款健康早餐碗，慢煮燕麦搭配新鲜蔬果和坚果，饱腹感强又营养均衡。',
    ingredients: [
      { name: '钢切燕麦', amount: '100g', note: null },
      { name: '牛奶', amount: '500ml', note: null },
      { name: '香蕉', amount: '半根', note: '切片' },
      { name: '蓝莓', amount: '50g', note: null },
      { name: '草莓', amount: '3颗', note: '切片' },
      { name: '奇异果', amount: '半个', note: '切片' },
      { name: '杏仁片', amount: '1勺', note: null },
      { name: '奇亚籽', amount: '1勺', note: null },
      { name: '肉桂粉', amount: '少许', note: null },
      { name: '蜂蜜', amount: '适量', note: null },
      { name: '花生酱', amount: '1勺', note: null }
    ],
    steps: [
      { order: 1, description: '小锅中加入牛奶和燕麦，中火煮开后转小火慢煮', tip: '经常搅拌防止粘锅' },
      { order: 2, description: '煮20分钟至燕麦浓稠软糯，期间多次搅拌', tip: '喜欢甜的可以加少许糖' },
      { order: 3, description: '加入奇亚籽和肉桂粉，搅拌均匀，关火焖2分钟', tip: null },
      { order: 4, description: '燕麦装入碗中，表面用勺子压出一个凹槽', tip: null },
      { order: 5, description: '在凹槽处放入花生酱，周围摆上香蕉片、蓝莓、草莓和奇异果', tip: null },
      { order: 6, description: '撒上杏仁片，淋上蜂蜜即可', tip: '可根据喜好搭配其他水果' }
    ],
    tags: ['早餐', '健康', '素食', '高纤']
  },
  {
    id: 3004,
    name: '自制煎饼果子',
    category: '早餐',
    difficulty: '中等',
    prepTime: 10,
    cookTime: 15,
    totalTime: 25,
    timeCategory: 30,
    servings: 2,
    emoji: '🌯',
    coverColor: '#D7CCC8',
    description: '正宗天津风味煎饼果子，在家也能做出街边摊的味道，外酥内软酱香浓郁。',
    ingredients: [
      { name: '绿豆面', amount: '60g', note: null },
      { name: '中筋面粉', amount: '40g', note: null },
      { name: '鸡蛋', amount: '2个', note: null },
      { name: '油条', amount: '2根', note: '或薄脆' },
      { name: '葱花', amount: '适量', note: null },
      { name: '香菜', amount: '适量', note: '切碎' },
      { name: '甜面酱', amount: '2勺', note: null },
      { name: '辣椒酱', amount: '1勺', note: null },
      { name: '清水', amount: '200ml', note: null },
      { name: '食用油', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '绿豆面和面粉混合，加清水搅拌成可流动的面糊，静置10分钟', tip: '面糊稠度要适中' },
      { order: 2, description: '平底锅烧热，刷薄油，舀一勺面糊，转动锅子摊成薄饼', tip: '锅要热，动作要快' },
      { order: 3, description: '面糊基本凝固时，打入一个鸡蛋，用铲子打散均匀铺在饼上', tip: null },
      { order: 4, description: '撒上葱花，待鸡蛋凝固后翻面', tip: null },
      { order: 5, description: '另一面刷上甜面酱和辣椒酱，撒上香菜碎', tip: null },
      { order: 6, description: '放上油条（或薄脆），从一边卷起，切段即可', tip: '油条提前切段，更容易卷' }
    ],
    tags: ['早餐', '中式', '街头小吃', '北方']
  },
  {
    id: 3005,
    name: '芝士焗牛油果配班尼迪克蛋',
    category: '早餐',
    difficulty: '中等',
    prepTime: 10,
    cookTime: 18,
    totalTime: 28,
    timeCategory: 30,
    servings: 2,
    emoji: '🥑',
    coverColor: '#A5D6A7',
    description: '牛油果的创新吃法，烤至温热的牛油果配上融化的芝士和完美的水波蛋，口感层次丰富。',
    ingredients: [
      { name: '牛油果', amount: '2个', note: null },
      { name: '鸡蛋', amount: '2个', note: null },
      { name: '马苏里拉芝士碎', amount: '40g', note: null },
      { name: '帕玛森芝士', amount: '20g', note: '擦碎' },
      { name: '培根', amount: '2片', note: null },
      { name: '小番茄', amount: '4个', note: '对半切' },
      { name: '黄油', amount: '20g', note: null },
      { name: '白醋', amount: '1勺', note: null },
      { name: '海盐', amount: '少许', note: null },
      { name: '黑胡椒', amount: '少许', note: null },
      { name: '荷兰芹', amount: '少许', note: '切碎' }
    ],
    steps: [
      { order: 1, description: '牛油果切半去核，用勺子挖去少许果肉，形成一个凹槽', tip: '挖出来的果肉可以做牛油果酱' },
      { order: 2, description: '培根煎至酥脆，切小块备用', tip: null },
      { order: 3, description: '牛油果凹槽中放入培根碎，撒上两种芝士，放上小番茄', tip: null },
      { order: 4, description: '烤箱预热至180度，烤10-12分钟至芝士融化冒泡', tip: null },
      { order: 5, description: '烤牛油果的同时，烧一锅水加白醋，做水波蛋，煮3分钟', tip: null },
      { order: 6, description: '取出烤好的牛油果，每个上面放一个水波蛋', tip: null },
      { order: 7, description: '撒上海盐、黑胡椒和荷兰芹碎，淋上融化的黄油即可', tip: null }
    ],
    tags: ['早餐', '西式', '创意', '高蛋白']
  },
  {
    id: 3006,
    name: '上海葱油拌面',
    category: '早餐',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 20,
    totalTime: 25,
    timeCategory: 30,
    servings: 2,
    emoji: '🍜',
    coverColor: '#FFF59D',
    description: '经典上海早餐，灵魂在于熬得金黄的葱油，香飘四溢，简单却让人欲罢不能。',
    ingredients: [
      { name: '细面条', amount: '200g', note: '新鲜切面更佳' },
      { name: '小葱', amount: '6根', note: '只要葱叶' },
      { name: '食用油', amount: '80ml', note: null },
      { name: '生抽', amount: '3勺', note: null },
      { name: '老抽', amount: '1勺', note: null },
      { name: '蚝油', amount: '1勺', note: null },
      { name: '白砂糖', amount: '1勺', note: null },
      { name: '清水', amount: '2勺', note: null }
    ],
    steps: [
      { order: 1, description: '小葱洗净沥干水分，切成长段，一定要擦干，防止炸的时候溅油', tip: '用厨房纸擦干' },
      { order: 2, description: '锅中倒油，凉油时就放入葱段，小火慢慢熬', tip: '一定要小火，葱才香不苦' },
      { order: 3, description: '熬至葱段金黄酥脆，约12-15分钟，捞出葱段', tip: '不要熬焦了' },
      { order: 4, description: '关火，趁油热时加入生抽、老抽、蚝油、糖和清水，搅拌均匀', tip: '会有滋滋声，小心烫伤' },
      { order: 5, description: '另起锅煮面，水开后下面，煮至8成熟捞出', tip: '面不要煮太软' },
      { order: 6, description: '面条沥干，盛入碗中，舀2勺葱油汁拌匀，撒上炸香的葱段即可', tip: '可以加个煎蛋更营养' }
    ],
    tags: ['早餐', '中式', '上海', '面食']
  }
]

export const BREAKFAST_TIME_CATEGORIES = [
  { key: 10, label: '10分钟', emoji: '⚡', description: '赶时间首选，10分钟搞定' },
  { key: 20, label: '20分钟', emoji: '⏰', description: '时间充裕，从容享受' },
  { key: 30, label: '30分钟', emoji: '👨‍🍳', description: '周末慢享，精致早餐' }
]

export function getBreakfastRecipesByTime(timeCategory) {
  return breakfastRecipes.filter(r => r.timeCategory === timeCategory)
}

export function getAllBreakfastRecipes() {
  return breakfastRecipes
}

export function getBreakfastRecipeById(id) {
  return breakfastRecipes.find(r => r.id === Number(id))
}

export { breakfastRecipes }
