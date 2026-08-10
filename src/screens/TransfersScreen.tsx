"use client";

import React, { useState } from "react";
import { HeaderBar } from "@/components/HeaderBar";
import { TransferCard } from "@/components/TransferCard";
import { Search, Filter, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const TransfersScreen: React.FC = () => {
  const { transfers, setSelectedTransferId, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "processing" | "delivered">("all");

  const filteredTransfers = transfers.filter((t) => {
    const matchesSearch =
      t.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.provider.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || t.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white pb-20">
      <HeaderBar title="Transfers history" />

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {/* Search & Filter Controls */}
        <div className="space-y-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transfer ID or recipient name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                filterStatus === "all"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              All ({transfers.length})
            </button>

            <button
              onClick={() => setFilterStatus("processing")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                filterStatus === "processing"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Clock className="w-3 h-3 text-indigo-400" />
              Processing
            </button>

            <button
              onClick={() => setFilterStatus("delivered")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                filterStatus === "delivered"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Delivered
            </button>
          </div>
        </div>

        {/* Transfers List */}
        <div className="space-y-2.5">
          {filteredTransfers.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <ArrowUpRight className="w-10 h-10 mx-auto opacity-30 text-slate-500" />
              <p className="text-sm font-bold">No transfers found</p>
              <p className="text-xs text-slate-500">Try adjusting your search query or filter.</p>
            </div>
          ) : (
            filteredTransfers.map((transfer) => (
              <TransferCard key={transfer.id} transfer={transfer} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
