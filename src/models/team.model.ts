
export interface Team {
  id: number;
  name: string;
  teamFocus: string;
  teamEmployees: TeamEmployeeDTO[];
  description: string;
  employees?: string[]; // IDs dos funcionários
}

export interface TeamEmployeeDTO {
  employeeId: number;
  name: string;
  position: string;
}
