USE [WebBanDT]
GO
SET IDENTITY_INSERT [dbo].[Customers] ON 

INSERT [dbo].[Customers] ([Id], [Name], [Phone], [Email], [Address], [Password], [AccountType], [Status], [RegisteredDate], [LastLoginDate]) VALUES (1, N'Tuyền Luis', N'0963566703', N'a5lhp1.swift@gmail.com', N'Quảng Ninh', N'$2b$07$LuveUbSfsdkMsp9tZy6l7uY4buYbbg6VUBEHsXGPvu.3U5ZE.6nn2', N'local', 1, CAST(N'2019-10-28 12:37:57.777' AS DateTime), CAST(N'2019-10-28 18:34:49.190' AS DateTime))
INSERT [dbo].[Customers] ([Id], [Name], [Phone], [Email], [Address], [Password], [AccountType], [Status], [RegisteredDate], [LastLoginDate]) VALUES (2, N'Tuyền Luis', N'0963566703', N'a5lhp.swift@gmail.com', N'Quảng Ninh', N'$2b$07$LuveUbSfsdkMsp9tZy6l7uY4buYbbg6VUBEHsXGPvu.3U5ZE.6nn2', N'local', 1, CAST(N'2019-10-28 12:38:16.423' AS DateTime), CAST(N'2019-10-30 07:32:58.907' AS DateTime))
SET IDENTITY_INSERT [dbo].[Customers] OFF
SET IDENTITY_INSERT [dbo].[Roles] ON 

INSERT [dbo].[Roles] ([Id], [Name]) VALUES (1, N'SupperAdmin')
INSERT [dbo].[Roles] ([Id], [Name]) VALUES (2, N'Admin')
INSERT [dbo].[Roles] ([Id], [Name]) VALUES (3, N'Customer')
SET IDENTITY_INSERT [dbo].[Roles] OFF
INSERT [dbo].[UserRoles] ([CustomerId], [RoleId]) VALUES (1, 3)
INSERT [dbo].[UserRoles] ([CustomerId], [RoleId]) VALUES (2, 1)
INSERT [dbo].[UserRoles] ([CustomerId], [RoleId]) VALUES (2, 2)
