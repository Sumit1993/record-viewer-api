import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Record {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  recordNumber: string;

  @Column()
  recordType: string;

  @Column()
  applicantName: string;

  @Column()
  dateSubmitted: string;

  @Column('text', { array: true })
  addresses: string[];

  @Column()
  recordStatus: string;

  @Column('text', { array: true })
  emails: string[];

  @Column('text', { array: true })
  phoneNumbers: string[];

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  tenure: number;
}
