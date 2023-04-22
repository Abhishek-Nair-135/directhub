import { CircularProgress } from "@mui/material";
import { findRelativeTime } from "../../utils/common";
import styles from "./Details.module.css";

const Details = ({ data, comments, loading }) => {
    return (
        <section className={styles.details_section}>
            <div>
                <h2>{data && `${data.title} #${data.number}`}</h2>
                <small>{data && data.body}</small>
            </div>

            <div className={styles.details_section__comments}>
                <h4>Comments</h4>
                {loading ? (
                    <div style={{ width: "100%", textAlign: "center" }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        {comments.map((comment) => (
                            <section className={styles.comment}>
                                <p>
                                    {comment.user?.login} commented {findRelativeTime(comment.created_at)}
                                </p>
                                <p>{comment.body}</p>
                            </section>
                        ))}
                    </>
                )}
            </div>
        </section>
    );
};

export default Details;
