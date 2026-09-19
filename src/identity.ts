import 'dotenv/config'
import { PrivateKey } from '@ethersphere/core-sdk'

const name = process.argv[2] as 'PUBLISHER_PRIVATE_KEY' | 'ROOT_AUTHORITY_PRIVATE_KEY' | undefined
if (!name || !['PUBLISHER_PRIVATE_KEY', 'ROOT_AUTHORITY_PRIVATE_KEY'].includes(name)) throw new Error('Usage: npm run identity -- PUBLISHER_PRIVATE_KEY|ROOT_AUTHORITY_PRIVATE_KEY')
const value = process.env[name]
if (!value) throw new Error(`${name} is absent from ignored .env`)
console.log(new PrivateKey(value).publicKey().address().toChecksum())
