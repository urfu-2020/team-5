USE School
DROP DATABASE Kilogram

CREATE DATABASE Kilogram
use Kilogram

GO
CREATE TABLE [User] (
	id INT PRIMARY KEY IDENTITY,
	username NVARCHAR(255) NOT NULL,
	avatarUrl NVARCHAR(512) NOT NULL,
	githubUrl NVARCHAR(512)
);


CREATE TABLE Chat (
	id INT IDENTITY PRIMARY KEY,
	chatType NVARCHAR(20) CHECK(chatType IN ('Own', 'Dialog', 'Group')),
	chatAvatarUrl NVARCHAR(1024),
	chatTitle NVARCHAR(255)
);


GO
CREATE TABLE ChatUser (
	chatId INT FOREIGN KEY REFERENCES Chat(id),
	userId INT FOREIGN KEY REFERENCES [User](id)
);

GO
CREATE TABLE Message (
	id NVARCHAR(36) PRIMARY KEY,
	chatId INT FOREIGN KEY REFERENCES Chat(id) NOT NULL,
	senderId INT FOREIGN KEY REFERENCES [User](id) NOT NULL,
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
	DECLARE @newUserId INT = (SELECT TOP(1) id FROM [User] WHERE username = @newUserUsername);
	DECLARE @nextUserId INT;

	DECLARE usersId_cursor CURSOR FOR
	SELECT id FROM [User]

	OPEN usersId_cursor
	FETCH NEXT FROM usersId_cursor INTO @nextUserId;

	WHILE @@FETCH_STATUS = 0
	BEGIN
		IF (@nextUserId <> @newUserId)
		BEGIN
			INSERT INTO Chat(chatType) VALUES ('Dialog');
			DECLARE @dialogId INT = @@IDENTITY;
			INSERT INTO ChatUser VALUES (@dialogId, @newUserId), (@dialogId, @nextUserId);
		END
		ELSE
		BEGIN
			INSERT INTO Chat(chatType) VALUES ('Own');
			INSERT INTO ChatUser VALUES (@@IDENTITY, @newUserId);
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
	SELECT DISTINCT id, chatType, chatAvatarUrl, chatTitle
	FROM Chat
	JOIN ChatUser
	ON Chat.id = ChatUser.chatId
	WHERE Chat.id IN (SELECT ChatId FROM ChatUser WHERE userId = @userId)



GO
CREATE FUNCTION GetUserChatsChatUserRecords(@userId INT)
RETURNS TABLE
AS RETURN
	SELECT	Chat.id as chatId,
					ChatUser.userId,
					[User].username,
					[User].avatarUrl,
					[User].githubUrl
	FROM Chat
	JOIN ChatUser
	ON Chat.id = ChatUser.chatId
	JOIN [User]
	ON ChatUser.userId = [User].id
	WHERE Chat.id IN (SELECT ChatId FROM ChatUser WHERE userId = @userId)


select * from GetUserChatsChatUserRecords(1)

/* Получить id чатов, в которых состоит пользователь */
GO
CREATE FUNCTION GetUserChatsIds(@userId INT)
RETURNS TABLE
AS RETURN
	SELECT DISTINCT chatId
	FROM ChatUser
	WHERE userId = @userId


/* Получить сообщения из чата, начиная с новых (самое новое - первое) */
GO
CREATE FUNCTION GetChatMessages(@chatId INT, @offset INT, @take INT)
RETURNS TABLE
AS RETURN
	SELECT *
	FROM Message
	WHERE Message.chatId = @chatId
	ORDER BY Message.time DESC
	OFFSET (@offset) ROWS FETCH NEXT (@take) ROWS ONLY


/* Получить последние (одно из каждого) сообщения всех чатов, в которых есть пользователь */
GO
CREATE FUNCTION GetUserLastChatMessages(@userId INT)
RETURNS @resMessages TABLE (
	id NVARCHAR(36),
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


/* Положить сообщение в бд */
GO
CREATE PROC StoreChatMessage(
	@messageId NVARCHAR(36),
	@chatId INT,
	@senderId INT,
	@text NVARCHAR(MAX),
	@hasAttachments BIT,
	@status NVARCHAR(20),
	@time NVARCHAR(255)
	)
AS
BEGIN
	INSERT INTO Message
	VALUES (@messageId, @chatId, @senderId, @text, @hasAttachments, @status, CAST(@time as DATETIME));
END
