/**
 * Created by sfrBox on 22/08/2017.
 */

/**
 * Get ipconnection to spy
 * @param req
 * @returns {*}
 */
export function ipConnection(req) {
  let ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'].split(',')[0];
  } else if (req.connection && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress;
  } else {
    ip = req.ip;
  }
  return ip;
}
