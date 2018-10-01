export interface C2BRequestParams {
  token: string;
  eventId?: string;
  msisdn: string;
  shortcode?: string;
  currency?: string;
  amount: string;
  date?: string;
  reference: string;
  commandId?: string;
  language?: string;
  callBackChannel?: string;
  callBackDestination: string;
  surname: string;
  initials: string;
}

export const c2b_payment_request_template = ({
  token,
  eventId = "80049",
  msisdn,
  shortcode = "8337",
  currency = "CDF",
  amount,
  date = new Date().getTime().toString(),
  reference,
  commandId = "InitTrans_oneForallC2B",
  language = "EN",
  callBackChannel = "2",
  callBackDestination,
  surname,
  initials
}: C2BRequestParams): string => `<?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:soap="http://www.4cgroup.co.za/soapauth"
    xmlns:gen="http://www.4cgroup.co.za/genericsoap">
    <soapenv:Header>
      <soap:Token xmlns:soap="http://www.4cgroup.co.za/soapauth">${token}</soap:Token>
      <soap:EventID>${eventId}</soap:EventID>
    </soapenv:Header>
    <soapenv:Body>
      <gen:getGenericResult>
        <Request>
          <dataItem>
            <name>CustomerMSISDN</name>
            <type>String</type>
            <value>${msisdn}</value>
          </dataItem>
          <dataItem>
            <name>ServiceProviderCode</name>
            <type>String</type>
            <value>${shortcode}</value>
          </dataItem>
          <dataItem>
            <name>Currency</name>
            <type>String</type>
            <value>${currency}</value>
          </dataItem>
          <dataItem>
            <name>Amount</name>
            <type>String</type>
            <value>${amount}</value>
          </dataItem>
          <dataItem>
            <name>Date</name>
            <type>String</type>
            <value>${date}</value>
          </dataItem>
          <dataItem>
            <name>ThirdPartyReference</name>
            <type>String</type>
            <value>${reference}</value>
          </dataItem>
          <dataItem>
            <name>CommandId</name>
            <type>String</type>
          <value>${commandId}</value>
          </dataItem>
          <dataItem>
            <name>Language</name>
            <type>String</type>
            <value>${language}</value>
          </dataItem>
          <dataItem>
            <name>CallBackChannel</name>
            <type>String</type>
            <value>${callBackChannel}</value>
          </dataItem>
          <dataItem>
            <name>CallBackDestination</name>
            <type>String</type>
            <value>${callBackDestination}</value>
          </dataItem>
          <dataItem>
            <name>Surname</name>
            <type>String</type>
            <value>${surname}</value>
          </dataItem>
          <dataItem>
            <name>Initials</name>
            <type>String</type>
            <value>${initials}</value>
          </dataItem>
        </Request>
      </gen:getGenericResult>
    </soapenv:Body>
  </soapenv:Envelope>`;
