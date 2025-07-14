import createElement from "./createElement.js";

export default (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const rootElement = doc.body.firstChild; // Get the first element inside the body

  if (!rootElement) {
    return null; // Handle empty HTML string or no elements
  }

  function convertNode(node) {
    // Handle element nodes
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      const attrs = {};
      for (const attr of node.attributes) {
        attrs[attr.name] = attr.value;
      }

      const children = Array.from(node.childNodes)
        .map(convertNode)
        .filter((child) => child !== null); // Filter out nulls from comments/empty text nodes

      return createElement(tagName, { attrs, children });
    }

    // Handle text nodes
    if (node.nodeType === Node.TEXT_NODE) {
      const trimmedText = node.textContent.trim();
      return trimmedText ? { text: trimmedText } : null; // Return text content, or null if empty after trimming
    }

    // Ignore comment nodes and other node types for this VDOM structure
    return null;
  }

  return convertNode(rootElement);
};
