// services/wildberriesAPI.ts
import axios, { AxiosInstance } from 'axios';
import { notifications } from '@mantine/notifications';

// Типы для API Wildberries
export interface WBProduct {
  nmId: number;
  imtId: number;
  nmUuid: string;
  subjectId: number;
  subjectName: string;
  vendorCode: string;
  brand: string;
  title: string;
  description: string;
  photos: string[];
  video: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  characteristics: Array<{
    id: number;
    name: string;
    value: string;
  }>;
  sizes: Array<{
    techSize: string;
    wbSize: string;
    skus: string[];
    price: number;
    discountedPrice: number;
  }>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WBStock {
  lastChangeDate: string;
  warehouseName: string;
  supplierArticle: string;
  nmId: number;
  barcode: string;
  quantity: number;
  inWayToClient: number;
  inWayFromClient: number;
  quantityFull: number;
  category: string;
  subject: string;
  brand: string;
  Price: number;
  Discount: number;
  isSupply: boolean;
  isRealization: boolean;
  SCCode: string;
}

export interface WBOrder {
  date: string;
  lastChangeDate: string;
  warehouseName: string;
  regionName: string;
  supplierArticle: string;
  nmId: number;
  barcode: string;
  category: string;
  subject: string;
  brand: string;
  techSize: string;
  incomeID: number;
  isSupply: boolean;
  isRealization: boolean;
  totalPrice: number;
  discountPercent: number;
  spp: number;
  finishedPrice: number;
  priceWithDisc: number;
  isCancel: boolean;
  cancelDate: string;
  orderType: string;
  sticker: string;
  gNumber: string;
  srid: string;
}

export interface WBSale {
  date: string;
  lastChangeDate: string;
  warehouseName: string;
  regionName: string;
  supplierArticle: string;
  nmId: number;
  barcode: string;
  category: string;
  subject: string;
  brand: string;
  techSize: string;
  incomeID: number;
  isSupply: boolean;
  isRealization: boolean;
  totalPrice: number;
  discountPercent: number;
  spp: number;
  paymentSaleAmount: number;
  forPay: number;
  finishedPrice: number;
  priceWithDisc: number;
  saleID: string;
  orderType: string;
  sticker: string;
  gNumber: string;
  srid: string;
}

export interface WBFeedback {
  id: string;
  imtId: number;
  nmId: number;
  subjectId: number;
  userName: string;
  matchingSize: string;
  text: string;
  productValuation: number;
  createdDate: string;
  state: string;
  answer: {
    text: string;
    state: string;
    createDate: string;
  };
  photoLinks: string[];
  video: string;
  wasViewed: boolean;
  isAbleSupplierFeedbackValuation: boolean;
  supplierFeedbackValuation: number;
  isAbleSupplierProductValuation: boolean;
  supplierProductValuation: number;
  isAbleReturnProductOrders: boolean;
  returnProductOrdersDate: string;
  bables: Array<{
    id: string;
    name: string;
    count: number;
  }>;
}

export interface WBAdvertStats {
  date: string;
  campaign: {
    id: number;
    name: string;
    type: string;
  };
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  spend: number;
  orders: number;
  shoppingCartRevenue: number;
  orderRevenue: number;
  roas: number;
}

// Класс для работы с API Wildberries
class WildberriesAPI {
  private api: AxiosInstance;
  private statisticsApi: AxiosInstance;
  private contentApi: AxiosInstance;
  private advertisingApi: AxiosInstance;

  constructor(apiKey: string) {
    // Основной API
    this.api = axios.create({
      baseURL: 'https://api.wildberries.ru',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });

    // API статистики
    this.statisticsApi = axios.create({
      baseURL: 'https://statistics-api.wildberries.ru',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });

    // API контента
    this.contentApi = axios.create({
      baseURL: 'https://content-api.wildberries.ru',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });

    // API рекламы
    this.advertisingApi = axios.create({
      baseURL: 'https://advert-api.wb.ru',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });

    // Interceptors для обработки ошибок
    [this.api, this.statisticsApi, this.contentApi, this.advertisingApi].forEach(instance => {
      instance.interceptors.response.use(
        response => response,
        error => {
          this.handleApiError(error);
          return Promise.reject(error);
        }
      );
    });
  }

  private handleApiError(error: any) {
    const message = error.response?.data?.message || error.message || 'Неизвестная ошибка API';
    
    notifications.show({
      title: 'Ошибка API Wildberries',
      message,
      color: 'red'
    });

    console.error('Wildberries API Error:', error);
  }

  // Методы для работы со складскими остатками
  async getStocks(dateFrom?: string): Promise<WBStock[]> {
    try {
      const response = await this.statisticsApi.get('/api/v1/supplier/stocks', {
        params: { dateFrom }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching stocks:', error);
      return [];
    }
  }

  // Методы для работы с заказами
  async getOrders(dateFrom: string, dateTo?: string): Promise<WBOrder[]> {
    try {
      const response = await this.statisticsApi.get('/api/v1/supplier/orders', {
        params: { dateFrom, dateTo }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  // Методы для работы с продажами
  async getSales(dateFrom: string, dateTo?: string): Promise<WBSale[]> {
    try {
      const response = await this.statisticsApi.get('/api/v1/supplier/sales', {
        params: { dateFrom, dateTo }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales:', error);
      return [];
    }
  }

  // Методы для работы с отзывами
  async getFeedbacks(isAnswered?: boolean, take = 1000, skip = 0): Promise<WBFeedback[]> {
    try {
      const response = await this.api.get('/api/v1/feedbacks', {
        params: { isAnswered, take, skip }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      return [];
    }
  }

  // Ответ на отзыв
  async replyToFeedback(feedbackId: string, text: string): Promise<boolean> {
    try {
      await this.api.patch('/api/v1/feedbacks', {
        id: feedbackId,
        text
      });
      
      notifications.show({
        title: 'Ответ отправлен',
        message: 'Ваш ответ на отзыв успешно отправлен',
        color: 'green'
      });
      
      return true;
    } catch (error) {
      console.error('Error replying to feedback:', error);
      return false;
    }
  }

  // Методы для работы с рекламой
  async getAdvertStats(dateFrom: string, dateTo: string): Promise<WBAdvertStats[]> {
    try {
      const campaigns = await this.advertisingApi.get('/adv/v1/promotion/count');
      const stats: WBAdvertStats[] = [];

      // Получаем статистику по каждой кампании
      for (const campaign of campaigns.data) {
        const campaignStats = await this.advertisingApi.get(`/adv/v2/fullstats`, {
          params: {
            campaignId: campaign.id,
            dateFrom,
            dateTo
          }
        });
        
        stats.push(...campaignStats.data);
      }

      return stats;
    } catch (error) {
      console.error('Error fetching advertising stats:', error);
      return [];
    }
  }

  // Получение информации о товарах
  async getProducts(): Promise<WBProduct[]> {
    try {
      const response = await this.contentApi.get('/content/v1/cards/cursor/list');
      return response.data.data.cards || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Аналитические методы для оперативного контроля
  async getOperationalData(dateFrom: string, dateTo: string) {
    const [stocks, orders, sales, feedbacks, advertStats] = await Promise.all([
      this.getStocks(dateFrom),
      this.getOrders(dateFrom, dateTo),
      this.getSales(dateFrom, dateTo),
      this.getFeedbacks(false, 100),
      this.getAdvertStats(dateFrom, dateTo)
    ]);

    return {
      stocks,
      orders,
      sales,
      feedbacks,
      advertStats
    };
  }

  // Расчет метрик для оперативного контроля
  calculateMetrics(data: {
    stocks: WBStock[];
    orders: WBOrder[];
    sales: WBSale[];
    feedbacks: WBFeedback[];
    advertStats: WBAdvertStats[];
  }) {
    // Расчет общих метрик
    const totalOrders = data.orders.length;
    const totalSales = data.sales.length;
    const totalRevenue = data.sales.reduce((sum, sale) => sum + sale.forPay, 0);
    const totalAdSpend = data.advertStats.reduce((sum, stat) => sum + stat.spend, 0);
    
    // Расчет конверсии
    const conversion = totalOrders > 0 ? (totalSales / totalOrders) * 100 : 0;
    
    // Расчет среднего рейтинга
    const ratings = data.feedbacks.map(f => f.productValuation).filter(r => r > 0);
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
      : 0;
    
    // Расчет ROAS
    const roas = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0;
    
    // Поиск проблемных товаров
    const lowStockProducts = data.stocks.filter(stock => stock.quantityFull < 10);
    const lowRatingProducts = data.feedbacks
      .filter(f => f.productValuation <= 3)
      .map(f => f.nmId);
    
    return {
      summary: {
        totalOrders,
        totalSales,
        totalRevenue,
        totalAdSpend,
        conversion,
        avgRating,
        roas
      },
      alerts: {
        lowStock: lowStockProducts,
        lowRating: [...new Set(lowRatingProducts)]
      }
    };
  }

  // Методы для управления рекламными кампаниями
  async updateCampaignBid(campaignId: number, bid: number): Promise<boolean> {
    try {
      await this.advertisingApi.post(`/adv/v1/cpm/set`, {
        campaignId,
        cpm: bid
      });
      
      notifications.show({
        title: 'Ставка обновлена',
        message: `Новая ставка: ${bid} ₽`,
        color: 'green'
      });
      
      return true;
    } catch (error) {
      console.error('Error updating campaign bid:', error);
      return false;
    }
  }

  async pauseCampaign(campaignId: number): Promise<boolean> {
    try {
      await this.advertisingApi.get(`/adv/v1/pause?id=${campaignId}`);
      
      notifications.show({
        title: 'Кампания приостановлена',
        message: 'Рекламная кампания успешно приостановлена',
        color: 'yellow'
      });
      
      return true;
    } catch (error) {
      console.error('Error pausing campaign:', error);
      return false;
    }
  }
}

// Singleton экземпляр
let apiInstance: WildberriesAPI | null = null;

// Функция инициализации API
export const initializeWildberriesAPI = (apiKey: string) => {
  apiInstance = new WildberriesAPI(apiKey);
  return apiInstance;
};

// Функция получения экземпляра API
export const getWildberriesAPI = (): WildberriesAPI => {
  if (!apiInstance) {
    throw new Error('Wildberries API не инициализирован. Вызовите initializeWildberriesAPI с API ключом.');
  }
  return apiInstance;
};

// Экспорт типов и класса
export { WildberriesAPI };
export default getWildberriesAPI;