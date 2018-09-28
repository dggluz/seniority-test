import { instanceOf, Constructor } from 'parmenides';

/**
 * Types a variable as instance of some Constructor, but accepts any values
 * (util for determining an instance of a superclass is actually instance of
 * an specific subclass).
 * It is a safer alternative than just casting with TypeScript's "as" keyword.
 * @param Constructor 
 */
export const as = <T> (Constructor: Constructor<T>) =>
	(x: any) => instanceOf(Constructor)(x)
;
