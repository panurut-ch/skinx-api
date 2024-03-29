import { ApiProperty } from '@nestjs/swagger';

export class SearchPostDto {
  @ApiProperty()
  keyword: string;

  @ApiProperty()
  page: number;

  @ApiProperty()
  perpage: number;

  @ApiProperty()
  sortbycolumn?: string;

  @ApiProperty()
  orderby?: string;

  @ApiProperty()
  tag?: string;
}
