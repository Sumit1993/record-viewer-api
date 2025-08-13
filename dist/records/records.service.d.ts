import { Repository } from 'typeorm';
import { Record } from '../entities/record.entity';
import { CreateRecordDto } from './dto/create-record.dto';
import { RecordsFilterDto } from './dto/records-filter.dto';
export declare class RecordsService {
    private readonly recordRepository;
    constructor(recordRepository: Repository<Record>);
    findAll(type?: string, filters?: RecordsFilterDto, columns?: string[], sort?: {
        column: string;
        order: 'ASC' | 'DESC';
    }, page?: number, limit?: number): Promise<{
        data: Partial<Record>[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pages: number;
            lastUpdated: string;
            activeFilters: number;
        };
    }>;
    findOne(id: string): Promise<Record | null>;
    create(createRecordDto: CreateRecordDto): Promise<Record>;
    private getLastUpdated;
    getAutocompleteSuggestions(field: string, query: string): Promise<string[]>;
}
