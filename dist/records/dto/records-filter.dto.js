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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordsFilterDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const allowedFields = [
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
class ConditionDto {
    operator;
    value;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConditionDto.prototype, "operator", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConditionDto.prototype, "value", void 0);
class FilterDto {
    field;
    conditions;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(allowedFields, { message: 'Invalid field name' }),
    __metadata("design:type", String)
], FilterDto.prototype, "field", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ConditionDto),
    __metadata("design:type", Array)
], FilterDto.prototype, "conditions", void 0);
class RecordsFilterDto {
    filters;
}
exports.RecordsFilterDto = RecordsFilterDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FilterDto),
    __metadata("design:type", Array)
], RecordsFilterDto.prototype, "filters", void 0);
//# sourceMappingURL=records-filter.dto.js.map