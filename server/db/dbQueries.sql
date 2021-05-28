
drop table Messages;
drop table ChatUsers;
drop table Chats;
drop table Users;

GO
CREATE TABLE Users (
	id INT PRIMARY KEY IDENTITY,
	username NVARCHAR(255) NOT NULL,
	avatarUrl NVARCHAR(512) NOT NULL,
	githubUrl NVARCHAR(512)
);


CREATE TABLE Chats (
	id INT IDENTITY PRIMARY KEY,
	chatType NVARCHAR(20) CHECK(chatType IN ('Own', 'Dialog', 'Group', 'Channel')),
	chatTitle NVARCHAR(255),
	owner INT FOREIGN KEY REFERENCES Users(id),
	description NVARCHAR(512),
	chatAvatarUrl NVARCHAR(512)
);

GO
CREATE TABLE ChatUsers (
	chatId INT FOREIGN KEY REFERENCES Chats(id),
	userId INT FOREIGN KEY REFERENCES Users(id)
);

GO
CREATE TABLE Messages (
	id INT IDENTITY PRIMARY KEY,
	chatId INT FOREIGN KEY REFERENCES Chats(id) NOT NULL,
	senderId INT FOREIGN KEY REFERENCES Users(id) NOT NULL,
	text NVARCHAR(MAX),
	hasAttachments BIT NOT NULL,
	status NVARCHAR(20) CHECK(Status IN ('Read', 'Unread', 'UnSend')) NOT NULL,
	time DATETIME NOT NULL
);


/* При первом логине этот пользователь добавляется в диалоги ко всем другим */
GO
CREATE PROC AddDialogsWithNewUser(@newUserUsername NVARCHAR(255))
AS
BEGIN
	DECLARE @newUserId INT = (SELECT TOP(1) id FROM Users WHERE username = @newUserUsername);
	DECLARE @nextUserId INT;

	DECLARE usersId_cursor CURSOR FOR
	SELECT id FROM Users

	OPEN usersId_cursor
	FETCH NEXT FROM usersId_cursor INTO @nextUserId;

	WHILE @@FETCH_STATUS = 0
	BEGIN
		IF (@nextUserId <> @newUserId)
		BEGIN
			INSERT INTO Chats(chatType, [owner]) VALUES ('Dialog', @newUserId);
			DECLARE @dialogId INT = @@IDENTITY;
			INSERT INTO ChatUsers VALUES (@dialogId, @newUserId), (@dialogId, @nextUserId);
		END
		ELSE
		BEGIN
			INSERT INTO Chats(chatType, [owner]) VALUES ('Own', @newUserId);
			INSERT INTO ChatUsers VALUES (@@IDENTITY, @newUserId);
		END

		FETCH NEXT FROM usersId_cursor INTO @nextUserId;
	END

	CLOSE usersId_cursor;
	DEALLOCATE usersId_cursor;
END


/* Получить все записи чаты, в которых состоит пользователь */
GO
CREATE FUNCTION GetUserChats(@userId INT)
RETURNS TABLE
AS RETURN
	SELECT DISTINCT
		Chats.id,
		Chats.chatType,
		Chats.chatAvatarUrl,
		Chats.chatTitle,
		Chats.owner,
		Chats.description
	FROM Chats
	JOIN ChatUsers
	ON Chats.id = ChatUsers.chatId
	WHERE Chats.id IN (SELECT ChatId FROM ChatUsers WHERE userId = @userId)


GO
CREATE FUNCTION GetUserChatsChatUserRecords(@userId INT)
RETURNS TABLE
AS RETURN
	SELECT	Chats.id as chatId,
					ChatUsers.userId,
					Users.username,
					Users.avatarUrl,
					Users.githubUrl
	FROM Chats
	JOIN ChatUsers
	ON Chats.id = ChatUsers.chatId
	JOIN Users
	ON ChatUsers.userId = Users.id
	WHERE Chats.id IN (SELECT ChatId FROM ChatUsers WHERE userId = @userId)

/* Получить id чатов, в которых состоит пользователь */
GO
CREATE FUNCTION GetUserChatsIds(@userId INT)
RETURNS TABLE
AS RETURN
	SELECT DISTINCT chatId
	FROM ChatUsers
	WHERE userId = @userId


/* Получить сообщения из чата, начиная с новых (самое новое - первое) */
GO
CREATE FUNCTION GetChatMessages(@chatId INT, @offset INT, @take INT)
RETURNS TABLE
AS RETURN
	SELECT *
	FROM Messages
	WHERE Messages.chatId = @chatId
	ORDER BY Messages.time DESC
	OFFSET (@offset) ROWS FETCH NEXT (@take) ROWS ONLY



/* Получить последние (одно из каждого) сообщения всех чатов, в которых есть пользователь */
GO
CREATE FUNCTION GetUserLastChatMessages(@userId INT)
RETURNS @resMessages TABLE (
	id INT,
	chatId INT NOT NULL,
	senderId INT NOT NULL,
	text NVARCHAR(MAX),
	hasAttachments BIT NOT NULL,
	status NVARCHAR(20) NOT NULL,
	time DATETIME NOT NULL
)
AS
BEGIN
	DECLARE @userChatIds TABLE(chatId INT);
	INSERT INTO @userChatIds
	SELECT *
	FROM GetUserChatsIds(@userId) as Chats;

	DECLARE chatId_cursor CURSOR FOR
	SELECT chatId FROM @userChatIds;
	OPEN chatId_cursor;
	DECLARE @nextChatId INT;

	FETCH NEXT FROM chatId_cursor INTO @nextChatId;
	WHILE @@FETCH_STATUS = 0
	BEGIN
		INSERT INTO @resMessages SELECT TOP(1) * FROM GetChatMessages(@nextChatId, 0, 20);
		FETCH NEXT FROM chatId_cursor INTO @nextChatId;
	END

	CLOSE chatId_cursor;
	DEALLOCATE chatId_cursor;

	RETURN;
END
