use DIMS;

--
--salarygrades
--


INSERT INTO salarygrades VALUES ('A', 5000, 10000);
INSERT INTO salarygrades VALUES ('B', 10001, 15000);
INSERT INTO salarygrades VALUES ('C', 15001, 20000);
INSERT INTO salarygrades VALUES ('D', 20001, 30000);
INSERT INTO salarygrades VALUES ('E', 30001, 50000);


--
-- department
--

INSERT INTO department VALUES (10, 'admin');
INSERT INTO department VALUES (20, 'sale');
INSERT INTO department VALUES (30, 'purchase');
INSERT INTO department VALUES (40, 'marketing');
INSERT INTO department VALUES (50, 'accounts');
INSERT INTO department VALUES (60, 'support');
INSERT INTO department(dept_id) VALUES (70);

--
--  customer
--
	
INSERT INTO customer VALUES ('C0001','Ricky','Calofornia');
INSERT INTO customer VALUES('C0002','Thompson',null);
INSERT INTO customer VALUES('C0003','Adams',null);
INSERT INTO customer VALUES('C0004','Smith','Texas');
INSERT INTO customer VALUES('C0005','John','Florida');


--
--  employee
--

INSERT INTO employee VALUES ('E0001','Bob','Bob@yahoo.com',8000,'Clerk','E0005',20);
INSERT INTO employee VALUES ('E0002','Maria','Maria@gmail.com',18000,'Engineer','E0009',60);
INSERT INTO employee VALUES ('E0003','Peter','Peter@yahoo.com',15000,'Engineer','E0009',60);
INSERT INTO employee VALUES ('E0004','Kevin','Kevin@gmail.com',9000,'Clerk','E0006',30);
INSERT INTO employee VALUES ('E0005','David','David@gmail.com',18000,'Manager','E0009',20);
INSERT INTO employee VALUES ('E0006','John','John@gmail.com',12000,'Manager','E0009',30);
INSERT INTO employee VALUES ('E0007','Harry','Harry@gmail.com',15000,'Manager','E0009',40);
INSERT INTO employee VALUES ('E0008','Herbert','Herbert@yahoo.com',12000,'Clerk','E0007',40);
INSERT INTO employee VALUES ('E0009','Michael','Michael@yahoo.com',25000,'Director','E0010',10);
INSERT INTO employee VALUES ('E0010','Arnold','Arnold@gmail.com',50000,'CEO',null,10);
INSERT INTO employee VALUES ('E0011','Jhonsan','Jhonsan@gmail.com',12000,'Accountant','E0010',50);
INSERT INTO employee(emp_id, emp_name, emp_email) VALUES ('E0012','Richard','Richard@yahoo.com');

--
--  product
--

INSERT INTO product VALUES ('P0001','Pepsi','15.00');
INSERT INTO product VALUES ('P0002','Coca Cola','10.00');
INSERT INTO product VALUES ('P0003','Thums up','11.00'); 
INSERT INTO product VALUES ('P0004','Limca','13.00');
INSERT INTO product VALUES ('P0005','Vanilla Shake','15.00');
INSERT INTO product VALUES ('P0006','Strawberry Shake','17.00');
INSERT INTO product VALUES ('P0007','Chocolate Shake','20.00');
INSERT INTO product VALUES ('P0008','Pineapple Juice','16.00');
INSERT INTO product VALUES ('P0009','Orange Juice','12.00');
INSERT INTO product VALUES ('P0010','Mango Juice','15.00');
INSERT INTO product VALUES ('P0011','Apple Juice','25.00');
INSERT INTO product VALUES ('P0012','Lime Water','5.00');
INSERT INTO product VALUES ('P0013','Fanta','7.00');



--
--  ordermaster
--

INSERT INTO ordermaster VALUES (101,'2009-03-11 00:00:00','C0001','E0001');
INSERT INTO ordermaster VALUES (102,'2009-02-15 00:00:00','C0002','E0004');
INSERT INTO ordermaster VALUES (103,'2009-02-17 00:00:00','C0002','E0005');
INSERT INTO ordermaster VALUES (104,'2009-01-19 00:00:00','C0004','E0002');
INSERT INTO ordermaster VALUES (105,'2008-12-22 00:00:00','C0005','E0003');
INSERT INTO ordermaster VALUES (106,'2008-12-26 00:00:00','C0003','E0005');
INSERT INTO ordermaster VALUES (107,'2008-11-28 00:00:00','C0001','E0002');
INSERT INTO ordermaster VALUES (108,'2008-07-02 00:00:00','C0002','E0001');
INSERT INTO ordermaster VALUES (109,'2008-07-03 00:00:00','C0003','E0004');
INSERT INTO ordermaster VALUES (110,'2008-07-05 00:00:00','C0005','E0005');
INSERT INTO ordermaster VALUES (111,'2008-07-08 00:00:00','C0004','E0005');
INSERT INTO ordermaster VALUES (112,'2008-07-10 00:00:00','C0001','E0003');
INSERT INTO ordermaster VALUES (113,'2008-07-15 00:00:00','C0002','E0002');
INSERT INTO ordermaster VALUES (114,'2008-06-20 00:00:00','C0004','E0001');


--
--  orderdetail
--

INSERT INTO orderdetail VALUES (101,'P0003',20);
INSERT INTO orderdetail VALUES (101,'P0006',35);
INSERT INTO orderdetail VALUES (102,'P0003',NULL);
INSERT INTO orderdetail VALUES (102,'P0010',25); 
INSERT INTO orderdetail VALUES (102,'P0006',10);
INSERT INTO orderdetail VALUES (103,'P0011',50);
INSERT INTO orderdetail VALUES (103,'P0001',18);
INSERT INTO orderdetail VALUES (104,'P0008',5); 
INSERT INTO orderdetail VALUES (105,'P0003',25);
INSERT INTO orderdetail VALUES (105,'P0001',30);
INSERT INTO orderdetail VALUES (106,'P0001',10);
INSERT INTO orderdetail VALUES (107,'P0002',5);
INSERT INTO orderdetail VALUES (108,'P0007',32);
INSERT INTO orderdetail VALUES (109,'P0002',21);
INSERT INTO orderdetail VALUES (110,'P0009',28);
INSERT INTO orderdetail VALUES (111,'P0012',42);
INSERT INTO orderdetail VALUES (112,'P0003',40);
INSERT INTO orderdetail VALUES (113,'P0004',NULL); 
INSERT INTO orderdetail VALUES (114,'P0005',28);



