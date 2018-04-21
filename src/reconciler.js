import { updateDomProperties } from './dom-utils';

let rootInstance = null;

export function render(element, container) {
	const prevInstance = rootInstance;
	const nextInstance = reconcile(container, prevInstance, element);
	rootInstance = nextInstance;
}

/*
Reusing DOM nodes
We said that the reconciliation algorithm needs to reuse as much DOM nodes as possible.
Let’s add a validation to the reconcile function to check if the previous rendered element
has the same type as the one we are currently trying to render. If the type is the same,
we will reuse it (updating the properties to match the new ones):
*/

function reconcile(parentDom, instance, element) {
	if (instance == null) {
		// Create instance
		const newInstance = instantiate(element);
		parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (element == null) {
    // Remove instance
    parentDom.removeChild(instance.dom)
    return null;
	} else if ((instance.dom, instance.element.props, element.props)) {
		// Update instance
		updateDomProperties(instance.dom, instance.element.props, element.props);
		instance.childInstances = reconcileChildren(instance, element);
		instance.element = element;
		return instance;
	} else {
		// Replace instance
		const newInstance = instantiate(element);
		parentDom.replaceChild(newInstance.dom, instance.dom);
		return newInstance;
	}
}

/*
we match the previous child instances instance.childInstances with the element children
element.props.children, and we recurse calling reconcile one by one. We also keep all
the instances returned by reconcile so we can update the childInstances.
*/

function reconcileChildren(instance, element) {
	const dom = instance.dom;
	const childInstances = instance.childInstances;
	const nextChildElements = element.props.children || [];
	const newChildInstances = [];
	const count = Math.max(childInstances.length, nextChildElements.length);
	for (let i = 0; i < count; i++) {
		const childInstance = childInstances[i];
		const childElement = nextChildElements[i];
		const newChildInstance = reconcile(dom, childInstance, childElement);
		newChildInstances.push(newChildInstance);
	}
	return newChildInstances.filter(instance => instance != null);
}

function instantiate(element) {
	const { type, props } = element;

	// Create DOM element
	const isTextElement = type === 'TEXT ELEMENT';
	const dom = isTextElement ? document.createTextNode('') : document.createElement(type);

	updateDomProperties(dom, [], props);

	// Instantiate and append children
	const childElements = props.children || [];
	const childInstances = childElements.map(instantiate);
	const childDoms = childInstances.map(childInstance => childInstance.dom);
	childDoms.forEach(childDom => dom.appendChild(childDom));

	const instance = { dom, element, childInstances };
	return instance;
}
