export const createDomElement = ({
  tagName = 'div',
  attribs = {}
}) => {
  const element = window.document.createElement(tagName);

  Object.keys(attribs).forEach(attribName => {
    element.setAttribute(attribName, attribs[attribName])
  });
  
  return element;
}

export default {
  createDomElement: createDomElement
}