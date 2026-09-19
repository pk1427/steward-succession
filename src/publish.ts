import 'dotenv/config'
import { Bee } from '@ethersphere/bee-js'
import { PrivateKey } from '@ethersphere/core-sdk'
import config from '../config/public-identities.json' with { type: 'json' }
const bee = new Bee(process.env.BEE_URL ?? 'http://localhost:1633')
const batchId = process.env.PAYER_BATCH_ID!
const publisherKey = process.env.PUBLISHER_PRIVATE_KEY!
if (!batchId || !publisherKey) throw new Error('PAYER_BATCH_ID and PUBLISHER_PRIVATE_KEY are required locally')
const publisherAddress = new PrivateKey(publisherKey).publicKey().address().toChecksum()
if (publisherAddress.toLowerCase() !== config.currentPublisher.toLowerCase()) throw new Error(`Configured currentPublisher does not match PUBLISHER_PRIVATE_KEY's public identity (${publisherAddress}).`)
const catalogue = JSON.stringify({ format: 'seven-libraries-catalogue', version: 1, updatedAt: new Date().toISOString(), holdings: [] })
const uploaded = await bee.data.upload(batchId, catalogue) // payer's batch, not publisher key
const publisher = bee.feed.makeWriter(config.catalogueTopic, publisherKey)
await publisher.uploadReference(batchId, uploaded.reference)
console.log(`Published catalogue reference ${uploaded.reference}`)
