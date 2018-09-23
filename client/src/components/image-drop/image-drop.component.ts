import { Component } from '../component';
import { FileButtonComponent } from '../file-button/file-button.component';
import { FileDropAreaComponent } from '../file-drop-area/file-drop-area.component';

declare var require: <T = string>(path: string) => T;

export class ImageDropComponent extends Component {
	constructor () {
		super(require('./image-drop.component.html'));
		new FileButtonComponent().appendTo(this.$dom.find('.file-button-wrapper'));
		new FileDropAreaComponent().appendTo(this.$dom.find('.file-drop-area-wrapper'));
	}
}
