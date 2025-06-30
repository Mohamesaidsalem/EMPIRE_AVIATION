import React, { useState } from 'react';
import { Plus, Save, Wrench, Receipt } from 'lucide-react';
import { ServiceRecord } from '../types/flight';

interface ServiceLogProps {
  services: ServiceRecord[];
  onAddService: (service: ServiceRecord) => void;
}

export const ServiceLog: React.FC<ServiceLogProps> = ({ services, onAddService }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<ServiceRecord>>({
    date: '',
    station: '',
    invoice: '',
    serviceType: '',
    quantity: 0,
    cost: 0,
    details: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const service: ServiceRecord = {
      ...formData as ServiceRecord
    };
    onAddService(service);
    setFormData({
      date: '',
      station: '',
      invoice: '',
      serviceType: '',
      quantity: 0,
      cost: 0,
      details: ''
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">سجل الخدمات</h2>
          <p className="text-gray-600">تتبع خدمات الطائرة والصيانة</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة خدمة</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Wrench className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">إضافة خدمة جديدة</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المحطة</label>
                <input
                  type="text"
                  value={formData.station}
                  onChange={(e) => setFormData(prev => ({ ...prev, station: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الفاتورة</label>
                <input
                  type="text"
                  value={formData.invoice}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoice: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع الخدمة</label>
                <input
                  type="text"
                  value={formData.serviceType}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الكمية</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التكلفة</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">التفاصيل</label>
              <textarea
                value={formData.details}
                onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>حفظ</span>
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Receipt className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد خدمات مسجلة</h3>
            <p className="text-gray-500">ابدأ بإضافة خدمة جديدة</p>
          </div>
        ) : (
          services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Wrench className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.serviceType}</h3>
                    <p className="text-sm text-gray-500">فاتورة #{service.invoice}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${service.cost.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{service.quantity} وحدة</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">التاريخ:</span>
                  <p className="font-medium text-gray-900">{new Date(service.date).toLocaleDateString('ar-SA')}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">المحطة:</span>
                  <p className="font-medium text-gray-900">{service.station}</p>
                </div>
              </div>
              
              {service.details && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">التفاصيل:</span>
                  <p className="text-gray-900 mt-1">{service.details}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};