import { useMemo, useState, type MutableRefObject } from "react";

import { Label } from "../label";

import type { FieldProps } from "./fields";
import { fieldByType } from "./fields";
import { useFieldValidation } from "./hooks/use-field-validation";

type FieldValue = FieldProps["value"];

export function Field(props: FieldProps) {
	const ViewField = fieldByType[props.type];
	const emptyRef: MutableRefObject<() => void> = { current: () => { } };
	const [callError] = useState<MutableRefObject<() => void>>(emptyRef);

	const { wrappedOnBlur, wrappedOnChange, wrappedOnKeyDown } = useFieldValidation<FieldValue>({
		value: props.value,
		validators: props.validators,
		validateOn: props.validateOn,
		isError: props.isError,
		onChange: props.onChange as (value: FieldValue) => void,
		onBlur: props.onBlur,
		onKeyDown: props.onKeyDown
	});

	const viewProps = useMemo(
		() => ({
			...props,
			onChange: wrappedOnChange,
			onBlur: wrappedOnBlur,
			onKeyDown: wrappedOnKeyDown
		}),
		[props, wrappedOnChange, wrappedOnBlur, wrappedOnKeyDown]
	);


	return (
		<>
			{props.label ? (
				<Label
					text={props.label}
					isRequired={props.isRequired ?? false}
					labelPosition={props.labelPosition}
					size={props.size}
					hint={props.info}
					variant={props.labelVariant}
				>
					<ViewField {...viewProps} onError={callError} />
				</Label>
			) : (
				<ViewField {...viewProps} onError={callError} />
			)}
		</>
	);
}
