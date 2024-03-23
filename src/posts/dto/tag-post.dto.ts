import { ApiProperty } from '@nestjs/swagger';

export class TagPostDto {
  @ApiProperty()
  tag: string;
}
