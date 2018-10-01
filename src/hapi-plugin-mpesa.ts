import { Server, Request, RouteOptions, ResponseToolkit } from 'hapi'
import { c2b_payment_request_template } from './c2b_payment_template'
import { doMpesaLogin } from './mpesaLogin'
import { ParsedUrlQuery } from 'querystring'

export interface IRegister {
  (server: Server, options: any): void
}

export interface IPlugin {
  name: string
  version?: string
  register: IRegister
}

export interface IMpesaPluginOptions {
  path: string
  vhost?: string
  route?: RouteOptions
  mpesaOptions: MpesaOptions
  devMode: boolean
}

export interface MpesaOptions {
  mpesaAuth: {
    username: string
    password: string
  }
  commandId: string
  mpesaUrl: string
  callbackBaseUrl: string
}

const mpesaLogin = async (options: MpesaOptions): Promise<string> => {
  // mpesa login and token
  console.log(options)

  const sessionId = await doMpesaLogin({
    url: options.mpesaUrl,
    username: options.mpesaAuth.username,
    password: options.mpesaAuth.password
  })

  console.log(sessionId)
  return await sessionId
}

const mpesaHapiPlugin: IPlugin = {
  name: 'mpesaHapi',
  register: async (
    server: Server,
    options: IMpesaPluginOptions,
    next?: Function
  ) => {
    let sessionId: string

    console.log('registering HAPI Mpesa Plugin to listen on:', options.path)
    if (!options) {
      throw new Error('HAPI Mpesa plugin requires options. Check code.')
    }

    // Register payment route
    server.route([
      {
        method: 'GET',
        path: '/c2b_payment',
        handler: async (request: Request, h: ResponseToolkit) => {
          try {
            console.log(request.url, 'sessionId:', sessionId)
            if (request.method === 'get') {
              const msisdn = (request.url.query as ParsedUrlQuery)
                .msisdn as string
              const amount = (request.url.query as ParsedUrlQuery)
                .amount as string
              const currency = (request.url.query as ParsedUrlQuery)
                .currency as string
              const surname = (request.url.query as ParsedUrlQuery)
                .surname as string
              const initials = (request.url.query as ParsedUrlQuery)
                .initials as string

              let response = {}
              const msisdn_str: string = msisdn as string
              if (options.devMode) {
                // TODO invoke MPESA payment call
                response = h.response({
                  success: true,
                  msisdn,
                  amount,
                  currency,
                  surname,
                  initials
                })
              } else {
                response = c2b_payment_request_template({
                  token: 'token',
                  reference: 'payment',
                  msisdn: msisdn_str,
                  currency,
                  amount,
                  surname,
                  initials,
                  callBackDestination:
                    options.mpesaOptions.callbackBaseUrl +
                    '/mpesa/c2b_payment_callback' // todo use `url.format`
                })
              }
              return response
            } else {
              return h.response({
                success: false,
                errorCode: 1,
                error: 'POST not supported yet',
                payload: request.payload
              })
            }
          } catch (error) {
            return {}
          }
        }
      },
      {
        method: 'POST',
        path: '/c2b_payment_callback',
        handler: async (request: Request, h: ResponseToolkit) => {
          console.log(request.payload, h)

          const response = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
            <response>
              <dataItem>
                <name>ResponseCode</name>
                <type>String</type>
                <value>200</value>
              </dataItem>
            </response>`

          return response
        }
      }
    ])

    // Login into MPESA and retrieve session token
    sessionId = options.devMode
      ? 'devSessionId'
      : await mpesaLogin(options.mpesaOptions)

    if (next) {
      next()
    }
  }
}

export { mpesaHapiPlugin }
