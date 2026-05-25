import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commonFind',
  standalone: true
})
export class CommonFindPipe implements PipeTransform {
  transform(list: any[], id: any, field: string = 'id'): any {
    if (!list || !id) return null;
    return list.find(item => item[field] === id);
  }
}
