import 'dotenv/config'
import { Bee } from '@ethersphere/bee-js'
import config from '../config/public-identities.json' with { type: 'json' }

type PublisherPointer = { format: 'catalogue-publisher-pointer'; version: number; publisher: string; topic: string }
const bee = new Bee(process.env.BEE_URL ?? 'http://localhost:1633')
// Public readers begin only with this stable council-controlled root feed.
const root = bee.feed.makeReader(config.stableCataloguePointer.topic, config.stableCataloguePointer.owner)
const rootUpdate = await root.downloadReference()
const pointer = JSON.parse((await bee.data.download(rootUpdate.reference)).toUtf8()) as PublisherPointer
if (pointer.format !== 'catalogue-publisher-pointer' || pointer.version !== 1) throw new Error('Unsupported publisher-pointer format')
const catalogueFeed = bee.feed.makeReader(pointer.topic, pointer.publisher)
const catalogueUpdate = await catalogueFeed.downloadReference()
const catalogue = JSON.parse((await bee.data.download(catalogueUpdate.reference)).toUtf8())
console.log(JSON.stringify({ stablePointer: config.stableCataloguePointer, activePublisher: pointer.publisher, catalogue }, null, 2))
