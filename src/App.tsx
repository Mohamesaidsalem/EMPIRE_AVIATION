import React, { useState, useEffect } from 'react';
import { Plane, BarChart3, Wrench, Menu, X, Plus } from 'lucide-react';
import { FlightForm } from './components/FlightForm';
import { FlightList } from './components/FlightList';
import { Dashboard } from './components/Dashboard';
import { ServiceLog } from './components/ServiceLog';
import { FlightRecord, ServiceRecord } from './types/flight';

type TabType = 'dashboard' | 'flights' | 'services';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showFlightForm, setShowFlightForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState<FlightRecord | null>(null);
  const [flights, setFlights] = useState<FlightRecord[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedFlights = localStorage.getItem('flightLogbook_flights');
    const savedServices = localStorage.getItem('flightLogbook_services');
    
    if (savedFlights) {
      setFlights(JSON.parse(savedFlights));
    }
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
  }, []);

  // Save flights to localStorage whenever flights change
  useEffect(() => {
    localStorage.setItem('flightLogbook_flights', JSON.stringify(flights));
  }, [flights]);

  // Save services to localStorage whenever services change
  useEffect(() => {
    localStorage.setItem('flightLogbook_services', JSON.stringify(services));
  }, [services]);

  const handleSaveFlight = (flight: FlightRecord) => {
    if (editingFlight) {
      setFlights(prev => prev.map(f => f.id === editingFlight.id ? flight : f));
      setEditingFlight(null);
    } else {
      setFlights(prev => [...prev, flight]);
    }
    setShowFlightForm(false);
  };

  const handleEditFlight = (flight: FlightRecord) => {
    setEditingFlight(flight);
    setShowFlightForm(true);
  };

  const handleDeleteFlight = (id: string) => {
    if (confirm('Are you sure you want to delete this flight record?')) {
      setFlights(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleAddService = (service: ServiceRecord) => {
    setServices(prev => [...prev, service]);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'flights', label: 'Flight Records', icon: Plane },
    { id: 'services', label: 'Service Log', icon: Wrench },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard flights={flights} />;
      case 'flights':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Flight Records</h2>
                <p className="text-gray-600">Manage and track all your flight operations</p>
              </div>
              <button
                onClick={() => setShowFlightForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Add Flight Record</span>
              </button>
            </div>
            <FlightList 
              flights={flights} 
              onEdit={handleEditFlight}
              onDelete={handleDeleteFlight}
            />
          </div>
        );
      case 'services':
        return <ServiceLog services={services} onAddService={handleAddService} />;
      default:
        return <Dashboard flights={flights} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plane className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Empire Aviation</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center space-x-3 p-6 border-b border-gray-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plane className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Empire Aviation</h1>
                <p className="text-sm text-gray-500">Flight Logbook System</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as TabType);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                      ${activeTab === tab.id 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                <p>Empire Aviation</p>
                <p className="text-xs mt-1">Version 1.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <main className="p-4 lg:p-8">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Flight Form Modal */}
      {showFlightForm && (
        <FlightForm
          onSave={handleSaveFlight}
          onCancel={() => {
            setShowFlightForm(false);
            setEditingFlight(null);
          }}
          editingFlight={editingFlight}
        />
      )}
    </div>
  );
}

export default App;