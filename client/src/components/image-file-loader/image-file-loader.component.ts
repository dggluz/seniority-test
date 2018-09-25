import { Component } from '../component';
import { FileLoaderComponent } from '../file-loader/file-loader.component';
import { readFileAsDataUrl } from '../../utils/read-file-as-data-url';

require('./image-file-loader.component.less');

export class ImageFileLoaderComponent extends Component {
	private _fileLoader: FileLoaderComponent;

	constructor () {
		super(require('./image-file-loader.component.html'));
		this._fileLoader = new FileLoaderComponent()
			.appendTo(this.$dom.find('.file-loader-wrapper'))
			.onNewFile(file => {
				readFileAsDataUrl(file)
					.fork(_ => {
						// TODO: handle error.
					}, image => {
						this.$dom.find('.image-preview').removeClass('d-none');
						this.$dom.find('.image-preview img').attr('src', image);
					})
				;
			})
			;
	}

	getImageFile () {
		return this._fileLoader.getFile();
	}
}
