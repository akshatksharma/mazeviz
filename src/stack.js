export function push(array, item) {
  return array.push(item);
}

export function pop(array) {
  if (isEmpty(array)) {
    console.log("array empty");
    return;
  }
  return array.pop();
}

export function peekFront(array) {
  return array[0];
}

export function isEmpty(array) {
  return array.length == 0;
}
