// 餐厅数据 - 真实数据
const restaurantDB = [
  {
    id: 'mcdonalds',
    name: '麦当劳',
    type: '快餐',
    price: 35,
    rating: 4.2,
    address: '北京市朝阳区建国路88号院',
    phone: '400-920-0205',
    hours: '06:00-23:00',
    description: '全球知名连锁快餐品牌',
    mainDishes: [
      { name: '巨无霸', price: 25, isSignature: true },
      { name: '麦辣鸡腿堡', price: 22, isSignature: true },
      { name: '板烧鸡腿堡', price: 24, isSignature: true },
      { name: '麦香鸡', price: 18, isSignature: false },
      { name: '双层吉士汉堡', price: 21, isSignature: false },
      { name: '麦乐鸡5块', price: 13, isSignature: false },
      { name: '薯条中份', price: 12, isSignature: false },
      { name: '麦旋风奥利奥', price: 14, isSignature: true }
    ],
    drinks: [
      { name: '可乐中杯', price: 10, isSignature: false },
      { name: '雪碧中杯', price: 10, isSignature: false },
      { name: '芬达中杯', price: 10, isSignature: false },
      { name: '零度可乐', price: 10, isSignature: false },
      { name: '热朱古力', price: 12, isSignature: true },
      { name: '鲜煮咖啡', price: 10, isSignature: false },
      { name: '拿铁', price: 16, isSignature: false },
      { name: '橙汁', price: 14, isSignature: false }
    ]
  },
  {
    id: 'kfc',
    name: '肯德基',
    type: '快餐',
    price: 40,
    rating: 4.1,
    address: '北京市朝阳区三里屯路19号',
    phone: '400-882-3823',
    hours: '07:00-23:00',
    description: '以炸鸡闻名的全球快餐品牌',
    mainDishes: [
      { name: '吮指原味鸡', price: 12, isSignature: true },
      { name: '香辣鸡腿堡', price: 20, isSignature: true },
      { name: '新奥尔良烤鸡腿堡', price: 22, isSignature: true },
      { name: '劲脆鸡腿堡', price: 20, isSignature: false },
      { name: '香辣鸡翅2块', price: 11, isSignature: true },
      { name: '新奥尔良烤翅2块', price: 11, isSignature: true },
      { name: '上校鸡块5块', price: 13, isSignature: false },
      { name: '劲爆鸡米花小份', price: 12, isSignature: false },
      { name: '薯条中份', price: 12, isSignature: false },
      { name: '葡式蛋挞', price: 9, isSignature: true }
    ],
    drinks: [
      { name: '百事可乐中杯', price: 10, isSignature: false },
      { name: '七喜中杯', price: 10, isSignature: false },
      { name: '美年达中杯', price: 10, isSignature: false },
      { name: '无糖可乐', price: 10, isSignature: false },
      { name: '热柠檬红茶', price: 12, isSignature: true },
      { name: '热牛奶', price: 12, isSignature: false },
      { name: '现磨咖啡', price: 14, isSignature: false },
      { name: '九珍果汁', price: 13, isSignature: true }
    ]
  },
  {
    id: 'haidilao',
    name: '海底捞',
    type: '火锅',
    price: 120,
    rating: 4.7,
    address: '北京市朝阳区王府井大街255号',
    phone: '400-810-1234',
    hours: '10:00-03:00',
    description: '以服务著称的火锅连锁品牌',
    mainDishes: [
      { name: '招牌虾滑', price: 48, isSignature: true },
      { name: '精品肥牛', price: 56, isSignature: true },
      { name: '毛肚', price: 52, isSignature: true },
      { name: '鸭肠', price: 42, isSignature: false },
      { name: '嫩牛肉', price: 58, isSignature: true },
      { name: '千层肚', price: 46, isSignature: false },
      { name: '黄喉', price: 48, isSignature: false },
      { name: '脑花', price: 28, isSignature: false },
      { name: '鸭血', price: 18, isSignature: false },
      { name: '四宫格锅底', price: 68, isSignature: true }
    ],
    drinks: [
      { name: '酸梅汤', price: 18, isSignature: true },
      { name: '金桔柠檬', price: 16, isSignature: false },
      { name: '鲜榨西瓜汁', price: 22, isSignature: true },
      { name: '鲜榨橙汁', price: 24, isSignature: false },
      { name: '啤酒', price: 15, isSignature: false },
      { name: '可乐', price: 12, isSignature: false },
      { name: '雪碧', price: 12, isSignature: false },
      { name: '豆浆', price: 10, isSignature: false }
    ]
  }
];

module.exports = {
  restaurantDB
};
