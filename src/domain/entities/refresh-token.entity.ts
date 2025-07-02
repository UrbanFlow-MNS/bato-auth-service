import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number

  @Column({ unique: true })
  deviceId: string;

  @Column()
  refreshToken: string;

  @Column()
  expiresAt: Date;
}