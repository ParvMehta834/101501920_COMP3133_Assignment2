import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apollo = inject(Apollo);

  getAllEmployees() {
    return this.apollo.query({
      query: gql`
        query {
          getAllEmployees {
            success
            message
            data
            error
          }
        }
      `,
      fetchPolicy: 'no-cache'
    }).pipe(map((res: any) => res.data.getAllEmployees));
  }

  addEmployee(input: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddEmployee($input: EmployeeInput!) {
          addEmployee(input: $input) {
            success
            message
            data
            error
          }
        }
      `,
      variables: { input }
    }).pipe(map((res: any) => res.data.addEmployee));
  }

  searchEmployees(filter: { designation?: string; department?: string }) {
    return this.apollo.query({
      query: gql`
        query SearchEmployees($filter: EmployeeSearchFilter!) {
          searchEmployees(filter: $filter) {
            success
            message
            data
            error
          }
        }
      `,
      variables: { filter },
      fetchPolicy: 'no-cache'
    }).pipe(map((res: any) => res.data.searchEmployees));
  }

  getEmployeeByEid(eid: string) {
    return this.apollo.query({
      query: gql`
        query GetEmployeeByEid($eid: ID!) {
          getEmployeeByEid(eid: $eid) {
            success
            message
            data
            error
          }
        }
      `,
      variables: { eid },
      fetchPolicy: 'no-cache'
    }).pipe(map((res: any) => res.data.getEmployeeByEid));
  }

  updateEmployeeByEid(eid: string, input: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateEmployeeByEid($eid: ID!, $input: EmployeeInput!) {
          updateEmployeeByEid(eid: $eid, input: $input) {
            success
            message
            data
            error
          }
        }
      `,
      variables: { eid, input }
    }).pipe(map((res: any) => res.data.updateEmployeeByEid));
  }

  deleteEmployeeByEid(eid: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation DeleteEmployeeByEid($eid: ID!) {
          deleteEmployeeByEid(eid: $eid) {
            success
            message
            data
            error
          }
        }
      `,
      variables: { eid }
    }).pipe(map((res: any) => res.data.deleteEmployeeByEid));
  }
}