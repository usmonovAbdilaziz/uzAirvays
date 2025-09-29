import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entities (hammasini bir joyga to‘plagan array)
import { MODELS } from './models';

// Modules
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seeds/seed.module';
import { UsersModule } from './users/users.module';
import { LoyaltyProgramsModule } from './humans/loyalty_programs/loyalty_programs.module';
import { NewsModule } from './humans/news/news.module';
import { BookingsModule } from './humans/bookings/bookings.module';
import { PassengersModule } from './humans/passengers/passengers.module';
import { CountriesModule } from './polet/countries/countries.module';
import { CitiesModule } from './polet/cities/cities.module';
import { CompaniesModule } from './polet/companies/companies.module';
import { PlanesModule } from './polet/planes/planes.module';
import { AirportsModule } from './polet/airports/airports.module';
import { FlightsModule } from './polet/flights/flights.module';
import { ClassFlightsModule } from './polet/class-flights/class-flights.module';
import { FlightSchedulesModule } from './polet/flight_schedules/flight_schedules.module';
import { FlightSeatsModule } from './polet/flight-seats/flight-seats.module';
import { PaymentsModule } from './payments/payments.module';
import { TicketsModule } from './humans/tickets/tickets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: String(process.env.DB_HOST),
        port: Number(process.env.DB_PORT!) ,
        username: String(process.env.DB_USER),
        password: String(process.env.DB_PASS),
        database: String(process.env.DB_NAME),
        models: MODELS,
        autoLoadModels: true,
        synchronize: true, // Changed from false to true to create tables
        logging: config.get<string>('NODE_ENV') !== 'production',
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }),
    }),

    // app modules
    AuthModule,
    SeedModule,
    UsersModule,
    LoyaltyProgramsModule,
    NewsModule,
    BookingsModule,
    PassengersModule,
    CountriesModule,
    CitiesModule,
    CompaniesModule,
    PlanesModule,
    AirportsModule,
    FlightsModule,
    ClassFlightsModule,
    FlightSchedulesModule,
    FlightSeatsModule,
    PaymentsModule,
    TicketsModule,
  ],
})
export class AppModule {}
