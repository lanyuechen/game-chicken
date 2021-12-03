export const prepareSpec = (spec) => {
  if (typeof spec === 'function') {
    return spec();
  }

  return spec;
}