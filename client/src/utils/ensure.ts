import { Contract } from 'parmenides';

/**
 * It's like a contract but for when the input type is an union that includes contract's type.
 * @param contract 
 */
export const ensure = <T> (contract: Contract<T>) =>
	<X> (x: T | X) => contract(x as T)
;
