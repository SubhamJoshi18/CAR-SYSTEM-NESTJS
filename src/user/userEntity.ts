import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
  length: number;

  @AfterInsert()
  logme() {
    console.log('Inserted with the id', this.id);
  }
  @AfterRemove()
  logup() {
    console.log('Removed with the id', this.id);
  }

  @AfterUpdate()
  logdow() {
    console.log('Updated with the id', this.id);
  }
}
