import React, { useEffect, useReducer, useRef, useState } from "react";
import EntryForm, { RoomObjType } from "../components/EntryForm";
import "../style.scss";
import ChatRoom from "../components/ChatRoom";
import reducer from "../reducer";
import { socket } from "../connect-socket";
import axios from "axios";

const Chat: React.FC = function () {
	const [ state, dispatch ] = useReducer(reducer, {
		isJoined: false,
		userName: "",
		roomId: "",
		users: [],
		messages: []
	});


	const onLogin = async (roomObj: RoomObjType) => {
		// @ts-ignore
		dispatch({
			type: "SET_IS_JOINED",
			payload: roomObj
		});
		socket.emit("ROOM:JOIN", roomObj);
		const res = await axios.get(`room/${roomObj.roomId}`);
		// @ts-ignore
		dispatch({
			type: "SET_USERS",
			payload: res.data.users
		});
		// @ts-ignore
		dispatch({
			type: "SET_MESSAGES",
			payload: res.data.messages
		});
	};
	const addMessage = (message: any) => {
		// @ts-ignore
		dispatch({
			type: "ADD_MESSAGE",
			payload: message
		});
	};

	useEffect(() => {
		socket.on("ROOM:JOINED", (users) => {
			// @ts-ignore
			dispatch({
				type: "SET_USERS",
				payload: users
			});
		});
		socket.on("ROOM:LEAVE", (users) => {
			// @ts-ignore
			dispatch({
				type: "SET_USERS",
				payload: users
			});
		});
		socket.on("ROOM:ADD_NEW_MESSAGE", (message) => {
			addMessage(message);
		});
	}, []);

	return (
		<main className="chat">
			{state.isJoined
				? <ChatRoom
					users={state.users}
					roomId={state.roomId}
					messages={state.messages}
					userName={state.userName}
					addMessage={addMessage}
				/>
				: <EntryForm onLogin={onLogin}/>
			}
		</main>
	);
};

export default Chat;