import { Component } from '../component';
import { FileLoaderComponent } from '../file-loader/file-loader.component';
import { getEventTargetProp } from '../../utils/get-event-target-prop';

require('./image-file-loader.component.less');

export class ImageFileLoaderComponent extends Component {
	private _fileLoader: FileLoaderComponent;

	constructor () {
		super(require('./image-file-loader.component.html'));
		this._fileLoader = new FileLoaderComponent()
			.appendTo(this.$dom.find('.file-loader-wrapper'))
			.onNewFile(file => {
				console.log(file);

				var reader = new FileReader();

				reader.onload = e => {
					const dataURLImage = getEventTargetProp(e, 'result');
					if (dataURLImage) {
						this.$dom.find('.image-preview').removeClass('d-none');
						this.$dom.find('.image-preview img').attr('src', dataURLImage);
					}
				};
			
				reader.readAsDataURL(file);
			})
			;
	}

	getImageFile () {
		return this._fileLoader.getFile();
	}
}
