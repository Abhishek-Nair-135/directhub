import { Card, CardActions, CardContent, CardHeader } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./DashboardCard.module.css";
import { findRelativeTime } from "../../utils/common";

const DashboardCard = ({ title, data, viewAllPath }) => {
    return (
        <Card className={styles.card} elevation={3}>
            <CardHeader title={title} />
            {data.length > 0 ? (
                <>
                    <CardContent>
                        {data.map((item) => (
                            <div className={styles.details} key={item.title}>
                                <div>{item.title}</div>
                                <div>{findRelativeTime(item.created_at)}</div>
                            </div>
                        ))}
                    </CardContent>
                    <CardActions>
                        <Link to={viewAllPath}>View All</Link>
                    </CardActions>
                </>
            ) : (
                <div>No {title} available</div>
            )}
        </Card>
    );
};

export default DashboardCard;
