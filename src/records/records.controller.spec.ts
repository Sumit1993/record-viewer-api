import { Test, TestingModule } from '@nestjs/testing';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { BadRequestException } from '@nestjs/common';

describe('RecordsController', () => {
  let controller: RecordsController;
  let service: RecordsService;

  const mockRecordsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordsController],
      providers: [
        {
          provide: RecordsService,
          useValue: mockRecordsService,
        },
      ],
    }).compile();

    controller = module.get<RecordsController>(RecordsController);
    service = module.get<RecordsService>(RecordsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRecords', () => {
    it('should call service.findAll with correct parameters', async () => {
      const type = 'test';
      const filters = '{"filters":[]}';
      const columns = 'id,recordType';
      const sort = 'recordType:asc';
      const page = '1';
      const limit = '10';

      await controller.getRecords(type, filters, columns, sort, page, limit);

      expect(service.findAll).toHaveBeenCalledWith(
        type,
        { filters: { filters: [] } },
        ['id', 'recordType'],
        { column: 'recordType', order: 'ASC' },
        1,
        10,
      );
    });

    it('should throw BadRequestException for invalid columns', async () => {
      const columns = 'invalidColumn';
      await expect(controller.getRecords(null, null, columns, null, null, null)).rejects.toThrow(
        new BadRequestException('Invalid column(s) requested'),
      );
    });

    it('should throw BadRequestException for invalid filters', async () => {
        const filters = 'invalid-json';
        await expect(controller.getRecords(null, filters, null, null, null, null)).rejects.toThrow(
          new BadRequestException('Invalid filters JSON'),
        );
      });

      it('should throw BadRequestException for invalid sort column', async () => {
        const sort = 'invalidColumn:asc';
        await expect(controller.getRecords(null, null, null, sort, null, null)).rejects.toThrow(
          new BadRequestException('Invalid sort column'),
        );
      });

      it('should throw BadRequestException for invalid page', async () => {
        const page = 'invalid';
        await expect(controller.getRecords(null, null, null, null, page, null)).rejects.toThrow(
          new BadRequestException('Invalid page number'),
        );
      });

      it('should throw BadRequestException for invalid limit', async () => {
        const limit = 'invalid';
        await expect(controller.getRecords(null, null, null, null, null, limit)).rejects.toThrow(
          new BadRequestException('Invalid limit number'),
        );
      });
  });

  describe('getRecord', () => {
    it('should call service.findOne with the correct id', async () => {
      const id = 'test-id';
      await controller.getRecord(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('createRecord', () => {
    it('should call service.create with the correct data', async () => {
      const createRecordDto: CreateRecordDto = {
        recordType: 'Test',
        applicantName: 'Test Applicant',
        addresses: ['Test Address'],
        recordStatus: 'Open',
        emails: ['test@test.com'],
        phoneNumbers: ['1234567890'],
      };
      await controller.createRecord(createRecordDto);
      expect(service.create).toHaveBeenCalledWith(createRecordDto);
    });
  });

  describe('updateRecord', () => {
    it('should call service.update with the correct id and data', async () => {
      const id = 'test-id';
      const updateRecordDto: UpdateRecordDto = { applicantName: 'Updated Applicant' };
      await controller.updateRecord(id, updateRecordDto);
      expect(service.update).toHaveBeenCalledWith(id, updateRecordDto);
    });
  });

  describe('deleteRecord', () => {
    it('should call service.remove with the correct id', async () => {
      const id = 'test-id';
      await controller.deleteRecord(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});