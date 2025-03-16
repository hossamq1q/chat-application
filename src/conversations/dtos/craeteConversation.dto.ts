import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
