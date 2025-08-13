import { RecordsQueryDto } from './dto/records-query.dto';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
export declare class RecordsController {
    private readonly recordsService;
    constructor(recordsService: RecordsService);
    getRecords(query: RecordsQueryDto): Promise<{
        data: Partial<import("../entities/record.entity").Record>[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pages: number;
            lastUpdated: string;
            activeFilters: number;
        };
    }>;
    getAutocompleteSuggestions(field: string, query: string): Promise<string[]>;
    createRecord(createRecordDto: CreateRecordDto): Promise<import("../entities/record.entity").Record>;
}
