"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useVoiceRoom } from "@/hooks/use-voice-room";
import { cn } from "@/lib/utils";
import { Headphones, Loader2, Mic, MicOff, PhoneOff, Radio } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

type VoiceRoomProps = {
  channelId: string;
  serverId: string;
};

export const VoiceRoom = ({ channelId, serverId }: VoiceRoomProps) => {
  const t = useTranslations("channel");
  const {
    errorKey,
    isConnecting,
    isDeafened,
    isJoined,
    isMuted,
    joinRoom,
    leaveRoom,
    participants,
    toggleDeafen,
    toggleMute,
  } = useVoiceRoom({ channelId, serverId });

  return (
    <div className="flex flex-1 flex-col px-4 pb-4">
      <div className="rounded-3xl border border-white/10 bg-card/70 p-5 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-zinc-400">
              <Radio className="size-4" />
              {t("voice.live")}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {t("voice.participants", { count: participants.length })}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
              {t("voice.ready")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isJoined ? (
              <Button
                type="button"
                onClick={() => void joinRoom()}
                disabled={isConnecting}
                className="min-w-32"
              >
                {isConnecting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                {isConnecting ? t("voice.connecting") : t("voice.join")}
              </Button>
            ) : (
              <>
                <Button type="button" variant="secondary" onClick={toggleMute}>
                  {isMuted ? <MicOff className="mr-2 size-4" /> : <Mic className="mr-2 size-4" />}
                  {isMuted ? t("voice.unmute") : t("voice.mute")}
                </Button>
                <Button type="button" variant="secondary" onClick={toggleDeafen}>
                  <Headphones className="mr-2 size-4" />
                  {isDeafened ? t("voice.undeafen") : t("voice.deafen")}
                </Button>
                <Button type="button" variant="destructive" onClick={() => void leaveRoom()}>
                  <PhoneOff className="mr-2 size-4" />
                  {t("voice.leave")}
                </Button>
              </>
            )}
          </div>
        </div>

        {errorKey ? <p className="mt-4 text-sm text-rose-400">{t(errorKey)}</p> : null}
      </div>

      <div className="mt-4 grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {participants.length === 0 ? (
          <div className="grid min-h-52 place-items-center rounded-3xl border border-dashed border-white/10 bg-zinc-900/30 px-6 text-center text-sm text-zinc-500">
            {t("voice.empty")}
          </div>
        ) : (
          participants.map((participant) => (
            <VoiceParticipantCard
              key={participant.socketId}
              isDeafened={isDeafened}
              participant={participant}
            />
          ))
        )}
      </div>
    </div>
  );
};

type VoiceParticipantCardProps = {
  isDeafened: boolean;
  participant: ReturnType<typeof useVoiceRoom>["participants"][number];
};

const VoiceParticipantCard = ({
  isDeafened,
  participant,
}: VoiceParticipantCardProps) => {
  const t = useTranslations("channel");

  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-zinc-900/40 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
        participant.isLocal && "border-emerald-500/30 bg-emerald-500/5",
      )}
    >
      <div className="flex items-center gap-4">
        <div>
          <Avatar className="size-14 border border-white/10">
            <AvatarFallback>{participant.name[0]?.toUpperCase() ?? "?"}</AvatarFallback>
            <AvatarImage src={participant.avatar ?? undefined} />
          </Avatar>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-white">{participant.name}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-400">
            <span className="rounded-full bg-white/5 px-2.5 py-1">
              {participant.isLocal ? t("voice.you") : t("voice.connected")}
            </span>
            <span className="rounded-full bg-white/5 px-2.5 py-1">
              {participant.muted ? t("voice.mic-off") : t("voice.mic-on")}
            </span>
            {participant.isLocal && isDeafened ? (
              <span className="rounded-full bg-white/5 px-2.5 py-1">{t("voice.deafened")}</span>
            ) : null}
          </div>
        </div>
      </div>
      {!participant.isLocal && participant.stream ? (
        <ParticipantAudio stream={participant.stream} muted={isDeafened} />
      ) : null}
    </div>
  );
};

type ParticipantAudioProps = {
  muted: boolean;
  stream: MediaStream;
};

const ParticipantAudio = ({ muted, stream }: ParticipantAudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.srcObject = stream;
    audioRef.current.muted = muted;
  }, [muted, stream]);

  return <audio autoPlay playsInline ref={audioRef} />;
};