import { deleteFile } from '../fs-utils';
import { configs } from '../configs';
import { resolve } from 'path';

export const deleteStaticImage = (imageName: string) =>
	configs
		.chain(configs =>
			deleteFile(resolve(
				process.cwd(),
				`./${configs.assets.namespace}/${configs.assets.imagesDir}/`,
				imageName
			))
		)
;
