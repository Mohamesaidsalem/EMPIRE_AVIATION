import React, { useState, useEffect } from 'react';
import { Save, Calculator, Plane, X, Plus, Minus } from 'lucide-react';
import { FlightRecord, Route } from '../types/flight';

interface FlightFormProps {
  onSave: (flight: FlightRecord) => void;
  onCancel: () => void;
  editingFlight?: FlightRecord | null;
}

export const FlightForm: React.FC<FlightFormProps> = ({ onSave, onCancel, editingFlight }) => {
  const [formData, setFormData] = useState<Partial<FlightRecord>>({
    journeyStartDate: '',
    journeyEndDate: '',
    tripNumber: '',
    aircraftType: 'GL7500',
    aircraftRegistration: 'T7-PYD',
    typeOfFlight: {
      revenue: true,
      ferry: false,
      maintenance: false,
      training: false,
      demo: false,
      company: false,
      owner: false,
      mercy: false
    },
    routes: [
      {
        date: '',
        from: '',
        to: '',
        recordedTiming: {
          off: '',
          takeOff: '',
          landing: '',
          blocksOn: '',
          flightTime: '',
          blockTime: ''
        },
        nightIfrAppr: {
          nightHrs: 0,
          ifrHrs: 0,
          apprType: ''
        },
        takeOffLanding: {
          day: 0,
          night: 0
        },
        pax: 0,
        utc: {
          local: '',
          utc: ''
        }
      }
    ],
    assignedDuty: {
      captain: false,
      firstOfficer: false,
      ocmCrew: false
    },
    crewName: '',
    dutyPeriod: {
      start: '',
      end: '',
      total: 0
    },
    totals: {
      flight: 0,
      block: 0,
      nightHrs: 0,
      ifrHrs: 0,
      appr: 0,
      ldgs: 0,
      dayNo: 0,
      pax: 0,
      date: '',
      fdpEnd: '',
      rest: 0,
      fdpStart: 0,
      splitDuty: 0,
      fdpAllowed: 0,
      extendedFdp: 0
    }
  });

  useEffect(() => {
    if (editingFlight) {
      setFormData(editingFlight);
    }
  }, [editingFlight]);

  const addRoute = () => {
    if (formData.routes && formData.routes.length < 3) {
      setFormData(prev => ({
        ...prev,
        routes: [
          ...prev.routes!,
          {
            date: '',
            from: '',
            to: '',
            recordedTiming: {
              off: '',
              takeOff: '',
              landing: '',
              blocksOn: '',
              flightTime: '',
              blockTime: ''
            },
            nightIfrAppr: {
              nightHrs: 0,
              ifrHrs: 0,
              apprType: ''
            },
            takeOffLanding: {
              day: 0,
              night: 0
            },
            pax: 0,
            utc: {
              local: '',
              utc: ''
            }
          }
        ]
      }));
    }
  };

  const removeRoute = (index: number) => {
    if (formData.routes && formData.routes.length > 1) {
      setFormData(prev => ({
        ...prev,
        routes: prev.routes!.filter((_, i) => i !== index)
      }));
    }
  };

  const updateRoute = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      routes: prev.routes!.map((route, i) => 
        i === index 
          ? { ...route, [field]: value }
          : route
      )
    }));
  };

  const updateRouteNested = (index: number, section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      routes: prev.routes!.map((route, i) => 
        i === index 
          ? { 
              ...route, 
              [section]: { 
                ...(route as any)[section], 
                [field]: value 
              }
            }
          : route
      )
    }));
  };

  const calculateFlightTime = (routeIndex: number) => {
    const route = formData.routes![routeIndex];
    const { takeOff, landing } = route.recordedTiming;
    
    if (takeOff && landing) {
      const takeOffTime = new Date(`2000-01-01 ${takeOff}`);
      const landingTime = new Date(`2000-01-01 ${landing}`);
      let flightMinutes = (landingTime.getTime() - takeOffTime.getTime()) / (1000 * 60);
      
      // Handle overnight flights
      if (flightMinutes < 0) {
        flightMinutes += 24 * 60;
      }
      
      const flightHours = Math.floor(flightMinutes / 60);
      const flightMins = Math.floor(flightMinutes % 60);
      
      updateRouteNested(routeIndex, 'recordedTiming', 'flightTime', 
        `${flightHours.toString().padStart(2, '0')}:${flightMins.toString().padStart(2, '0')}`
      );
    }
  };

  const calculateBlockTime = (routeIndex: number) => {
    const route = formData.routes![routeIndex];
    const { off, blocksOn } = route.recordedTiming;
    
    if (off && blocksOn) {
      const offTime = new Date(`2000-01-01 ${off}`);
      const blocksOnTime = new Date(`2000-01-01 ${blocksOn}`);
      let blockMinutes = (blocksOnTime.getTime() - offTime.getTime()) / (1000 * 60);
      
      // Handle overnight flights
      if (blockMinutes < 0) {
        blockMinutes += 24 * 60;
      }
      
      const blockHours = Math.floor(blockMinutes / 60);
      const blockMins = Math.floor(blockMinutes % 60);
      
      updateRouteNested(routeIndex, 'recordedTiming', 'blockTime', 
        `${blockHours.toString().padStart(2, '0')}:${blockMins.toString().padStart(2, '0')}`
      );
    }
  };

  const calculateDutyPeriod = () => {
    const { start, end } = formData.dutyPeriod!;
    
    if (start && end) {
      const startTime = new Date(`2000-01-01 ${start}`);
      const endTime = new Date(`2000-01-01 ${end}`);
      let dutyMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      
      // Handle overnight duty
      if (dutyMinutes < 0) {
        dutyMinutes += 24 * 60;
      }
      
      const dutyHours = dutyMinutes / 60;
      
      setFormData(prev => ({
        ...prev,
        dutyPeriod: {
          ...prev.dutyPeriod!,
          total: Math.round(dutyHours * 100) / 100
        }
      }));
    }
  };

  const calculateTotals = () => {
    if (!formData.routes) return;

    let totalFlight = 0;
    let totalBlock = 0;
    let totalNightHrs = 0;
    let totalIfrHrs = 0;
    let totalAppr = 0;
    let totalLdgs = 0;
    let totalDayNo = 0;
    let totalPax = 0;

    formData.routes.forEach(route => {
      // Convert time strings to decimal hours
      if (route.recordedTiming.flightTime) {
        const [hours, minutes] = route.recordedTiming.flightTime.split(':').map(Number);
        totalFlight += hours + (minutes / 60);
      }
      
      if (route.recordedTiming.blockTime) {
        const [hours, minutes] = route.recordedTiming.blockTime.split(':').map(Number);
        totalBlock += hours + (minutes / 60);
      }

      totalNightHrs += route.nightIfrAppr.nightHrs;
      totalIfrHrs += route.nightIfrAppr.ifrHrs;
      totalLdgs += route.takeOffLanding.day + route.takeOffLanding.night;
      totalDayNo += route.takeOffLanding.day;
      totalPax += route.pax;
    });

    setFormData(prev => ({
      ...prev,
      totals: {
        ...prev.totals!,
        flight: Math.round(totalFlight * 100) / 100,
        block: Math.round(totalBlock * 100) / 100,
        nightHrs: totalNightHrs,
        ifrHrs: totalIfrHrs,
        appr: totalAppr,
        ldgs: totalLdgs,
        dayNo: totalDayNo,
        pax: totalPax
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateTotals();
    
    const flight: FlightRecord = {
      id: editingFlight?.id || Date.now().toString(),
      ...formData as FlightRecord
    };
    onSave(flight);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {editingFlight ? 'Edit Flight Record' : 'New Flight Record'}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Header Information */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Journey start date</label>
                <input
                  type="date"
                  value={formData.journeyStartDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, journeyStartDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Journey end date</label>
                <input
                  type="date"
                  value={formData.journeyEndDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, journeyEndDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trip number</label>
                <input
                  type="text"
                  value={formData.tripNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, tripNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aircraft type</label>
                <input
                  type="text"
                  value={formData.aircraftType}
                  onChange={(e) => setFormData(prev => ({ ...prev, aircraftType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aircraft registration</label>
                <input
                  type="text"
                  value={formData.aircraftRegistration}
                  onChange={(e) => setFormData(prev => ({ ...prev, aircraftRegistration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Type of Flight */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Type of flight</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {Object.entries(formData.typeOfFlight || {}).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      typeOfFlight: {
                        ...prev.typeOfFlight!,
                        [key]: e.target.checked
                      }
                    }))}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700 capitalize">{key}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Routes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Routes</h3>
              <div className="flex space-x-2">
                {formData.routes && formData.routes.length < 3 && (
                  <button
                    type="button"
                    onClick={addRoute}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Route</span>
                  </button>
                )}
              </div>
            </div>

            {formData.routes?.map((route, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-semibold text-gray-800">Route {index + 1}</h4>
                  {formData.routes!.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRoute(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Date */}
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={route.date}
                      onChange={(e) => updateRoute(index, 'date', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* From */}
                  <div className="lg:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
                    <input
                      type="text"
                      value={route.from}
                      onChange={(e) => updateRoute(index, 'from', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      placeholder="ICAO"
                    />
                  </div>

                  {/* To */}
                  <div className="lg:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
                    <input
                      type="text"
                      value={route.to}
                      onChange={(e) => updateRoute(index, 'to', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      placeholder="ICAO"
                    />
                  </div>

                  {/* Recorded Timing */}
                  <div className="lg:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Off</label>
                    <input
                      type="time"
                      value={route.recordedTiming.off}
                      onChange={(e) => updateRouteNested(index, 'recordedTiming', 'off', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Take off</label>
                    <input
                      type="time"
                      value={route.recordedTiming.takeOff}
                      onChange={(e) => updateRouteNested(index, 'recordedTiming', 'takeOff', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Landing</label>
                    <input
                      type="time"
                      value={route.recordedTiming.landing}
                      onChange={(e) => updateRouteNested(index, 'recordedTiming', 'landing', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Blocks On</label>
                    <input
                      type="time"
                      value={route.recordedTiming.blocksOn}
                      onChange={(e) => updateRouteNested(index, 'recordedTiming', 'blocksOn', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Flight time</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={route.recordedTiming.flightTime}
                        readOnly
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-l bg-gray-50"
                        placeholder="00:00"
                      />
                      <button
                        type="button"
                        onClick={() => calculateFlightTime(index)}
                        className="px-2 py-1 bg-blue-600 text-white rounded-r hover:bg-blue-700"
                      >
                        <Calculator className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Block time</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={route.recordedTiming.blockTime}
                        readOnly
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-l bg-gray-50"
                        placeholder="00:00"
                      />
                      <button
                        type="button"
                        onClick={() => calculateBlockTime(index)}
                        className="px-2 py-1 bg-blue-600 text-white rounded-r hover:bg-blue-700"
                      >
                        <Calculator className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">PAX</label>
                    <input
                      type="number"
                      value={route.pax}
                      onChange={(e) => updateRoute(index, 'pax', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Night/IFR/Appr Section */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Night Hrs</label>
                    <input
                      type="number"
                      step="0.1"
                      value={route.nightIfrAppr.nightHrs}
                      onChange={(e) => updateRouteNested(index, 'nightIfrAppr', 'nightHrs', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">IFR Hrs</label>
                    <input
                      type="number"
                      step="0.1"
                      value={route.nightIfrAppr.ifrHrs}
                      onChange={(e) => updateRouteNested(index, 'nightIfrAppr', 'ifrHrs', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Appr Type</label>
                    <input
                      type="text"
                      value={route.nightIfrAppr.apprType}
                      onChange={(e) => updateRouteNested(index, 'nightIfrAppr', 'apprType', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Day T/O & Ldg</label>
                    <input
                      type="number"
                      value={route.takeOffLanding.day}
                      onChange={(e) => updateRouteNested(index, 'takeOffLanding', 'day', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Night T/O & Ldg</label>
                    <input
                      type="number"
                      value={route.takeOffLanding.night}
                      onChange={(e) => updateRouteNested(index, 'takeOffLanding', 'night', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Assigned Duty & Crew */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Duty</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.assignedDuty?.captain}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      assignedDuty: { ...prev.assignedDuty!, captain: e.target.checked }
                    }))}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Captain</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.assignedDuty?.firstOfficer}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      assignedDuty: { ...prev.assignedDuty!, firstOfficer: e.target.checked }
                    }))}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">First Officer</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.assignedDuty?.ocmCrew}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      assignedDuty: { ...prev.assignedDuty!, ocmCrew: e.target.checked }
                    }))}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">OCM Crew</span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crew Name</h3>
              <input
                type="text"
                value={formData.crewName}
                onChange={(e) => setFormData(prev => ({ ...prev, crewName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter crew member name"
              />
            </div>
          </div>

          {/* Duty Period */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Duty Period</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start</label>
                <input
                  type="time"
                  value={formData.dutyPeriod?.start}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dutyPeriod: { ...prev.dutyPeriod!, start: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End</label>
                <input
                  type="time"
                  value={formData.dutyPeriod?.end}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dutyPeriod: { ...prev.dutyPeriod!, end: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total (hours)</label>
                <div className="flex">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.dutyPeriod?.total}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={calculateDutyPeriod}
                    className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                  >
                    <Calculator className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={calculateTotals}
                  className="w-full mt-6 flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Calculate Totals</span>
                </button>
              </div>
            </div>
          </div>

          {/* Totals Display */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Totals</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formData.totals?.flight.toFixed(1)}</div>
                <div className="text-xs text-gray-600">Flight Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formData.totals?.block.toFixed(1)}</div>
                <div className="text-xs text-gray-600">Block Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formData.totals?.nightHrs}</div>
                <div className="text-xs text-gray-600">Night Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formData.totals?.ifrHrs}</div>
                <div className="text-xs text-gray-600">IFR Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formData.totals?.ldgs}</div>
                <div className="text-xs text-gray-600">Landings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formData.totals?.pax}</div>
                <div className="text-xs text-gray-600">Total PAX</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Save className="w-5 h-5" />
              <span>Save Flight Record</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};