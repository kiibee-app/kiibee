import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { Injectable, PipeTransform } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: string) {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }
}
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
