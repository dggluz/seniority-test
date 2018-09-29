import { Component } from '../component';

require('./persistence-monitor.component.less');

const SUCCESS_SHOW_TIMEOUT_SECONDS = 4;

export class PersistenceMonitorComponent extends Component {
	private _successShowTimeout = -1;

	constructor () {
		super(require('./persistence-monitor.component.html'));
	}

	protected _setHandlers () {
		this.$dom
			.find('.error-wrapper')
			.click(_ =>
				this._clearStyles()
			)
		;
		return this;
	}

	showLoading () {
		this._clearStyles();
		this.$dom.addClass('show-loading');
		return this;
	}

	showError () {
		this._clearStyles();
		this.$dom.addClass('show-error');
		return this;
	}

	showSuccess () {
		this._clearStyles();
		this.$dom.addClass('show-success');
		
		this._successShowTimeout = setTimeout(
			() =>
				this._clearStyles(),
			SUCCESS_SHOW_TIMEOUT_SECONDS * 1000
		);
		return this;
	}

	private _clearStyles () {
		clearTimeout(this._successShowTimeout);
		this.$dom.removeClass('show-loading show-error show-success');
		return this;
	}
}
