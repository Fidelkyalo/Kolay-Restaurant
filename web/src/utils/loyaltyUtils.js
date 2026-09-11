/**
 * Kolay Restaurant – Loyalty Points Utility
 * Slogan: "Deliciously Earned"
 *
 * Earning rules:
 *   - Sign-up bonus       : 100 pts
 *   - Every order         : 1 pt per KES 10 spent  (= 10 pts / KES 100)
 *   - Reservation made    : 50 pts
 *   - Leaving a review    : 30 pts
 *   - Birthday bonus      : 200 pts (once per year)
 *
 * Redeeming rules:
 *   - 100 pts  = KES 50 discount
 *   - Min redeem: 100 pts
 *   - Max redeem per order: 500 pts (KES 250)
 *
 * Tiers (based on lifetime points earned):
 *   0–499    → New Member   (bronze)
 *   500–1499 → Silver
 *   1500–2999→ Gold
 *   3000+    → VIP Platinum
 */

export const EARN_RATES = {
    ORDER_PER_KES: 10,      // 1 pt per KES 10
    SIGNUP_BONUS: 100,
    RESERVATION: 50,
    REVIEW: 30,
    BIRTHDAY: 200,
};

export const REDEEM = {
    PTS_PER_KES: 2,         // 100 pts = KES 50  →  1 pt = KES 0.50  →  2 pts = KES 1
    MIN_PTS: 100,
    MAX_PTS_PER_ORDER: 500,
};

export const TIERS = [
    { name: 'New Member',   min: 0,    max: 499,   color: '#CD7F32', bg: 'bg-amber-800/20',   border: 'border-amber-700/30',  text: 'text-amber-400',   icon: '🥉' },
    { name: 'Silver',       min: 500,  max: 1499,  color: '#C0C0C0', bg: 'bg-slate-500/20',   border: 'border-slate-400/30',  text: 'text-slate-300',   icon: '🥈' },
    { name: 'Gold Member',  min: 1500, max: 2999,  color: '#FFD700', bg: 'bg-yellow-500/20',  border: 'border-yellow-400/30', text: 'text-yellow-300',  icon: '🥇' },
    { name: 'VIP Platinum', min: 3000, max: Infinity, color: '#E5E4E2', bg: 'bg-purple-500/20', border: 'border-purple-400/30', text: 'text-purple-300', icon: '💎' },
];

export function getTier(lifetimePoints) {
    return TIERS.find(t => lifetimePoints >= t.min && lifetimePoints <= t.max) || TIERS[0];
}

export function ptsForOrder(amountKES) {
    return Math.floor(amountKES / EARN_RATES.ORDER_PER_KES);
}

export function ptsToKES(pts) {
    return Math.floor(pts / REDEEM.PTS_PER_KES);
}

export function canRedeem(pts) {
    return pts >= REDEEM.MIN_PTS;
}

// ── localStorage helpers ────────────────────────────────────────────────────

const LS_KEY = 'kolay_loyalty';   // { [username]: { balance, lifetime, history[] } }

export function getLoyaltyRecord(username) {
    try {
        const all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
        return all[username.toLowerCase()] || { balance: 0, lifetime: 0, history: [] };
    } catch { return { balance: 0, lifetime: 0, history: [] }; }
}

export function saveLoyaltyRecord(username, record) {
    try {
        const all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
        all[username.toLowerCase()] = record;
        localStorage.setItem(LS_KEY, JSON.stringify(all));
        window.dispatchEvent(new Event('storage'));
    } catch { /* silent */ }
}

/**
 * Award points to a user and record the reason.
 * Returns the updated record.
 */
export function awardPoints(username, pts, reason, orderId = null) {
    if (!username || pts <= 0) return null;
    const rec = getLoyaltyRecord(username);
    const updated = {
        balance:  rec.balance  + pts,
        lifetime: rec.lifetime + pts,
        history:  [
            {
                id: `EVT-${Date.now()}`,
                type: 'earn',
                pts,
                reason,
                orderId,
                date: new Date().toISOString(),
            },
            ...rec.history,
        ].slice(0, 100), // keep last 100 events
    };
    saveLoyaltyRecord(username, updated);

    // Also sync into kolay_members so admin panel sees it
    syncMemberPoints(username, updated.balance, updated.lifetime);

    return updated;
}

/**
 * Redeem points (deduct from balance).
 * Returns { ok, updated, kesDiscount } or { ok: false, reason }
 */
export function redeemPoints(username, ptsRequested) {
    const pts = Math.min(ptsRequested, REDEEM.MAX_PTS_PER_ORDER);
    if (pts < REDEEM.MIN_PTS) return { ok: false, reason: `Minimum ${REDEEM.MIN_PTS} pts to redeem.` };
    const rec = getLoyaltyRecord(username);
    if (rec.balance < pts) return { ok: false, reason: 'Insufficient points balance.' };

    const kesDiscount = ptsToKES(pts);
    const updated = {
        balance:  rec.balance - pts,
        lifetime: rec.lifetime, // lifetime never decreases
        history:  [
            {
                id: `EVT-${Date.now()}`,
                type: 'redeem',
                pts: -pts,
                reason: `Redeemed for KES ${kesDiscount} discount`,
                date: new Date().toISOString(),
            },
            ...rec.history,
        ].slice(0, 100),
    };
    saveLoyaltyRecord(username, updated);
    syncMemberPoints(username, updated.balance, updated.lifetime);
    return { ok: true, updated, kesDiscount };
}

function syncMemberPoints(username, balance, lifetime) {
    try {
        const members = JSON.parse(localStorage.getItem('kolay_members') || '[]');
        const idx = members.findIndex(m => m.username?.toLowerCase() === username.toLowerCase());
        if (idx !== -1) {
            members[idx].rewardPoints = balance;
            members[idx].loyaltyLevel = getTier(lifetime).name;
            localStorage.setItem('kolay_members', JSON.stringify(members));
        }
    } catch { /* silent */ }
}

/** Generate QR payload string for a member's loyalty card */
export function loyaltyQRPayload(username, balance, tier) {
    return JSON.stringify({
        app: 'Kolay Restaurant',
        member: username,
        points: balance,
        tier: tier.name,
        slogan: 'Deliciously Earned',
        ts: Date.now(),
    });
}

/** Get all members' loyalty data (for admin view) */
export function getAllLoyalty() {
    try {
        const all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
        return Object.entries(all).map(([username, rec]) => ({
            username,
            ...rec,
            tier: getTier(rec.lifetime),
        }));
    } catch { return []; }
}
