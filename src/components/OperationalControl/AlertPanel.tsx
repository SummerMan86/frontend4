import React, { useState, useEffect } from 'react';

// Types for alerts
interface AlertAction {
  label: string;
  action: () => void;
  variant: 'filled' | 'light' | 'subtle';
}

interface AffectedItem {
  id: string;
  name: string;
  sku: string;
  rating?: number;
  stock?: number;
  price?: number;
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'rating' | 'stock' | 'budget' | 'position' | 'competitor';
  title: string;
  description: string;
  metric?: {
    current: number;
    threshold: number;
    unit?: string;
    trend: 'up' | 'down' | 'stable';
  };
  actions: AlertAction[];
  timestamp: Date;
  isRead: boolean;
  affectedItems: AffectedItem[];
}

// Test data
const generateTestAlerts = (): Alert[] => [
  {
    id: '1',
    type: 'critical',
    category: 'rating',
    title: 'Критически низкий рейтинг',
    description: 'Рейтинг товара "Кроссовки Nike Air Max" упал до 3.2. Последний отзыв: "Качество ужасное, подошва отклеилась через неделю"',
    metric: {
      current: 3.2,
      threshold: 4.0,
      trend: 'down'
    },
    actions: [
      { label: 'Ответить на отзыв', action: () => console.log('Открыть форму ответа'), variant: 'filled' },
      { label: 'Все отзывы', action: () => console.log('Перейти к отзывам'), variant: 'light' }
    ],
    timestamp: new Date(),
    isRead: false,
    affectedItems: [
      { id: '12345678', name: 'Кроссовки Nike Air Max', sku: 'NK-AM-001', rating: 3.2 }
    ]
  },
  {
    id: '2',
    type: 'critical',
    category: 'stock',
    title: 'Товар заканчивается',
    description: 'На складе Казань осталось всего 5 единиц товара. При текущем темпе продаж хватит на 2 дня',
    metric: {
      current: 5,
      threshold: 50,
      unit: 'шт',
      trend: 'down'
    },
    actions: [
      { label: 'Создать поставку', action: () => console.log('Создать заказ'), variant: 'filled' },
      { label: 'Прогноз', action: () => console.log('Показать прогноз'), variant: 'light' }
    ],
    timestamp: new Date(Date.now() - 3600000),
    isRead: false,
    affectedItems: [
      { id: '23456789', name: 'Футболка базовая черная', sku: 'TB-BL-M', stock: 5 }
    ]
  },
  {
    id: '3',
    type: 'warning',
    category: 'budget',
    title: 'Превышение рекламного бюджета',
    description: 'Расходы на АРК превысили дневной лимит на 25%. Текущий ДРР: 18%',
    metric: {
      current: 125,
      threshold: 100,
      unit: '%',
      trend: 'up'
    },
    actions: [
      { label: 'Снизить ставки', action: () => console.log('Управление ставками'), variant: 'filled' },
      { label: 'Анализ', action: () => console.log('Анализ расходов'), variant: 'light' }
    ],
    timestamp: new Date(Date.now() - 7200000),
    isRead: true,
    affectedItems: []
  },
  {
    id: '4',
    type: 'warning',
    category: 'position',
    title: 'Падение позиций в поиске',
    description: 'По запросу "кроссовки женские" позиция упала с 3 на 8 место. Конкуренты повысили ставки',
    metric: {
      current: 8,
      threshold: 5,
      trend: 'down'
    },
    actions: [
      { label: 'Повысить ставку', action: () => console.log('Управление ставками'), variant: 'filled' },
      { label: 'Анализ конкурентов', action: () => console.log('Анализ'), variant: 'light' }
    ],
    timestamp: new Date(Date.now() - 10800000),
    isRead: false,
    affectedItems: [
      { id: '34567890', name: 'Кроссовки женские розовые', sku: 'KR-W-PNK' }
    ]
  }
];

// Utility function for time ago
const getTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'только что';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} мин назад`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ч назад`;
  return `${Math.floor(seconds / 86400)} д назад`;
};

// Summary Card Component
const AlertSummaryCard = ({ 
  icon, 
  color, 
  title, 
  count, 
  subtitle, 
  onClick, 
  pulse = false 
}: {
  icon: React.ReactNode;
  color: 'red' | 'orange' | 'yellow' | 'blue';
  title: string;
  count: number;
  subtitle: string;
  onClick: () => void;
  pulse?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  
  const colors = {
    red: { bg: '#fee2e2', border: '#fca5a5', text: '#dc2626' },
    orange: { bg: '#fed7aa', border: '#fdba74', text: '#ea580c' },
    yellow: { bg: '#fef3c7', border: '#fcd34d', text: '#d97706' },
    blue: { bg: '#dbeafe', border: '#93c5fd', text: '#2563eb' }
  };
  
  const colorScheme = colors[color] || colors.blue;
  
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        cursor: 'pointer',
        padding: '16px',
        borderRadius: '8px',
        border: `1px solid ${hovered ? colorScheme.border : '#e5e7eb'}`,
        backgroundColor: hovered ? colorScheme.bg : '#ffffff',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
        position: 'relative'
      }}
    >
      {pulse && count > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            backgroundColor: colorScheme.text,
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}
        />
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            backgroundColor: colorScheme.bg,
            color: colorScheme.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: colorScheme.text }}>
            {count}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};

// Alert Item Component
const AlertItem = ({ 
  alert, 
  expanded, 
  onToggle, 
  onMute, 
  onAction 
}: {
  alert: Alert;
  expanded: boolean;
  onToggle: () => void;
  onMute: () => void;
  onAction: (action: AlertAction) => void;
}) => {
  const getIcon = () => {
    switch (alert.category) {
      case 'rating': return '⭐';
      case 'stock': return '📦';
      case 'budget': return '💰';
      case 'position': return '📉';
      default: return '⚠️';
    }
  };
  
  const getColor = () => {
    const colors = {
      critical: { bg: '#fee2e2', border: '#fca5a5', text: '#dc2626' },
      warning: { bg: '#fef3c7', border: '#fcd34d', text: '#d97706' },
      info: { bg: '#dbeafe', border: '#93c5fd', text: '#2563eb' }
    };
    return colors[alert.type];
  };
  
  const icon = getIcon();
  const colorScheme = getColor();
  const timeAgo = getTimeAgo(alert.timestamp);
  
  return (
    <div
      style={{
        padding: '12px',
        borderRadius: '8px',
        border: `1px solid ${!alert.isRead ? colorScheme.border : '#e5e7eb'}`,
        backgroundColor: !alert.isRead ? colorScheme.bg : '#ffffff',
        marginBottom: '8px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              backgroundColor: colorScheme.bg,
              color: colorScheme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '20px'
            }}
          >
            {icon}
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{alert.title}</h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>{timeAgo}</span>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: colorScheme.bg,
                    color: colorScheme.text,
                    fontWeight: 500
                  }}
                >
                  {alert.type === 'critical' ? 'Критично' : 
                   alert.type === 'warning' ? 'Важно' : 'Инфо'}
                </span>
              </div>
            </div>
            
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: '#6b7280',
              lineHeight: '1.5',
              overflow: expanded ? 'visible' : 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: expanded ? 'normal' : 'nowrap'
            }}>
              {alert.description}
            </p>

            {alert.metric && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <span style={{ fontSize: '12px', color: colorScheme.text, fontWeight: 500 }}>
                  {alert.metric.current}{alert.metric.unit || ''} / {alert.metric.threshold}{alert.metric.unit || ''}
                </span>
                <div style={{
                  flex: 1,
                  maxWidth: '100px',
                  height: '4px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div
                    style={{
                      width: `${(alert.metric.current / alert.metric.threshold) * 100}%`,
                      height: '100%',
                      backgroundColor: colorScheme.text,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                {alert.metric.trend !== 'stable' && (
                  <span style={{ fontSize: '12px' }}>
                    {alert.metric.trend === 'up' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onToggle}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: '#6b7280',
            fontSize: '16px'
          }}
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
          {alert.affectedItems.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <h5 style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 500 }}>Затронутые товары:</h5>
              {alert.affectedItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    backgroundColor: '#f9fafb'
                  }}>
                    {item.sku}
                  </span>
                  <span style={{ fontSize: '12px' }}>{item.name}</span>
                  {item.rating && (
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 6px',
                      backgroundColor: '#fef3c7',
                      color: '#d97706',
                      borderRadius: '4px'
                    }}>
                      ⭐ {item.rating}
                    </span>
                  )}
                  {item.stock && (
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 6px',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      borderRadius: '4px'
                    }}>
                      📦 {item.stock} шт
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            {alert.actions.map((action, index) => (
              <button
                key={index}
                onClick={() => onAction(action)}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  ...(action.variant === 'filled' ? {
                    backgroundColor: colorScheme.text,
                    color: '#ffffff',
                    border: 'none'
                  } : action.variant === 'light' ? {
                    backgroundColor: colorScheme.bg,
                    color: colorScheme.text,
                    border: `1px solid ${colorScheme.border}`
                  } : {
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb'
                  })
                }}
              >
                {action.label}
              </button>
            ))}
            <button
              onClick={onMute}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: 'transparent',
                color: '#9ca3af',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              🔕 Отключить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main AlertPanel Component
const AlertPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [muted, setMuted] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setAlerts(generateTestAlerts());
  }, []);

  const alertCounts = alerts.reduce((acc, alert) => {
    if (!muted.has(alert.id)) {
      if (alert.category === 'competitor') {
        return acc;
      }
      return {
        ...acc,
        [alert.category]: (acc[alert.category] || 0) + 1,
        critical: alert.type === 'critical' ? acc.critical + 1 : acc.critical
      };
    }
    return acc;
  }, { rating: 0, stock: 0, budget: 0, position: 0, critical: 0 });

  const toggleExpanded = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const muteAlert = (id: string) => {
    setMuted(prev => new Set([...prev, id]));
  };

  const handleAlertAction = (alert: Alert, action: AlertAction) => {
    action.action();
    setAlerts(prev => prev.map(a => 
      a.id === alert.id ? { ...a, isRead: true } : a
    ));
  };

  const handleCategoryClick = (category: string) => {
    console.log('Filter by category:', category);
  };

  const refreshAlerts = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAlerts(generateTestAlerts());
    setRefreshing(false);
  };

  const filteredAlerts = alerts
    .filter(alert => !muted.has(alert.id))
    .filter(alert => filter === 'all' || !alert.isRead)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div style={{
      padding: '16px',
      borderRadius: '8px',
      border: `1px solid ${alertCounts.critical > 0 ? '#fca5a5' : '#e5e7eb'}`,
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ⚠️
            </div>
            {alertCounts.critical > 0 && (
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '12px',
                height: '12px',
                backgroundColor: '#dc2626',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }} />
            )}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Критические предупреждения</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
              {alertCounts.critical} требуют немедленного внимания
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={refreshAlerts}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: '#6b7280',
              fontSize: '18px',
              animation: refreshing ? 'spin 1s linear infinite' : 'none'
            }}
            title="Обновить данные"
          >
            🔄
          </button>
          
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                color: '#6b7280',
                fontSize: '18px'
              }}
            >
              ⋮
            </button>
            
            {showMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minWidth: '200px',
                zIndex: 1000
              }}>
                <button
                  onClick={() => { setFilter('all'); setShowMenu(false); }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  👁️ Показать все
                </button>
                <button
                  onClick={() => { setFilter('unread'); setShowMenu(false); }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  👁️ Только непрочитанные
                </button>
                <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e5e7eb' }} />
                <button
                  onClick={() => { alert('Push-уведомления включены'); setShowMenu(false); }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🔔 Включить push-уведомления
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <AlertSummaryCard
          icon="⭐"
          color="red"
          title="Низкий рейтинг"
          count={alertCounts.rating}
          subtitle="товара < 4.0"
          onClick={() => handleCategoryClick('rating')}
          pulse={true}
        />
        <AlertSummaryCard
          icon="📦"
          color="orange"
          title="Заканчивается"
          count={alertCounts.stock}
          subtitle="SKU < 3 дней"
          onClick={() => handleCategoryClick('stock')}
          pulse={true}
        />
        <AlertSummaryCard
          icon="💰"
          color="yellow"
          title="Превышение"
          count={alertCounts.budget}
          subtitle="лимитов"
          onClick={() => handleCategoryClick('budget')}
        />
        <AlertSummaryCard
          icon="📉"
          color="blue"
          title="Падение"
          count={alertCounts.position}
          subtitle="позиций"
          onClick={() => handleCategoryClick('position')}
        />
      </div>

      {/* Alert List */}
      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {filteredAlerts.length === 0 ? (
          <p style={{
            textAlign: 'center',
            color: '#9ca3af',
            padding: '40px 0'
          }}>
            {filter === 'unread' 
              ? 'Нет непрочитанных предупреждений' 
              : 'Нет активных предупреждений'}
          </p>
        ) : (
          filteredAlerts.map(alert => (
            <AlertItem
              key={alert.id}
              alert={alert}
              expanded={expanded.has(alert.id)}
              onToggle={() => toggleExpanded(alert.id)}
              onMute={() => muteAlert(alert.id)}
              onAction={(action) => handleAlertAction(alert, action)}
            />
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '16px'
      }}>
        <button
          onClick={() => setExpanded(new Set())}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: 'transparent',
            color: '#6b7280',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Свернуть все
        </button>
        <button
          onClick={() => {
            setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
            alert('Все уведомления помечены как прочитанные');
          }}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: 'transparent',
            color: '#6b7280',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Прочитать все
        </button>
      </div>
    </div>
  );
};

export default AlertPanel;