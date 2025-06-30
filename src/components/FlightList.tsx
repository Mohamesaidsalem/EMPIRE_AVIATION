import React from 'react';
import { Edit, Trash2, MapPin, Clock, Users, Plane } from 'lucide-react';
import { FlightRecord } from '../types/flight';

interface FlightListProps {
  flights: FlightRecord[];
  onEdit: (flight: FlightRecord) => void;
  onDelete: (id: string) => void;
}

export const FlightList: React.FC<FlightListProps> = ({ flights, onEdit, onDelete }) => {
  const formatTime = (time: string) => {
    return time || '--:--';
  };

  const formatDuration = (duration: string) => {
    return duration || '0:00';
  };

  const getFlightTypes = (typeOfFlight: any) => {
    return Object.entries(typeOfFlight || {})
      .filter(([_, value]) => value)
      .map(([key, _]) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(', ');
  };

  if (flights.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Plane className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No flight records found</h3>
        <p className="text-gray-500">Start by adding your first flight record</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <div key={flight.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plane className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Trip #{flight.tripNumber}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {flight.aircraftType} • {flight.aircraftRegistration}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(flight)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(flight.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Journey Dates */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase">Journey Start</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {flight.journeyStartDate ? new Date(flight.journeyStartDate).toLocaleDateString() : 'Not set'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase">Journey End</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {flight.journeyEndDate ? new Date(flight.journeyEndDate).toLocaleDateString() : 'Not set'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase">Crew</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{flight.crewName || 'Not specified'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase">Duty Period</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {flight.dutyPeriod.total.toFixed(1)}h
                </p>
              </div>
            </div>

            {/* Routes */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Routes ({flight.routes.length})</h4>
              {flight.routes.map((route, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-1 bg-blue-200 rounded">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          {route.from} → {route.to}
                        </h5>
                        <p className="text-xs text-gray-500">
                          {route.date ? new Date(route.date).toLocaleDateString() : 'Date not set'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDuration(route.recordedTiming.flightTime)}
                      </p>
                      <p className="text-xs text-gray-500">Flight Time</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Off:</span>
                      <p className="font-medium">{formatTime(route.recordedTiming.off)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Take Off:</span>
                      <p className="font-medium">{formatTime(route.recordedTiming.takeOff)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Landing:</span>
                      <p className="font-medium">{formatTime(route.recordedTiming.landing)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Blocks On:</span>
                      <p className="font-medium">{formatTime(route.recordedTiming.blocksOn)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Block Time:</span>
                      <p className="font-medium">{formatDuration(route.recordedTiming.blockTime)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">PAX:</span>
                      <p className="font-medium">{route.pax}</p>
                    </div>
                  </div>

                  {(route.nightIfrAppr.nightHrs > 0 || route.nightIfrAppr.ifrHrs > 0) && (
                    <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-blue-200 text-xs">
                      <div>
                        <span className="text-gray-500">Night Hrs:</span>
                        <p className="font-medium">{route.nightIfrAppr.nightHrs}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">IFR Hrs:</span>
                        <p className="font-medium">{route.nightIfrAppr.ifrHrs}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Appr Type:</span>
                        <p className="font-medium">{route.nightIfrAppr.apprType || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Flight Type & Totals */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {getFlightTypes(flight.typeOfFlight)}
                </span>
                {flight.assignedDuty.captain && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Captain</span>
                )}
                {flight.assignedDuty.firstOfficer && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">First Officer</span>
                )}
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold text-gray-900">
                  Total: {flight.totals.flight.toFixed(1)}h flight • {flight.totals.block.toFixed(1)}h block
                </p>
                <p className="text-gray-500 text-xs">
                  {flight.totals.ldgs} landings • {flight.totals.pax} total PAX
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};