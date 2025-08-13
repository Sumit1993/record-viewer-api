export declare class RecordsQueryDto {
    static readonly allowedRecordTypes: string[];
    static readonly allowedColumns: string[];
    type?: string;
    filters?: string;
    columns?: string;
    sort?: string;
    page?: string;
    limit?: string;
}
