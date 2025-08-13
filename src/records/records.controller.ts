import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RecordsQueryDto } from './dto/records-query.dto';
import { RecordsFilterDto } from './dto/records-filter.dto';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';

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
  async getRecords(@Query() query: RecordsQueryDto) {
    const columnsArr = query.columns
      ? query.columns
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean)
      : undefined;
    let filterObj: RecordsFilterDto | undefined;
    if (query.filters) {
      try {
        const parsedFilters: unknown = JSON.parse(query.filters);
        filterObj = Object.assign(new RecordsFilterDto(), {
          filters: parsedFilters,
        });
      } catch {
        throw new BadRequestException('Invalid filters JSON');
      }
    }
    let sortObj: { column: string; order: 'ASC' | 'DESC' } | undefined;
    if (query.sort) {
      const [column, order] = query.sort.split(':');
      sortObj = {
        column,
        order: order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      };
    }
    const pageNum = query.page ? parseInt(query.page, 10) : 1;
    const limitNum = query.limit ? parseInt(query.limit, 10) : 20;
    if (isNaN(pageNum) || pageNum < 1)
      throw new BadRequestException('Invalid page number');
    if (isNaN(limitNum) || limitNum < 1)
      throw new BadRequestException('Invalid limit number');
    return this.recordsService.findAll(
      query.type,
      filterObj,
      columnsArr,
      sortObj,
      pageNum,
      limitNum,
    );
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Get autocomplete suggestions for a field' })
  @ApiQuery({
    name: 'field',
    required: true,
    type: String,
    description: 'The field to get suggestions for',
  })
  @ApiQuery({
    name: 'query',
    required: true,
    type: String,
    description: 'The search query',
  })
  @ApiResponse({ status: 200, description: 'Autocomplete suggestions found' })
  async getAutocompleteSuggestions(
    @Query('field') field: string,
    @Query('query') query: string,
  ) {
    // Validate field against allowedColumns
    const allowedColumns = RecordsQueryDto.allowedColumns;
    if (!allowedColumns.includes(field)) {
      throw new BadRequestException(`Invalid field for autocomplete: ${field}`);
    }
    return this.recordsService.getAutocompleteSuggestions(field, query);
  }

  @Post()
  async createRecord(@Body() createRecordDto: CreateRecordDto) {
    return this.recordsService.create(createRecordDto);
  }
}
