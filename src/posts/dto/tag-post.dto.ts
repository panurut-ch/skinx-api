import { ApiProperty } from '@nestjs/swagger';

export class TagPostDto {
  @ApiProperty()
  tag: string;

  @ApiProperty()
  page: number;

  @ApiProperty()
  perpage: number;

  @ApiProperty()
  sortbycolumn?: string;

  @ApiProperty()
  orderby?: string;
}
