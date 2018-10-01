export interface C2BLoginParams {
  eventId?: string;
  username: string;
  password: string;
}

export const c2b_login_request_template = ({
  eventId = "2500",
  username,
  password
}: C2BLoginParams): string => `
  <?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope
      xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
      xmlns:soap="http://www.4cgroup.co.za/soapauth"
      xmlns:gen="http://www.4cgroup.co.za/genericsoap">
      <soapenv:Header>
        <soap:EventID>${eventId}</soap:EventID>
      </soapenv:Header>
      <soapenv:Body>
        <gen:getGenericResult>
          <Request>
            <dataItem>
              <name>Username</name>
              <type>String</type>
              <value>${username}</value>
            </dataItem>
            <dataItem>
              <name>Password</name>
              <type>String</type>
              <value>${password}</value>
            </dataItem>
          </Request>
        </gen:getGenericResult>
      </soapenv:Body>
    </soapenv:Envelope>
`;
