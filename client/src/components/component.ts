export abstract class Component {
	protected $dom: JQuery<HTMLElement>;

	/**
	 * @constructor
	 * It's a template method that builds the jQuery representation of the component.
	 * @param html HTML that corresponds with the component.
	 */
	constructor (html: string) {
		this.$dom = $(html);
		this._setHandlers();
	}
	
	/**
	 * Appends the component to the wrapper.
	 * @param $wrapper
	 * @returns Itself to allow method chaining.
	 */
	public appendTo ($wrapper: string | Element | JQuery<HTMLElement> | DocumentFragment | (Element | DocumentFragment)[]) {
		this.$dom.appendTo($wrapper);
		return this;
	}
	
	protected _setHandlers () {
		// Default implementation. Subclasses can override it.
		return this;
	}
}
