import { IsOptional, IsString, IsIn } from 'class-validator';

export class RecordsQueryDto {
  static readonly allowedRecordTypes = [
    'Business',
    'Building Permit',
    'Zoning Variance',
  ];
  static readonly allowedColumns = [
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

  @IsOptional()
  @IsString()
  @IsIn(RecordsQueryDto.allowedRecordTypes)
  type?: string;

  @IsOptional()
  @IsString()
  filters?: string;

  @IsOptional()
  @IsString()
  columns?: string;

  @IsOptional()
  @IsString()
  @IsIn(RecordsQueryDto.allowedRecordTypes)
  sort?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
