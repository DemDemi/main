import { ApiProperty } from '@nestjs/swagger';
import { FileResponseDto } from './file-response.dto';

export class ListFileResponseDto {

    @ApiProperty({ example: [FileResponseDto] })
    files: FileResponseDto[];

    @ApiProperty({ example: 30 })
    total_count: number;

    @ApiProperty({ example: 3 })
    pages_count: number

    @ApiProperty({ example: 1 })
    page: number

}
