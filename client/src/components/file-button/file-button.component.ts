import { Component } from '../component';

declare var require: <T = string>(path: string) => T;

require('./file-button.component.less');

export type FileCallback = (file: File) => void;

// TODO: support specific mime types
export class FileButtonComponent extends Component {
	private _fileCallbacks: FileCallback[] = [];

	constructor () {
		super(require('./file-button.component.html'));
	}

	protected _setHandlers () {
		this.$dom
			.find('input[type=file]')
			.change(e => {
				console.log(e);
				if (e.originalEvent.target) {
					const files = (e.originalEvent.target as any).files as FileList;

					// TODO: validate there's only one file
					// TODO: validate file permissions
					// TODO: validate file type
					// TODO: extra validations (like image size)
					// TODO: trigger event handlers
					this._triggerFileCallbacks(files[0]);
				}
			});
		return this;
	}

	// TODO: improve typings
	onNewFile (callback: FileCallback) {
		this._fileCallbacks.push(callback);
		return this;
	}

	private _triggerFileCallbacks(file: File) {
		this._fileCallbacks.forEach(aCallback => {
			aCallback(file);
		})
		return this;
	}
}
