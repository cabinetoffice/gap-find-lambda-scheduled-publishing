import { merge } from "lodash";

/**
 * The same as Partial, BUT also applies to nested object's attributes
 */
type Optional<T> = {
  [P in keyof T]?: Optional<T[P]>;
};

/**
 *
 * @param defaultProps - A function that returns the default object that will be returned when calling this function
 * @param overrides - Custom overrides for specific attributes of the object
 * @returns - A single combined object with all the default values AND the overrides
 */
const getProps = <T extends Object>(
  defaultProps: () => T,
  overrides: Optional<T> = {}
): T => {
  return merge(defaultProps(), overrides);
};

export { Optional, getProps };
