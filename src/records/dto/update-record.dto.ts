import { IsString, IsArray, IsOptional, IsInt } from 'class-validator';

export class UpdateRecordDto {
  @IsOptional()
  @IsString()
  recordType?: string;

  @IsOptional()
  @IsString()
  applicantName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  addresses?: string[];

  @IsOptional()
  @IsString()
  recordStatus?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emails?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phoneNumbers?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  tenure?: number;
}
