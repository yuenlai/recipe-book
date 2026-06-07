export const LEFTOVER_CATEGORIES = [
  { key: 'cooked_meat', name: '熟肉类', emoji: '🍖' },
  { key: 'cooked_fish', name: '熟海鲜类', emoji: '🐟' },
  { key: 'cooked_veg', name: '熟蔬菜类', emoji: '🥦' },
  { key: 'rice_noodle', name: '米饭/面条', emoji: '🍚' },
  { key: 'bread', name: '面包/糕点', emoji: '🍞' },
  { key: 'egg', name: '蛋/豆制品', emoji: '🥚' },
  { key: 'soup_broth', name: '汤/汤底', emoji: '🍲' },
  { key: 'scraps', name: '边角料', emoji: '🥬' }
]

export const LEFTOVER_INGREDIENTS = [
  { id: 1, name: '红烧肉', category: 'cooked_meat', emoji: '🥩', note: '剩余的红烧五花肉' },
  { id: 2, name: '炒鸡丁', category: 'cooked_meat', emoji: '🍗', note: '宫保鸡丁或其他炒鸡肉丁' },
  { id: 3, name: '煎牛排', category: 'cooked_meat', emoji: '🥩', note: '剩余的煎/烤牛排' },
  { id: 4, name: '炸鸡翅', category: 'cooked_meat', emoji: '🍗', note: '剩余的炸鸡翅' },
  { id: 5, name: '回锅肉片', category: 'cooked_meat', emoji: '🥓', note: '剩余的回锅肉或煮熟的五花肉片' },
  { id: 6, name: '糖醋排骨', category: 'cooked_meat', emoji: '🍖', note: '剩余的糖醋排骨' },
  { id: 7, name: '蒸鱼', category: 'cooked_fish', emoji: '🐟', note: '剩余的清蒸/红烧鱼块' },
  { id: 8, name: '炒虾仁', category: 'cooked_fish', emoji: '🦐', note: '剩余的炒虾仁' },
  { id: 9, name: '炒青菜', category: 'cooked_veg', emoji: '🥬', note: '剩余的清炒时蔬' },
  { id: 10, name: '麻婆豆腐', category: 'cooked_veg', emoji: '🫘', note: '剩余的麻婆豆腐' },
  { id: 11, name: '番茄炒蛋', category: 'egg', emoji: '🍳', note: '剩余的番茄炒蛋' },
  { id: 12, name: '白米饭', category: 'rice_noodle', emoji: '🍚', note: '剩余的白米饭' },
  { id: 13, name: '炒面条', category: 'rice_noodle', emoji: '🍜', note: '剩余的炒面或汤面' },
  { id: 14, name: '意大利面', category: 'rice_noodle', emoji: '🍝', note: '剩余的意大利面' },
  { id: 15, name: '白馒头', category: 'bread', emoji: '🥟', note: '剩余的白馒头' },
  { id: 16, name: '面包片', category: 'bread', emoji: '🍞', note: '剩余的吐司面包' },
  { id: 17, name: '茶叶蛋', category: 'egg', emoji: '🥚', note: '剩余的茶叶蛋/煮鸡蛋' },
  { id: 18, name: '骨头汤', category: 'soup_broth', emoji: '🍲', note: '剩余的骨头汤/高汤' },
  { id: 19, name: '鸡汤', category: 'soup_broth', emoji: '🍲', note: '剩余的鸡汤' },
  { id: 20, name: '西兰花根', category: 'scraps', emoji: '🥦', note: '切下来的西兰花根茎' },
  { id: 21, name: '胡萝卜皮', category: 'scraps', emoji: '🥕', note: '削下来的胡萝卜皮' },
  { id: 22, name: '芹菜叶', category: 'scraps', emoji: '🌿', note: '摘下的芹菜叶子' },
  { id: 23, name: '西瓜皮', category: 'scraps', emoji: '🍉', note: '吃完的西瓜皮' },
  { id: 24, name: '豆腐渣', category: 'scraps', emoji: '🫘', note: '做豆腐/豆浆剩下的豆腐渣' }
]

export const LEFTOVER_RECIPES = [
  {
    id: 101,
    name: '红烧肉炒饭',
    sourceIngredients: ['红烧肉', '白米饭'],
    emoji: '🍚',
    coverColor: '#8B4513',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    description: '将剩余红烧肉和米饭完美结合，香糯可口，每一粒米饭都裹着肉香。',
    transformationTip: '红烧肉的油脂和酱汁让米饭粒粒分明，香气扑鼻。可以加入鸡蛋和蔬菜增加营养。',
    ingredients: [
      { name: '剩红烧肉', amount: '200g', note: '切小丁' },
      { name: '剩米饭', amount: '300g', note: '打散' },
      { name: '鸡蛋', amount: '2个', note: '打散' },
      { name: '青菜', amount: '50g', note: '切碎' },
      { name: '葱花', amount: '适量', note: null },
      { name: '盐', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '红烧肉切成小丁，青菜切碎', tip: '肉丁大小要均匀，方便翻炒' },
      { order: 2, description: '热锅少油，倒入蛋液炒至半凝固盛出', tip: '鸡蛋不要炒太老，嫩一点更好吃' },
      { order: 3, description: '锅中加油，放入红烧肉丁翻炒出香', tip: '可以把红烧肉的油脂炒出来' },
      { order: 4, description: '加入米饭大火翻炒均匀', tip: '米饭要提前打散，不要有结块' },
      { order: 5, description: '加入炒好的鸡蛋和青菜碎继续翻炒', tip: '青菜最后放，保持脆嫩' },
      { order: 6, description: '加少许盐调味，撒葱花出锅', tip: '红烧肉本身有咸味，盐要少放' }
    ],
    tags: ['快手', '主食', '家常']
  },
  {
    id: 102,
    name: '鸡肉蔬菜粥',
    sourceIngredients: ['炒鸡丁', '白米饭'],
    emoji: '🥣',
    coverColor: '#DEB887',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 15,
    servings: 2,
    description: '用剩米饭和鸡丁快速熬制的营养粥品，温暖肠胃，清淡易消化。',
    transformationTip: '剩米饭熬粥比生米更快更绵密，鸡丁提供丰富蛋白质。适合早餐或宵夜。',
    ingredients: [
      { name: '剩炒鸡丁', amount: '150g', note: '撕成小块' },
      { name: '剩米饭', amount: '200g', note: null },
      { name: '胡萝卜', amount: '50g', note: '切丁' },
      { name: '青菜', amount: '30g', note: '切碎' },
      { name: '姜片', amount: '2片', note: null },
      { name: '盐和白胡椒粉', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '米饭放入锅中，加适量水大火煮开', tip: '水的量根据喜好的稠度调整' },
      { order: 2, description: '转小火熬煮10分钟，期间搅拌防粘', tip: '偶尔搅拌让粥更绵密' },
      { order: 3, description: '加入胡萝卜丁和姜片煮5分钟', tip: '胡萝卜要煮软才好吃' },
      { order: 4, description: '加入鸡丁煮2分钟', tip: '鸡丁是熟的，不需要煮太久' },
      { order: 5, description: '最后加青菜碎煮1分钟', tip: '青菜煮断生即可，保持绿色' },
      { order: 6, description: '加盐和白胡椒粉调味出锅', tip: '可以滴几滴香油提香' }
    ],
    tags: ['养胃', '早餐', '清淡']
  },
  {
    id: 103,
    name: '牛排三明治',
    sourceIngredients: ['煎牛排', '面包片'],
    emoji: '🥪',
    coverColor: '#8B0000',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 5,
    servings: 1,
    description: '高级感满满的快手早餐，将剩余牛排变身美味三明治，搭配蔬菜营养均衡。',
    transformationTip: '牛排切薄片，用小火加热即可，不要过度加热以免变老。',
    ingredients: [
      { name: '剩牛排', amount: '150g', note: '切薄片' },
      { name: '吐司面包', amount: '2片', note: null },
      { name: '生菜', amount: '2片', note: '洗净沥干' },
      { name: '番茄', amount: '2片', note: null },
      { name: '洋葱', amount: '少许', note: '切细丝' },
      { name: '蛋黄酱', amount: '1勺', note: null },
      { name: '黑胡椒', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '牛排切薄片，用平底锅小火加热1分钟', tip: '不要煎太久，以免肉质变老' },
      { order: 2, description: '吐司面包可以烤一下更香脆', tip: '烤至表面金黄即可' },
      { order: 3, description: '面包片涂抹蛋黄酱', tip: '可以根据喜好换成黄芥末' },
      { order: 4, description: '依次铺上生菜、番茄片、牛排、洋葱丝', tip: '蔬菜要沥干水分，防止面包变软' },
      { order: 5, description: '撒上黑胡椒', tip: '现磨的黑胡椒更香' },
      { order: 6, description: '盖上另一片面包，对角切开即可', tip: '可以用牙签固定，方便食用' }
    ],
    tags: ['早餐', '西式', '快手']
  },
  {
    id: 104,
    name: '香辣鸡翅炒年糕',
    sourceIngredients: ['炸鸡翅'],
    emoji: '🍢',
    coverColor: '#CD5C5C',
    difficulty: '中等',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    description: '将原本干硬的炸鸡翅重新焕发活力，配上软糯年糕，甜辣适口。',
    transformationTip: '炸鸡翅先蒸一下让肉质回软，再和年糕一起炒，吸收酱汁更美味。',
    ingredients: [
      { name: '剩炸鸡翅', amount: '8个', note: null },
      { name: '年糕', amount: '200g', note: '切片' },
      { name: '韩式辣酱', amount: '2勺', note: null },
      { name: '糖', amount: '1勺', note: null },
      { name: '生抽', amount: '1勺', note: null },
      { name: '蒜瓣', amount: '3瓣', note: '切片' },
      { name: '白芝麻', amount: '适量', note: '装饰' }
    ],
    steps: [
      { order: 1, description: '炸鸡翅放入蒸锅蒸5分钟回软', tip: '蒸过的鸡翅肉质更嫩，容易入味' },
      { order: 2, description: '年糕切片，用开水泡软', tip: '年糕泡软后更容易炒熟' },
      { order: 3, description: '调酱汁：韩式辣酱、糖、生抽、少许水混合', tip: '可以根据口味调整辣度' },
      { order: 4, description: '热锅加油，爆香蒜片', tip: '小火炒香，不要炒糊' },
      { order: 5, description: '倒入鸡翅和年糕翻炒', tip: '翻炒均匀，让年糕不粘在一起' },
      { order: 6, description: '倒入调好的酱汁，小火收汁', tip: '不停翻炒，防止糊底' },
      { order: 7, description: '撒白芝麻出锅', tip: '可以撒些葱花增加香气' }
    ],
    tags: ['韩式', '下饭', '创意']
  },
  {
    id: 105,
    name: '回锅肉夹馍',
    sourceIngredients: ['回锅肉片', '白馒头'],
    emoji: '🥙',
    coverColor: '#D2691E',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 8,
    servings: 2,
    description: '川菜与面食的完美结合，回锅肉的香辣配上馒头的香软，一口满足。',
    transformationTip: '回锅肉回锅再炒一次更香，馒头煎至外脆内软更有口感。',
    ingredients: [
      { name: '剩回锅肉片', amount: '200g', note: null },
      { name: '白馒头', amount: '2个', note: '对半切开' },
      { name: '青椒', amount: '半个', note: '切丝' },
      { name: '蒜苗', amount: '2根', note: '切段' },
      { name: '豆瓣酱', amount: '1勺', note: null },
      { name: '食用油', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '馒头切面朝下，用平底锅煎至金黄', tip: '煎过的馒头更香，不会被肉汁泡软' },
      { order: 2, description: '锅中少油，加入豆瓣酱炒出红油', tip: '小火慢炒，红油更香' },
      { order: 3, description: '放入回锅肉片翻炒出香', tip: '肉片本身有油，少放油' },
      { order: 4, description: '加入青椒丝和蒜苗段翻炒断生', tip: '大火快炒，保持脆嫩' },
      { order: 5, description: '将炒好的回锅肉夹入煎好的馒头中', tip: '肉要夹得多一些才过瘾' },
      { order: 6, description: '趁热食用最佳', tip: '搭配一碗小米粥更完美' }
    ],
    tags: ['创意', '主食', '川味']
  },
  {
    id: 106,
    name: '糖醋排骨披萨',
    sourceIngredients: ['糖醋排骨'],
    emoji: '🍕',
    coverColor: '#DC143C',
    difficulty: '中等',
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    description: '中西合璧的创意美食，酸甜的糖醋排骨配上芝士，意外的美味。',
    transformationTip: '用吐司面包做饼底，快手又方便，芝士要多放才有拉丝效果。',
    ingredients: [
      { name: '剩糖醋排骨', amount: '150g', note: '去骨切小块' },
      { name: '厚切吐司', amount: '2片', note: null },
      { name: '马苏里拉芝士', amount: '100g', note: '刨丝' },
      { name: '番茄酱', amount: '2勺', note: null },
      { name: '洋葱', amount: '少许', note: '切丁' },
      { name: '青椒', amount: '少许', note: '切丁' },
      { name: '黑胡椒', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '糖醋排骨去骨切成小块', tip: '尽量去掉骨头，方便食用' },
      { order: 2, description: '吐司片均匀涂抹番茄酱', tip: '边缘也要涂到' },
      { order: 3, description: '撒上一层芝士碎', tip: '芝士要多，拉丝效果才好' },
      { order: 4, description: '铺上排骨块、洋葱丁、青椒丁', tip: '料要足，但不要太多以免掉下来' },
      { order: 5, description: '再撒一层芝士碎，撒黑胡椒', tip: '最上层的芝士烤至金黄最香' },
      { order: 6, description: '烤箱180度烤10-12分钟', tip: '芝士融化，表面金黄即可' },
      { order: 7, description: '取出趁热食用', tip: '小心烫口，芝士可以拉很长的丝' }
    ],
    tags: ['创意', '西式', '芝士']
  },
  {
    id: 107,
    name: '鱼松炒饭',
    sourceIngredients: ['蒸鱼', '白米饭'],
    emoji: '🍛',
    coverColor: '#20B2AA',
    difficulty: '简单',
    prepTime: 8,
    cookTime: 10,
    servings: 2,
    description: '将蒸鱼拆成鱼松，配上米饭翻炒，鲜美无比，连挑食的孩子都爱吃。',
    transformationTip: '蒸鱼去刺后可以先炒干水分，这样鱼肉更香更松散，不会腥。',
    ingredients: [
      { name: '剩蒸鱼', amount: '200g', note: '去刺拆碎' },
      { name: '剩米饭', amount: '300g', note: '打散' },
      { name: '鸡蛋', amount: '2个', note: '打散' },
      { name: '葱花', amount: '适量', note: null },
      { name: '姜', amount: '1小块', note: '切末' },
      { name: '生抽', amount: '1勺', note: null },
      { name: '白胡椒粉', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '蒸鱼去刺，仔细拆成鱼肉碎', tip: '一定要检查有没有小刺' },
      { order: 2, description: '热锅少油，放入姜末和鱼肉小火炒干', tip: '炒干水分的鱼松更香，不腥' },
      { order: 3, description: '鱼肉炒至金黄松散后盛出', tip: '大概需要5分钟，耐心翻炒' },
      { order: 4, description: '锅中加油，炒好鸡蛋盛出', tip: '鸡蛋炒嫩一点' },
      { order: 5, description: '炒米饭至粒粒分明', tip: '大火翻炒，让米饭散开' },
      { order: 6, description: '加入鱼松、鸡蛋翻炒均匀', tip: '轻轻翻拌，不要把鱼松弄碎' },
      { order: 7, description: '加生抽、白胡椒粉调味，撒葱花出锅', tip: '蒸鱼有咸味，生抽少放' }
    ],
    tags: ['海鲜', '主食', '儿童']
  },
  {
    id: 108,
    name: '虾仁滑蛋盖饭',
    sourceIngredients: ['炒虾仁', '白米饭'],
    emoji: '🍤',
    coverColor: '#FFA07A',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 8,
    servings: 2,
    description: '鲜嫩的虾仁配上滑嫩的鸡蛋，浇在热米饭上，简单却无比美味。',
    transformationTip: '虾仁是熟的，最后放就好，鸡蛋要嫩，筷子迅速划散。',
    ingredients: [
      { name: '剩炒虾仁', amount: '150g', note: null },
      { name: '鸡蛋', amount: '3个', note: '打散' },
      { name: '热米饭', amount: '2碗', note: null },
      { name: '葱花', amount: '适量', note: null },
      { name: '水淀粉', amount: '适量', note: null },
      { name: '盐和白胡椒粉', amount: '适量', note: null },
      { name: '香油', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '鸡蛋加少许盐和水淀粉打散', tip: '加水淀粉鸡蛋更滑嫩' },
      { order: 2, description: '锅中加适量水或高汤煮开', tip: '用高汤更鲜美' },
      { order: 3, description: '放入虾仁煮1分钟', tip: '虾仁是熟的，热透即可' },
      { order: 4, description: '转小火，慢慢倒入蛋液', tip: '边倒边用筷子轻轻划散' },
      { order: 5, description: '蛋液半凝固时关火', tip: '余温会让鸡蛋完全凝固，保持嫩滑' },
      { order: 6, description: '加盐和白胡椒调味，滴香油', tip: '最后撒葱花' },
      { order: 7, description: '将虾仁滑蛋浇在热米饭上', tip: '米饭要热的，才好吃' }
    ],
    tags: ['海鲜', '盖饭', '清淡']
  },
  {
    id: 109,
    name: '蔬菜鸡蛋饼',
    sourceIngredients: ['炒青菜', '番茄炒蛋'],
    emoji: '🥞',
    coverColor: '#9ACD32',
    difficulty: '简单',
    prepTime: 8,
    cookTime: 10,
    servings: 2,
    description: '将剩余蔬菜和鸡蛋混合煎成饼，外酥里嫩，营养丰富，早餐首选。',
    transformationTip: '蔬菜要切碎挤干水分，否则饼会散，不容易成型。',
    ingredients: [
      { name: '剩炒青菜', amount: '100g', note: '切碎挤水' },
      { name: '剩番茄炒蛋', amount: '100g', note: null },
      { name: '鸡蛋', amount: '2个', note: '打散' },
      { name: '面粉', amount: '50g', note: null },
      { name: '葱花', amount: '适量', note: null },
      { name: '盐', amount: '适量', note: null },
      { name: '食用油', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '炒青菜切碎，挤干多余水分', tip: '水分太多饼会散，一定要挤干' },
      { order: 2, description: '将所有材料放入大碗中', tip: '番茄炒蛋可以稍微切碎' },
      { order: 3, description: '加入面粉和鸡蛋，搅拌均匀', tip: '面糊要浓稠，能够成团' },
      { order: 4, description: '加盐和葱花调味', tip: '剩菜本身有咸味，盐要少放' },
      { order: 5, description: '平底锅加油，舀入面糊摊成圆饼', tip: '小火慢煎，不要频繁翻动' },
      { order: 6, description: '一面金黄后翻面，煎至两面金黄', tip: '用铲子压一压，让内部熟透' },
      { order: 7, description: '出锅切块，配番茄酱食用', tip: '外酥里嫩，非常好吃' }
    ],
    tags: ['早餐', '素食', '营养']
  },
  {
    id: 110,
    name: '麻婆豆腐烧茄子',
    sourceIngredients: ['麻婆豆腐'],
    emoji: '🍆',
    coverColor: '#800080',
    difficulty: '中等',
    prepTime: 10,
    cookTime: 15,
    servings: 3,
    description: '麻辣鲜香的麻婆豆腐配上软糯的茄子，下饭神器的升级版。',
    transformationTip: '茄子先炸或煎软，再和麻婆豆腐一起烧，吸饱汤汁的茄子超好吃。',
    ingredients: [
      { name: '剩麻婆豆腐', amount: '1盒', note: null },
      { name: '茄子', amount: '2个', note: '切滚刀块' },
      { name: '蒜末', amount: '3瓣', note: null },
      { name: '豆瓣酱', amount: '1勺', note: null },
      { name: '生抽', amount: '1勺', note: null },
      { name: '淀粉', amount: '适量', note: '勾芡用' },
      { name: '葱花', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '茄子切滚刀块，撒盐腌制10分钟', tip: '腌过的茄子不吸油，更健康' },
      { order: 2, description: '茄子挤干水分，拍上干淀粉', tip: '拍淀粉煎后外皮酥脆' },
      { order: 3, description: '平底锅加油，煎茄子至金黄软熟', tip: '中小火慢煎，确保内部熟透' },
      { order: 4, description: '另起锅，爆香蒜末和豆瓣酱', tip: '小火炒出红油' },
      { order: 5, description: '倒入麻婆豆腐和少许水', tip: '用铲子把豆腐切小块' },
      { order: 6, description: '放入煎好的茄子，轻轻翻拌', tip: '不要太用力，豆腐易碎' },
      { order: 7, description: '小火烧3分钟入味，淀粉勾芡', tip: '让汤汁裹满茄子' },
      { order: 8, description: '撒葱花出锅', tip: '配白米饭，能吃三大碗' }
    ],
    tags: ['川菜', '下饭', '素食']
  },
  {
    id: 111,
    name: '炒面煎饼',
    sourceIngredients: ['炒面条'],
    emoji: '🫓',
    coverColor: '#DAA520',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    description: '将剩余炒面条压成饼煎至金黄酥脆，外酥里软，口感层次丰富。',
    transformationTip: '面条要压实，小火慢煎，煎至两面金黄酥脆才好吃。',
    ingredients: [
      { name: '剩炒面', amount: '300g', note: null },
      { name: '鸡蛋', amount: '2个', note: '打散' },
      { name: '面粉', amount: '30g', note: null },
      { name: '葱花', amount: '适量', note: null },
      { name: '黑胡椒', amount: '适量', note: null },
      { name: '食用油', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '炒面放入大碗中，稍微剪短', tip: '面条太长不方便压饼' },
      { order: 2, description: '加入鸡蛋、面粉、葱花、黑胡椒', tip: '面粉起到粘合作用' },
      { order: 3, description: '用筷子搅拌均匀', tip: '让每根面条都裹上蛋液' },
      { order: 4, description: '平底锅加油，倒入面条混合物', tip: '油可以多一些，更酥脆' },
      { order: 5, description: '用铲子压实，压成圆饼状', tip: '尽量压薄一些，容易煎透' },
      { order: 6, description: '中小火煎至一面金黄酥脆', tip: '耐心等待，不要频繁翻动' },
      { order: 7, description: '翻面煎另一面至金黄', tip: '可以盖盖子焖一会，确保熟透' },
      { order: 8, description: '出锅切块，配番茄酱或辣酱', tip: '外酥里软，非常香' }
    ],
    tags: ['创意', '面食', '酥脆']
  },
  {
    id: 112,
    name: '意面蔬菜浓汤',
    sourceIngredients: ['意大利面'],
    emoji: '🥫',
    coverColor: '#FF6347',
    difficulty: '简单',
    prepTime: 8,
    cookTime: 15,
    servings: 2,
    description: '将剩余意面和蔬菜打成浓汤，浓郁顺滑，暖胃又暖心。',
    transformationTip: '用料理棒打成浓汤，口感顺滑，加入淡奶油更浓郁。',
    ingredients: [
      { name: '剩意大利面', amount: '150g', note: null },
      { name: '番茄', amount: '1个', note: '切块' },
      { name: '洋葱', amount: '半个', note: '切丁' },
      { name: '胡萝卜', amount: '半根', note: '切丁' },
      { name: '西芹', amount: '1根', note: '切丁' },
      { name: '淡奶油', amount: '50ml', note: null },
      { name: '黄油', amount: '20g', note: null },
      { name: '盐和黑胡椒', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '黄油融化，炒香洋葱、胡萝卜、西芹', tip: '蔬菜炒软更出味' },
      { order: 2, description: '加入番茄块炒至出汁', tip: '番茄去皮口感更好' },
      { order: 3, description: '加入意面和适量水或高汤', tip: '水没过食材即可' },
      { order: 4, description: '大火煮开后转小火煮10分钟', tip: '让意面吸收汤汁' },
      { order: 5, description: '用料理棒打成细腻的浓汤', tip: '打至顺滑没有颗粒' },
      { order: 6, description: '倒回锅中，加入淡奶油', tip: '不要煮沸，防止奶油分离' },
      { order: 7, description: '加盐和黑胡椒调味', tip: '可以撒些香草碎' },
      { order: 8, description: '配烤面包丁食用', tip: '面包丁增加口感层次' }
    ],
    tags: ['西式', '汤品', '暖胃']
  },
  {
    id: 113,
    name: '黄金馒头片',
    sourceIngredients: ['白馒头'],
    emoji: '🍞',
    coverColor: '#FFD700',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 8,
    servings: 2,
    description: '简单却美味的早餐选择，外酥里软，金黄诱人，蘸炼乳或咸酱都好吃。',
    transformationTip: '馒头片裹上蛋液煎，既不会吸太多油，又金黄酥脆。',
    ingredients: [
      { name: '剩馒头', amount: '2个', note: '切厚片' },
      { name: '鸡蛋', amount: '2个', note: '打散' },
      { name: '盐', amount: '少许', note: null },
      { name: '白胡椒粉', amount: '少许', note: null },
      { name: '葱花', amount: '适量', note: null },
      { name: '食用油', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '馒头切约1.5cm厚的片', tip: '厚度均匀，煎制时熟度一致' },
      { order: 2, description: '鸡蛋加盐、白胡椒、葱花打散', tip: '可以做甜口的，加糖不加盐' },
      { order: 3, description: '平底锅加油烧热', tip: '油温六成热最合适' },
      { order: 4, description: '馒头片快速蘸蛋液', tip: '不要泡太久，吸太多蛋液面饼会烂' },
      { order: 5, description: '放入锅中，中小火煎制', tip: '一次不要放太多，免得粘连' },
      { order: 6, description: '一面金黄后翻面，煎至两面金黄', tip: '不要煎太久，保持内部松软' },
      { order: 7, description: '出锅控油，配炼乳或辣酱', tip: '趁热吃最香' }
    ],
    tags: ['早餐', '快手', '家常']
  },
  {
    id: 114,
    name: '面包布丁',
    sourceIngredients: ['面包片'],
    emoji: '🍮',
    coverColor: '#DEB887',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    description: '用变硬的吐司面包制作的经典甜点，柔软湿润，香甜可口。',
    transformationTip: '面包要充分吸收蛋奶液，烤出来才够湿润好吃。',
    ingredients: [
      { name: '剩面包片', amount: '4片', note: '切小块' },
      { name: '鸡蛋', amount: '3个', note: null },
      { name: '牛奶', amount: '300ml', note: null },
      { name: '糖', amount: '50g', note: null },
      { name: '淡奶油', amount: '100ml', note: null },
      { name: '香草精', amount: '少许', note: null },
      { name: '肉桂粉', amount: '少许', note: null },
      { name: '葡萄干', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '面包切小块，铺在烤碗中', tip: '面包稍微硬一点更好' },
      { order: 2, description: '撒上葡萄干', tip: '可以提前用朗姆酒泡软' },
      { order: 3, description: '鸡蛋加糖打散，加入牛奶、淡奶油', tip: '搅拌均匀，不要打发' },
      { order: 4, description: '加入香草精和肉桂粉', tip: '没有可以省略' },
      { order: 5, description: '将蛋奶液过滤后倒入烤碗', tip: '过滤后口感更细腻' },
      { order: 6, description: '按压面包让其充分吸收液体', tip: '让每块面包都吸饱蛋奶液' },
      { order: 7, description: '静置10分钟后，烤箱170度烤25分钟', tip: '表面金黄，内部凝固即可' },
      { order: 8, description: '趁热食用，可配冰淇淋', tip: '冷热都好吃' }
    ],
    tags: ['甜点', '烘焙', '西式']
  },
  {
    id: 115,
    name: '蛋香茶叶蛋炒饭',
    sourceIngredients: ['茶叶蛋', '白米饭'],
    emoji: '🍳',
    coverColor: '#8B4513',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 8,
    servings: 2,
    description: '茶叶蛋独特的卤香让炒饭风味升级，每一口都有惊喜。',
    transformationTip: '茶叶蛋切小丁，和米饭一起炒，卤香融入米饭中。',
    ingredients: [
      { name: '剩茶叶蛋', amount: '3个', note: '切小丁' },
      { name: '剩米饭', amount: '300g', note: '打散' },
      { name: '胡萝卜', amount: '30g', note: '切丁' },
      { name: '青豆', amount: '30g', note: null },
      { name: '玉米', amount: '30g', note: null },
      { name: '葱花', amount: '适量', note: null },
      { name: '生抽', amount: '1勺', note: null },
      { name: '白胡椒粉', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '茶叶蛋切小丁备用', tip: '尽量切小一点，分布均匀' },
      { order: 2, description: '胡萝卜丁、青豆、玉米焯水备用', tip: '焯水后颜色更鲜艳' },
      { order: 3, description: '热锅加油，放入茶叶蛋丁炒香', tip: '小火炒出香味，不要炒糊' },
      { order: 4, description: '加入米饭大火翻炒均匀', tip: '米饭要炒散，粒粒分明' },
      { order: 5, description: '加入焯好的蔬菜丁', tip: '蔬菜已经是熟的，炒热即可' },
      { order: 6, description: '加生抽和白胡椒调味', tip: '茶叶蛋本身有咸味，少放盐' },
      { order: 7, description: '撒葱花出锅', tip: '葱花最后放，香气更浓' }
    ],
    tags: ['主食', '快手', '家常']
  },
  {
    id: 116,
    name: '骨头汤火锅',
    sourceIngredients: ['骨头汤'],
    emoji: '🍲',
    coverColor: '#CD853F',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 20,
    servings: 3,
    description: '用剩余骨头汤做火锅汤底，营养不浪费，想吃什么涮什么。',
    transformationTip: '骨头汤过滤后加姜片和葱段熬开，就是完美的火锅汤底。',
    ingredients: [
      { name: '剩骨头汤', amount: '1大碗', note: '过滤去渣' },
      { name: '姜片', amount: '3片', note: null },
      { name: '葱段', amount: '2段', note: null },
      { name: '红枣', amount: '5颗', note: null },
      { name: '枸杞', amount: '少许', note: null },
      { name: '各种涮菜', amount: '适量', note: '肉类、蔬菜、菌菇等' },
      { name: '蘸料', amount: '适量', note: '根据喜好准备' }
    ],
    steps: [
      { order: 1, description: '骨头汤过滤，去掉骨头和渣', tip: '过滤后的汤底更清澈' },
      { order: 2, description: '汤倒入锅中，加姜片、葱段、红枣', tip: '可以加少许党参、黄芪更补' },
      { order: 3, description: '大火煮开后转小火煮10分钟', tip: '让香味充分释放' },
      { order: 4, description: '准备各种涮菜，洗净切好', tip: '根据喜好准备，丰俭由人' },
      { order: 5, description: '准备蘸料：蒜泥、香油、腐乳等', tip: '蘸料是火锅的灵魂' },
      { order: 6, description: '汤底加枸杞，就可以涮菜了', tip: '先涮肉，再涮蔬菜，最后煮面' },
      { order: 7, description: '吃完可以喝汤，营养全部吸收', tip: '汤已经很鲜，不需要再加味精' }
    ],
    tags: ['火锅', '暖胃', '聚会']
  },
  {
    id: 117,
    name: '鸡汤烩面',
    sourceIngredients: ['鸡汤', '白米饭'],
    emoji: '🍜',
    coverColor: '#F5DEB3',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    description: '用剩饭做的创意烩面，将米饭压成饼切块再煮，口感独特。',
    transformationTip: '剩米饭压成薄饼煎硬，再切块煮，就是Q弹的米粑粑。',
    ingredients: [
      { name: '剩鸡汤', amount: '500ml', note: '过滤' },
      { name: '剩米饭', amount: '200g', note: null },
      { name: '青菜', amount: '50g', note: '切段' },
      { name: '鸡蛋', amount: '1个', note: '打散' },
      { name: '葱花', amount: '适量', note: null },
      { name: '盐和白胡椒粉', amount: '适量', note: null },
      { name: '香油', amount: '少许', note: null }
    ],
    steps: [
      { order: 1, description: '米饭装入保鲜袋，压成薄饼', tip: '尽量压薄压匀' },
      { order: 2, description: '平底锅煎至两面金黄硬实', tip: '煎硬一点，煮后才有嚼劲' },
      { order: 3, description: '切成1cm宽的条状', tip: '也可以切成小块' },
      { order: 4, description: '鸡汤煮开，放入米条煮2分钟', tip: '煮软即可，不要太久' },
      { order: 5, description: '淋入蛋液，形成蛋花', tip: '边倒边轻轻搅拌' },
      { order: 6, description: '加入青菜煮至断生', tip: '青菜不要煮太久，保持绿色' },
      { order: 7, description: '加盐、白胡椒调味，滴香油撒葱花', tip: '鸡汤本身有鲜味，少放盐' }
    ],
    tags: ['创意', '汤品', '家常']
  },
  {
    id: 118,
    name: '西兰花根茎炒肉丝',
    sourceIngredients: ['西兰花根'],
    emoji: '🥦',
    coverColor: '#228B22',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 8,
    servings: 2,
    description: '平时会扔掉的西兰花根茎，削皮后脆嫩可口，搭配肉丝营养美味。',
    transformationTip: '西兰花根茎要削掉厚皮，切成薄片或丝，口感脆嫩。',
    ingredients: [
      { name: '西兰花根茎', amount: '2个', note: '削皮切丝' },
      { name: '猪肉丝', amount: '100g', note: null },
      { name: '蒜末', amount: '2瓣', note: null },
      { name: '生抽', amount: '1勺', note: null },
      { name: '料酒', amount: '1勺', note: null },
      { name: '淀粉', amount: '适量', note: null },
      { name: '盐', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '西兰花根茎削去外层硬皮', tip: '厚皮一定要削掉，不然咬不动' },
      { order: 2, description: '切成细丝，用清水浸泡', tip: '泡水可以保持脆嫩' },
      { order: 3, description: '肉丝加料酒、生抽、淀粉腌制', tip: '腌制10分钟更嫩滑' },
      { order: 4, description: '热锅加油，滑炒肉丝至变色盛出', tip: '大火快炒，保持嫩滑' },
      { order: 5, description: '锅中加油，爆香蒜末', tip: '小火炒香' },
      { order: 6, description: '放入西兰花丝大火快炒', tip: '炒至断生即可，保持脆嫩' },
      { order: 7, description: '加入肉丝，加盐调味翻炒均匀', tip: '全程大火快炒' },
      { order: 8, description: '出锅装盘', tip: '脆嫩爽口，非常下饭' }
    ],
    tags: ['环保', '素食', '快手']
  },
  {
    id: 119,
    name: '胡萝卜皮脆片',
    sourceIngredients: ['胡萝卜皮'],
    emoji: '🥕',
    coverColor: '#FF8C00',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 15,
    servings: 1,
    description: '将削下来的胡萝卜皮烤成脆片，健康零食，低卡又美味。',
    transformationTip: '胡萝卜皮要擦干水分，刷薄油，低温慢烤至酥脆。',
    ingredients: [
      { name: '胡萝卜皮', amount: '1碗', note: '削胡萝卜的皮' },
      { name: '橄榄油', amount: '1勺', note: null },
      { name: '盐', amount: '少许', note: null },
      { name: '黑胡椒', amount: '少许', note: null },
      { name: '孜然粉', amount: '少许', note: '可选' }
    ],
    steps: [
      { order: 1, description: '胡萝卜皮洗净，擦干水分', tip: '水分一定要擦干，不然不脆' },
      { order: 2, description: '刷上薄薄一层橄榄油', tip: '油不要太多，不然会腻' },
      { order: 3, description: '撒盐、黑胡椒和孜然粉', tip: '根据喜好加辣椒粉也可以' },
      { order: 4, description: '均匀铺在烤盘上，不要重叠', tip: '铺单层才能烤均匀' },
      { order: 5, description: '烤箱150度烤10-15分钟', tip: '期间翻一次面' },
      { order: 6, description: '烤至金黄酥脆，边缘微焦', tip: '注意观察，不要烤糊' },
      { order: 7, description: '取出放凉，就是健康脆片', tip: '放凉后更酥脆，密封保存' }
    ],
    tags: ['环保', '零食', '健康']
  },
  {
    id: 120,
    name: '芹菜叶炒蛋',
    sourceIngredients: ['芹菜叶'],
    emoji: '🥚',
    coverColor: '#9ACD32',
    difficulty: '简单',
    prepTime: 5,
    cookTime: 5,
    servings: 2,
    description: '芹菜叶比芹菜茎更有营养，和鸡蛋同炒，鲜香嫩滑。',
    transformationTip: '芹菜叶焯水去苦味，挤干水分再炒，口感更好。',
    ingredients: [
      { name: '芹菜叶', amount: '1把', note: '洗净' },
      { name: '鸡蛋', amount: '3个', note: '打散' },
      { name: '蒜末', amount: '2瓣', note: null },
      { name: '盐', amount: '适量', note: null },
      { name: '香油', amount: '少许', note: null },
      { name: '食用油', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '芹菜叶洗净，开水焯30秒', tip: '焯水可以去除苦涩味' },
      { order: 2, description: '捞出过冷水，挤干水分切碎', tip: '挤得越干越好' },
      { order: 3, description: '鸡蛋打散，加入芹菜叶碎', tip: '充分混合' },
      { order: 4, description: '加盐调味，搅拌均匀', tip: '可以加少许白胡椒' },
      { order: 5, description: '热锅加油，爆香蒜末', tip: '小火炒香，不要炒糊' },
      { order: 6, description: '倒入蛋液，中小火煎制', tip: '底部凝固后再翻炒' },
      { order: 7, description: '蛋液凝固后快速翻炒散', tip: '不要炒太久，保持嫩滑' },
      { order: 8, description: '滴香油出锅', tip: '清香扑鼻，非常下饭' }
    ],
    tags: ['环保', '素食', '快手']
  },
  {
    id: 121,
    name: '凉拌西瓜皮',
    sourceIngredients: ['西瓜皮'],
    emoji: '🥗',
    coverColor: '#98FB98',
    difficulty: '简单',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    description: '夏天消暑开胃的凉拌小菜，脆爽可口，清爽解腻。',
    transformationTip: '西瓜皮去掉外皮和红瓤，只留中间的脆层。',
    ingredients: [
      { name: '西瓜皮', amount: '500g', note: '去外皮和红瓤' },
      { name: '盐', amount: '1勺', note: '腌制用' },
      { name: '生抽', amount: '1勺', note: null },
      { name: '醋', amount: '1勺', note: null },
      { name: '糖', amount: '1小勺', note: null },
      { name: '香油', amount: '少许', note: null },
      { name: '蒜末', amount: '2瓣', note: null },
      { name: '干辣椒', amount: '2个', note: '剪段' }
    ],
    steps: [
      { order: 1, description: '西瓜皮削去外层绿皮和红瓤', tip: '只留中间白色的脆层' },
      { order: 2, description: '切成薄片或细条', tip: '切薄一点更容易入味' },
      { order: 3, description: '加盐抓匀，腌制10分钟', tip: '杀出多余水分，口感更脆' },
      { order: 4, description: '用冷开水冲洗，挤干水分', tip: '尽量挤干，这样才脆' },
      { order: 5, description: '加入生抽、醋、糖、蒜末、干辣椒', tip: '根据口味调整糖醋比例' },
      { order: 6, description: '淋上热油爆香干辣椒', tip: '油烧热淋上去，香气扑鼻' },
      { order: 7, description: '拌匀后冷藏20分钟', tip: '冷藏后更清爽开胃' },
      { order: 8, description: '吃前淋香油即可', tip: '夏天吃最爽' }
    ],
    tags: ['环保', '凉菜', '夏日']
  },
  {
    id: 122,
    name: '豆腐渣丸子',
    sourceIngredients: ['豆腐渣'],
    emoji: '🍡',
    coverColor: '#F5DEB3',
    difficulty: '中等',
    prepTime: 15,
    cookTime: 15,
    servings: 3,
    description: '做豆腐/豆浆剩下的豆腐渣，做成香煎丸子，外酥里嫩，高蛋白。',
    transformationTip: '豆腐渣要挤干水分，加面粉和鸡蛋才能成型，煎至金黄酥脆。',
    ingredients: [
      { name: '豆腐渣', amount: '300g', note: '挤干水分' },
      { name: '猪肉末', amount: '100g', note: null },
      { name: '鸡蛋', amount: '1个', note: null },
      { name: '面粉', amount: '50g', note: null },
      { name: '葱姜末', amount: '适量', note: null },
      { name: '生抽', amount: '1勺', note: null },
      { name: '盐和白胡椒粉', amount: '适量', note: null },
      { name: '食用油', amount: '适量', note: null }
    ],
    steps: [
      { order: 1, description: '豆腐渣用纱布挤干水分', tip: '越干越好，否则丸子容易散' },
      { order: 2, description: '豆腐渣放入大碗中，加入肉末', tip: '没有肉末可以全素' },
      { order: 3, description: '加入鸡蛋、面粉、葱姜末', tip: '面粉起到粘合作用' },
      { order: 4, description: '加生抽、盐、白胡椒调味', tip: '可以加少许五香粉' },
      { order: 5, description: '用筷子朝一个方向搅拌上劲', tip: '搅拌至粘稠能成团' },
      { order: 6, description: '手心抹油，搓成大小均匀的丸子', tip: '大小一致，受热均匀' },
      { order: 7, description: '平底锅加油，放入丸子', tip: '中小火慢煎，不要频繁翻动' },
      { order: 8, description: '煎至四面金黄酥脆', tip: '可以配番茄酱或椒盐食用' }
    ],
    tags: ['环保', '素食', '高蛋白']
  }
]

export function getIngredientsByCategory(categoryKey) {
  if (!categoryKey || categoryKey === 'all') {
    return LEFTOVER_INGREDIENTS
  }
  return LEFTOVER_INGREDIENTS.filter(i => i.category === categoryKey)
}

export function getRecommendedRecipes(selectedIngredientIds) {
  if (!selectedIngredientIds || selectedIngredientIds.length === 0) {
    return LEFTOVER_RECIPES
  }

  const selectedNames = LEFTOVER_INGREDIENTS
    .filter(i => selectedIngredientIds.includes(i.id))
    .map(i => i.name)

  const scored = LEFTOVER_RECIPES.map(recipe => {
    const matchedSources = recipe.sourceIngredients.filter(src =>
      selectedNames.some(name => src.includes(name) || name.includes(src))
    )
    
    return {
      ...recipe,
      matchedCount: matchedSources.length,
      matchedIngredients: matchedSources,
      score: matchedSources.length * 100 + (10 - recipe.sourceIngredients.length)
    }
  }).filter(r => r.matchedCount > 0)
    .sort((a, b) => b.score - a.score)

  return scored
}

export function getAllLeftoverRecipes() {
  return LEFTOVER_RECIPES
}
