import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  rowsArray: string[] | undefined = undefined;

  onFileSelected(event: any): void {

    if (event.srcElement.files.length > 1 || event.srcElement.files[0].size > 5000) {
      console.log('Wrong Input, Please try again.');
      return;
    }

    const file: Blob = event.srcElement.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      let csvData = reader.result as string;
      let csvRecordsArray = (<string>csvData).split(/\r\n|\n/).filter((string) => !string.split(',').includes(''));
      csvRecordsArray.shift();
      this.rowsArray = csvRecordsArray;
    };
    reader.onload(event);

  }
}
