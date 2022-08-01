import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import { Agreement } from "../generated/schema"
import { AgreementCreated } from "../generated/AgreementFramework/AgreementFramework"
import { handleAgreementCreated } from "../src/agreement-framework"
import { createAgreementCreatedEvent } from "./agreement-framework-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let id = BigInt.fromI32(234)
    let termsHash = Bytes.fromI32(1234567890)
    let criteria = BigInt.fromI32(234)
    let newAgreementCreatedEvent = createAgreementCreatedEvent(
      id,
      termsHash,
      criteria
    )
    handleAgreementCreated(newAgreementCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Agreement created and stored", () => {
    assert.entityCount("Agreement", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Agreement",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
      "termsHash",
      "1234567890"
    )
    assert.fieldEquals(
      "Agreement",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
      "criteria",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
