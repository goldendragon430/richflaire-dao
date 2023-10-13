import { SET_PERA_WALLET } from "../actionTypes";

const initState = {
    peraWallet: null
};

export const walletReducer = (state = initState, action) => {
    const { type, payload = 1 } = action;
    switch (type) {
        case SET_PERA_WALLET:
            return { ...state, peraWallet: payload };
        default:
            return state;
    }
};
