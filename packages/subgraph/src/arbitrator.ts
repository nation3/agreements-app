import {
    ResolutionAppealed as ResolutionAppealedEvent,
    ResolutionEndorsed as ResolutionEndorsedEvent,
    ResolutionExecuted as ResolutionExecutedEvent,
    ResolutionSubmitted as ResolutionSubmittedEvent,
} from "../generated/Arbitrator/Arbitrator"
import {
    Dispute,
    Resolution,
} from "../generated/schema"

export function handleResolutionAppealed(event: ResolutionAppealedEvent): void {
    let resolution = Resolution.load(event.params.hash.toHexString())
    if (resolution) {
        resolution.status = "Appealed"
        resolution.save();
    }
}

export function handleResolutionEndorsed(event: ResolutionEndorsedEvent): void {
    let resolution = Resolution.load(event.params.hash.toHexString())
    if (resolution) {
        resolution.status = "Endorsed";
        resolution.save();
    }
}

export function handleResolutionExecuted(event: ResolutionExecutedEvent): void {
    let resolution = Resolution.load(event.params.hash.toHexString())
    if (resolution) {
        resolution.status = "Executed";
        resolution.save();
    }
}

export function handleResolutionSubmitted(event: ResolutionSubmittedEvent): void {
    let dispute = Dispute.load(event.params.id.toHexString());
    let resolution = Resolution.load(event.params.hash.toHexString());

    if (dispute != null) {
        if (resolution == null) {
            resolution = new Resolution(event.params.hash.toHexString());
        }
        resolution.submittedAtBlock = event.block.number;
        resolution.status = "Submitted";
        resolution.dispute = dispute.id;
        resolution.save();

        dispute.resolution = resolution.id;
        dispute.save();
    }
}
