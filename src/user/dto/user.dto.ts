import {
	IsEmail,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'

export class UserDto {
	@IsEmail()
	email: string
	
	@MinLength(8, {
		message: 'Password must be at least 8 characters long'
	})
	@IsString()
	@IsOptional()
	password?: string
	
	@IsOptional()
	@IsString()
	name: string
	
	@IsOptional()
	@IsString()
	avatarPath: string
	
	@IsOptional()
	@IsString()
	phone?: string
}