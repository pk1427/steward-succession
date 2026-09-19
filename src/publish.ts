import 'dotenv/config'
import { Bee } from '@ethersphere/bee-js'
import { PrivateKey } from '@ethersphere/core-sdk'
import { readFile } from 'node:fs/promises'
import config from '../config/public-identities.json' with { type: 'json' }
const bee = new Bee(process.env.BEE_URL ?? 'http://localhost:1633')
const batchId = process.env.PAYER_BATCH_ID!
const successorMode = process.env.PUBLISHER_ROLE === 'successor'
const publisherKey = successorMode ? process.env.SUCCESSOR_PRIVATE_KEY! : process.env.PUBLISHER_PRIVATE_KEY!
if (!batchId || !publisherKey) throw new Error('PAYER_BATCH_ID and PUBLISHER_PRIVATE_KEY are required locally')
const expectedPublisher = successorMode ? config.namedSuccessor : config.currentPublisher
const publisherAddress = new PrivateKey(publisherKey).publicKey().address().toChecksum()
if (publisherAddress.toLowerCase() !== expectedPublisher.toLowerCase()) throw new Error(`Configured active publisher does not match the selected private signing identity (${publisherAddress}).`)
const cataloguePath = process.env.CATALOGUE_FILE ?? new URL('../catalogue.json', import.meta.url)
const catalogue = JSON.parse(await readFile(cataloguePath, 'utf8')) as { format: string; version: number; updatedAt?: string; holdings: unknown[] }
if (catalogue.format !== 'seven-libraries-catalogue' || catalogue.version !== 1 || !Array.isArray(catalogue.holdings)) throw new Error('Catalogue must use seven-libraries-catalogue format version 1 and include holdings.')
catalogue.updatedAt = new Date().toISOString()
const uploaded = await bee.data.upload(batchId, JSON.stringify(catalogue)) // payer's batch, not publisher key
const publisher = bee.feed.makeWriter(config.catalogueTopic, publisherKey)
let feedIndexNext: unknown
try { feedIndexNext = (await bee.feed.fetchLatestUpdate(config.catalogueTopic, expectedPublisher)).feedIndexNext } catch { console.info('No catalogue update yet; creating index 0.') }
const update = await publisher.uploadReference(batchId, uploaded.reference, feedIndexNext ? { index: feedIndexNext as never } : undefined)
console.log(JSON.stringify({ publisher: expectedPublisher, catalogueReference: uploaded.reference.toString(), feedUpdateReference: update.reference.toString(), holdings: catalogue.holdings.length }, null, 2))
