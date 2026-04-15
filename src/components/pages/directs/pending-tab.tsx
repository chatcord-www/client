"use client";

import { IncomingRequestItem, OutgoingRequestItem } from "./types";
import { IncomingRequestsTab } from "./incoming-requests-tab";
import { OutgoingRequestsTab } from "./outgoing-requests-tab";

type PendingTabProps = {
	incoming: IncomingRequestItem[];
	outgoing: OutgoingRequestItem[];
	isBusy: boolean;
	onAccept: (requesterId: string) => void;
	onDecline: (requesterId: string) => void;
	onCancel: (targetUserId: string) => void;
};

export const PendingTab = ({
	incoming,
	outgoing,
	isBusy,
	onAccept,
	onDecline,
	onCancel,
}: PendingTabProps) => {
	const hasIncoming = incoming.length > 0;
	const hasOutgoing = outgoing.length > 0;

	if (!hasIncoming && !hasOutgoing) {
		return (
			<div className="rounded-lg border border-white/10 bg-[#11131a] p-8 text-center text-sm text-zinc-500">
				No pending requests.
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{hasIncoming && (
				<div>
					<div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
						Received - {incoming.length}
					</div>
					<IncomingRequestsTab
						items={incoming}
						isBusy={isBusy}
						onAccept={onAccept}
						onDecline={onDecline}
					/>
				</div>
			)}

			{hasOutgoing && (
				<div>
					<div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
						Sent - {outgoing.length}
					</div>
					<OutgoingRequestsTab
						items={outgoing}
						isBusy={isBusy}
						onCancel={onCancel}
					/>
				</div>
			)}
		</div>
	);
};
