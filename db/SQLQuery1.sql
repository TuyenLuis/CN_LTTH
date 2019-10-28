CREATE PROC prc_Insert_CreateAccountLocal
@Name NVARCHAR(128),
@Phone VARCHAR(20),
@Email VARCHAR(128),
@Address NVARCHAR(200),
@Password VARCHAR(100),
@Id INT OUTPUT
AS
	DECLARE @count INT
	SELECT @count = COUNT(*) FROM dbo.Customers WHERE Email = @Email
	IF (@count <> 0)
		BEGIN
			SET @Id = 0
		END
	ELSE
		BEGIN
			INSERT dbo.Customers
			        ( Name ,
			          Phone ,
			          Email ,
			          [Address] ,
			          [Password] ,
			          AccountType ,
			          [Status] ,
			          RegisteredDate ,
			          LastLoginDate
			        )
			VALUES  ( @Name , -- Name - nvarchar(128)
			          @Phone , -- Phone - varchar(20)
			          @Email , -- Email - varchar(128)
			          @Address , -- Address - nvarchar(200)
			          @Password , -- Password - varchar(100)
			          'local' , -- AccountType - varchar(20)
			          1 , -- Status - int -- 1 is active
			          GETDATE() , -- RegisteredDate - datetime
			          GETDATE()  -- LastLoginDate - datetime
			        )
			SET @Id = @@IDENTITY
			INSERT dbo.UserRoles
			        ( CustomerId, RoleId )
			VALUES  ( @@IDENTITY, -- CustomerId - int
			          3  -- RoleId - Customer
			          )
		END
GO


CREATE PROCEDURE prc_Select_CheckLogin
@Email VARCHAR(128),
@Password VARCHAR(100),
@LoginResult NVARCHAR(200) OUTPUT,
@Id INT OUTPUT
AS 
	DECLARE @checkEmail INT
	SELECT @checkEmail = COUNT(*) FROM dbo.Customers 
	WHERE Email = @Email AND [Status] = 1 AND AccountType = 'local'
	IF @checkEmail = 0
		BEGIN
			SELECT @LoginResult = 'Email is invalid. Please check again', @Id = NULL
		END
    ELSE
		BEGIN
			DECLARE @checkAccount INT
			SELECT @checkAccount = COUNT(*), @Id = Id FROM dbo.Customers 
			WHERE Email = @Email AND [Status] = 1 AND AccountType = 'local' AND [Password] = @Password
			GROUP BY Id
			IF @checkAccount = 0
				BEGIN
					SELECT @LoginResult = 'Email and password is invalid. Please check again', @Id = NULL
				END
			ELSE
				BEGIN
					SET @LoginResult = 'Login success'
					UPDATE dbo.Customers SET LastLoginDate = GETDATE()
					WHERE Id = @Id
				END
		END
GO	

DECLARE @Id INT
EXECUTE dbo.prc_Insert_CreateAccountLocal N'Tuyền Luis', -- nvarchar(128)
    '0963566703', -- varchar(20)
    'a5lhp.swift@gmail.com', -- varchar(128)
    N'Quảng Ninh', -- nvarchar(200)
    '123456', -- varchar(100)
    @Id OUTPUT -- bit
PRINT @Id

DECLARE @LoginResult NVARCHAR(200), @Id int
EXEC dbo.prc_Select_CheckLogin 'a5lhp.swift@gmail.com', -- varchar(128)
    '123456', -- varchar(100)
    @LoginResult OUTPUT, -- nvarchar(200)
    @Id OUTPUT-- int

PRINT @LoginResult
PRINT @Id

GO

SELECT Id, Name, Phone, Email, [Address], AccountType, [Status], RegisteredDate, LastLoginDate FROM dbo.Customers
