import React, { useState } from "react";
import axios from "axios";

export type RoomObjType = {
	roomId: string,
	userName: string
}
type propsType = {
	onLogin: (roomObj: RoomObjType) => void
}
const EntryForm: React.FC<propsType> = function ({ onLogin }) {
	const [ roomId, setRoomId ] = useState<string>("");
	const [ userName, setUserName ] = useState<string>("");

	const handleEnter = async () => {
		if (!roomId || !userName) {
			alert("Неверные данные");
			return;
		}
		const roomObj: RoomObjType = {
			roomId,
			userName
		};
		await axios.post("rooms", roomObj);
		onLogin(roomObj);
	};

	return (
		<form className="entry-form">
			<div className="entry-form__header">
				Войти в чат
			</div>
			<div className="entry-form__input-container">
				<input
					placeholder="Введите id комнаты"
					type="text"
					className="entry-form__input"
					value={roomId}
					onChange={(e) => setRoomId(e.target.value)}
				/>
			</div>
			<div className="entry-form__input-container">
				<input
					placeholder="Введите имя пользователя"
					type="text"
					className="entry-form__input"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
				/>
			</div>
			<button
				className="entry-form__enter-button"
				onClick={handleEnter}
				type="button"
			>
				Войти
			</button>
		</form>
	);
};

export default EntryForm;