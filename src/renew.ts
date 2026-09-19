import 'dotenv/config'
import { Bee } from '@ethersphere/bee-js'
const batchId = process.env.PAYER_BATCH_ID!
const bee = new Bee(process.env.BEE_URL ?? 'http://localhost:1633')
if (!batchId) throw new Error('PAYER_BATCH_ID required')
// Extend/top up the existing postage batch; this is deliberately reachable via npm run renew.
const additionalAmount = process.env.RENEW_AMOUNT ?? '414720000'
try {
  await bee.stamp.topUp(batchId, additionalAmount)
  console.log(`Extended existing storage batch ${batchId} with additional amount ${additionalAmount}`)
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  if (message.includes('out of funds') || message.includes('402')) {
    console.error(`Storage renewal was not applied: the Bee wallet has insufficient xBZZ for amount ${additionalAmount}. The existing batch remains unchanged; fund the node wallet before retrying.`)
  } else {
    console.error(`Storage renewal was not applied: ${message}`)
  }
  process.exitCode = 1
}
