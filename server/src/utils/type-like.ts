import { obj } from 'parmenides';
import { ObjectId, ObjectID } from 'mongodb';
import { isInstanceOf } from '@ts-task/utils';

export type Validator <T> = (x: any) => T;

export type MapOfValidators <T> = {
	[P in keyof T]: Validator<T[P]>;
};

export class TypeLikeError extends TypeError {
	TypeLikeError = 'TypeLikeError';
}

export const isTypeLikeError = (err: any): err is TypeLikeError =>
	err.TypeLikeError === 'TypeLikeError'
;

/**
 * It is similar to `objOf` from parmenides, but instead of returning
 * the same object that is validated, returns a mapped object (mapped with the validator
 * functions).
 * @param checkersMap
 */
export const objectOfLike = <T> (checkersMap: MapOfValidators<T>) => {
	// Assert the map checkers is an object.
	obj(checkersMap);

	return (target: any) => {
		const ret: any = {};
		// Assert the target is an object
		obj(target);

		// Validate each key, and store it's mapped value
		for (const aKey in checkersMap) {
			const aChecker = checkersMap[aKey];
			const aTargetValue = target[aKey];
			try {
				ret[aKey] = aChecker(aTargetValue);
			} catch (e) {
				if (e instanceof TypeError) {
					throw new TypeLikeError(`[${aKey}]: ${e.message}`);
				}
				throw e;
			}
		}

		// Return the object with all the mapped values
		return ret as T;
	};
};

export const mongoIdLike = (mongoId: string | ObjectId) => {
	if (isInstanceOf(ObjectID)(mongoId) || typeof mongoId === 'string' && /^[a-f0-9]{24}$/i.test(mongoId)) {
		return new ObjectId(mongoId);
	}
	throw new TypeLikeError(
		`The value is not a MongoId (has "${(
			mongoId
		)}" value)`
	);
};

export const numberLike = (value: number | string) => {
	if (isNaN(value as any)) {
		throw new TypeLikeError(`"${value} can not be converted to number"`);
	}
	return Number(value);
};
