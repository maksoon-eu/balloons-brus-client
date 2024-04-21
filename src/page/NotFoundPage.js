import React from "react";

import SendMessage from "../components/sendMessage/SendMessage";
import NotFound from "../components/notFound/NotFound";

const NotFoundPage = () => {
    return (
        <React.Fragment>
        <NotFound/>
        <SendMessage/>
        </React.Fragment>
    )
}

export default NotFoundPage;