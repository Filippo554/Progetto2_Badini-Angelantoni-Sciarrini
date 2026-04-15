export const WS_EVENTS = {
  // Prenotazioni
  PRENOTAZIONE_CREATED: "prenotazione:created",
  PRENOTAZIONE_UPDATED: "prenotazione:updated",
  PRENOTAZIONE_DELETED: "prenotazione:deleted",

  // Aula
  AULA_CREATED: "aula:created",
  AULA_UPDATED: "aula:updated",
  AULA_DELETED: "aula:deleted",

  // Classe
  CLASSE_CREATED: "classe:created",
  CLASSE_UPDATED: "classe:updated",
  CLASSE_DELETED: "classe:deleted",

  // Utente (admin actions)
  UTENTE_UPDATED: "utente:updated",
  UTENTE_DISABLED: "utente:disabled",
  UTENTE_CREATED: "utente:created",

  // Sistema
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  ERROR: "error",
} as const;

export type WSEvent = typeof WS_EVENTS[keyof typeof WS_EVENTS];