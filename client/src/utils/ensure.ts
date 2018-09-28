import { Contract } from 'parmenides';

export const ensure = <T> (contract: Contract<T>) =>
	<X> (x: T | X) => contract(x as T)
;
