import { Component } from '../component';
import { readFileAsDataUrl } from '../../utils/read-file-as-data-url';
import { FileButtonComponent } from '../file-button/file-button.component';
import { FileDropAreaComponent } from '../file-drop-area/file-drop-area.component';

require('./image-file-loader.component.less');

export class ImageFileLoaderComponent extends Component {
	private _fileButton: FileButtonComponent;
	private _fileDropArea: FileDropAreaComponent;

	constructor () {
		super(require('./image-file-loader.component.html'));

		this._fileButton = new FileButtonComponent()
			.configureAcceptedType('image/*')
			.onNewFile(file => this._handleNewFile(file))
			.appendTo(this.$dom.find('.file-button-wrapper'))
		;
		this._fileDropArea = new FileDropAreaComponent()
			.configureAcceptedType('image/*')
			.onNewFile(file => this._handleNewFile(file))
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

	private _handleNewFile (file: File) {
		readFileAsDataUrl(file)
			.fork(_ => {
				// TODO: handle error.
			}, image => {
				// TODO: extract to method
				this.$dom.find('.image-preview').removeClass('d-none');
				this.$dom.find('.image-preview img').attr('src', image);
			})
		;
		return this;
	}
}
