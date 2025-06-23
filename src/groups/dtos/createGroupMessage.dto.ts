import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGroupMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  groupId: number;
}
