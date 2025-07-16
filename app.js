import { init } from "./MiniMvc/init.js";
import view from "./MiniMvc/viewRoute.js";

function update(state, msg) {
    switch (msg.type) {
        case "ROUTE_CHANGE":
            return { ...state, path: msg.path };
        default:
            return state;
    }
}

const initialState = {path: window.location.pathname};

init(document.getElementById("app"), initialState, update, view);