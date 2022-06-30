# Court

- 7/9 multisig. Members are elected once a year, and they must enter an agreement (meta-agreement) with a significant $veNATION stake, which can be slashed by the DAO. If a member gets their lock slashed, they are kicked out of the multisig.
- Calls from the multisig need to have a delay, and in that delay $veNATION holders should be able to stop transactions from executing. This is in case the multisig goes rogue or the jury misbehaves.
- Challenge: Gnosis Safe doesn’t have a way to give permission to another entity to control the multisig’s signatories. Aragon would work great, but it’s expensive to vote (may be worth it though).
- Challenge: Gnosis Safe has a timelock, but it looks quite clunky/hacky. This, again, could be very easily implemented in Aragon with the [Delay app](https://github.com/1Hive/delay-app)
