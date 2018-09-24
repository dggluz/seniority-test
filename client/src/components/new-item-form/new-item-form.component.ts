import { Component } from '../component';
import { ImageFileLoaderComponent } from '../image-file-loader/image-file-loader.component';

export class NewItemFormComponent extends Component {
	constructor () {
		super(require('./new-item-form.component.html'));
		new ImageFileLoaderComponent()
			.appendTo(this.$dom.find('.image-file-selector-wrapper'));
	}

	_setHandlers () {
		this.$dom.children('form').submit(e => {
			e.preventDefault();
			console.log('new item');
		});

		return this;
	}
}
