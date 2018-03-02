import crypto from 'crypto';
import config from './config';

const SHA256 = '03';
const TUPAS_MESSAGE_TYPE = '701';

const generateMac = (params) => {
  const joinedParams = `${params.join('&')}&`;
  return crypto.createHash('sha256').update(joinedParams).digest('hex').toUpperCase();
};

const generateMacForRequest = (requestParams) => {
  const macParams = [
    requestParams.messageType,
    requestParams.version,
    requestParams.vendorId,
    requestParams.languageCode,
    requestParams.identifier,
    requestParams.idType,
    requestParams.returnLink,
    requestParams.cancelLink,
    requestParams.rejectLink,
    requestParams.keyVersion,
    requestParams.algorithmType,
    requestParams.checksumKey,
  ];

  return generateMac(macParams);
};

const buildBankParams = ({
  bank, languageCode, returnUrls, requestId,
}) => {
  const params = {
    name: bank.name,
    id: bank.id,
    bankAuthUrl: bank.authUrl,
    messageType: TUPAS_MESSAGE_TYPE,
    version: bank.version,
    vendorId: bank.vendorId,
    identifier: requestId,
    languageCode,
    idType: bank.idType,
    returnLink: returnUrls.ok,
    cancelLink: returnUrls.cancel,
    rejectLink: returnUrls.reject,
    keyVersion: bank.keyVersion,
    algorithmType: SHA256,
    checksumKey: bank.checksumKey,
  };

  params.mac = generateMacForRequest(params);

  delete params.checksumKey; // Unset secret key so it's not passed to the client

  return params;
};

export default function () {
  // NOTE: If possible make this truly unique by storing it in e.g. DynamoDB
  // This should be 20 characters long random string
  const requestId = `${(new Date()).getTime()}${(Math.floor(Math.random() * 9000000) + 1000000)}`;

  // TODO: baseUrl should probably direct to client it would then do request to validation endpoint
  const baseUrl = process.env.GW_URL;
  const returnUrls = {
    ok: `${baseUrl}ok`,
    cancel: `${baseUrl}cancel`,
    reject: `${baseUrl}reject`,
  };

  const banks = config.banks.map(bank =>
    buildBankParams({
      bank, languageCode: 'FI', requestId, returnUrls,
    }));

  return banks;
}
