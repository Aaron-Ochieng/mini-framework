import { routes } from "./routes.js";

export default (state) => {
    const page = routes[state.path];
    return page ? page(state) : {text : "404 Not Found"};
}