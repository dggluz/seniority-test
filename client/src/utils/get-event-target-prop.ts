export const getEventTargetProp = <T = string> (event: { target: EventTarget | null }, propName: string) =>
	event.target && (event.target as any)[propName] as T;
;

