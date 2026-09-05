import PocketBase from 'pocketbase';

// For local development
const PB_URL = process.env.NEXT_PUBLIC_PB_URL || 'http://localhost:8090';

export const pb = new PocketBase(PB_URL);

// Auto-refresh auth
pb.autoCancellation(false);
