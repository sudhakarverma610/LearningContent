use AIMS;

--
--salarygrades
--


INSERT INTO salarygrades VALUES ('A', 2000, 5000);
INSERT INTO salarygrades VALUES ('B', 5001, 10000);
INSERT INTO salarygrades VALUES ('C', 10001, 15000);
INSERT INTO salarygrades VALUES ('D', 15001, 20000);
INSERT INTO salarygrades VALUES ('E', 20001, 25000);


--
-- department
--

INSERT INTO department VALUES (10, 'admin');
INSERT INTO department VALUES (20, 'sale');
INSERT INTO department VALUES (30, 'purchase');
INSERT INTO department VALUES (40, 'marketing');
INSERT INTO department VALUES (50, 'accounts');

--
--  Table Customer
--
	
INSERT INTO customer VALUES ('C0001','Ricky','Calofornia');
INSERT INTO customer VALUES('C0002','Thompson',null);
INSERT INTO customer VALUES('C0003','Adams',null);
INSERT INTO customer VALUES('C0004','Smith','Texas');
INSERT INTO customer VALUES('C0005','John','Florida');


--
--  Table Employee
--

INSERT INTO employee VALUES ('E0001','Bob',8000,'E0006',20);
INSERT INTO employee VALUES ('E0002','Maria',12000,'E0006',20);
INSERT INTO employee VALUES ('E0003','Peter',16000,'E0007',20);
INSERT INTO employee VALUES ('E0004','Kevin',9000,'E0006',30);
INSERT INTO employee VALUES ('E0005','Herbert',12000,'E0006',40);
INSERT INTO employee VALUES ('E0006','Michael',22000,null,10);
INSERT INTO employee VALUES ('E0007','Arnold',23000,null,10);
INSERT INTO employee VALUES ('E0008','Jhonsan',21000,'E0007',50);

--
--  Table Product
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
--  Table ordermaster
--

INSERT INTO ordermaster VALUES (101,'2019-03-11 00:00:00','C0001','E0001');
INSERT INTO ordermaster VALUES (102,'2019-02-15 00:00:00','C0002','E0004');
INSERT INTO ordermaster VALUES (103,'2019-02-17 00:00:00','C0002','E0005');
INSERT INTO ordermaster VALUES (104,'2019-01-19 00:00:00','C0004','E0002');
INSERT INTO ordermaster VALUES (105,'2018-12-22 00:00:00','C0005','E0003');
INSERT INTO ordermaster VALUES (106,'2018-12-26 00:00:00','C0003','E0005');
INSERT INTO ordermaster VALUES (107,'2018-11-28 00:00:00','C0001','E0002');
INSERT INTO ordermaster VALUES (108,'2019-07-02 00:00:00','C0002','E0001');
INSERT INTO ordermaster VALUES (109,'2019-07-03 00:00:00','C0003','E0004');
INSERT INTO ordermaster VALUES (110,'2019-07-05 00:00:00','C0005','E0005');
INSERT INTO ordermaster VALUES (111,'2019-07-08 00:00:00','C0004','E0005');
INSERT INTO ordermaster VALUES (112,'2019-07-10 00:00:00','C0001','E0003');
INSERT INTO ordermaster VALUES (113,'2019-07-15 00:00:00','C0002','E0002');
INSERT INTO ordermaster VALUES (114,'2019-06-20 00:00:00','C0004','E0001');


--
--  Table orderdetail
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



