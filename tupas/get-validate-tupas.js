import crypto from 'crypto';
import config from './config';

const compactArray = (originalArray) => {
  const newArray = [];
  for (let i = 0; i < originalArray.length; i += 1) {
    if (originalArray[i]) {
      newArray.push(originalArray[i]);
    }
  }
  return newArray;
};

const generateMac = (params) => {
  const joinedParams = `${params.join('&')}&`;
  return crypto.createHash('sha256').update(joinedParams).digest('hex').toUpperCase();
};

const generateMacForResponse = (queryParams) => {
  const bankNumber = queryParams.B02K_TIMESTMP.substr(0, 3);
  const bank = config.banks.find(b =>
    b.number === bankNumber);

  const macParams = compactArray([
    queryParams.B02K_VERS,
    queryParams.B02K_TIMESTMP,
    queryParams.B02K_IDNBR,
    queryParams.B02K_STAMP,
    queryParams.B02K_CUSTNAME,
    queryParams.B02K_KEYVERS,
    queryParams.B02K_ALG,
    queryParams.B02K_CUSTID,
    queryParams.B02K_CUSTTYPE,
    queryParams.B02K_USERID,
    queryParams.B02K_USERNAME,
    bank.checksumKey,
  ]).map(val =>
    unescape(val).replace(/\+/g, ' '));

  return generateMac(macParams);
};

export default function (event) {
  const queryParams = event.queryStringParameters;
  switch (event.path) {
    case '/ok':
      if (queryParams.B02K_MAC &&
        queryParams.B02K_MAC.toUpperCase() === generateMacForResponse(queryParams)) {
        // NOTE: Here you can save user state in your DB etc.
        return { success: true };
      }

      return { success: false, reason: 'mac-fail' };
    case '/cancel':
      // TODO
      break;
    case '/reject':
      // TODO
      break;
    default:
      // TODO
      break;
  }

  return { message: 'Go Serverless v1.0! Your function executed successfully!' };
}
