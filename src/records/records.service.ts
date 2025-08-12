import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Record } from '../entities/record.entity';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordsFilterDto } from './dto/records-filter.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async findAll(
    type?: string,
    filters?: RecordsFilterDto,
    columns?: string[],
    sort?: { column: string; order: 'ASC' | 'DESC' },
    page = 1,
    limit = 20,
  ): Promise<{
    data: Partial<Record>[];
    meta: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      lastUpdated: string;
      activeFilters: number;
    };
  }> {
    const qb = this.recordRepository.createQueryBuilder('record');
    if (type) {
      qb.andWhere('record.recordType = :type', { type });
    }

    let activeFilters = 0;

    if (filters && filters.filters) {
      activeFilters = filters.filters.length;
      qb.andWhere(
        new Brackets((qb) => {
          filters.filters.forEach((filter, filterIndex) => {
            qb.orWhere(
              new Brackets((qb) => {
                filter.conditions.forEach((condition, conditionIndex) => {
                  const paramName = `p_${filterIndex}_${conditionIndex}`;
                  qb.orWhere(
                    `record.${filter.field} ${condition.operator} :${paramName}`,
                    { [paramName]: condition.value },
                  );
                });
              }),
            );
          });
        }),
      );
    }

    if (sort && sort.column) {
      qb.orderBy(`record.${sort.column}`, sort.order);
    }

    if (columns && columns.length) {
      qb.select(columns.map((c) => `record.${c}`));
    }

    const [records, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const lastUpdated = await this.getLastUpdated();

    const pages = Math.ceil(total / limit);
    return {
      data: records,
      meta: {
        total,
        page,
        limit,
        pages,
        lastUpdated: lastUpdated?.dateSubmitted || new Date().toISOString(),
        activeFilters,
      },
    };
  }

  async findOne(id: string): Promise<Record | null> {
    return this.recordRepository.findOne({ where: { id } });
  }

  async create(createRecordDto: CreateRecordDto): Promise<Record> {
    const data: Partial<Record> = { ...createRecordDto };
    if (!data.recordNumber) {
      let prefix = 'GEN';
      if (data.recordType === 'Business') prefix = 'BUS';
      else if (data.recordType === 'Building Permit') prefix = 'BLD';
      else if (data.recordType === 'Zoning Variance') prefix = 'ZON';
      const rand = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
      data.recordNumber = `${prefix}-${rand}`;
    }
    if (!data.dateSubmitted) {
      data.dateSubmitted = new Date().toISOString();
    }
    const record = this.recordRepository.create(data);
    return this.recordRepository.save(record);
  }

  async update(id: string, updateRecordDto: UpdateRecordDto): Promise<Record> {
    await this.recordRepository.update(id, updateRecordDto);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`Record with id ${id} not found after update.`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.recordRepository.delete(id);
  }

  private async getLastUpdated(): Promise<Record> {
    const record = await this.recordRepository.findOne({
      where: {},
      order: { dateSubmitted: 'DESC' },
    });
    if (!record) {
      throw new Error('No records found');
    }
    return record;
  }
}
