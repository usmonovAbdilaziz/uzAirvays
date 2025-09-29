import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcryptjs from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { AdminRole } from '../Roles/roles';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async createSuperAdmin(): Promise<void> {
    try {
      const existingSuperAdmin = await this.userModel.findOne({
        where: { role: AdminRole.SUPERADMIN },
      });

      if (existingSuperAdmin) {
        this.logger.log('SuperAdmin allaqachon mavjud');
        return;
      }
      const adminPass = process.env.ADMIN_PASS!;
      const hashedPassword = await bcryptjs.hash(adminPass, 10);

      const superAdmin = await this.userModel.create({
        email: process.env.ADMIN_EMAIL,
        full_name: process.env.ADMIN_NAME,
        password: hashedPassword,
        role: AdminRole.SUPERADMIN,
        loyality_points: 0,
        is_active: true,
      });

      this.logger.log(`SuperAdmin yaratildi - ID: ${superAdmin.id}`);
    } catch (error) {
      this.logger.error('SuperAdmin yaratishda xatolik:', error);
    }
  }

  async createTestUser(): Promise<void> {
    try {
      const existingTestUser = await this.userModel.findOne({
        where: { email: 'test@uzairways.com' },
      });

      if (existingTestUser) {
        this.logger.log('Test user allaqachon mavjud');
        return;
      }

      const hashedPassword = await bcryptjs.hash('password123', 10);

      const testUser = await this.userModel.create({
        email: 'test@uzairways.com',
        full_name: 'Test User',
        password: hashedPassword,
        role: AdminRole.USER,
        loyality_points: 0,
        is_active: true,
      });

      this.logger.log(`Test user yaratildi - ID: ${testUser.id}`);
    } catch (error) {
      this.logger.error('Test user yaratishda xatolik:', error);
    }
  }
  async runSeeds(): Promise<void> {
    this.logger.log('Seed jarayoni boshlandi...');
    await this.createSuperAdmin();
    await this.createTestUser();
    this.logger.log('Seed jarayoni tugallandi');
  }
}
