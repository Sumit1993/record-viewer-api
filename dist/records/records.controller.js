"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const records_query_dto_1 = require("./dto/records-query.dto");
const records_filter_dto_1 = require("./dto/records-filter.dto");
const records_service_1 = require("./records.service");
const create_record_dto_1 = require("./dto/create-record.dto");
let RecordsController = class RecordsController {
    recordsService;
    constructor(recordsService) {
        this.recordsService = recordsService;
    }
    async getRecords(query) {
        const columnsArr = query.columns
            ? query.columns
                .split(',')
                .map((c) => c.trim())
                .filter(Boolean)
            : undefined;
        let filterObj;
        if (query.filters) {
            try {
                const parsedFilters = JSON.parse(query.filters);
                filterObj = Object.assign(new records_filter_dto_1.RecordsFilterDto(), {
                    filters: parsedFilters,
                });
            }
            catch {
                throw new common_1.BadRequestException('Invalid filters JSON');
            }
        }
        let sortObj;
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
            throw new common_1.BadRequestException('Invalid page number');
        if (isNaN(limitNum) || limitNum < 1)
            throw new common_1.BadRequestException('Invalid limit number');
        return this.recordsService.findAll(query.type, filterObj, columnsArr, sortObj, pageNum, limitNum);
    }
    async getAutocompleteSuggestions(field, query) {
        const allowedColumns = records_query_dto_1.RecordsQueryDto.allowedColumns;
        if (!allowedColumns.includes(field)) {
            throw new common_1.BadRequestException(`Invalid field for autocomplete: ${field}`);
        }
        return this.recordsService.getAutocompleteSuggestions(field, query);
    }
    async createRecord(createRecordDto) {
        return this.recordsService.create(createRecordDto);
    }
};
exports.RecordsController = RecordsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get records with advanced filtering, sorting, and column selection',
    }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, type: String }),
    (0, swagger_1.ApiQuery)({
        name: 'filters',
        required: false,
        type: String,
        description: 'JSON string for AND/OR filter groups',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'columns',
        required: false,
        type: String,
        description: 'Comma-separated list of columns to select',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sort',
        required: false,
        type: String,
        description: 'Sort by column, e.g. "dateSubmitted:desc"',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Records found' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [records_query_dto_1.RecordsQueryDto]),
    __metadata("design:returntype", Promise)
], RecordsController.prototype, "getRecords", null);
__decorate([
    (0, common_1.Get)('autocomplete'),
    (0, swagger_1.ApiOperation)({ summary: 'Get autocomplete suggestions for a field' }),
    (0, swagger_1.ApiQuery)({
        name: 'field',
        required: true,
        type: String,
        description: 'The field to get suggestions for',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'query',
        required: true,
        type: String,
        description: 'The search query',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Autocomplete suggestions found' }),
    __param(0, (0, common_1.Query)('field')),
    __param(1, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RecordsController.prototype, "getAutocompleteSuggestions", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_record_dto_1.CreateRecordDto]),
    __metadata("design:returntype", Promise)
], RecordsController.prototype, "createRecord", null);
exports.RecordsController = RecordsController = __decorate([
    (0, common_1.Controller)('records'),
    (0, swagger_1.ApiTags)('records'),
    __metadata("design:paramtypes", [records_service_1.RecordsService])
], RecordsController);
//# sourceMappingURL=records.controller.js.map