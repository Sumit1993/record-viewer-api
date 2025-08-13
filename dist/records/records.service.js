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
exports.RecordsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const record_entity_1 = require("../entities/record.entity");
let RecordsService = class RecordsService {
    recordRepository;
    constructor(recordRepository) {
        this.recordRepository = recordRepository;
    }
    async findAll(type, filters, columns, sort, page = 1, limit = 20) {
        const qb = this.recordRepository.createQueryBuilder('record');
        if (type) {
            qb.andWhere('record.recordType = :type', { type });
        }
        let activeFilters = 0;
        if (filters && filters.filters) {
            activeFilters = filters.filters.length;
            qb.andWhere(new typeorm_2.Brackets((qb) => {
                filters.filters.forEach((filter, filterIndex) => {
                    qb.andWhere(new typeorm_2.Brackets((qb) => {
                        filter.conditions.forEach((condition, conditionIndex) => {
                            const paramName = `p_${filterIndex}_${conditionIndex}`;
                            let sqlOperator;
                            let searchValue = condition.value;
                            if (condition.operator === 'is') {
                                sqlOperator = 'ILIKE';
                                searchValue = `%${searchValue}%`;
                            }
                            else if (condition.operator === 'is not') {
                                sqlOperator = 'NOT ILIKE';
                                searchValue = `%${searchValue}%`;
                            }
                            else {
                                sqlOperator = condition.operator;
                            }
                            qb.orWhere(`record.${filter.field} ${sqlOperator} :${paramName}`, { [paramName]: searchValue });
                        });
                    }));
                });
            }));
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
    async findOne(id) {
        return this.recordRepository.findOne({ where: { id } });
    }
    async create(createRecordDto) {
        const data = { ...createRecordDto };
        if (!data.recordNumber) {
            let prefix = 'GEN';
            if (data.recordType === 'Business')
                prefix = 'BUS';
            else if (data.recordType === 'Building Permit')
                prefix = 'BLD';
            else if (data.recordType === 'Zoning Variance')
                prefix = 'ZON';
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
    async getLastUpdated() {
        const record = await this.recordRepository.findOne({
            where: {},
            order: { dateSubmitted: 'DESC' },
        });
        if (!record) {
            throw new Error('No records found');
        }
        return record;
    }
    async getAutocompleteSuggestions(field, query) {
        const qb = this.recordRepository.createQueryBuilder('record');
        const results = await qb
            .select(`record.${field}`)
            .distinct(true)
            .where(`record.${field} ILIKE :query`, { query: `%${query}%` })
            .orderBy(`record.${field}`, 'ASC')
            .limit(5)
            .getRawMany();
        if (!results || results.length === 0) {
            throw new Error('No records found');
        }
        return results.map((row) => row[`record_${field}`]);
    }
};
exports.RecordsService = RecordsService;
exports.RecordsService = RecordsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(record_entity_1.Record)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RecordsService);
//# sourceMappingURL=records.service.js.map