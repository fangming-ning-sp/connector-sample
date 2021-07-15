/* Copyright (c) 2021. SailPoint Technologies, Inc. All rights reserved. */

import { createConnector } from '@sailpoint/connector-sdk'

const identities = new Map([
        ["john.doe", 
          {
              identity: 'john.doe',
              uuid: '1234',
              attributes: {
                  first: 'john',
                  last: 'doe',
                  email: 'john.doe@example.com',
              },
          }
        ],
        [
          "jane.doe",
          {
              identity: 'jane.doe',
              uuid: '1234',
              attributes: {
                  first: 'jane',
                  last: 'doe',
                  email: 'jane.doe@example.com',
              },
          }
        ]
    ]); 

function readConfig(): any {
  let config = process.env["CONNECTOR_CONFIG"]
  if (!config) {
    return {};
  }

  return JSON.parse(Buffer.from(config, 'base64').toString())
}

let cfg = readConfig()
console.log("configuration: ", cfg)

/**
 * Mock connector for integration testing
 */
export const connector = createConnector()
  .stdAccountRead((context, input, res) => {
    const acct = identities.get(input.identity);
    if (!acct) {
        throw new Error('unexpected identity')
    }
    res.send(acct)
  })
  .stdAccountList((context, input, res) => {
    console.log("Running account list")
    console.error("Example message sent to stderr")
    for (let value of identities.values()) {
      res.send(value)
    }
  })
  .stdTestConnection((context, input, res) => {
    res.send({})
  })
  .command('simple:sleep', async (context, input, res) => {
    await new Promise(resolve => setTimeout(resolve, input.sleepMs));
  })
  .command('simple:boom', async (context, input, res) => {
    throw new Error('boom')
  })
  .command('simple:echo', async (context, input, res) => {
    res.send({
      context,
      input
    })
  })
  .command('simple:echo-many', async (context, input, res) => {
    for (let n = 0;n < input.n;n++) {
      res.send({
				n: n,
				input: input,
			})
    }
  })
