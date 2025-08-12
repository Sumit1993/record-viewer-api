import { Test, TestingModule } from '@nestjs/testing';
import { RecordsService } from './records.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Record } from '../entities/record.entity';
import { Repository } from 'typeorm';
import { RecordsFilterDto } from './dto/records-filter.dto';

jest.mock('typeorm', () => ({
  ...jest.requireActual('typeorm'),
  Brackets: jest.fn((cb) => cb),
}));

describe('RecordsService', () => {
  let service: RecordsService;
  let repository: Repository<Record>;

  const mockQueryBuilder = {
    andWhere: jest.fn(function (cb) {
      if (typeof cb === 'function') {
        cb(this);
      }
      return this;
    }),
    orWhere: jest.fn(function (cb) {
      if (typeof cb === 'function') {
        cb(this);
      }
      return this;
    }),
    orderBy: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  };

  const mockRecordRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordsService,
        {
          provide: getRepositoryToken(Record),
          useValue: mockRecordRepository,
        },
      ],
    }).compile();

    service = module.get<RecordsService>(RecordsService);
    repository = module.get<Repository<Record>>(getRepositoryToken(Record));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    beforeEach(() => {
      mockRecordRepository.findOne.mockResolvedValue({
        id: '1',
        dateSubmitted: new Date().toISOString(),
      });
    });

    it('should call createQueryBuilder', async () => {
      await service.findAll();
      expect(mockRecordRepository.createQueryBuilder).toHaveBeenCalledWith(
        'record',
      );
    });

    it('should handle type filter', async () => {
      await service.findAll('test-type');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'record.recordType = :type',
        { type: 'test-type' },
      );
    });

    it('should handle filters', async () => {
      const filters: RecordsFilterDto = {
        filters: [
          {
            field: 'recordType',
            conditions: [{ operator: '=', value: 'test' }],
          },
        ],
      };
      await service.findAll(null, filters);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should handle multiple filters', async () => {
      const filters: RecordsFilterDto = {
        filters: [
          {
            field: 'recordType',
            conditions: [{ operator: '=', value: 'test' }],
          },
          {
            field: 'applicantName',
            conditions: [{ operator: '=', value: 'test' }],
          },
        ],
      };
      await service.findAll(null, filters);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should handle multiple conditions in a filter', async () => {
      const filters: RecordsFilterDto = {
        filters: [
          {
            field: 'recordType',
            conditions: [
              { operator: '=', value: 'test' },
              { operator: '!=', value: 'test2' },
            ],
          },
        ],
      };
      await service.findAll(null, filters);
      expect(mockQueryBuilder.orWhere).toHaveBeenCalled();
    });

    it('should handle sorting', async () => {
      await service.findAll(null, null, null, { column: 'id', order: 'DESC' });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'record.id',
        'DESC',
      );
    });

    it('should handle column selection', async () => {
      await service.findAll(null, null, ['id', 'recordType']);
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        'record.id',
        'record.recordType',
      ]);
    });
  });

  describe('findOne', () => {
    it('should call repository.findOne with the correct id', async () => {
      const id = 'test-id';
      await service.findOne(id);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('create', () => {
    it('should create and save a new record', async () => {
      const createRecordDto = {
        recordType: 'Test',
        applicantName: 'Test Applicant',
        addresses: ['Test Address'],
        recordStatus: 'Open',
        emails: ['test@test.com'],
        phoneNumbers: ['1234567890'],
      };
      const newRecord = { ...createRecordDto, id: 'new-id' };

      mockRecordRepository.create.mockReturnValue(newRecord);
      mockRecordRepository.save.mockResolvedValue(newRecord);

      const result = await service.create(createRecordDto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining(createRecordDto),
      );
      expect(repository.save).toHaveBeenCalledWith(newRecord);
      expect(result).toEqual(newRecord);
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const id = 'test-id';
      const updateRecordDto = { applicantName: 'Updated Applicant' };
      const updatedRecord = { id, ...updateRecordDto };

      mockRecordRepository.update.mockResolvedValue(undefined);
      mockRecordRepository.findOne.mockResolvedValue(updatedRecord);

      const result = await service.update(id, updateRecordDto);

      expect(repository.update).toHaveBeenCalledWith(id, updateRecordDto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(updatedRecord);
    });

    it('should throw an error if record not found after update', async () => {
      const id = 'test-id';
      const updateRecordDto = { applicantName: 'Updated Applicant' };

      mockRecordRepository.update.mockResolvedValue(undefined);
      mockRecordRepository.findOne.mockResolvedValue(null);

      await expect(service.update(id, updateRecordDto)).rejects.toThrow(
        `Record with id ${id} not found after update.`,
      );
    });
  });

  describe('remove', () => {
    it('should remove a record', async () => {
      const id = 'test-id';
      await service.remove(id);
      expect(repository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('getLastUpdated', () => {
    it('should throw an error if no records are found', async () => {
      mockRecordRepository.findOne.mockResolvedValue(null);
      await expect(service['getLastUpdated']()).rejects.toThrow(
        'No records found',
      );
    });

    it('should return the latest record', async () => {
      const latestRecord = {
        id: 'latest',
        dateSubmitted: new Date().toISOString(),
      };
      mockRecordRepository.findOne.mockResolvedValue(latestRecord);
      const result = await service['getLastUpdated']();
      expect(result).toEqual(latestRecord);
    });
  });
});
