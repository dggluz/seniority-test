import { ClassType } from './class-type';

export type FileCallback = (file: File) => void;

/**
 * Mixin that provides basic FileSelector functionality
 * @param Base 
 */
export const FileSelector = <T extends ClassType<any>> (Base: T) =>
	class extends Base {
		protected _fileCallbacks: FileCallback[] = [];
		protected _file: File | null = null;

		onNewFile (callback: FileCallback) {
			this._fileCallbacks.push(callback);
			return this;
		}

		getFile () {
			return this._file;
		}

		protected setFile (file: File | null) {
			this._file = file;
			return this;
		}

		protected _triggerFileCallbacks() {
			const file = this.getFile();
			if (file) {
				this._fileCallbacks.forEach(aCallback => {
					aCallback(file);
				});
			}
			return this;
		}
	}
;
