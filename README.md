<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

//https://drawsql.app/teams/abudev-1/diagrams/airways-2 xozzirda shuni bajarayapmiz
/\*Bu `SQL` skript — bir aviakompaniya yoki aviatsiya tizimi uchun **ma'lumotlar bazasi (database)** sxemasini yaratish uchun yozilgan. Har bir `CREATE TABLE` buyrug'i yangi jadval yaratadi. Quyida **har bir jadval**ning **vazifasi** va **maqsadi** haqida qisqacha tushuntiraman:

---

### 🌍 `countries`

- **Vazifasi**: Dunyo davlatlarini saqlash.
- **Asosiy ustunlar**:
  - `iso_code` – davlatning ISO kodlari (masalan: `UZ`, `US`, `RU`)
  - `name` – davlat nomi

---

### 🏙️ `cities`

- **Vazifasi**: Shaharlar haqidagi ma'lumotlar.
- **Asosiy ustunlar**:
  - `country_id` – qaysi davlatda joylashgan (foreign key)

---

### ✈️ `airports`

- **Vazifasi**: Aeroportlar haqidagi ma’lumotlar.
- **Asosiy ustunlar**:
  - `iata_code`, `icao_code` – xalqaro aeroport kodlari
  - `city_id` – qaysi shaharda joylashgan
  - `timezone`, `latitude`, `longitude` – vaqt zonasi, joylashuv

---

### 🏢 `companies`

- **Vazifasi**: Aviakompaniyalar (masalan: Uzbekistan Airways, Turkish Airlines).
- **Asosiy ustunlar**:
  - `name`, `code`, `website` – kompaniya haqida info
  - `created_at`, `updated_at` – qachon qo‘shilgan

---

### 🛫 `planes`

- **Vazifasi**: Har bir kompaniyaga tegishli samolyotlar.
- **Asosiy ustunlar**:
  - `model`, `registration_number`
  - `seat_map` – joylashuv JSON shaklida

---

### 💺 `classes`

- **Vazifasi**: Uchoqdagi klasslar (Economy, Business, First Class).
- **Asosiy ustunlar**:
  - `code`, `display_name`
  - `baggage_allowance_kg`

---

### 👤 `users`

- **Vazifasi**: Tizimdan foydalanayotgan foydalanuvchilar.
- **Asosiy ustunlar**:
  - `email`, `phone`, `password_hash`, `loyalty_points`
  - `role`: `USER`, `ADMIN` va h.k.

---

### 👨‍💼 `admins`

- **Vazifasi**: Admin foydalanuvchilarni aniqlash.
- **Asosiy ustunlar**:
  - `user_id` – foydalanuvchi ID
  - `created_by` – kim admin qilgan

---

### 🛬 `flights`

- **Vazifasi**: Rejalashtirilgan parvozlar.
- **Asosiy ustunlar**:
  - `flight_number`
  - `origin_airport_id`, `destination_airport_id`

---

### 📅 `flight_schedules`

- **Vazifasi**: Muayyan sanadagi parvozlar jadvali.
- **Asosiy ustunlar**:
  - `flight_id`, `plane_id`
  - `departure_time`, `arrival_time`
  - `seats_available`, `base_price`

---

### 💺 `flight_seats`

- **Vazifasi**: Har bir parvoz jadvalidagi o‘rindiqlar.
- **Asosiy ustunlar**:
  - `seat_label`, `class`, `price`, `is_reserved`

---

### 📦 `bookings`

- **Vazifasi**: Foydalanuvchilarning bronlari.
- **Asosiy ustunlar**:
  - `booking_reference`, `total_amount`, `status`

---

### 🧍‍♂️ `passengers`

- **Vazifasi**: Bron qilingan odamlar (yo‘lovchilar).
- **Asosiy ustunlar**:
  - `passport_number`, `seat_label`, `ticket_id`

---

### 🎫 `tickets`

- **Vazifasi**: Har bir yo‘lovchi uchun chiptalar.
- **Asosiy ustunlar**:
  - `ticket_number`, `fare`, `checkin_status`

---

### 💳 `payments`

- **Vazifasi**: To‘lovlar haqida ma’lumot.
- **Asosiy ustunlar**:
  - `provider`, `provider_transaction_id`
  - `amount`, `status`

---

### ⭐ `reviews`

- **Vazifasi**: Foydalanuvchilar tomonidan yozilgan sharhlar.
- **Asosiy ustunlar**:
  - `rating`, `comment`

---

### 🎁 `loyalty_programs`

- **Vazifasi**: Sodiqlik dasturlari (frequent flyer).
- **Asosiy ustunlar**:
  - `name`, `description`

---

### 📈 `loyalty_points_history`

- **Vazifasi**: Foydalanuvchilarning ballar tarixi.
- **Asosiy ustunlar**:
  - `points`, `reason`, `reference_id`

---

### 📰 `news`

- **Vazifasi**: Yangiliklar, blog postlar.
- **Asosiy ustunlar**:
  - `title`, `slug`, `content`, `is_published`

---

### 📋 `audit_logs`

- **Vazifasi**: Tizimda amalga oshirilgan harakatlar logi (jurnali).
- **Asosiy ustunlar**:
  - `actor_id` – kim qilgan
  - `action`, `entity`, `payload`

---

### Umumiy G'oya:

Bu baza real aviatsiya tizimi uchun **to‘liq CRUD** (create, read, update, delete) amallarni bajarishga moslangan, **yolovchilar, parvozlar, bronlar, chiptalar, to‘lovlar, va boshqalar** bilan ishlash imkonini beradi.

---

Agar shu struktura asosida **admin panel**, **foydalanuvchi ilovasi**, yoki **mobil ilova** yaratmoqchi bo‘lsangiz — har bir jadval sizga kerakli ma'lumotni saqlab beradi.

Agar kerak bo‘lsa, ushbu sxemani asos qilib:

- REST API loyihasi
- Laravel yoki Django backend
- React / Vue frontend
- Mobil ilova (Flutter, React Native)

bilan bog‘lash bo‘yicha yordam berishim mumkin.
\*/

# for failed transaktion stripe payment_intents confirm pi_3SBsh8L616f0TvDE0dbbSbnN \ --payment-method pm_card_chargeDeclined

# for success transaktion

stripe payment_intents confirm pi_3SBtBFL616f0TvDE1WW9CbEZ --payment-method pm_card_chargeDeclined
stripe payment_intents confirm pi_3SBtBFL616f0TvDE1WW9CbEZ --payment-method pm_card_chargeDeclined
