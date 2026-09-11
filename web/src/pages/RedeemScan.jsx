import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Zap, Gift, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import {
    getLoyaltyRecord, redeemPoints, getTier,
    ptsToKES, REDEEM, verifyRedeemToken
} from '../utils/loyaltyUtils';

// ── Small barcode preview on the redeem page ──────────────────────────────────
function BarcodePreview({ value }) {
    const ref = useRef(null);
    useEffect(() => {
        if (!ref.current || !value) return;
        try {
            JsBarcode(ref.current, value, {
                format: 'CODE128', width: 2, height: 60,
                displayValue: true, font: 'monospace', fontSize: 10,
                background: '#1a0e08', lineColor: '#E67E22',
                textPosition: 'bottom', textMargin: 4, margin: 8,
            });
        } catch { /* silent */ }
    }, [value]);
    return (
        <div className="bg-[#1a0e08] rounded-xl border border-[#E67E22]/20 px-3 py-2 flex justify-center">
            <canvas ref={ref} style={{ maxWidth: '100%' }} />
        </div>
    );
}

/**
 * /redeem?user=USERNAME&pts=BALANCE&token=TOKEN
 *
 * Staff land here when they scan a customer's loyalty QR code.
 * They see the member's current balance and can apply a redemption.
 */
export default function RedeemScan() {
    const location = useLocation();
    const params   = new URLSearchParams(location.search);

    const username  = params.get('user')  || '';
    const qrPts     = parseInt(params.get('pts') || '0', 10);
    const token     = params.get('token') || '';

    const [loyalty,   setLoyalty]   = useState(null);
    const [redeemAmt, setRedeemAmt] = useState(100);
    const [result,    setResult]    = useState(null); // { ok, text, kesDiscount }
    const [valid,     setValid]     = useState(false);

    useEffect(() => {
        if (!username) return;
        // Verify the token
        const ok = verifyRedeemToken(username, qrPts, token);
        setValid(ok);
        if (ok) {
            const rec = getLoyaltyRecord(username);
            setLoyalty(rec);
            setRedeemAmt(Math.min(REDEEM.MAX_PTS_PER_ORDER, rec.balance));
        }
    }, [username]);

    if (!username) {
        return <ErrorScreen msg="No member data in this barcode. Please ask the customer to show their loyalty barcode from their Profile." />;
    }

    if (!valid) {
        return <ErrorScreen msg="This barcode is invalid or expired. Ask the customer to open their Profile → Points tab and show the fresh barcode." />;
    }

    if (!loyalty) return null;

    const tier = getTier(loyalty.lifetime);

    const handleRedeem = () => {
        const res = redeemPoints(username, redeemAmt);
        if (res.ok) {
            setLoyalty(res.updated);
            setResult({ ok: true, text: `✓ Redeemed ${redeemAmt} pts`, kesDiscount: res.kesDiscount });
        } else {
            setResult({ ok: false, text: res.reason });
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0A07] font-body flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-[#E67E22] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_#E67E2240]">
                        <Zap className="w-7 h-7 text-white fill-white" />
                    </div>
                    <h1 className="text-2xl font-display font-black text-white">Loyalty Redemption</h1>
                    <p className="text-white/30 text-xs mt-1 italic">Deliciously Earned — Kolay Restaurant</p>
                </div>

                {/* Member card */}
                <div className={`rounded-2xl p-5 border mb-5 ${tier.bg} ${tier.border}`}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#E67E22] rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0">
                            {username[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-black text-base">{username}</p>
                            <p className={`text-sm font-black ${tier.text}`}>{tier.icon} {tier.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[#E67E22] font-black text-2xl">{loyalty.balance.toLocaleString()}</p>
                            <p className="text-white/30 text-[10px] font-bold">points</p>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-xs">
                        <span className="text-white/30 font-semibold">Worth</span>
                        <span className="text-green-400 font-black">KES {ptsToKES(loyalty.balance).toLocaleString()}</span>
                    </div>
                    {/* Barcode */}
                    <div className="mt-4">
                        <BarcodePreview value={`KOLAY-${username.toUpperCase().replace(/[^A-Z0-9]/g,'')}-${String(loyalty.balance).padStart(6,'0')}`} />
                    </div>
                </div>

                {/* Redemption result */}
                {result ? (
                    <div className={`rounded-2xl p-6 mb-5 text-center border ${result.ok ? 'bg-green-500/10 border-green-500/25' : 'bg-red-500/10 border-red-500/25'}`}>
                        {result.ok ? (
                            <>
                                <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
                                <p className="text-green-300 font-black text-lg">{result.text}</p>
                                <p className="text-white/50 text-sm mt-1">
                                    Apply <strong className="text-green-400">KES {result.kesDiscount}</strong> discount to the customer's bill.
                                </p>
                                <div className="mt-4 bg-white/5 rounded-xl p-3">
                                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Remaining balance</p>
                                    <p className="text-[#E67E22] font-black text-xl">{loyalty.balance.toLocaleString()} pts</p>
                                    <p className="text-white/30 text-xs">= KES {ptsToKES(loyalty.balance)} still redeemable</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                                <p className="text-red-300 font-black">{result.text}</p>
                            </>
                        )}
                        <Link to="/dashboard"
                            className="mt-5 inline-flex items-center gap-2 bg-white/8 border border-white/15 text-white/60 hover:text-white font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all">
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                        </Link>
                    </div>
                ) : (
                    /* Redeem form */
                    <div className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-5">
                        <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-4 flex items-center gap-2">
                            <Gift className="w-4 h-4 text-[#E67E22]" /> Apply Redemption
                        </p>
                        <p className="text-white/40 text-xs mb-4">
                            100 pts = KES 50 · Max per transaction: {REDEEM.MAX_PTS_PER_ORDER} pts (KES {ptsToKES(REDEEM.MAX_PTS_PER_ORDER)})
                        </p>

                        {loyalty.balance < REDEEM.MIN_PTS ? (
                            <div className="bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-center">
                                <p className="text-white/30 text-sm font-semibold">Not enough points to redeem.</p>
                                <p className="text-white/20 text-xs mt-1">Minimum {REDEEM.MIN_PTS} pts required.</p>
                            </div>
                        ) : (
                            <>
                                {/* Preset amounts */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {[100, 200, 500].map(p => (
                                        <button key={p}
                                            onClick={() => setRedeemAmt(Math.min(p, loyalty.balance))}
                                            disabled={loyalty.balance < p}
                                            className={`py-2.5 rounded-xl text-xs font-black border transition-all ${redeemAmt === Math.min(p, loyalty.balance) && redeemAmt === p
                                                ? 'bg-[#E67E22] border-[#E67E22] text-white'
                                                : 'bg-white/5 border-white/10 text-white/50 hover:text-white disabled:opacity-30'}`}>
                                            {p} pts<br />
                                            <span className="text-[9px] font-semibold">KES {ptsToKES(p)}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mb-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                                    <span className="text-white/40 text-xs font-semibold">Selected</span>
                                    <span className="text-[#E67E22] font-black">{redeemAmt} pts = KES {ptsToKES(redeemAmt)}</span>
                                </div>

                                <button onClick={handleRedeem}
                                    className="w-full bg-[#E67E22] hover:bg-[#cf6d17] text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2">
                                    <Gift className="w-4 h-4" /> Confirm Redemption
                                </button>
                            </>
                        )}
                    </div>
                )}

                <p className="text-center text-white/15 text-[10px]">
                    Staff portal · Kolay Restaurant · Do not share this URL
                </p>
            </div>
        </div>
    );
}

function ErrorScreen({ msg }) {
    return (
        <div className="min-h-screen bg-[#0D0A07] font-body flex items-center justify-center px-4">
            <div className="text-center max-w-sm">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-white font-black text-xl mb-2">Invalid Barcode</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-6">{msg}</p>
                <Link to="/" className="inline-flex items-center gap-2 bg-white/8 border border-white/15 text-white font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all">
                    <ArrowLeft className="w-3.5 h-3.5" /> Go Home
                </Link>
            </div>
        </div>
    );
}
