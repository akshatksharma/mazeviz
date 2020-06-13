export function enqueue(array, item) {
  return array.push(item);
}

export function dequeue(array) {
  if (isEmpty(array)) {
    console.log("array empty");
    return;
  }
  return array.shift();
}

export function peekFront(array) {
  return array[0];
}

export function isEmpty(array) {
  return array.length == 0;
}
