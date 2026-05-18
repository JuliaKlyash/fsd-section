
import { Spinner } from "../../icons/spinner";

import styles from "./loading-circle.module.scss";

export const LoadingCircle = (props: { size: "16" | "24" | "32" }) => {
	return <Spinner size={props.size} className={styles.spinner} />;
};
