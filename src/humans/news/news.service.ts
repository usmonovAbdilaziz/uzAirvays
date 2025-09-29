import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { handleError, successMessage } from 'src/helps/http-filter.response';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { News } from './entities/news.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NewsService {
  constructor(
    private readonly userServise: UsersService,
    @InjectModel(News) private readonly newsModel: typeof News,
  ) {}
  async create(createNewsDto: CreateNewsDto) {
    try {
      const { user_id } = createNewsDto;
      const response = await this.userServise.findOne(user_id);

      if (!response || !response.data) {
        throw new NotFoundException('User not found');
      }
      const user = response.data as any;
      if (user.role == 'user') {
        throw new ForbiddenException('Sizga  reklama tarqatish mumkin emas');
      }

      const newNews = await this.newsModel.create({ ...createNewsDto });
      return successMessage(newNews, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const news = await this.newsModel.findAll({
        include: { all: true },
        order: [['id', 'DESC']],
      });
      return successMessage(news);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const newNews = await this.newsModel.findByPk(id, {
        include: { all: true },
      });
      if (!newNews) {
        throw new NotFoundException('News not found');
      }
      return successMessage(newNews);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    try {
      const [affectedRows, updatedNews] = await this.newsModel.update(
        updateNewsDto,
        { where: { id }, returning: true },
      );
      if (affectedRows === 0) {
        throw new NotFoundException('News not found');
      }
      return successMessage(updatedNews[0]);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const oldNews = await this.newsModel.destroy({ where: { id } });
      if (oldNews == 0) {
        throw new NotFoundException('News not found');
      }
      return successMessage({ message: 'Delete news from id' });
    } catch (error) {
      handleError(error);
    }
  }
}
