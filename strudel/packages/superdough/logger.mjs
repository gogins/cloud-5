let log = (msg) => console.log(msg);

export function errorLogger(e, origin = 'cyclist') {
  //TODO: add some kind of debug flag that enables this  while in dev mode
  // console.error(e);
  logger(`[${origin}] error: ${e.message}`);
}

export const logger = (...args) => log(...args);

export const setLogger = (fn) => {
  log = fn;
};
