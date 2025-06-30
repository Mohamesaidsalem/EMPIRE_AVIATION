export interface Route {
  date: string;
  from: string;
  to: string;
  recordedTiming: {
    off: string;
    takeOff: string;
    landing: string;
    blocksOn: string;
    flightTime: string;
    blockTime: string;
  };
  nightIfrAppr: {
    nightHrs: number;
    ifrHrs: number;
    apprType: string;
  };
  takeOffLanding: {
    day: number;
    night: number;
  };
  pax: number;
  utc: {
    local: string;
    utc: string;
  };
}

export interface FlightRecord {
  id: string;
  journeyStartDate: string;
  journeyEndDate: string;
  tripNumber: string;
  aircraftType: string;
  aircraftRegistration: string;
  typeOfFlight: {
    revenue: boolean;
    ferry: boolean;
    maintenance: boolean;
    training: boolean;
    demo: boolean;
    company: boolean;
    owner: boolean;
    mercy: boolean;
  };
  routes: Route[];
  assignedDuty: {
    captain: boolean;
    firstOfficer: boolean;
    ocmCrew: boolean;
  };
  crewName: string;
  dutyPeriod: {
    start: string;
    end: string;
    total: number;
  };
  totals: {
    flight: number;
    block: number;
    nightHrs: number;
    ifrHrs: number;
    appr: number;
    ldgs: number;
    dayNo: number;
    pax: number;
    date: string;
    fdpEnd: string;
    rest: number;
    fdpStart: number;
    splitDuty: number;
    fdpAllowed: number;
    extendedFdp: number;
  };
}

export interface ServiceRecord {
  date: string;
  station: string;
  invoice: string;
  serviceType: string;
  quantity: number;
  cost: number;
  details: string;
}