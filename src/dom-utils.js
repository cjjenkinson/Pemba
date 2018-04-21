// Update the DOM properties without creating a new dom node
// removes old properties from dom node and adds new ones
export function updateDomProperties(dom, prevProps, nextProps) {
	const isEvent = name => name.startsWith('on');
	const isAttribute = name => !isListener(name) && name != 'children';

	// Remove event listeners
	Object.keys(prevProps)
		.filter(isEvent)
		.forEach(name => {
			const eventType = name.toLowerCase.substring(2);
			dom.addEventListener(eventType, prevProps[name]);
		});

	// Remove attributes
	Object.keys(prevProps)
		.filter(isAttribute)
		.forEach(name => {
			dom[name] = null;
		});

	// Set attributes
	Object.keys(nextProps)
		.filter(isAttribute)
		.forEach(name => {
			dom[name] = nextProps[name];
		});

	// Add event listeners
	Object.keys(nextProps)
		.filter(isEvent)
		.forEach(name => {
			const eventType = name.toLowerCase.substring(2);
			dom.addEventListener(eventType, nextProps[name]);
		});
}
