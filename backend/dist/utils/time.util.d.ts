import { Request } from 'express';
export declare const getCurrentTime: (req: Request) => Date;
export declare const isExpired: (expiresAt: Date | null, currentTime: Date) => boolean;
export declare const calculateExpiryDate: (ttlSeconds: number) => Date;
//# sourceMappingURL=time.util.d.ts.map