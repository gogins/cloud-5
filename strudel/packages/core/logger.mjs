export const logKey = 'strudel.log';

let debounce = 1000,
  lastMessage,
  lastTime;

export function errorLogger(e, origin = 'cyclist') {
  //TODO: add some kind of debug flag that enables this  while in dev mode
  // console.error(e);
  logger(`[${origin}] error: ${e.message}`);
}

export function logger(message, type, data = {}) {
  let t = performance.now();
  if (lastMessage === message && t - lastTime < debounce) {
    return;
  }
  lastMessage = message;
  lastTime = t;
  console.log(`%c${message}`, 'background-color: black;color:white;border-radius:15px');
  if (typeof document !== 'undefined' && typeof CustomEvent !== 'undefined') {
    document.dispatchEvent(
      new CustomEvent(logKey, {
        detail: {
          message,
          type,
          data,
        },
      }),
    );
  }
}

logger.key = logKey;
