import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate',
    standalone: true,
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, limit: number = 100): string {
        if (!value) {
            return '';
        }
        // Giới hạn chuỗi theo số ký tự, thêm '...' nếu vượt quá
        return value.length > limit ? value.substring(0, limit) + '...' : value;
    }
}
