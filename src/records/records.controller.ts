import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RecordsFilterDto } from './dto/records-filter.dto';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@Controller('records')
@ApiTags('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}
  @Get()
  @ApiOperation({
    summary:
      'Get records with advanced filtering, sorting, and column selection',
  })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({
    name: 'filters',
    required: false,
    type: String,
    description: 'JSON string for AND/OR filter groups',
  })
  @ApiQuery({
    name: 'columns',
    required: false,
    type: String,
    description: 'Comma-separated list of columns to select',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort by column, e.g. "dateSubmitted:desc"',
  })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Records found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getRecords(
    @Query('type') type: string,
    @Query('filters') filters: string,
    @Query('columns') columns: string,
    @Query('sort') sort: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const allowedColumns = [
      'id',
      'recordNumber',
      'recordType',
      'applicantName',
      'dateSubmitted',
      'addresses',
      'recordStatus',
      'emails',
      'phoneNumbers',
      'description',
      'tenure',
    ];
    const columnsArr = columns
      ? columns
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean)
      : undefined;
    if (columnsArr && columnsArr.some((col) => !allowedColumns.includes(col))) {
      throw new BadRequestException('Invalid column(s) requested');
    }
    let filterObj: RecordsFilterDto | undefined;
    if (filters) {
      try {
        const parsedFilters: unknown = JSON.parse(filters);
        filterObj = Object.assign(new RecordsFilterDto(), {
          filters: parsedFilters,
        });
      } catch {
        throw new BadRequestException('Invalid filters JSON');
      }
    }
    let sortObj: { column: string; order: 'ASC' | 'DESC' } | undefined;
    if (sort) {
      const [column, order] = sort.split(':');
      if (!allowedColumns.includes(column)) {
        throw new BadRequestException('Invalid sort column');
      }
      sortObj = {
        column,
        order: order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      };
    }
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    if (isNaN(pageNum) || pageNum < 1)
      throw new BadRequestException('Invalid page number');
    if (isNaN(limitNum) || limitNum < 1)
      throw new BadRequestException('Invalid limit number');
    return this.recordsService.findAll(
      type,
      filterObj,
      columnsArr,
      sortObj,
      pageNum,
      limitNum,
    );
  }

  @Get(':id')
  async getRecord(@Param('id') id: string) {
    return this.recordsService.findOne(id);
  }

  @Post()
  async createRecord(@Body() createRecordDto: CreateRecordDto) {
    return this.recordsService.create(createRecordDto);
  }

  @Put(':id')
  async updateRecord(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
  ) {
    return this.recordsService.update(id, updateRecordDto);
  }

  @Delete(':id')
  async deleteRecord(@Param('id') id: string) {
    await this.recordsService.remove(id);
    return { deleted: true };
  }
}
