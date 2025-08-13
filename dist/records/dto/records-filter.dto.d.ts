declare class ConditionDto {
    operator: string;
    value: string;
}
declare class FilterDto {
    field: string;
    conditions: ConditionDto[];
}
export declare class RecordsFilterDto {
    filters: FilterDto[];
}
export {};
