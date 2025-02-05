import React, { useState } from 'react';
import { Clock, Filter, AlertCircle, ChevronDown, ChevronUp, Timer, User, MapPin, Coffee, CheckCircle2, MoreVertical } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
  specialRequests?: string[];
}

interface Order {
  id: string;
  customer: string;
  items: OrderItem[];
  total: number;
  status: 'new' | 'preparing' | 'ready' | 'completed';
  priority: 'urgent' | 'standard';
  time: string;
  table: string;
  assignedTo?: string;
  estimatedTime?: string;
  actualTime?: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '#1234',
      customer: 'John Doe',
      items: [
        { 
          name: 'Coq au Vin',
          quantity: 1,
          notes: 'Medium well',
          specialRequests: ['No mushrooms']
        },
        {
          name: 'French Onion Soup',
          quantity: 1
        }
      ],
      total: 42.98,
      status: 'preparing',
      priority: 'urgent',
      time: '10 mins ago',
      table: '4',
      assignedTo: 'Chef Michael',
      estimatedTime: '15 mins'
    },
    {
      id: '#1235',
      customer: 'Jane Smith',
      items: [
        {
          name: 'Ratatouille',
          quantity: 1,
          specialRequests: ['Extra herbs']
        },
        {
          name: 'Crème Brûlée',
          quantity: 2
        }
      ],
      total: 36.99,
      status: 'ready',
      priority: 'standard',
      time: '15 mins ago',
      table: '7',
      assignedTo: 'Chef Sarah',
      estimatedTime: '20 mins',
      actualTime: '18 mins'
    }
  ]);

  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Order['priority']) => {
    return priority === 'urgent' 
      ? 'bg-red-100 text-red-800 border border-red-200' 
      : 'bg-gray-100 text-gray-600 border border-gray-200';
  };

  const getTimeColor = (time: string) => {
    const minutes = parseInt(time);
    if (minutes > 30) return 'text-red-600';
    if (minutes > 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const filteredOrders = orders.filter(order => 
    activeStatus === 'all' || order.status === activeStatus
  );

  const orderStatuses = [
    { value: 'all', label: 'All Orders' },
    { value: 'new', label: 'New' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {orders.filter(o => o.status !== 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Coffee className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Preparing</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {orders.filter(o => o.status === 'preparing').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Timer className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ready to Serve</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {orders.filter(o => o.status === 'ready').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Prep Time</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">18m</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {orderStatuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setActiveStatus(status.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeStatus === status.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-5 h-5 mr-2 text-gray-600" />
          <span className="text-gray-600">Filter</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div 
            key={order.id}
            className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
              expandedOrder === order.id ? 'ring-2 ring-primary-500' : 'hover:shadow-md'
            }`}
          >
            {/* Order Header */}
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-semibold text-gray-900">{order.id}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(order.priority)}`}>
                        {order.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      <span className="font-medium">{order.customer}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">${order.total}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className={getTimeColor(order.time)}>{order.time}</span>
                    </div>
                  </div>
                  {expandedOrder === order.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Table {order.table}
                </div>
                {order.assignedTo && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {order.assignedTo}
                  </div>
                )}
                {order.estimatedTime && (
                  <div className="flex items-center">
                    <Timer className="w-4 h-4 mr-1" />
                    Est. {order.estimatedTime}
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedOrder === order.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Order Items</h5>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-start justify-between bg-white p-3 rounded-lg">
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">{item.name}</span>
                              <span className="ml-2 text-sm text-gray-500">×{item.quantity}</span>
                            </div>
                            {item.notes && (
                              <p className="mt-1 text-sm text-gray-500">{item.notes}</p>
                            )}
                            {item.specialRequests && item.specialRequests.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {item.specialRequests.map((request, idx) => (
                                  <span 
                                    key={idx}
                                    className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full"
                                  >
                                    {request}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button className="p-1 hover:bg-gray-100 rounded-full">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 pt-2">
                    {order.status !== 'completed' && (
                      <>
                        {order.status === 'new' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            Start Preparing
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Mark as Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Complete Order
                          </button>
                        )}
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          Add Note
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}