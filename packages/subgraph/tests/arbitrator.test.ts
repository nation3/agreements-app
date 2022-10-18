import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, Address } from "@graphprotocol/graph-ts"
import { ResolutionAppealed } from "../generated/schema"
import { ResolutionAppealed as ResolutionAppealedEvent } from "../generated/Arbitrator/Arbitrator"
import { handleResolutionAppealed } from "../src/arbitrator"
import { createResolutionAppealedEvent } from "./arbitrator-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let hash = Bytes.fromI32(1234567890)
    let account = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newResolutionAppealedEvent = createResolutionAppealedEvent(
      hash,
      account
    )
    handleResolutionAppealed(newResolutionAppealedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ResolutionAppealed created and stored", () => {
    assert.entityCount("ResolutionAppealed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ResolutionAppealed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "hash",
      "1234567890"
    )
    assert.fieldEquals(
      "ResolutionAppealed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "account",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
