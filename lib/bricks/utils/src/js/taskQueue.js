/* eslint-disable no-undef */
export function pushTaskQueue() {
  if (global.taskQueue === undefined) {
    global.taskQueue = 1;
  } else {
    global.taskQueue++;
  }
}

export function popTaskQueue() {
  if (global.taskQueue === undefined || global.taskQueue < 1) {
    throw new Error("pop on empty or undefined task queue");
  }
  global.taskQueue--;
}
