import { ApiProperty } from '@nestjs/swagger';

export class AllPostDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  perpage: number;

  @ApiProperty()
  sortbycolumn?: string;

  @ApiProperty()
  orderby?: string;
}
