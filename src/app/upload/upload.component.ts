import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser'
import { ICommonProjectsData, ICsvData } from 'src/shared/iCsvData';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnChanges {
  errors: any[] = [];
  isCsvSelected: boolean = false;

  constructor(
    private csvParser: NgxCsvParser
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
      if(changes) {
        this.isCsvSelected = !!this.isCsvSelected;
      }
  }

  csvData: ICommonProjectsData[] | undefined = undefined;

  onFileSelected(event: any): void {

    if(this.csvData) {
      this.csvData = undefined;
    };

    if (this.errors.length > 0) {
      this.errors.length = 0;
    };

    const isDataValid = this.validateInput(event);

    if(isDataValid !== true) {
      return;
    }

    const file = event.srcElement.files[0];
    this.csvParser.parse(file, { header: true, delimiter: ',' })
      .subscribe({
        next: (data) => {
          const filteredData = (data as any[]).filter(obj => obj?.ProjectID);
          if(filteredData.length < 1) {
            this.errors.push('There are no employees who worked on same project in provided file. Please try another file.');
            event.target.value = '';
            return;
          }
          const parsedData: ICommonProjectsData[] | undefined = this.parseCsvData(filteredData);
          this.csvData = parsedData;
        },
        error: (error: NgxCSVParserError): void => {
          this.errors.push(error.message);
        }
      })
  }

  parseCsvData(data: any[]): ICommonProjectsData[] | undefined {
    const filteredCommonProjects = this.getProjectsThatHaveCommonEmployees(data);
    const commonProjectsReport: ICommonProjectsData[] = this.getCommonProjectsReport(filteredCommonProjects)

    return commonProjectsReport.length > 0 ? commonProjectsReport.sort((obj1, obj2) => Number(obj2.daysWorked) - Number(obj1.daysWorked)) : undefined;
  }


  determineFormat(date: string): string {
    const slashSeparatedRegexp = /\d{4}\/\d{2}\/\d{2}/;
    return slashSeparatedRegexp.test(date) ? 'slash' : 'dash';
  }

  dateDifferenceInDays(first: any, second: any) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  getProjectsThatHaveCommonEmployees(data: any[]): any[] {
    const commonProjects = data.reduce((acc, currentEmployee) => {
      const employeeDataWithoutProject = { empId: currentEmployee.EmpID, dateFrom: currentEmployee.DateFrom, dateTo: currentEmployee.DateTo };

      if (acc[currentEmployee.ProjectID]) {
        acc[currentEmployee.ProjectID].push(employeeDataWithoutProject);
      } else if (!acc[currentEmployee.ProjectID]) {
        acc[currentEmployee.ProjectID] = [employeeDataWithoutProject];
      }

      return acc;
    }, {});

    // return projects that have 2 employees working on
    return Object.entries(commonProjects).filter(([key, value]: string | any[]) => value.length > 1) as any[];
  }

  getCommonProjectsReport(fiteredCommonProjects: any[]): ICommonProjectsData[] {
    const dateActions: any = {
      'slash': (date: string): string[] => {
        return date.split('/');
      },
      'dash': (date: string): string[] => {
        return date.split('-');
      }
    }

    return fiteredCommonProjects.reduce((acc, [projectId, employeesArr]) => {
      const commonProjectData: ICommonProjectsData = {} as ICommonProjectsData;
      const [firstEmployee, secondEmployee] = [...employeesArr];

      const firstEmployeeDateFromArr = dateActions[this.determineFormat(firstEmployee.dateFrom)](firstEmployee.dateFrom);
      const firstEmployeeDateToArr = firstEmployee.dateTo !== 'NULL'
        ? dateActions[this.determineFormat(firstEmployee.dateTo)](firstEmployee.dateTo)
        : new Date().toJSON().slice(0, 10).split('-');

      const secondEmployeeDateFromArr = dateActions[this.determineFormat(secondEmployee.dateFrom)](secondEmployee.dateFrom);
      const secondEmployeeDateToArr = secondEmployee.dateTo !== 'NULL'
        ? dateActions[this.determineFormat(secondEmployee.dateTo)](secondEmployee.dateTo)
        : new Date().toJSON().slice(0, 10).split('-');

      const firstEmployeeDateFrom = new Date(firstEmployeeDateFromArr[0], firstEmployeeDateFromArr[1] - 1, firstEmployeeDateFromArr[2]);
      const firstEmployeeDateTo = new Date(firstEmployeeDateToArr[0], firstEmployeeDateToArr[1] - 1, firstEmployeeDateToArr[2]);
      const secondEmployeeDateFrom = new Date(secondEmployeeDateFromArr[0], secondEmployeeDateFromArr[1] - 1, secondEmployeeDateFromArr[2]);
      const secondEmployeeDateTo = new Date(secondEmployeeDateToArr[0], secondEmployeeDateToArr[1] - 1, secondEmployeeDateToArr[2]);

      const startDate = secondEmployeeDateFrom >= firstEmployeeDateFrom
        ? secondEmployeeDateFrom
        : firstEmployeeDateFrom

      const endDate = secondEmployeeDateTo > firstEmployeeDateTo
        ? firstEmployeeDateTo
        : secondEmployeeDateTo

      const difference = this.dateDifferenceInDays(startDate, endDate);

      if (difference <= 0) {
        return acc;
      }

      commonProjectData.projectID = projectId;
      commonProjectData.firstEmployeeID = firstEmployee.empId;
      commonProjectData.secondEmployeeId = secondEmployee.empId;
      commonProjectData.daysWorked = difference + '';

      acc.push(commonProjectData);

      return acc;

    }, [])
  }

  validateInput(event: any): boolean {
    if (event.srcElement.files.length > 1) {
      this.errors.push('Can\'t upload more than 1 file');
      event.target.value = '';
      return false;
    };

    if (event.srcElement.files[0].size > 5000) {
      this.errors.push('Maximum upload size is 5MB!');
      event.target.value = '';
      return false;
    };

    return true;
  }








}
