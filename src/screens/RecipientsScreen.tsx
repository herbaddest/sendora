"use client";

import React, { useState } from "react";
import { HeaderBar } from "@/components/HeaderBar";
import { RecipientCard } from "@/components/RecipientCard";
import { Plus, Search, Trash2, Edit2, Phone, Smartphone, Building2, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Recipient } from "@/types";

export const RecipientsScreen: React.FC = () => {
  const { recipients, addRecipient, deleteRecipient, initiateSendFlow, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState<"M-Pesa" | "Airtel Money" | "Equity Bank" | "KCB Bank">("M-Pesa");

  const filteredRecipients = recipients.filter(
    (r) =>
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    await addRecipient({
      fullName,
      phone,
      country: "Kenya",
      deliveryMethod: provider.includes("Bank") ? "bank_transfer" : "mobile_money",
      provider,
      accountNumber: phone,
      isFavorite: true,
    });

    setFullName("");
    setPhone("");
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white pb-20">
      <HeaderBar title="Saved Recipients" />

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {/* Top Actions */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search recipients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center shrink-0 active:scale-95"
            title="Add Recipient"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Recipient Cards with Delete & Direct Transfer Actions */}
        <div className="space-y-3">
          {filteredRecipients.map((rec) => (
            <div key={rec.id} className="relative group">
              <RecipientCard recipient={rec} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Remove ${rec.fullName} from saved recipients?`)) {
                    deleteRecipient(rec.id);
                  }
                }}
                className="absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all opacity-80 group-hover:opacity-100"
                title="Delete Recipient"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Recipient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add New Recipient (Kenya 🇰🇪)</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Grace Akinyi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+254 733 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Delivery Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="M-Pesa">🟢 M-Pesa Mobile Money</option>
                  <option value="Airtel Money">🔴 Airtel Money</option>
                  <option value="Equity Bank">🏦 Equity Bank</option>
                  <option value="KCB Bank">🏦 KCB Bank</option>
                </select>
              </div>

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
                  Save Recipient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
