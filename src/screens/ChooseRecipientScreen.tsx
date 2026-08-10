"use client";

import React, { useState } from "react";
import { HeaderBar } from "@/components/HeaderBar";
import { Search, Plus, UserPlus, Check, X, Phone, Smartphone, Building2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Recipient } from "@/types";

export const ChooseRecipientScreen: React.FC = () => {
  const { recipients, addRecipient, updateSendDraft, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Recipient Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [provider, setProvider] = useState<"M-Pesa" | "Airtel Money" | "Equity Bank" | "KCB Bank">("M-Pesa");
  const [deliveryMethod, setDeliveryMethod] = useState<"mobile_money" | "bank_transfer">("mobile_money");

  const filteredRecipients = recipients.filter(
    (r) =>
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectRecipient = (rec: Recipient) => {
    updateSendDraft({
      recipientId: rec.id,
      recipientName: rec.fullName,
      phone: rec.phone,
      provider: rec.provider,
      accountNumber: rec.accountNumber,
      deliveryMethod: rec.deliveryMethod,
    });
    navigateTo("send_money");
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isBank = deliveryMethod === "bank_transfer";

    // For mobile money, phone is required. For bank, account number is required.
    if (!fullName.trim()) return;
    if (isBank && !accountNumber.trim()) return;
    if (!isBank && !phone.trim()) return;

    const recipientPhone = isBank ? (phone.trim() || accountNumber) : phone;
    const recipientAccount = isBank ? accountNumber : phone;

    const newRec = await addRecipient({
      fullName,
      phone: recipientPhone,
      country: "Kenya",
      deliveryMethod,
      provider,
      accountNumber: recipientAccount,
      isFavorite: true,
    });

    handleSelectRecipient(newRec);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white pb-20">
      <HeaderBar title="Choose recipient" showBack onBack={() => navigateTo("send_money")} />

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, phone or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Add New Recipient CTA Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full p-4 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-dashed border-indigo-500/40 text-indigo-300 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <Plus className="w-5 h-5 text-indigo-400" />
          <span>+ Add New Recipient</span>
        </button>

        {/* Saved Recipients List */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Recipients</h3>
          {filteredRecipients.map((rec) => (
            <div
              key={rec.id}
              onClick={() => handleSelectRecipient(rec)}
              className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 cursor-pointer flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                  {rec.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300">{rec.fullName}</h4>
                  <p className="text-xs text-slate-400">{rec.provider} • {rec.deliveryMethod === "bank_transfer" ? rec.accountNumber : rec.phone}</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                Select
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Recipient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add New Recipient in Kenya 🇰🇪</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mary Wanjiku"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Provider</label>
                <select
                  value={provider}
                  onChange={(e) => {
                    const p = e.target.value as any;
                    setProvider(p);
                    const isBank = p.includes("Bank");
                    setDeliveryMethod(isBank ? "bank_transfer" : "mobile_money");
                    // Clear the input when switching between bank and mobile money
                    setPhone("");
                    setAccountNumber("");
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="M-Pesa">🟢 M-Pesa Mobile Money</option>
                  <option value="Airtel Money">🔴 Airtel Money</option>
                  <option value="Equity Bank">🏦 Equity Bank Kenya</option>
                  <option value="KCB Bank">🏦 KCB Bank Kenya</option>
                </select>
              </div>

              {/* Show phone number for mobile money, account number for banks */}
              {deliveryMethod === "mobile_money" ? (
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+254 712 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    The M-Pesa or Airtel Money registered phone number
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Account Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 0110293847501"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                      required
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      The bank account number for {provider}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Phone Number (optional)</label>
                    <input
                      type="tel"
                      placeholder="+254 700 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      For SMS notification of the transfer
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
