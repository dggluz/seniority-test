
/**
 * @abstract @class
 * Component superclass. Performs the basic setup of a component (reads HTML, appends to DOM, sets event handlers).
 * It's intended to be subclassed, not to be instanced itself.
 */
export class Component {
	protected $dom: JQuery<HTMLElement>;

	/**
	 * @constructor
	 * It's a template method that builds the jQuery representation of the component.
	 * @param html HTML that corresponds with the component.
	 */
	constructor (html: string) {
		// As we cannot make this class "abstract" (it could not be extended by mixin if it was),
		// we just perform the following runtime assertion to ensure it is not instantiated directly.
		if (this.constructor === Component) {
			throw new Error('Component is inteded to be subclassed, not to be instantiated directly.');
		}

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
