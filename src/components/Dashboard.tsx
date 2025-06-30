import React from 'react';
import { Clock, MapPin, Plane, Users, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { FlightRecord } from '../types/flight';

interface DashboardProps {
  flights: FlightRecord[];
}

export const Dashboard: React.FC<DashboardProps> = ({ flights }) => {
  const calculateStats = () => {
    const totalFlights = flights.length;
    const totalRoutes = flights.reduce((acc, flight) => acc + flight.routes.length, 0);
    
    const totalFlightTime = flights.reduce((acc, flight) => {
      return acc + flight.totals.flight;
    }, 0);

    const totalBlockTime = flights.reduce((acc, flight) => {
      return acc + flight.totals.block;
    }, 0);

    const totalDutyTime = flights.reduce((acc, flight) => {
      return acc + (flight.dutyPeriod.total || 0);
    }, 0);

    const totalNightHours = flights.reduce((acc, flight) => {
      return acc + flight.totals.nightHrs;
    }, 0);

    const totalIfrHours = flights.reduce((acc, flight) => {
      return acc + flight.totals.ifrHrs;
    }, 0);

    const totalLandings = flights.reduce((acc, flight) => {
      return acc + flight.totals.ldgs;
    }, 0);

    const totalPax = flights.reduce((acc, flight) => {
      return acc + flight.totals.pax;
    }, 0);

    const uniqueAircraft = new Set(flights.map(f => f.aircraftRegistration)).size;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyFlights = flights.filter(f => {
      const flightDate = new Date(f.journeyStartDate);
      return flightDate.getMonth() === currentMonth && flightDate.getFullYear() === currentYear;
    }).length;

    return {
      totalFlights,
      totalRoutes,
      totalFlightTime: Math.round(totalFlightTime * 10) / 10,
      totalBlockTime: Math.round(totalBlockTime * 10) / 10,
      totalDutyTime: Math.round(totalDutyTime * 10) / 10,
      totalNightHours: Math.round(totalNightHours * 10) / 10,
      totalIfrHours: Math.round(totalIfrHours * 10) / 10,
      totalLandings,
      totalPax,
      uniqueAircraft,
      monthlyFlights
    };
  };

  const stats = calculateStats();

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      pink: 'bg-pink-100 text-pink-600'
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Flight Logbook Dashboard</h2>
        <p className="text-gray-600">Overview of your flight operations and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Plane}
          title="Total Flights"
          value={stats.totalFlights}
          subtitle="flight records"
          color="blue"
        />
        
        <StatCard
          icon={MapPin}
          title="Total Routes"
          value={stats.totalRoutes}
          subtitle="individual routes"
          color="green"
        />
        
        <StatCard
          icon={Clock}
          title="Flight Hours"
          value={`${stats.totalFlightTime}h`}
          subtitle="total flight time"
          color="purple"
        />
        
        <StatCard
          icon={BarChart3}
          title="Block Hours"
          value={`${stats.totalBlockTime}h`}
          subtitle="total block time"
          color="orange"
        />
        
        <StatCard
          icon={Users}
          title="Duty Hours"
          value={`${stats.totalDutyTime}h`}
          subtitle="total duty time"
          color="indigo"
        />
        
        <StatCard
          icon={Calendar}
          title="Night Hours"
          value={`${stats.totalNightHours}h`}
          subtitle="night flight time"
          color="yellow"
        />
        
        <StatCard
          icon={Plane}
          title="IFR Hours"
          value={`${stats.totalIfrHours}h`}
          subtitle="instrument flight time"
          color="pink"
        />
        
        <StatCard
          icon={MapPin}
          title="Total Landings"
          value={stats.totalLandings}
          subtitle="takeoffs & landings"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          title="Total Passengers"
          value={stats.totalPax}
          subtitle="passengers carried"
          color="green"
        />
        
        <StatCard
          icon={Plane}
          title="Aircraft Used"
          value={stats.uniqueAircraft}
          subtitle="different aircraft"
          color="blue"
        />
        
        <StatCard
          icon={Calendar}
          title="This Month"
          value={stats.monthlyFlights}
          subtitle="flights this month"
          color="purple"
        />
      </div>

      {/* Recent Activity */}
      {flights.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Flight Activity</h3>
          </div>
          
          <div className="space-y-4">
            {flights.slice(0, 5).map((flight) => (
              <div key={flight.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Trip #{flight.tripNumber} • {flight.routes.length} route{flight.routes.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      {flight.aircraftType} {flight.aircraftRegistration} • {flight.totals.flight.toFixed(1)}h flight time
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">
                    {flight.journeyStartDate ? new Date(flight.journeyStartDate).toLocaleDateString() : 'No date'}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {flight.totals.pax} PAX • {flight.totals.ldgs} landings
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {flights.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Plane className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No flight records yet</h3>
          <p className="text-gray-500">Start by adding your first flight record to see your statistics here</p>
        </div>
      )}
    </div>
  );
};