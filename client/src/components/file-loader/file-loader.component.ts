import { Component } from '../component';
import { FileButtonComponent, FileCallback } from '../file-button/file-button.component';
import { FileDropAreaComponent } from '../file-drop-area/file-drop-area.component';

export class FileLoaderComponent extends Component {
	private _fileButton: FileButtonComponent;
	private _fileDropArea: FileDropAreaComponent;

	constructor () {
		super(require('./file-loader.component.html'));
		this._fileButton = new FileButtonComponent()
			.appendTo(this.$dom.find('.file-button-wrapper'));
		this._fileDropArea = new FileDropAreaComponent()
			.appendTo(this.$dom.find('.file-drop-area-wrapper'));
	}

	// TODO: improve typings
	onNewFile (callback: FileCallback) {
		this
			._fileButton
			.onNewFile(callback);
		this._fileDropArea;
	}
}
