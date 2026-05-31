// ============================================================================
// TmuxRef — shared tmux session/window reference for notification titles
// ============================================================================
//
// When PAI runs inside tmux, notifications are stamped with the originating
// session/window so concurrent panes are distinguishable at a glance. The ref
// is title-only — it is never spoken by TTS and is omitted entirely outside
// tmux, keeping notification payloads byte-identical to prior behavior.
//
// Single source of truth for both pai.ts (pai-notify) and algorithm.ts
// (phase-transition voiceNotify), which previously carried divergent copies.

import { spawnSync } from "bun";

/**
 * Returns the current tmux ref as `session:window-index:window-name`
 * (e.g. `_dotfiles:2:HOME`), or null when not inside tmux / on any error.
 */
export function getTmuxRef(): string | null {
  if (!process.env.TMUX) return null;
  try {
    const r = spawnSync(["tmux", "display-message", "-p", "#S:#I:#W"]);
    if (r.exitCode !== 0) return null;
    const ref = r.stdout.toString().trim();
    return ref.length > 0 && ref.length <= 64 ? ref : null;
  } catch {
    return null;
  }
}

/**
 * Returns the notification title to inject into a /notify payload, or
 * undefined when not inside tmux (caller should omit `title` entirely).
 */
export function tmuxNotificationTitle(): string | undefined {
  const ref = getTmuxRef();
  return ref ? `PAI Notification — tmux:${ref}` : undefined;
}
