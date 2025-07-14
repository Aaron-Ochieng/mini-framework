export default (tag, { attrs = {}, children = [] } = {}) => {
  return {
    tag,
    properties: attrs,
    children,
  };
};
