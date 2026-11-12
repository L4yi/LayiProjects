import React from "react";
import ErrorPage from "./ErrorPage";

export default function ServiceUnavailable503() {
    return <ErrorPage code={503} />;
}
