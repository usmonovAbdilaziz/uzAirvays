# uzAirways API Documentation

## 🔐 Authentication

### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "superadmin@uzairways.com",
  "password": "superadmin123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "superadmin@uzairways.com",
    "full_name": "Super Administrator",
    "role": "superadmin",
    "is_active": true
  }
}
```

### Profile

```bash
GET /api/v1/auth/profile
Authorization: Bearer <access_token>
```

### Refresh Token

```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 👥 Role-based Access Control

### Roles:

- **SUPERADMIN**: Barcha endpointlarga access
- **ADMIN**: Faqat polet (flight) moduli endpointlariga access
- **USER**: Humans moduli endpointlariga access

### Protected Endpoints:

#### 🛡️ SUPERADMIN Only:

- `GET/POST/PATCH/DELETE /api/v1/users/*`

#### 🛡️ ADMIN + SUPERADMIN:

- `GET/POST/PATCH/DELETE /api/v1/countries/*`
- `GET/POST/PATCH/DELETE /api/v1/cities/*`
- `GET/POST/PATCH/DELETE /api/v1/companies/*`
- `GET/POST/PATCH/DELETE /api/v1/airports/*`
- `GET/POST/PATCH/DELETE /api/v1/planes/*`
- `GET/POST/PATCH/DELETE /api/v1/flights/*`
- `GET/POST/PATCH/DELETE /api/v1/class-flights/*`
- `GET/POST/PATCH/DELETE /api/v1/flight-schedules/*`
- `GET/POST/PATCH/DELETE /api/v1/flight-seats/*`

#### 🛡️ USER + ADMIN + SUPERADMIN:

- `GET/POST/PATCH/DELETE /api/v1/bookings/*`
- `GET/POST/PATCH/DELETE /api/v1/tickets/*`
- `GET/POST/PATCH/DELETE /api/v1/passengers/*`
- `GET/POST/PATCH/DELETE /api/v1/news/*`
- `GET/POST/PATCH/DELETE /api/v1/loyalty-programs/*`
- `GET/POST/DELETE /api/v1/payments/*` (webhook public)

#### 🌐 Public Endpoints:

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/payments/webhook` (Stripe webhook)

## 🛠️ Usage Example

```bash
# 1. Login va token olish
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "superadmin@uzairways.com", "password": "superadmin123"}'

# 2. Protected endpoint-ga access
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer <access_token>"

# 3. Create booking (USER role)
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "flight_schedule_id": 1, "currency": "USD"}'
```

## 📋 Features

✅ **JWT Authentication** - Access & Refresh tokens  
✅ **bcryptjs** - Password hashing  
✅ **Role-based Access Control** - SUPERADMIN/ADMIN/USER  
✅ **Auto SuperAdmin** - Seed yaratish  
✅ **Clean Architecture** - NestJS best practices  
✅ **Type Safety** - TypeScript va ValidationPipes  
✅ **Global Guards** - AuthGuard + RolesGuard  
✅ **Public Endpoints** - Webhook uchun @Public decorator

## 🚀 Server Status

Server ishlamoqda: **http://localhost:3000**
