/* Create database AIMS.                                                                     */

use master;

go

IF EXISTS (
   SELECT name
   FROM sys.databases
   WHERE name = 'AIMS'
)
drop database AIMS
go

create database AIMS  

go

use AIMS  

go

/* Create new table "salarygrades".                                                           */
/* "salarygrades" : Table of salarygrades                                                     */  
create table salarygrades ( 
	grade varchar(2) not null,
	min_Salary decimal(10,2) null,
	max_Salary decimal(10,2) null) ON 'PRIMARY'  

go

alter table salarygrades
	add constraint PK_salarygrades primary key clustered (grade)   


go

/* Create new table "product".                                                                */
/* "product" : Table of product                                                               */  
create table product ( 
	product_id varchar(5) not null,
	product_name varchar(45) null,
	product_rate decimal(10,2) null) ON 'PRIMARY'  

go

alter table product
	add constraint PK_product primary key clustered (product_id)   


go

/* Create new table "ordermaster".                                                            */
/* "ordermaster" : Table of ordermaster                                                       */  
create table ordermaster ( 
	order_id int default 0 not null,
	Order_date datetime null,
	customer_id varchar(5) null,
	emp_id varchar(5) null) ON 'PRIMARY'  

go

alter table ordermaster
	add constraint PK_ordermaster primary key clustered (order_id)   


go

/* Create new table "orderdetail".                                                            */
/* "orderdetail" : Table of orderdetail                                                       */  
create table orderdetail ( 
	order_id int not null,
	product_id varchar(5) not null,
	quantity int null) ON 'PRIMARY'  

go

alter table orderdetail
	add constraint orderdetail_PK primary key nonclustered (product_id, order_id)   


go

/* Create new table "employee".                                                               */
/* "employee" : Table of employee                                                             */  
create table employee ( 
	emp_id varchar(5) not null,
	emp_name varchar(20) null,
	emp_salary decimal(10,2) null,
	emp_manager_id varchar(5) null,
	dept_id int null) ON 'PRIMARY'  

go

alter table employee
	add constraint PK_employee primary key clustered (emp_id)   


go

/* Create new table "department".                                                             */
/* "department" : Table of department                                                         */  
create table department ( 
	dept_id int not null,
	dept_name varchar(45) null) ON 'PRIMARY'  

go

alter table department
	add constraint PK_department primary key clustered (dept_id)   


go

/* Create new table "customer".                                                               */
/* "customer" : Table of customer                                                             */  
create table customer ( 
	customer_id varchar(5) default 'NULL' not null,
	customer_name varchar(20) default 'NULL' null,
	customer_address varchar(30) default 'NULL' null) ON 'PRIMARY'  

go

alter table customer
	add constraint PK_customer primary key clustered (customer_id)   


go

/* Add foreign key constraints to table "ordermaster".                                        */
alter table ordermaster
	add constraint employee_ordermaster_FK1 foreign key (emp_id)
	 references employee (emp_id) on update no action on delete no action  

go

alter table ordermaster
	add constraint customer_ordermaster_FK1 foreign key (customer_id)
	 references customer (customer_id) on update no action on delete no action  

go

/* Add foreign key constraints to table "orderdetail".                                        */
alter table orderdetail
	add constraint ordermaster_orderdetail_FK1 foreign key (order_id)
	 references ordermaster (order_id) on update no action on delete no action  

go

alter table orderdetail
	add constraint product_orderdetail_FK1 foreign key (product_id)
	 references product (product_id) on update no action on delete no action  

go

/* Add foreign key constraints to table "employee".                                           */
alter table employee
	add constraint department_employee_FK1 foreign key (dept_id)
	 references department (dept_id) on update no action on delete no action  

go



