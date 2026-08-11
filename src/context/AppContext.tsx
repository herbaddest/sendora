"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  User,
  Recipient,
  Transfer,
  ExchangeRate,
  Notification,
} from "@/types";
import { calculateTransferFee } from "@/lib/feeCalculator";

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
  | "docs"
  | "top_up";

export type BottomTab =
  | "home"
  | "recipients"
  | "transfers"
  | "profile"
  | "docs";

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
  walletBalance: number;
  demoSettings: {
    customRate: number;
    instantDelivery: boolean;
  };

  navigateTo: (screen: ScreenName, tab?: BottomTab) => void;
  setActiveTab: (tab: BottomTab) => void;
  setSelectedTransferId: (id: string | null) => void;

  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    fullName: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;

  addRecipient: (
    recipient: Omit<Recipient, "id" | "userId" | "createdAt">
  ) => Promise<Recipient>;
  updateRecipient: (
    id: string,
    recipient: Partial<Recipient>
  ) => Promise<void>;
  deleteRecipient: (id: string) => Promise<void>;

  updateSendDraft: (patch: Partial<SendFlowDraft>) => void;
  initiateSendFlow: (recipient?: Recipient) => void;
  confirmAndSendTransfer: () => Promise<Transfer>;
  updateTransferStep: (
    transferId: string,
    step: number,
    status?: string
  ) => Promise<void>;

  updateRate: (toCurrency: string, rate: number) => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;
  resetAllDemoData: () => Promise<void>;
  getRateFor: (toCurrency: string) => number;

  topUpWallet: (
    amount: number,
    method?: string,
    cardLast4?: string
  ) => Promise<void>;
}

const DEFAULT_DRAFT: SendFlowDraft = {
  recipientId: "",
  recipientName: "",
  phone: "",
  provider: "M-Pesa",
  accountNumber: "",
  deliveryMethod: "mobile_money",
  sendAmount: 100,
  sendCurrency: "USD",
  recipientCurrency: "KES",
  exchangeRate: 129.5,
  fee: calculateTransferFee(100),
  note: "",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [activeScreen, setActiveScreen] =
    useState<ScreenName>("welcome");
  const [activeTab, setActiveTabState] =
    useState<BottomTab>("home");
  const [selectedTransferId, setSelectedTransferId] =
    useState<string | null>(null);

  const [sendFlowDraft, setSendFlowDraft] =
    useState<SendFlowDraft>(DEFAULT_DRAFT);

  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const [demoSettings, setDemoSettings] = useState({
    customRate: 129.5,
    instantDelivery: false,
  });

  /*
   * Load everything belonging to the current account.
   * PostgreSQL is the source of truth.
   */
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const [
        resRec,
        resTrans,
        resRates,
        resNotif,
        resWallet,
      ] = await Promise.all([
        fetch(`/api/recipients?userId=${encodeURIComponent(userId)}`),
        fetch(`/api/transfers?userId=${encodeURIComponent(userId)}`),
        fetch("/api/rates"),
        fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`),
        fetch(`/api/wallet?userId=${encodeURIComponent(userId)}`),
      ]);

      if (!resRec.ok) {
        throw new Error("Failed to load recipients");
      }

      if (!resTrans.ok) {
        throw new Error("Failed to load transfers");
      }

      if (!resRates.ok) {
        throw new Error("Failed to load exchange rates");
      }

      if (!resNotif.ok) {
        throw new Error("Failed to load notifications");
      }

      if (!resWallet.ok) {
        throw new Error("Failed to load wallet");
      }

      const [
        recipientsData,
        transfersData,
        ratesData,
        notificationsData,
        walletData,
      ] = await Promise.all([
        resRec.json(),
        resTrans.json(),
        resRates.json(),
        resNotif.json(),
        resWallet.json(),
      ]);

      setRecipients(recipientsData.recipients ?? []);
      setTransfers(transfersData.transfers ?? []);
      setRates(ratesData.rates ?? []);
      setNotifications(notificationsData.notifications ?? []);

      if (walletData.wallet) {
        setWalletBalance(Number(walletData.wallet.balance));
      }
    } catch (error) {
      console.error("Failed to load account data:", error);
      throw error;
    }
  }, []);

  const refreshUserData = useCallback(async () => {
    if (!user?.id) return;

    await fetchUserData(user.id);
  }, [user?.id, fetchUserData]);

  const navigateTo = (
    screen: ScreenName,
    tab?: BottomTab
  ) => {
    setActiveScreen(screen);

    if (tab) {
      setActiveTabState(tab);
    } else if (
      ["home", "recipients", "transfers", "profile", "docs"].includes(
        screen
      )
    ) {
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

    const found = rates.find(
      (r) => r.toCurrency === toCurrency
    );

    return found ? found.rate : 129.5;
  };

  /*
   * LOGIN
   *
   * The account itself is stored in PostgreSQL.
   * After login we immediately reload all associated data.
   */
  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.user) {
        return false;
      }

      setUser(data.user);
      setIsAuthenticated(true);

      if (data.wallet) {
        setWalletBalance(Number(data.wallet.balance));
      }

      await fetchUserData(data.user.id);

      navigateTo("home");

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * SIGNUP
   */
  const signup = async (
    fullName: string,
    email: string,
    phone: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "signup",
          fullName,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.user) {
        return false;
      }

      setUser(data.user);
      setIsAuthenticated(true);

      setRecipients([]);
      setTransfers([]);
      setNotifications([]);

      if (data.wallet) {
        setWalletBalance(Number(data.wallet.balance));
      } else {
        setWalletBalance(0);
      }

      await fetchUserData(data.user.id);

      navigateTo("home");

      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setWalletBalance(0);
    setRecipients([]);
    setTransfers([]);
    setNotifications([]);
    setSelectedTransferId(null);
    setSendFlowDraft(DEFAULT_DRAFT);

    navigateTo("welcome");
  };

  /*
   * RECIPIENTS
   *
   * No local fallback anymore.
   * If PostgreSQL fails, the operation fails visibly instead
   * of creating data that disappears on refresh.
   */
  const addRecipient = async (
    recipientData: Omit<
      Recipient,
      "id" | "userId" | "createdAt"
    >
  ): Promise<Recipient> => {
    const userId = user?.id;

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const res = await fetch("/api/recipients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...recipientData,
        userId,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.recipient) {
      throw new Error(
        data.error || "Failed to add recipient"
      );
    }

    setRecipients((prev) => [
      data.recipient,
      ...prev.filter((r) => r.id !== data.recipient.id),
    ]);

    return data.recipient;
  };

  const updateRecipient = async (
    id: string,
    patch: Partial<Recipient>
  ) => {
    const res = await fetch("/api/recipients", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        ...patch,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error || "Failed to update recipient"
      );
    }

    setRecipients((prev) =>
      prev.map((recipient) =>
        recipient.id === id
          ? { ...recipient, ...patch }
          : recipient
      )
    );
  };

  const deleteRecipient = async (id: string) => {
    const res = await fetch(
      `/api/recipients?id=${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error || "Failed to delete recipient"
      );
    }

    setRecipients((prev) =>
      prev.filter((recipient) => recipient.id !== id)
    );
  };

  /*
   * SEND FLOW
   */
  const updateSendDraft = (
    patch: Partial<SendFlowDraft>
  ) => {
    setSendFlowDraft((prev) => {
      const next = {
        ...prev,
        ...patch,
      };

      if (
        patch.sendAmount !== undefined ||
        patch.recipientCurrency !== undefined
      ) {
        next.exchangeRate = getRateFor(
          next.recipientCurrency
        );
      }

      if (patch.sendAmount !== undefined) {
        next.fee = calculateTransferFee(
          next.sendAmount
        );
      }

      return next;
    });
  };

  const initiateSendFlow = (recipient?: Recipient) => {
    const targetRecipient =
      recipient || recipients[0];

    if (!targetRecipient) {
      navigateTo("choose_recipient");
      return;
    }

    const currentRate = getRateFor("KES");

    setSendFlowDraft({
      recipientId: targetRecipient.id,
      recipientName: targetRecipient.fullName,
      phone: targetRecipient.phone,
      provider: targetRecipient.provider,
      accountNumber: targetRecipient.accountNumber,
      deliveryMethod:
        targetRecipient.deliveryMethod,
      sendAmount: 100,
      sendCurrency: "USD",
      recipientCurrency: "KES",
      exchangeRate: currentRate,
      fee: calculateTransferFee(100),
      note: "Family Transfer",
    });

    navigateTo("send_money");
  };

  /*
   * TRANSFER
   *
   * PostgreSQL is the source of truth.
   * No client-side fake fallback is created if the API fails.
   */
  const confirmAndSendTransfer =
    async (): Promise<Transfer> => {
      const userId = user?.id;

      if (!userId) {
        throw new Error("Not authenticated");
      }

      if (!sendFlowDraft.recipientId) {
        throw new Error("Please select a recipient");
      }

      if (
        !Number.isFinite(sendFlowDraft.sendAmount) ||
        sendFlowDraft.sendAmount <= 0
      ) {
        throw new Error("Invalid transfer amount");
      }

      const currentRate = getRateFor(
        sendFlowDraft.recipientCurrency
      );

      const receiveAmount = Number(
        (
          sendFlowDraft.sendAmount * currentRate
        ).toFixed(2)
      );

      const newId = `SD-2026-${Math.floor(
        100000 + Math.random() * 900000
      )}`;

      const transferPayload = {
        id: newId,
        userId,
        recipientId:
          sendFlowDraft.recipientId,
        senderAmount:
          sendFlowDraft.sendAmount,
        senderCurrency:
          sendFlowDraft.sendCurrency,
        recipientAmount: receiveAmount,
        recipientCurrency:
          sendFlowDraft.recipientCurrency,
        fee: calculateTransferFee(
          sendFlowDraft.sendAmount
        ),
        exchangeRate: currentRate,
        deliveryMethod:
          sendFlowDraft.deliveryMethod,
        provider: sendFlowDraft.provider,
        accountNumber:
          sendFlowDraft.accountNumber,
        recipientName:
          sendFlowDraft.recipientName,
        note: sendFlowDraft.note,
      };

      setIsLoading(true);

      try {
        const res = await fetch(
          "/api/transfers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              transferPayload
            ),
          }
        );

        const data = await res.json();

        if (!res.ok || !data.transfer) {
          throw new Error(
            data.error ||
              "Transfer could not be completed"
          );
        }

        /*
         * The API/database is authoritative.
         * Reload all account data after the transfer.
         */
        await refreshUserData();

        setSelectedTransferId(
          data.transfer.id
        );

        return data.transfer;
      } catch (error) {
        console.error(
          "Transfer failed:",
          error
        );
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

  const updateTransferStep = async (
    transferId: string,
    step: number,
    status?: string
  ) => {
    const targetStatus =
      status ||
      (step === 4
        ? "delivered"
        : "processing");

    const res = await fetch(
      "/api/transfers",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: transferId,
          currentStep: step,
          status: targetStatus,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error ||
          "Failed to update transfer"
      );
    }

    /*
     * Reload from PostgreSQL so tracking/history
     * always reflects the stored transaction.
     */
    await refreshUserData();
  };

  /*
   * RATES
   */
  const updateRate = async (
    toCurrency: string,
    rate: number
  ) => {
    setDemoSettings((prev) => ({
      ...prev,
      customRate: rate,
    }));

    const res = await fetch(
      "/api/rates",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toCurrency,
          rate,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error ||
          "Failed to update exchange rate"
      );
    }

    const ratesRes = await fetch(
      "/api/rates"
    );

    if (ratesRes.ok) {
      const ratesData =
        await ratesRes.json();

      setRates(
        ratesData.rates ?? []
      );
    }
  };

  /*
   * NOTIFICATIONS
   */
  const markNotificationsAsRead =
    async () => {
      if (!user?.id) return;

      const res = await fetch(
        "/api/notifications",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            markAllAsRead: true,
            userId: user.id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Failed to mark notifications as read"
        );
      }

      await fetchUserData(user.id);
    };

  /*
   * TOP UP
   *
   * No optimistic-only balance.
   * The database determines the final balance.
   */
  const topUpWallet = async (
    amount: number,
    method?: string,
    cardLast4?: string
  ) => {
    const userId = user?.id;

    if (!userId) {
      throw new Error("Not authenticated");
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new Error("Invalid top-up amount");
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        "/api/wallet",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId,
            amount,
            method: method || "card",
            cardLast4,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.wallet) {
        throw new Error(
          data.error ||
            "Top-up failed"
        );
      }

      /*
       * Reload wallet, transactions/history,
       * recipients and notifications.
       */
      await refreshUserData();
    } catch (error) {
      console.error(
        "Top-up error:",
        error
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * RESET DEMO DATA
   */
  const resetAllDemoData = async () => {
    try {
      const res = await fetch(
        "/api/demo/reset",
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error ||
            "Failed to reset demo data"
        );
      }

      const ratesRes = await fetch(
        "/api/rates"
      );

      if (ratesRes.ok) {
        const ratesData =
          await ratesRes.json();

        setRates(
          ratesData.rates ?? []
        );
      }

      setDemoSettings({
        customRate: 129.5,
        instantDelivery: false,
      });

      setSelectedTransferId(null);

      if (user?.id) {
        await fetchUserData(user.id);
      } else {
        navigateTo("welcome");
      }
    } catch (error) {
      console.error(
        "Reset error:",
        error
      );
      throw error;
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
        walletBalance,
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

        topUpWallet,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used within an AppProvider"
    );
  }

  return context;
};