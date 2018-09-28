import { Component } from '../component';
import { FileButtonComponent } from '../file-button/file-button.component';
import { FileDropAreaComponent } from '../file-drop-area/file-drop-area.component';
import { FileSelector } from '../../utils/file-selector.mixin';

export class ImageFileLoaderComponent extends FileSelector(Component) {
	private _fileButton: FileButtonComponent;
	private _fileDropArea: FileDropAreaComponent;

	constructor () {
		super(require('./image-file-loader.component.html'));

		this._fileButton = new FileButtonComponent()
			.configureAcceptedType('image/*')
			.onNewFile(_file => this._triggerFileCallbacks())
			.appendTo(this.$dom.find('.file-button-wrapper'))
		;
		this._fileDropArea = new FileDropAreaComponent()
			.configureAcceptedType('image/*')
			.onNewFile(_file => this._triggerFileCallbacks())
			.appendTo(this.$dom.find('.file-drop-area-wrapper'))
		;
	}

	getImageFile () {
		return this._fileButton.getFile() || this._fileDropArea.getFile();
	}

	restart () {
		this._fileButton.restart();
		this._fileDropArea.restart();
		this.$dom.find('.image-preview').addClass('d-none');
		this.$dom.find('.image-preview img').attr('src', '');
		return this;
	}

	/**
	 * @override from FileSelector mixin
	 */
	getFile () {
		return this.getImageFile();
	}
}
