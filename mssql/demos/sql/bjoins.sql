Use DIMS;

-- cross join
select * from employee cross join department

-- equi join
select emp_name, dept_name from employee, department where employee.dept_id = department.dept_id

-- non-equi join
select emp_name, grade from employee, salarygrades where emp_salary between min_salary and max_salary

-- inner join
select emp_name, dept_name from employee inner join department on employee.dept_id = department.dept_id

-- left outer join
select emp_name, dept_name from employee left outer join department on employee.dept_id = department.dept_id

-- right outer join
select emp_name, dept_name from employee right outer join department on employee.dept_id = department.dept_id

-- full outer join
select emp_name, dept_name from employee full outer join department on employee.dept_id = department.dept_id

-- self join
select e1.emp_name, e2.emp_name from employee e1 inner join employee e2 on e1.emp_manager_id = e2.emp_id
