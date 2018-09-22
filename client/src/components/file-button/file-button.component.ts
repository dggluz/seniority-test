import { Component } from '../component';

declare var require: <T = string>(path: string) => T;

require('./file-button.component.less');

export class FileButtonComponent extends Component {
	constructor () {
		super(require('./file-button.component.html'));
	}
}
