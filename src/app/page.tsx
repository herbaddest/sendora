"use client";

import React from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";

import { WelcomeScreen } from "@/screens/WelcomeScreen";
import { CreateAccountScreen } from "@/screens/CreateAccountScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { SendMoneyScreen } from "@/screens/SendMoneyScreen";
import { ChooseRecipientScreen } from "@/screens/ChooseRecipientScreen";
import { ReviewTransferScreen } from "@/screens/ReviewTransferScreen";
import { ProcessingScreen } from "@/screens/ProcessingScreen";
import { TrackingScreen } from "@/screens/TrackingScreen";
import { TransfersScreen } from "@/screens/TransfersScreen";
import { RecipientsScreen } from "@/screens/RecipientsScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { DocsScreen } from "@/screens/DocsScreen";
import { TopUpScreen } from "@/screens/TopUpScreen";

function AppContent() {
  const { activeScreen } = useApp();

  const renderScreen = () => {
    switch (activeScreen) {
      case "welcome":
        return <WelcomeScreen />;
      case "register":
        return <CreateAccountScreen />;
      case "home":
        return <HomeScreen />;
      case "send_money":
        return <SendMoneyScreen />;
      case "choose_recipient":
        return <ChooseRecipientScreen />;
      case "review_transfer":
        return <ReviewTransferScreen />;
      case "processing":
        return <ProcessingScreen />;
      case "tracking":
        return <TrackingScreen />;
      case "transfers":
        return <TransfersScreen />;
      case "recipients":
        return <RecipientsScreen />;
      case "profile":
        return <ProfileScreen />;
      case "docs":
        return <DocsScreen />;
      case "top_up":
        return <TopUpScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-900">
        {renderScreen()}
        <BottomNav />
      </div>
    </MobileFrame>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
