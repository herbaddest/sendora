"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Recipient, Transfer, ExchangeRate, Notification, TransferStatus } from "@/types";
import { INITIAL_USER, INITIAL_RECIPIENTS, INITIAL_TRANSFERS, INITIAL_RATES, INITIAL_NOTIFICATIONS } from "@/lib/seedData";

export type ScreenName =
  | "welcome"
  | "register"
  | "login"
  | "home"
  | "send_money"
  | "choose_recipient"
  | "review_transfer"
  | "processing"
  | "tracking"
  | "recipients"
  | "transfers"
  | "profile"
  | "docs";

export type BottomTab = "home" | "recipients" | "transfers" | "profile" | "docs";

export interface SendFlowDraft {
  recipientId: string;
  recipientName: string;
  phone: string;
  provider: string;
  accountNumber: string;
  deliveryMethod: string;
  sendAmount: number;
  sendCurrency: string;
  recipientCurrency: string;
  exchangeRate: number;
  fee: number;
  note: string;
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  recipients: Recipient[];
  transfers: Transfer[];
  rates: ExchangeRate[];
  notifications: Notification[];
  activeScreen: ScreenName;
  activeTab: BottomTab;
  selectedTransferId: string | null;
  sendFlowDraft: SendFlowDraft;
  isLoading: boolean;
  demoSettings: {
    customRate: number;
    instantDelivery: boolean;
  };
  
  // Navigation & Screen Control
  navigateTo: (screen: ScreenName, tab?: BottomTab) => void;
  setActiveTab: (tab: BottomTab) => void;
  setSelectedTransferId: (id: string | null) => void;
  
  // Auth
  login: (email: string) => Promise<boolean>;
  signup: (fullName: string, email: string, phone: string) => Promise<boolean>;
  logout: () => void;
  
  // Recipient Management
  addRecipient: (recipient: Omit<Recipient, "id" | "userId" | "createdAt">) => Promise<Recipient>;
  updateRecipient: (id: string, recipient: Partial<Recipient>) => Promise<void>;
  deleteRecipient: (id: string) => Promise<void>;
  
  // Transfer Management
  updateSendDraft: (patch: Partial<SendFlowDraft>) => void;
  initiateSendFlow: (recipient?: Recipient) => void;
  confirmAndSendTransfer: () => Promise<Transfer>;
  updateTransferStep: (transferId: string, step: number, status?: TransferStatus) => Promise<void>;
  
  // Rates
  updateRate: (toCurrency: string, rate: number) => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;
  resetAllDemoData: () => Promise<void>;
  getRateFor: (toCurrency: string) => number;
}

const DEFAULT_DRAFT: SendFlowDraft = {
  recipientId: "rec_mary_wanjiku",
  recipientName: "Mary Wanjiku",
  phone: "+254 712 345 234",
  provider: "M-Pesa",
  accountNumber: "•••• 234",
  deliveryMethod: "mobile_money",
  sendAmount: 100,
  sendCurrency: "USD",
  recipientCurrency: "KES",
  exchangeRate: 129.50,
  fee: 1.99,
  note: "",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);
  const [transfers, setTransfers] = useState<Transfer[]>(INITIAL_TRANSFERS);
  const [rates, setRates] = useState<ExchangeRate[]>(INITIAL_RATES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  
  const [activeScreen, setActiveScreen] = useState<ScreenName>("home");
  const [activeTab, setActiveTabState] = useState<BottomTab>("home");
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>("SD-2026-892104");
  const [sendFlowDraft, setSendFlowDraft] = useState<SendFlowDraft>(DEFAULT_DRAFT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [demoSettings, setDemoSettings] = useState({
    customRate: 129.50,
    instantDelivery: false,
  });

  // Load from API on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [resAuth, resRec, resTrans, resRates, resNotif] = await Promise.allSettled([
        fetch("/api/auth"),
        fetch("/api/recipients"),
        fetch("/api/transfers"),
        fetch("/api/rates"),
        fetch("/api/notifications"),
      ]);

      if (resAuth.status === "fulfilled" && resAuth.value.ok) {
        const data = await resAuth.value.json();
        if (data.user) setUser(data.user);
      }
      if (resRec.status === "fulfilled" && resRec.value.ok) {
        const data = await resRec.value.json();
        if (data.recipients?.length) setRecipients(data.recipients);
      }
      if (resTrans.status === "fulfilled" && resTrans.value.ok) {
        const data = await resTrans.value.json();
        if (data.transfers?.length) setTransfers(data.transfers);
      }
      if (resRates.status === "fulfilled" && resRates.value.ok) {
        const data = await resRates.value.json();
        if (data.rates?.length) setRates(data.rates);
      }
      if (resNotif.status === "fulfilled" && resNotif.value.ok) {
        const data = await resNotif.value.json();
        if (data.notifications?.length) setNotifications(data.notifications);
      }
    } catch (e) {
      console.warn("Failed fetching from server, using local defaults", e);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateTo = (screen: ScreenName, tab?: BottomTab) => {
    setActiveScreen(screen);
    if (tab) {
      setActiveTabState(tab);
    } else if (["home", "recipients", "transfers", "profile", "docs"].includes(screen)) {
      setActiveTabState(screen as BottomTab);
    }
  };

  const setActiveTab = (tab: BottomTab) => {
    setActiveTabState(tab);
    setActiveScreen(tab as ScreenName);
  };

  const getRateFor = (toCurrency: string) => {
    if (toCurrency === "KES" && demoSettings.customRate) {
      return demoSettings.customRate;
    }
    const found = rates.find((r) => r.toCurrency === toCurrency);
    return found ? found.rate : 129.50;
  };

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        navigateTo("home");
        return true;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
    // Fallback login
    setIsAuthenticated(true);
    setUser(INITIAL_USER);
    navigateTo("home");
    return true;
  };

  const signup = async (fullName: string, email: string, phone: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signup", fullName, email, phone }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        navigateTo("home");
        return true;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
    // Local fallback signup
    const newUser: User = {
      id: `usr_${Date.now()}`,
      fullName,
      email,
      phone,
      country: "United States",
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setIsAuthenticated(true);
    navigateTo("home");
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    navigateTo("welcome");
  };

  const addRecipient = async (recipientData: Omit<Recipient, "id" | "userId" | "createdAt">): Promise<Recipient> => {
    const newRec: Recipient = {
      ...recipientData,
      id: `rec_${Date.now()}`,
      userId: user?.id || "usr_john_doe_01",
      createdAt: new Date().toISOString(),
    };

    setRecipients((prev) => [newRec, ...prev]);

    try {
      await fetch("/api/recipients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRec),
      });
    } catch (e) {
      console.error(e);
    }

    return newRec;
  };

  const updateRecipient = async (id: string, patch: Partial<Recipient>) => {
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
    try {
      await fetch("/api/recipients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteRecipient = async (id: string) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
    try {
      await fetch(`/api/recipients?id=${id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
  };

  const updateSendDraft = (patch: Partial<SendFlowDraft>) => {
    setSendFlowDraft((prev) => {
      const next = { ...prev, ...patch };
      if (patch.sendAmount !== undefined || patch.recipientCurrency !== undefined) {
        const currentRate = getRateFor(next.recipientCurrency);
        next.exchangeRate = currentRate;
      }
      return next;
    });
  };

  const initiateSendFlow = (recipient?: Recipient) => {
    const targetRec = recipient || recipients[0] || INITIAL_RECIPIENTS[0];
    const currentRate = getRateFor("KES");

    setSendFlowDraft({
      recipientId: targetRec.id,
      recipientName: targetRec.fullName,
      phone: targetRec.phone,
      provider: targetRec.provider,
      accountNumber: targetRec.accountNumber,
      deliveryMethod: targetRec.deliveryMethod,
      sendAmount: 100,
      sendCurrency: "USD",
      recipientCurrency: "KES",
      exchangeRate: currentRate,
      fee: 1.99,
      note: "Family Transfer",
    });

    navigateTo("send_money");
  };

  const confirmAndSendTransfer = async (): Promise<Transfer> => {
    const currentRate = getRateFor(sendFlowDraft.recipientCurrency);
    const receiveAmount = Number((sendFlowDraft.sendAmount * currentRate).toFixed(2));
    const newId = `SD-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTransfer: Transfer = {
      id: newId,
      userId: user?.id || "usr_john_doe_01",
      recipientId: sendFlowDraft.recipientId,
      senderAmount: sendFlowDraft.sendAmount,
      senderCurrency: sendFlowDraft.sendCurrency,
      recipientAmount: receiveAmount,
      recipientCurrency: sendFlowDraft.recipientCurrency,
      fee: sendFlowDraft.fee,
      exchangeRate: currentRate,
      deliveryMethod: sendFlowDraft.deliveryMethod,
      provider: sendFlowDraft.provider,
      accountNumber: sendFlowDraft.accountNumber,
      recipientName: sendFlowDraft.recipientName,
      status: "processing",
      currentStep: 2, // Payment received, preparing sending
      note: sendFlowDraft.note,
      estimatedDelivery: "Instantly (~2 mins)",
      createdAt: new Date().toISOString(),
    };

    setTransfers((prev) => [newTransfer, ...prev]);
    setSelectedTransferId(newId);

    // Add immediate notification
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId: user?.id || "usr_john_doe_01",
      title: "Transfer Processing",
      message: `${receiveAmount.toLocaleString()} ${sendFlowDraft.recipientCurrency} is being sent to ${sendFlowDraft.recipientName}.`,
      type: "transfer",
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    try {
      await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransfer),
      });
    } catch (e) {
      console.error(e);
    }

    return newTransfer;
  };

  const updateTransferStep = async (transferId: string, step: number, status?: TransferStatus) => {
    const targetStatus = status || (step === 4 ? "delivered" : "processing");

    setTransfers((prev) =>
      prev.map((t) => {
        if (t.id === transferId) {
          return {
            ...t,
            currentStep: step,
            status: targetStatus,
            estimatedDelivery: step === 4 ? "Delivered" : t.estimatedDelivery,
          };
        }
        return t;
      })
    );

    try {
      await fetch("/api/transfers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: transferId, currentStep: step, status: targetStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const updateRate = async (toCurrency: string, rate: number) => {
    setDemoSettings((prev) => ({ ...prev, customRate: rate }));
    setRates((prev) =>
      prev.map((r) => (r.toCurrency === toCurrency ? { ...r, rate, updatedAt: new Date().toISOString() } : r))
    );

    try {
      await fetch("/api/rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toCurrency, rate }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const markNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const resetAllDemoData = async () => {
    setUser(INITIAL_USER);
    setRecipients(INITIAL_RECIPIENTS);
    setTransfers(INITIAL_TRANSFERS);
    setRates(INITIAL_RATES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setDemoSettings({ customRate: 129.50, instantDelivery: false });
    setSelectedTransferId("SD-2026-892104");

    try {
      await fetch("/api/demo/reset", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        recipients,
        transfers,
        rates,
        notifications,
        activeScreen,
        activeTab,
        selectedTransferId,
        sendFlowDraft,
        isLoading,
        demoSettings,
        navigateTo,
        setActiveTab,
        setSelectedTransferId,
        login,
        signup,
        logout,
        addRecipient,
        updateRecipient,
        deleteRecipient,
        updateSendDraft,
        initiateSendFlow,
        confirmAndSendTransfer,
        updateTransferStep,
        updateRate,
        markNotificationsAsRead,
        resetAllDemoData,
        getRateFor,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
