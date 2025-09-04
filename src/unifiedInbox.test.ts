import { getUnifiedInboxFromRaw } from "./unifiedInbox";

describe('Unified Inbox', () => {
  it('Should return messages ordered by time', () => {
    const startTimePlusSeconds = (seconds: number) => {
      return `2025-05-14T12:00:0${seconds}.000Z`;
    }

    const raw = [
      { airbnbId: 'msg1', message: 'How', timestamp: startTimePlusSeconds(1), listingId: 1 },
      { airbnbId: 'msg2', message: 'Are You?', timestamp: startTimePlusSeconds(2), listingId: 1 },
      { airbnbId: 'msg0', message: 'Hello', timestamp: startTimePlusSeconds(0), listingId: 1 }
    ];

    const result = getUnifiedInboxFromRaw(raw);

    expect(result[0].id).toBe('msg2');
    expect(result[1].id).toBe('msg1');
    expect(result[2].id).toBe('msg0');
  })
});

