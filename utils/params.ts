export function parseIntParamValue(value: string | string[] | undefined, defaultValue = undefined) {
  if (value === undefined) {
    return defaultValue;
  } else if (typeof value === 'string') {
    const parsedValue = parseInt(value);
    return isNaN(parsedValue) ? defaultValue : parsedValue;
  } else if (Array.isArray(value)) {
    const parsedValues = value.map((str) => parseInt(str));
    const isValid = parsedValues.every((parsedValue) => !isNaN(parsedValue));
    return isValid ? parsedValues[0] : defaultValue; // Default to 1 if any parsing fails
  } else {
    return defaultValue;
  }
}

export function parseStringParamValue(value: string | string[] | undefined, defaultValue = undefined) {
  if (value === undefined) {
    return defaultValue;
  } else if (typeof value === 'string') {
    return value;
  } else if (Array.isArray(value)) {
    return value[0];
  } else {
    return defaultValue;
  }
}
