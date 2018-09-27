import { readAndValidateJSONFile } from './fs-utils';
import { strictObjOf, num, str } from 'parmenides';

/**
 * Contract (see parmenides) to validate against the
 * expected form of the configs.json file (throw ParmenidesError if doesn't
 * validate and types the result if it does)
 * @param target object to validate
 * @returns validated target
 */
const configsContract = strictObjOf({
	server: strictObjOf({
		port: num
	}),
	assets: strictObjOf({
		namespace: str,
		imagesDir: str
	}),
	imageSize: strictObjOf({
		height: num,
		width: num
	})
});

/**
 * Shared task to the content of the configs.json file, parsed and validated.
 * The file is a docker config.
 */
export const configs = readAndValidateJSONFile('/configs.json', configsContract);
