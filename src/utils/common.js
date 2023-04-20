import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);

export const findRelativeTime = (time) => {
    return dayjs(time).fromNow();
}