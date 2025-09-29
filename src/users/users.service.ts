import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleError, successMessage } from 'src/helps/http-filter.response';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CryptoService } from 'src/utils/hashed-password';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly cryptoService: CryptoService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;
      const emails = await this.userModel.findOne({ where: { email } });
      if (emails) {
        throw new ConflictException('Bu email allaqachon ro‘yxatdan o‘tgan');
      }
      const hashPass = await this.cryptoService.encrypt(password);
      const newUser = await this.userModel.create({
        ...createUserDto,
        password: hashPass,
      });
      return successMessage(newUser, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const users = await this.userModel.findAll({ include: { all: true } });
      return successMessage(users);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userModel.findByPk(id, {
        include: { all: true },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return successMessage(user);
    } catch (error) {
      handleError(error);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({
        where: { email },
        include: { all: true },
      });
      if (!user) {
        return null;
      }
      return successMessage(user);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const [affectedRows, updatedUsers] = await this.userModel.update(
        updateUserDto,
        {
          where: { id },
          returning: true,
        },
      );
      if (affectedRows === 0) {
        throw new NotFoundException('User not found');
      }
      return successMessage(updatedUsers[0]);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userModel.destroy({ where: { id } });
      if (user === 0) {
        throw new NotFoundException('User not found');
      }
      return successMessage({ message: 'Delete user from id' });
    } catch (error) {
      handleError(error);
    }
  }
}
