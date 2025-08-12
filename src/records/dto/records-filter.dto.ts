import { IsString, IsArray, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsString()
  operator!: string; // 'is', 'is not', etc.

  @IsString()
  value!: string;
}

class FilterDto {
  @IsString()
  @IsIn(allowedFields, { message: 'Invalid field name' })
  field!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConditionDto)
  conditions!: ConditionDto[];
}

export class RecordsFilterDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterDto)
  filters!: FilterDto[];
}
