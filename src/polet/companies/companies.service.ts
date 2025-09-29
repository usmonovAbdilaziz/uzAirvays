import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Company } from './entities/company.entity';
import { handleError, successMessage } from 'src/helps/http-filter.response';
import { CitiesService } from '../cities/cities.service';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company) private companyModel: typeof Company,
    private readonly cityService: CitiesService,
  ) {}
  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const { code, city_id } = createCompanyDto;
      const company = await this.companyModel.findOne({ where: { code } });
      if (company) {
        throw new ConflictException('Company already exists');
      }
      const city = await this.cityService.findOne(city_id);
      if (!city) {
        throw new NotFoundException('City not found');
      }
      const newCompany = await this.companyModel.create({
        ...createCompanyDto,
      });
      return successMessage(newCompany, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const companies = await this.companyModel.findAll({
        include: { all: true },
        order: [['id', 'DESC']],
      });
      return successMessage(companies);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const company = await this.companyModel.findByPk(id,{include:{all:true}});
      if (!company) {
        throw new ConflictException('Company not found');
      }
      return successMessage(company);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    try {
      const company = await this.companyModel.update(
        updateCompanyDto,
        {
          where: { id },
          returning: true,
        },
      );
      if (company[0] == 0) {
        throw new ConflictException('Company not found');
      }

      return successMessage(company[1][0]);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const company = await this.companyModel.destroy({ where: { id } });
      if (company == 0) {
        throw new NotFoundException('Company not found');
      }
      return successMessage({ message: 'Company deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
