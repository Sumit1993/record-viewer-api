import { IsString, IsArray, IsOptional, IsInt } from 'class-validator';

export class CreateRecordDto {
  @IsString()
  recordType: string;

  @IsString()
  applicantName: string;

  @IsArray()
  @IsString({ each: true })
  addresses: string[];

  @IsString()
  recordStatus: string;

  @IsArray()
  @IsString({ each: true })
  emails: string[];

  @IsArray()
  @IsString({ each: true })
  phoneNumbers: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  tenure?: number;
}
