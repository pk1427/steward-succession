import 'dotenv/config'
import { Bee } from '@ethersphere/bee-js'
import { PrivateKey } from '@ethersphere/core-sdk'
import config from '../config/public-identities.json' with { type: 'json' }
const incomingPublisher = process.argv[2] // supplied externally; never hard-coded into succession logic
const incomingTopic = process.argv[3] ?? config.catalogueTopic
if (!incomingPublisher) throw new Error('Usage: npm run succeed -- <incoming-publisher-address> [topic]')
const batchId = process.env.PAYER_BATCH_ID!
const authorityKey = process.env.ROOT_AUTHORITY_PRIVATE_KEY!
if (!batchId || !authorityKey) throw new Error('Council authority key and treasury batch are required locally')
const authorityAddress = new PrivateKey(authorityKey).publicKey().address().toChecksum()
if (authorityAddress.toLowerCase() !== config.rootAuthority.toLowerCase()) throw new Error(`Configured rootAuthority does not match ROOT_AUTHORITY_PRIVATE_KEY's public identity (${authorityAddress}).`)
const bee = new Bee(process.env.BEE_URL ?? 'http://localhost:1633')
// Authority is the council/root key, separate from any current publisher identity.
const rootWriter = bee.feed.makeWriter(config.stableCataloguePointer.topic, authorityKey)
const pointer = await bee.data.upload(batchId, JSON.stringify({ format: 'catalogue-publisher-pointer', version: 1, publisher: incomingPublisher, topic: incomingTopic }))
await rootWriter.uploadReference(batchId, pointer.reference)
console.log(`Stable pointer rotated by root authority to ${incomingPublisher}`)
