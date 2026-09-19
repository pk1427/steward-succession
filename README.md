# Catalogue that survives a steward

Readers start from the stable root feed owner/topic in `config/public-identities.json`; `npm run resolve` follows it to the currently active publisher feed and catalogue. Rotating publisher identities therefore does not change the public reader address.

`PAYER_BATCH_ID` is the treasury's funded storage identity and `PUBLISHER_PRIVATE_KEY` signs catalogue revisions. They are separate configuration inputs. `npm run renew` tops up the existing batch. `npm run succeed -- <incoming-address>` accepts the successor externally and requires the separately-held root-authority key.

See the agreement and hand-off record template for the human process, its actual limitations, and continuity trigger. Complete the evidence only after performing the real council-authorized rotation.
