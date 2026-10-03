import { replyContentNodes } from "./reply-content-parser";
import styles from "./reply-content.module.css";

export function ReplyContent({ content }: { content: string }) {
  return <div className={styles.content}>{replyContentNodes(content)}</div>;
}
