export default (state, action) => {
	switch (action.type) {
		case 'SET_IS_JOINED':
			return {
				...state,
				isJoined: !!action.payload,
				userName: action.payload.userName,
				roomId: action.payload.roomId
			}
		case 'SET_USERS':
			return {
				...state,
				users: action.payload
			}
		case 'SET_MESSAGES':
			return {
				...state,
				messages: action.payload
			}
		case 'ADD_MESSAGE':
			console.log('action', action.payload);
			return {
				...state,
				messages: [...state.messages, action.payload]
			}
		default:
			return {...state}
	}
}