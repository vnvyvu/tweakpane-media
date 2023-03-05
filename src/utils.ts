export function mergeElement<T extends HTMLElement>(
	resultElement: T,
	elementProps?: Partial<Omit<T, 'style'>> & {
		style?: Partial<CSSStyleDeclaration>;
	},
	defaultProps?: Partial<Omit<T, 'style'>> & {
		style?: Partial<CSSStyleDeclaration>;
	},
): T {
	const props = {
		...defaultProps,
		...elementProps,
		style: {...defaultProps?.style, ...elementProps?.style},
	};

	const keys = Object.keys(props);

	for (let i = 0; i < keys.length; i++) {
		const k = keys[i] as keyof HTMLElement;
		const v = props?.[k];

		switch (k) {
			case 'ATTRIBUTE_NODE':
				break;
			case 'CDATA_SECTION_NODE':
				break;
			case 'COMMENT_NODE':
				break;
			case 'DOCUMENT_FRAGMENT_NODE':
				break;
			case 'DOCUMENT_NODE':
				break;
			case 'DOCUMENT_POSITION_CONTAINED_BY':
				break;
			case 'DOCUMENT_POSITION_CONTAINS':
				break;
			case 'DOCUMENT_POSITION_DISCONNECTED':
				break;
			case 'DOCUMENT_POSITION_FOLLOWING':
				break;
			case 'DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC':
				break;
			case 'DOCUMENT_POSITION_PRECEDING':
				break;
			case 'DOCUMENT_TYPE_NODE':
				break;
			case 'ELEMENT_NODE':
				break;
			case 'ENTITY_NODE':
				break;
			case 'ENTITY_REFERENCE_NODE':
				break;
			case 'NOTATION_NODE':
				break;
			case 'PROCESSING_INSTRUCTION_NODE':
				break;
			case 'TEXT_NODE':
				break;
			case 'accessKeyLabel':
				break;
			case 'assignedSlot':
				break;
			case 'attributes':
				break;
			case 'baseURI':
				break;
			case 'childElementCount':
				break;
			case 'childNodes':
				break;
			case 'children':
				if (v instanceof Node) resultElement.appendChild(v);
				else if (v) resultElement.innerHTML = v.toString();
				break;
			case 'classList':
				break;
			case 'clientHeight':
				break;
			case 'clientLeft':
				break;
			case 'clientTop':
				break;
			case 'clientWidth':
				break;
			case 'dataset':
				break;
			case 'firstChild':
				break;
			case 'firstElementChild':
				break;
			case 'isConnected':
				break;
			case 'isContentEditable':
				break;
			case 'lastChild':
				break;
			case 'lastElementChild':
				break;
			case 'localName':
				break;
			case 'namespaceURI':
				break;
			case 'nextElementSibling':
				break;
			case 'nextSibling':
				break;
			case 'nodeName':
				break;
			case 'nodeType':
				break;
			case 'offsetHeight':
				break;
			case 'offsetLeft':
				break;
			case 'offsetParent':
				break;
			case 'offsetTop':
				break;
			case 'offsetWidth':
				break;
			case 'ownerDocument':
				break;
			case 'parentElement':
				break;
			case 'parentNode':
				break;
			case 'part':
				break;
			case 'prefix':
				break;
			case 'previousElementSibling':
				break;
			case 'previousSibling':
				break;
			case 'scrollHeight':
				break;
			case 'scrollWidth':
				break;
			case 'shadowRoot':
				break;
			case 'style': {
				const styleKeys = Object.keys(v as HTMLElement['style']);

				for (let j = 0; j < styleKeys.length; j++) {
					const styleK = styleKeys[j] as keyof HTMLElement['style'];
					const styleV = (v as CSSStyleDeclaration)?.[styleK];

					if (typeof styleV !== 'function') {
						switch (styleK) {
							case 'parentRule':
								break;
							case 'length':
								break;

							default:
								if (styleV) (resultElement.style as any)[styleK] = styleV;
								break;
						}
					}
				}
				break;
			}
			case 'tagName':
				break;

			default:
				if (typeof (props as any)[k] === 'function')
					(resultElement as any)[k.toLocaleLowerCase()] = v;
				else (resultElement as any)[k] = v;

				break;
		}
	}

	return resultElement;
}
