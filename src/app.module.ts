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
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'), // yoki DB_PASSWORD, .env ga moslang
        database: config.get<string>('DB_NAME'),
        models: MODELS,
        autoLoadModels: true,
        synchronize: true,
        logging: false,
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
