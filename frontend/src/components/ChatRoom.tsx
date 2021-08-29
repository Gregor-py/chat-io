import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { socket } from "../connect-socket";

type ChatRoomPropsType = {
	userName: string,
	users: string[],
	roomId: string,
	messages: any[],
	addMessage: (message: any) => void,
}

const ChatRoom: React.FC<ChatRoomPropsType> = function ({ users, roomId, messages, userName, addMessage }) {
	const [ messageText, setMessageText ] = useState<string>("");

	const messagesRef = useRef<any>();

	useEffect(() => {
		messagesRef.current.scrollTo(0, 99999);
	}, [ messages ]);

	const onSendMessage = () => {
		socket.emit("ROOM:NEW_MESSAGE", {
			roomId,
			userName,
			text: messageText
		});
		setMessageText("");
		addMessage({
			roomId,
			userName,
			text: messageText
		});
	};

	return (
		<div className="chat-room">
			<div className="chat-room__side-panel side-panel">
				<div className="side-panel__room-name">
					Комната: <span>{roomId}</span>
				</div>
				<div className="side-panel__online-count">
					<div className="side-panel__online-count-header">
						Онлайн <span>{users.length}</span>
					</div>
					{users.map((user) => (
						<div className="side-panel__user">
							{user}
						</div>
					))}
				</div>
			</div>
			<div className="chat-room__chat-body chat-body">
				<div className="chat-body__messages" ref={messagesRef}>
					{messages.map((message) => <Message userName={message.userName} textMessage={message.text}/>)}
				</div>
				<form className="chat-body__create-message-form create-message-form">
					<textarea
						className="create-message-form__textarea"
						onChange={(e) => setMessageText(e.target.value)}
						value={messageText}/>
					<button
						type="button"
						className="create-message-form__send-button"
						onClick={onSendMessage}
					>
						Отравить
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChatRoom;