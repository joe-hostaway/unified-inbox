interface RawAirbnbMessage {
  airbnbId: string;
  message: string;
  timestamp?: string;
  listingId: number;
}

interface RawBookingMessage {
  booking_id: number;
  text: string;
  time: Date | null;
  reservationId?: number;
}

interface RawVrboMessage {
  vrboId: string;
  content: string;
  receivedAt: number;
  reservationId: number;
}

export interface UnifiedMessage {
  id: string;
  source: 'airbnb' | 'booking' | 'vrbo';
  text: string;
  timestamp: Date;
  contextId: number;
}

/**
 * Maps raw messages to UnifiedMessage
 */
export function mapToUnified(raw: any): UnifiedMessage {
  // Airbnb
  if ((raw as RawAirbnbMessage).airbnbId !== undefined) {
    const m = raw as RawAirbnbMessage;
    const ts = m.timestamp ? new Date(m.timestamp) : new Date(0);
    if (isNaN(ts.getTime())) throw new Error(`Invalid Airbnb timestamp: ${m.timestamp}`);
    return {
      id: m.airbnbId,
      source: 'airbnb',
      text: m.message,
      timestamp: ts,
      contextId: m.listingId,
    };
  }

  // Booking.com
  if ((raw as RawBookingMessage).booking_id !== undefined) {
    const m = raw as RawBookingMessage;
    if (m.time === null) throw new Error(`Missing Booking.com time for id ${m.booking_id}`);
    if (m.reservationId === undefined) throw new Error(`Missing reservationId for Booking message ${m.booking_id}`);
    return {
      id: m.booking_id.toString(),
      source: 'booking',
      text: m.text,
      timestamp: m.time,
      contextId: m.reservationId,
    };
  }

  // Vrbo
  if ((raw as RawVrboMessage).vrboId !== undefined) {
    const m = raw as RawVrboMessage;
    return {
      id: m.vrboId,
      source: 'vrbo',
      text: m.content,
      timestamp: new Date(m.receivedAt),
      contextId: m.reservationId,
    };
  }

  throw new Error('Unknown message format');
}

/**
 * Core function: take any array of raw messages,
 * normalize them and sort by timestamp descending.
 */
export function getUnifiedInboxFromRaw(raws: any[]): UnifiedMessage[] {
  const unified = raws.map(mapToUnified);
  return unified.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
