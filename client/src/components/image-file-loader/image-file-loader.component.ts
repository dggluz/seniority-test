import { Component } from '../component';
import { FileLoaderComponent } from '../file-loader/file-loader.component';

require('./image-file-loader.component.less');

export class ImageFileLoaderComponent extends Component {
	constructor () {
		super(require('./image-file-loader.component.html'));
		new FileLoaderComponent()
			.appendTo(this.$dom.find('.file-loader-wrapper'))
			.onNewFile(file => {
				console.log(file);

				var reader = new FileReader();

				reader.onload = e => {
					if (e && e.target) {
						this.$dom.find('.image-preview').removeClass('d-none');
						this.$dom.find('.image-preview img').attr('src', (e.target as any).result as string);
					}
				};
			
				reader.readAsDataURL(file);
			})
			;
	}
}
