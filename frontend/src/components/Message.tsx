import React from "react";

type MessagePropsType = {
	userName: string,
	textMessage: string
}
const Message: React.FC<MessagePropsType> = function ({userName, textMessage}) {
	return (
		<div className="chat-body__message chat-message">
			<div className="chat-message__header message-header">
				<span className="message-header__user-name">
					{userName}
				</span>
			</div>
			<div className="chat-message__text">
				{textMessage}
			</div>
		</div>
	);
};

export default Message;