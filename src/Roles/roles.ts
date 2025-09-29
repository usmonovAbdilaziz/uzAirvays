export enum AdminRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  NEW = 'NEW',
  PAID = 'PAID',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  CREATED = 'CREATED',
  FAILED = 'FAILED',
}

export enum Currency {
  USD = 'USD',
  UZS = 'UZS',
  EUR = 'EUR',
  RUB = 'RUB',
}

export enum ScheduleStatus {
  SCHEDULED = 'SCHEDULED',
  DELAYED = 'DELAYED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}
export enum locked {
  locked = 'locked',
  unlocked = 'unlocked',
}
export enum ClassFlightRole {
  ECONOMY = 'ECONOMY',
  BUSINESS = 'BUSINESS',
}
export enum SeatCol {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H',
  I = 'I',
  J = 'J',
  K = 'K',
  L = 'L',
  M = 'M',
  N = 'N',
  O = 'O',
  P = 'P',
}

export enum FlightStatus {
  SCHEDULED = 'SCHEDULED',
  BOARDING = 'BOARDING',
  DEPARTED = 'DEPARTED',
  IN_FLIGHT = 'IN_FLIGHT',
  ARRIVED = 'ARRIVED',
  DELAYED = 'DELAYED',
  CANCELLED = 'CANCELLED',
}
