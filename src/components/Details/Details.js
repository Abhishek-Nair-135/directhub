import { findRelativeTime } from "../../utils/common";
import styles from "./Details.module.css";

const Details = ({ data, comments }) => {
    return (
        <div className={styles.details_section}>
            <div>
                <h2>{data && `${data.title} #${data.number}`}</h2>
                <small>{data && data.body}</small>
            </div>

            <div className={styles.details_section__comments}>
                <h4>Comments</h4>
                {comments.length > 0 &&
                    comments.map((comment) => (
                        <div className={styles.comment}>
                            <div>
                                {comment.user?.login} commented {findRelativeTime(comment.created_at)}
                            </div>
                            <div>{comment.body}</div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Details;
