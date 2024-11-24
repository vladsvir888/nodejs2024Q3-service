import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  login: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;
}
