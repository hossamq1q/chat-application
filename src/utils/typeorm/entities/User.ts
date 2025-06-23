import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Exclude } from 'class-transformer';
import { Message } from './Message';
import { Group } from './Group';
import { Profile } from "./profile";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Message, (message) => message.author)
  messages: Message[];

  @ManyToMany(()=>Group , (group)=>group.users)
  groups: Group[];

  @OneToOne(() => Profile, { cascade: ['insert', 'update'] })
  @JoinColumn()
  profile: Profile;
}
