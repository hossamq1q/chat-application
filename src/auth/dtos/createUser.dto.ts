import {
  IsEmail,
  IsNotEmpty,
  IsString, Matches,
  Max,
  MaxLength,
  Min,
  MinLength
} from "class-validator";

export class CreateUserDto {

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(16)
  @Matches(/^@/, {
    message: 'Username must start with "@"',
  })
  username: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  lastName: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
