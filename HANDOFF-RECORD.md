# Completed hand-off record — 2026-09-20

Outgoing signing identity: `0xF67C795B80E2D1Dc864Cb24c800690E63fbC7176`.

Incoming signing identity: `0x2B8bff28f868FB662B48d8C3CfF5567CC84c1130`.

The council-held root authority `0xC42AdB802DF17a7CfC4367912aE0C9b44DbAF024` rotated the unchanged stable pointer topic `0x4a495a7be3122a74c7668fd27b2fbc0941467595fd21be2c432187fe64f9c6cb` to the incoming publisher. The verifiable root feed-update reference is:

`97ba1f82b5bb4a17cb08025cfab96a5a4a7242935f53d1280c39bf2e57c03772`

The immutable pointer payload reference is `a50abc206d23490f855091b114377ed3013aa0d81fb53c041eb4da941779137d`. Immediately afterward, `npm run resolve` returned the incoming identity as `activePublisher` and resolved catalogue reference `ff192f3a252a469811f121565b9dc0262fa47488d076e3a94d3615402bc05e9a`.

The distinct storage payer is the Bee node wallet `0xa3112455a919385ed2a0081de0ec87690cdbb67e`, which owns the configured postage batch. This confirms separated payment, publishing, and root-rotation authority roles; it does not claim separated custody of a batch hosted on one shared Bee node.
