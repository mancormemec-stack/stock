import type { ChatItem } from "./types";
import type { Key } from "@/i18n/dict";

/** Only explicitly authored demo answers can be simplified. */
export function getSimpleReplyKey(items: ChatItem[]): Key | undefined {
  const answer = [...items].reverse().find((item) => item.kind === "assistant");
  if (answer?.kind !== "assistant") return undefined;
  if (answer.textKey === "chat.4") return "chat.4.simple";
  if (answer.textKey === "conv.demoReply") return "conv.demoReply.simple";
  return undefined;
}
