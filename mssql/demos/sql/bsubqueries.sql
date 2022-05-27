use DIMS;

select emp_salary from employee where emp_designation like 'manager'

select emp_name, emp_salary from employee where emp_salary IN (select emp_salary from employee where emp_designation like 'manager');

select emp_name, emp_salary from employee where emp_salary >ANY (select emp_salary from employee where emp_designation like 'manager');

select emp_name, emp_salary from employee where emp_salary >ALL (select emp_salary from employee where emp_designation like 'manager');

select emp_name, emp_salary from employee where emp_salary <ANY (select emp_salary from employee where emp_designation like 'manager');

select emp_name, emp_salary from employee where emp_salary <ALL (select emp_salary from employee where emp_designation like 'manager');