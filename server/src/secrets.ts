import { readAndValidateJSONFile } from './fs-utils';
import { strictObjOf, str, num } from 'parmenides';

/**
 * Contract (see parmenides) to validate against the
 * expected form of the secrets.json file (throw TypeError if doesn't
 * validate and types the result if it does)
 * @param target object to validate
 * @returns validated target
 */
const dbSecretsContract = strictObjOf({
	db: strictObjOf({
		host: str,
		port: num,
		dbName: str
	})
});

/**
 * Shared task to the content of the secrets.json file, parsed and validated.
 */
export const dbSecrets = readAndValidateJSONFile(
	'/run/secrets/db',
	dbSecretsContract
);
