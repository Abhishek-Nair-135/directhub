import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>404 | Page Not Found</h1>
            <Link to={"/"}>Back to Home</Link>
        </div>
    );
};

export default NotFound;
