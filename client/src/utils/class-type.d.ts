/**
 * Type of a Class constructor. It is used by mixins.
 */
export interface ClassType <T> {
	new (...args: any[]): T;
}
