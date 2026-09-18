import 'dotenv/config'
import { Bee } from '@ethersphere/bee-js'
const batchId = process.env.PAYER_BATCH_ID!
const bee = new Bee(process.env.BEE_URL ?? 'http://localhost:1633')
if (!batchId) throw new Error('PAYER_BATCH_ID required')
// Extend/top up the existing postage batch; this is deliberately reachable via npm run renew.
const additionalAmount = process.env.RENEW_AMOUNT ?? '414720000'
await bee.stamp.topUp(batchId, additionalAmount)
console.log(`Extended existing storage batch ${batchId} with additional amount ${additionalAmount}`)
