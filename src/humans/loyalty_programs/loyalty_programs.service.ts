import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoyaltyProgramDto } from './dto/create-loyalty_program.dto';
import { UpdateLoyaltyProgramDto } from './dto/update-loyalty_program.dto';
import { LoyaltyProgram } from './entities/loyalty_program.entity';
import { InjectModel } from '@nestjs/sequelize';
import { handleError, successMessage } from 'src/helps/http-filter.response';
import { UsersService } from '../../users/users.service';

@Injectable()
export class LoyaltyProgramsService {
  constructor(
    @InjectModel(LoyaltyProgram)
    private readonly loyalityModel: typeof LoyaltyProgram,
    private readonly userService: UsersService,
  ) {}
  async create(createLoyaltyProgramDto: CreateLoyaltyProgramDto) {
    try {
      const { user_id } = createLoyaltyProgramDto;
      const user = await this.userService.findOne(user_id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const newLoyality = await this.loyalityModel.create({
        ...createLoyaltyProgramDto,
      });

      return successMessage(newLoyality, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const loyality = await this.loyalityModel.findAll({
        include: { all: true },
        order: [['id', 'DESC']],
      });
      return successMessage(loyality);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const loyality = await this.loyalityModel.findByPk(id);
      if (!loyality) {
        throw new NotFoundException('Loyality empty');
      }
      return successMessage(loyality);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateLoyaltyProgramDto: UpdateLoyaltyProgramDto) {
    try {
      const newLoyality = await this.loyalityModel.update(
        updateLoyaltyProgramDto,
        { where: { id }, returning: true },
      );

      if (newLoyality[0] == 0) {
        throw new NotFoundException('Loyality empty');
      }
      return successMessage(newLoyality[1][0]);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const olderLoyality = await this.loyalityModel.destroy({ where: { id } });
      if (olderLoyality === 0) {
        throw new NotFoundException('Loyality empty');
      }
      return successMessage({ message: 'Deleted loyality thanks' });
    } catch (error) {
      handleError(error);
    }
  }
}
