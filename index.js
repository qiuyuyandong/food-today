// 今天吃什么 - 主页面逻辑
const { restaurantDB } = require('../../utils/data.js');

Page({
  data: {
    // 定位相关
    location: null,
    locationStatus: '', // '', 'success', 'error'
    locationIcon: '🌍',
    locationText: '点击按钮获取您的位置',
    isLocating: false,

    // 筛选相关
    showFilter: false,
    radius: 1000,
    priceRange: 'all',

    // 餐厅数据
    restaurants: [],
    filteredRestaurants: [],
    showRestaurantList: false,

    // 标签页
    activeTab: 'restaurants', // 'restaurants', 'favorites', 'history'

    // 收藏和历史
    favorites: [],
    history: [],

    // 抽签相关
    showLottery: false,
    isRollingShop: false,
    rollingShopName: '',
    selectedShop: null,

    // 菜品选择
    showDishSelection: false,
    activeDishTab: 'main', // 'main', 'drink'
    selectedMainDish: null,
    selectedDrink: null,
    isDrawingMain: false,
    isDrawingDrink: false,
    drawingMainName: '',
    drawingDrinkName: '',
    drawnMainDish: null,
    drawnDrink: null,

    // 弹窗
    showModal: false,
    modalRestaurant: null,

    // 总结
    showSummary: false,

    // Toast
    toast: {
      show: false,
      message: '',
      type: 'info' // 'info', 'success', 'error'
    }
  },

  onLoad() {
    // 加载收藏和历史
    this.loadStorageData();
    // 初始化餐厅数据（添加随机距离）
    this.initRestaurants();
  },

  onShareAppMessage() {
    return {
      title: '今天吃什么？让命运决定你的下一餐！',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'
    };
  },

  // ========== 数据初始化 ==========

  loadStorageData() {
    try {
      const favorites = wx.getStorageSync('favorites') || [];
      const history = wx.getStorageSync('history') || [];
      this.setData({ favorites, history });
    } catch (e) {
      console.error('加载存储数据失败:', e);
    }
  },

  initRestaurants() {
    // 为每个餐厅添加随机距离（模拟）
    const restaurants = restaurantDB.map(r => ({
      ...r,
      distance: Math.floor(Math.random() * 2000) + 100,
      lat: 39.9 + Math.random() * 0.1,
      lng: 116.4 + Math.random() * 0.1,
      isFavorite: false
    }));

    this.setData({ restaurants });
  },

  // ========== 定位功能 ==========

  getLocation() {
    this.setData({
      isLocating: true,
      locationStatus: '',
      locationIcon: '⏳',
      locationText: '正在获取位置...'
    });

    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const { latitude, longitude } = res;
        this.setData({
          location: { lat: latitude, lng: longitude },
          locationStatus: 'success',
          locationIcon: '✅',
          locationText: `已获取位置 (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          isLocating: false,
          showFilter: true,
          showRestaurantList: true,
          showLottery: true
        });

        // 计算实际距离
        this.calculateDistances(latitude, longitude);
        this.applyFilter();

        this.showToast('位置获取成功！', 'success');
      },
      fail: (err) => {
        console.error('获取位置失败:', err);
        this.setData({
          locationStatus: 'error',
          locationIcon: '❌',
          locationText: '获取位置失败，请检查定位权限',
          isLocating: false
        });
        this.showToast('获取位置失败', 'error');
      }
    });
  },

  calculateDistances(lat, lng) {
    // 使用简化的距离计算（实际应该用Haversine公式）
    const restaurants = this.data.restaurants.map(r => {
      // 模拟距离计算
      const distance = Math.floor(
        Math.sqrt(Math.pow(r.lat - lat, 2) + Math.pow(r.lng - lng, 2)) * 111000
      );
      return { ...r, distance: Math.max(100, distance) };
    }).sort((a, b) => a.distance - b.distance);

    this.setData({ restaurants });
  },

  // ========== 筛选功能 ==========

  onRadiusChange(e) {
    this.setData({ radius: e.detail.value });
  },

  onPriceChange(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({ priceRange: value });
  },

  applyFilter() {
    let filtered = [...this.data.restaurants];

    // 距离筛选
    filtered = filtered.filter(r => r.distance <= this.data.radius);

    // 价格筛选
    if (this.data.priceRange !== 'all') {
      const [min, max] = this.data.priceRange.split('-').map(v =>
        v === '100+' ? 100 : parseInt(v)
      );
      if (this.data.priceRange === '100+') {
        filtered = filtered.filter(r => r.price >= 100);
      } else {
        filtered = filtered.filter(r => r.price >= min && r.price <= max);
      }
    }

    this.setData({ filteredRestaurants: filtered });
    this.showToast(`找到 ${filtered.length} 家餐厅`, 'success');
  },

  // ========== 标签页切换 ==========

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // ========== 收藏功能 ==========

  toggleFavorite(e) {
    const id = e.currentTarget.dataset.id;
    const restaurant = this.data.restaurants.find(r => r.id === id);

    if (!restaurant) return;

    let favorites = [...this.data.favorites];
    const index = favorites.findIndex(f => f.id === id);

    if (index === -1) {
      // 添加收藏
      favorites.push({ ...restaurant, isFavorite: true });
      this.showToast('已添加到收藏', 'success');
    } else {
      // 取消收藏
      favorites.splice(index, 1);
      this.showToast('已取消收藏', 'info');
    }

    // 更新餐厅数据
    const restaurants = this.data.restaurants.map(r =>
      r.id === id ? { ...r, isFavorite: index === -1 } : r
    );

    this.setData({ favorites, restaurants });

    // 保存到本地
    wx.setStorageSync('favorites', favorites);
  },

  // ========== 导航功能（完美支持）==========

  openNavigation(e) {
    const { name, address, lat, lng } = e.currentTarget.dataset;

    // 使用微信内置地图导航 - 完美支持！
    wx.openLocation({
      latitude: parseFloat(lat) || 39.9,
      longitude: parseFloat(lng) || 116.4,
      name: name,
      address: address,
      scale: 18,
      success: () => {
        this.showToast('正在打开导航...', 'success');
      },
      fail: (err) => {
        console.error('导航失败:', err);
        this.showToast('导航失败，请重试', 'error');
      }
    });
  },

  navigateFromModal() {
    const { modalRestaurant } = this.data;
    if (!modalRestaurant) return;

    wx.openLocation({
      latitude: modalRestaurant.lat,
      longitude: modalRestaurant.lng,
      name: modalRestaurant.name,
      address: modalRestaurant.address,
      scale: 18
    });
  },

  // ========== 餐厅详情 ==========

  showRestaurantDetail(e) {
    const id = e.currentTarget.dataset.id;
    const restaurant = this.data.restaurants.find(r => r.id === id);

    if (restaurant) {
      this.setData({
        showModal: true,
        modalRestaurant: restaurant
      });
    }
  },

  closeModal() {
    this.setData({
      showModal: false,
      modalRestaurant: null
    });
  },

  preventClose() {
    // 阻止冒泡
  },

  // ========== 抽签 - 选店 ==========

  startShopLottery() {
    const { filteredRestaurants } = this.data;

    if (filteredRestaurants.length === 0) {
      this.showToast('暂无可用的餐厅', 'error');
      return;
    }

    this.setData({
      isRollingShop: true,
      selectedShop: null
    });

    // 滚动动画
    let count = 0;
    const totalRolls = 10;

    const rollInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
      const randomShop = filteredRestaurants[randomIndex];

      this.setData({ rollingShopName: randomShop.name });
      count++;

      if (count >= totalRolls) {
        clearInterval(rollInterval);
        // 最终选择
        const finalIndex = Math.floor(Math.random() * filteredRestaurants.length);
        const selectedShop = filteredRestaurants[finalIndex];

        this.setData({
          isRollingShop: false,
          selectedShop: selectedShop,
          rollingShopName: ''
        });

        this.showToast(`🎉 抽中了「${selectedShop.name}」`, 'success');
      }
    }, 50);
  },

  resetShop() {
    this.setData({
      selectedShop: null,
      isRollingShop: false,
      rollingShopName: ''
    });
  },

  confirmShop() {
    const { selectedShop } = this.data;

    if (!selectedShop) {
      this.showToast('请先抽签选择店铺', 'error');
      return;
    }

    this.setData({
      showLottery: false,
      showDishSelection: true,
      activeDishTab: 'main',
      selectedMainDish: null,
      selectedDrink: null,
      drawnMainDish: null,
      drawnDrink: null
    });

    this.showToast(`已选择「${selectedShop.name}」，开始选菜吧！`, 'success');
  },

  // ========== 菜品选择 ==========

  switchDishTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeDishTab: tab });
  },

  selectDish(e) {
    const { index, type } = e.currentTarget.dataset;
    const { selectedShop } = this.data;

    if (!selectedShop) return;

    if (type === 'main') {
      const dish = selectedShop.mainDishes[index];
      this.setData({ selectedMainDish: { ...dish, index } });
      this.showToast(`已选择主食：${dish.name}`, 'success');
    } else {
      const dish = selectedShop.drinks[index];
      this.setData({ selectedDrink: { ...dish, index } });
      this.showToast(`已选择饮料：${dish.name}`, 'success');
    }
  },

  // ========== 抽签 - 主食 ==========

  drawMainDish() {
    const { selectedShop } = this.data;

    if (!selectedShop || !selectedShop.mainDishes.length) {
      this.showToast('暂无主食可选', 'error');
      return;
    }

    this.setData({ isDrawingMain: true });

    let count = 0;
    const totalRolls = 8;

    const rollInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * selectedShop.mainDishes.length);
      const randomDish = selectedShop.mainDishes[randomIndex];

      this.setData({ drawingMainName: randomDish.name });
      count++;

      if (count >= totalRolls) {
        clearInterval(rollInterval);

        const finalIndex = Math.floor(Math.random() * selectedShop.mainDishes.length);
        const drawnDish = selectedShop.mainDishes[finalIndex];

        this.setData({
          isDrawingMain: false,
          drawnMainDish: drawnDish,
          selectedMainDish: { ...drawnDish, index: finalIndex },
          drawingMainName: ''
        });

        this.showToast(`🎉 抽中了主食：${drawnDish.name}`, 'success');
      }
    }, 40);
  },

  // ========== 抽签 - 饮料 ==========

  drawDrink() {
    const { selectedShop } = this.data;

    if (!selectedShop || !selectedShop.drinks.length) {
      this.showToast('暂无饮料可选', 'error');
      return;
    }

    this.setData({ isDrawingDrink: true });

    let count = 0;
    const totalRolls = 8;

    const rollInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * selectedShop.drinks.length);
      const randomDrink = selectedShop.drinks[randomIndex];

      this.setData({ drawingDrinkName: randomDrink.name });
      count++;

      if (count >= totalRolls) {
        clearInterval(rollInterval);

        const finalIndex = Math.floor(Math.random() * selectedShop.drinks.length);
        const drawnDrink = selectedShop.drinks[finalIndex];

        this.setData({
          isDrawingDrink: false,
          drawnDrink: drawnDrink,
          selectedDrink: { ...drawnDrink, index: finalIndex },
          drawingDrinkName: ''
        });

        this.showToast(`🎉 抽中了饮料：${drawnDrink.name}`, 'success');
      }
    }, 40);
  },

  // ========== 完成选择 ==========

  finishSelection() {
    const { selectedShop, selectedMainDish, selectedDrink } = this.data;

    if (!selectedShop) {
      this.showToast('请先选择店铺', 'error');
      return;
    }

    if (!selectedMainDish && !selectedDrink) {
      this.showToast('请至少选择主食或饮料', 'error');
      return;
    }

    // 显示总结
    this.setData({ showSummary: true });

    // 保存到历史
    this.addToHistory();
  },

  addToHistory() {
    const { selectedShop, selectedMainDish, selectedDrink } = this.data;

    const historyItem = {
      id: selectedShop.id,
      name: selectedShop.name,
      type: selectedShop.type,
      rating: selectedShop.rating,
      price: selectedShop.price,
      selectedMainDish: selectedMainDish,
      selectedDrink: selectedDrink,
      totalPrice: (selectedMainDish ? selectedMainDish.price : 0) + (selectedDrink ? selectedDrink.price : 0),
      date: new Date().toLocaleString('zh-CN'),
      timestamp: Date.now()
    };

    const history = [historyItem, ...this.data.history].slice(0, 50);

    this.setData({ history });
    wx.setStorageSync('history', history);
  },

  closeSummary() {
    this.setData({ showSummary: false });
    this.resetAll();
  },

  resetAll() {
    this.setData({
      showDishSelection: false,
      showLottery: true,
      selectedShop: null,
      selectedMainDish: null,
      selectedDrink: null,
      drawnMainDish: null,
      drawnDrink: null,
      isRollingShop: false,
      isDrawingMain: false,
      isDrawingDrink: false
    });
  },

  backToShopSelection() {
    this.setData({
      showDishSelection: false,
      showLottery: true,
      selectedMainDish: null,
      selectedDrink: null,
      drawnMainDish: null,
      drawnDrink: null
    });
  },

  // ========== Toast 提示 ==========

  showToast(message, type = 'info') {
    this.setData({
      toast: { show: true, message, type }
    });

    setTimeout(() => {
      this.setData({
        toast: { show: false, message: '', type: 'info' }
      });
    }, 2500);
  }
});
