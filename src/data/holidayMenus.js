const HOLIDAY_MENUS = [
  {
    id: 'spring-festival',
    name: '春节团圆宴',
    type: 'holiday',
    emoji: '🧧',
    coverColor: '#E74C3C',
    description: '传统中国年菜，吉祥如意，阖家团圆的丰盛美食',
    occasion: '适合家庭团聚、拜年宴请',
    people: 6,
    recipeIds: [5, 2, 7, 3, 12, 16, 20],
    features: ['寓意吉祥', '传统名菜', '老少皆宜'],
    tips: '提前准备食材，部分菜品可提前做好，当天加热即可'
  },
  {
    id: 'mid-autumn',
    name: '中秋赏月宴',
    type: 'holiday',
    emoji: '🥮',
    coverColor: '#F39C12',
    description: '月圆人团圆，赏月品美食的温馨家宴',
    occasion: '适合中秋佳节、家庭赏月',
    people: 4,
    recipeIds: [1, 4, 8, 12, 16, 17],
    features: ['精致小菜', '应季美食', '搭配月饼'],
    tips: '准备好月饼和茶水，饭后赏月时享用'
  },
  {
    id: 'dragon-boat',
    name: '端午家宴',
    type: 'holiday',
    emoji: '🐲',
    coverColor: '#27AE60',
    description: '粽叶飘香，传统端午美食盛宴',
    occasion: '适合端午节、家庭聚餐',
    people: 4,
    recipeIds: [20, 6, 8, 12, 14, 18],
    features: ['传统风味', '粽子配菜', '清爽可口'],
    tips: '搭配粽子食用，注意荤素搭配'
  },
  {
    id: 'christmas',
    name: '圣诞大餐',
    type: 'holiday',
    emoji: '🎄',
    coverColor: '#C0392B',
    description: '温馨浪漫的西式圣诞晚宴，节日氛围满满',
    occasion: '适合圣诞节、年末派对',
    people: 4,
    recipeIds: [10, 9, 11, 12, 13, 19],
    features: ['西式经典', '节日氛围', '浪漫温馨'],
    tips: '提前布置餐桌，准备圣诞音乐和装饰'
  },
  {
    id: 'valentine',
    name: '情人节浪漫餐',
    type: 'holiday',
    emoji: '💕',
    coverColor: '#E91E63',
    description: '浪漫双人烛光晚餐，给TA一个惊喜',
    occasion: '适合情人节、纪念日、求婚',
    people: 2,
    recipeIds: [10, 11, 12, 13, 19],
    features: ['双人份', '浪漫氛围', '精致美味'],
    tips: '准备好蜡烛、红酒和音乐，营造浪漫氛围'
  },
  {
    id: 'birthday',
    name: '生日派对宴',
    type: 'holiday',
    emoji: '🎂',
    coverColor: '#9C27B0',
    description: '热闹欢乐的生日派对美食盛宴',
    occasion: '适合生日派对、庆祝活动',
    people: 8,
    recipeIds: [22, 20, 5, 1, 4, 15, 17, 18],
    features: ['热闹丰盛', '儿童喜爱', '适合派对'],
    tips: '准备好生日蛋糕和装饰，部分菜品可提前做好'
  },
  {
    id: 'family-dinner',
    name: '周末家庭聚餐',
    type: 'scene',
    emoji: '👨‍👩‍👧‍👦',
    coverColor: '#3498DB',
    description: '温馨丰盛的家庭聚餐，满足全家人的口味',
    occasion: '适合周末团聚、家庭日常',
    people: 4,
    recipeIds: [2, 3, 4, 8, 12, 14],
    features: ['家常美味', '营养均衡', '适合全家'],
    tips: '根据家人的口味调整辣度和咸淡'
  },
  {
    id: 'friends-party',
    name: '朋友聚会',
    type: 'scene',
    emoji: '🎉',
    coverColor: '#E67E22',
    description: '热闹丰盛的好友聚会美食，聊天喝酒两不误',
    occasion: '适合朋友聚会、轰趴、看球赛',
    people: 6,
    recipeIds: [22, 20, 7, 1, 4, 17, 18],
    features: ['下酒好菜', '方便手拿', '热闹丰盛'],
    tips: '准备一些一次性餐具，方便聚会使用'
  },
  {
    id: 'business-dinner',
    name: '商务宴请',
    type: 'scene',
    emoji: '💼',
    coverColor: '#2C3E50',
    description: '精致体面的商务宴请菜单，彰显主人品味',
    occasion: '适合商务宴请、客户招待',
    people: 4,
    recipeIds: [10, 5, 2, 11, 12, 13],
    features: ['精致高档', '荤素搭配', '体面大方'],
    tips: '提前了解客人的饮食禁忌和偏好'
  },
  {
    id: 'kids-birthday',
    name: '儿童生日会',
    type: 'scene',
    emoji: '🎈',
    coverColor: '#FF69B4',
    description: '色彩缤纷、美味有趣的儿童派对美食',
    occasion: '适合儿童生日、亲子活动',
    people: 8,
    recipeIds: [22, 9, 3, 15, 14, 17, 18],
    features: ['造型可爱', '酸甜可口', '儿童喜爱'],
    tips: '注意食物大小，避免儿童噎食，准备一些卡通装饰'
  },
  {
    id: 'picnic',
    name: '户外野餐',
    type: 'scene',
    emoji: '🧺',
    coverColor: '#8BC34A',
    description: '方便携带、美味清爽的户外野餐美食',
    occasion: '适合公园野餐、春游、自驾游',
    people: 4,
    recipeIds: [20, 21, 11, 14, 17, 18],
    features: ['方便携带', '无需加热', '清爽可口'],
    tips: '使用保鲜盒分装，准备好湿巾和垃圾袋'
  },
  {
    id: 'afternoon-tea',
    name: '下午茶时光',
    type: 'scene',
    emoji: '☕',
    coverColor: '#A1887F',
    description: '精致优雅的下午茶套餐，悠闲惬意的时光',
    occasion: '适合闺蜜聚会、商务下午茶、休闲时光',
    people: 2,
    recipeIds: [13, 14, 16, 17, 19],
    features: ['精致甜点', '咖啡茶饮', '悠闲惬意'],
    tips: '准备好漂亮的茶具和餐盘，拍照更好看'
  }
]

const HOLIDAY_TYPES = [
  { key: 'all', name: '全部', emoji: '📋' },
  { key: 'holiday', name: '传统节日', emoji: '🎊' },
  { key: 'scene', name: '场景主题', emoji: '🎬' }
]

export { HOLIDAY_MENUS, HOLIDAY_TYPES }
export default HOLIDAY_MENUS
